# Security Audit Report — ShelterHub (dog-tagger)

**Date:** 2026-03-18
**Scope:** Full application — Next.js frontend, API routes, Supabase (DB + Auth), AWS S3, Amplify deployment
**Methodology:** White-box source code review, architecture analysis

---

## Executive Summary

The application has a reasonable security foundation (RLS on all tables, server-side auth checks, presigned uploads). However, **9 findings were identified**, including **3 Critical** and **3 High** severity issues that could lead to cross-tenant data access, S3 bucket takeover, and infrastructure reconnaissance.

---

## Findings

### CRITICAL-1: Photo Upload Route Missing Tenant Isolation Check

**File:** `src/app/api/photos/upload/route.ts:26-72`
**Severity:** CRITICAL
**CVSS:** 8.8

The `/api/photos/upload` POST endpoint verifies the user is authenticated but **never checks that the user belongs to the tenant specified in the `tenantId` form field**. Compare this to the presign route (`/api/photos/presign/route.ts:36-59`) which correctly verifies `appUser.tenant_id === tenantId`.

**Impact:** Any authenticated user can upload files to **any tenant's S3 namespace** by simply passing an arbitrary `tenantId` in the multipart form. This enables:
- Cross-tenant data pollution (uploading malicious/inappropriate photos to another shelter's animals)
- Storage abuse under another tenant's prefix
- Potential compliance violations (HIPAA-adjacent animal records contamination)

**Proof of Concept:**
```bash
curl -X POST https://app.example.com/api/photos/upload \
  -H "Cookie: <valid_session_cookie>" \
  -F "file=@malicious.jpg" \
  -F "tenantId=tenant-2" \
  -F "animalId=a-1"
```

**Remediation:** Add the same tenant-isolation check used in the presign route:
```typescript
const { data: appUser } = await supabase
  .from('users')
  .select('tenant_id, role')
  .eq('auth_uid', user.id)
  .single();

if (!appUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
if (appUser.role !== 'super_admin' && appUser.tenant_id !== tenantId) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

### CRITICAL-2: Diagnose Endpoint Leaks Infrastructure Details and Allows Unauthenticated S3 Probing

**File:** `src/app/api/photos/diagnose/route.ts`
**Severity:** CRITICAL
**CVSS:** 8.2

The `/api/photos/diagnose` endpoint has **no role-based authorization** (the comment on line 14 says "admin only in production" but this is not enforced). Any authenticated user can call it and receive:

1. **AWS credential metadata** — whether credentials are STS-based or static, the key prefix (first 4 chars of AccessKeyId), session token presence (line 70-71)
2. **Bucket existence confirmation** via HeadBucket (line 85)
3. **IAM permission enumeration** — whether s3:PutObject is allowed (line 141)
4. **Network topology info** — whether compute can reach S3, VPC/security group hints (line 107)
5. **Write verification** — the endpoint creates and deletes test objects in the bucket (lines 118-156)

**Impact:** An attacker with any valid account can perform complete reconnaissance of your AWS infrastructure. The credential key prefix leaks whether you're using IAM roles vs. static keys and the STS session token presence reveals the credential chain. The test-write capability can be abused to validate bucket write access.

**Remediation:**
1. **Immediately restrict to super_admin** or remove entirely (the TODO on line 14 acknowledges this)
2. Strip credential metadata from the response (never expose key prefixes)
3. Remove the test-write — use CloudWatch/IAM policy simulator for validation instead

---

### CRITICAL-3: Open Redirect in Auth Callback

**File:** `src/app/auth/callback/route.ts:11,17`
**Severity:** CRITICAL
**CVSS:** 7.5

The auth callback reads the `next` query parameter and redirects to it after successful code exchange:
```typescript
const next = searchParams.get('next') ?? '/dashboard';
return NextResponse.redirect(`${origin}${next}`);
```

While `origin` is prepended, the `next` parameter is **not validated**. An attacker can craft:
```
/auth/callback?code=VALID&next=//evil.com
```
Since `${origin}//evil.com` resolves to `https://evil.com` in most browsers (double-slash is protocol-relative), this enables phishing attacks where victims are redirected to a credential-harvesting page after legitimate authentication.

The same issue exists in `src/app/login/page.tsx:24,52` where `next` is read from query params and used in `window.location.href = next` — this is a direct DOM-based open redirect.

**Remediation:**
```typescript
// Validate next is a relative path
const next = searchParams.get('next') ?? '/dashboard';
const safePath = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
return NextResponse.redirect(`${origin}${safePath}`);
```

---

### HIGH-1: /api/auth/me Leaks All Tenant Data to Every Authenticated User

**File:** `src/app/api/auth/me/route.ts:72-76`
**Severity:** HIGH
**CVSS:** 7.1

The `/api/auth/me` endpoint fetches **all active tenants** and returns them in the response:
```typescript
const { data: tenantRows } = await supabase
  .from('tenants')
  .select('*')
  .eq('is_active', true);
```

There is no filter by the user's own `tenant_id`. While RLS on the `tenants` table should restrict this, the query returns all tenants visible to the user. For super admins this is intentional, but for regular users this may expose sensitive information about other organizations (EIN numbers, addresses, phone numbers, emails) if the RLS policy has gaps.

Additionally, the endpoint uses the `NEXT_PUBLIC_SUPABASE_ANON_KEY` via `createServerSupabase()`, which means the query runs with the anon role + RLS. The `tenants_select_by_user_email` policy (migration 9) allows any authenticated user to see their own tenant, but the `tenants_select` policy allows anyone whose `auth_tenant_id()` matches — this is correct, but the query should still filter to prevent unnecessary data exposure.

**Remediation:** Filter the tenants query:
```typescript
const { data: tenantRows } = await supabase
  .from('tenants')
  .select('*')
  .eq('is_active', true)
  .eq('id', row.tenant_id);  // Regular users only see their own tenant
```

---

### HIGH-2: Amplify Build Script Dumps Environment Variables to Disk

**File:** `amplify.yml:9`
**Severity:** HIGH
**CVSS:** 7.0

The Amplify build phase runs:
```yaml
- env | grep -E '^(NEXT_PUBLIC_|S3_|AWS_)' >> .env.production
```

This pipes **all matching environment variables** (including `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` if set) into `.env.production`, which is then included in the build artifacts:
```yaml
artifacts:
  baseDirectory: .next
  files:
    - '**/*'
```

If `AWS_*` credentials are present as env vars (rather than IAM role), they will be written to the `.env.production` file and included in the deployed artifact. Even with IAM roles, the `AWS_REGION` and `S3_*` variables expose infrastructure configuration.

**Impact:** If the build artifacts are cached, shared, or if `.next` is ever publicly accessible, credentials could be leaked.

**Remediation:**
- Only write the specific variables you need: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `S3_BUCKET_NAME`, `S3_REGION`
- Never glob-match `AWS_*` as it can capture secrets
- Use explicit variable names:
```yaml
- echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" >> .env.production
- echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" >> .env.production
- echo "S3_BUCKET_NAME=$S3_BUCKET_NAME" >> .env.production
- echo "S3_REGION=$S3_REGION" >> .env.production
```

---

### HIGH-3: S3 Key Path Traversal via animalId Parameter

**File:** `src/app/api/photos/presign/route.ts:76`, `src/app/api/photos/upload/route.ts:72`
**Severity:** HIGH
**CVSS:** 6.5

The S3 object key is constructed using user-supplied input without sanitization:
```typescript
const key = `${tenantId}/animals/${animalId}/${Date.now()}.${ext}`;
```

If `animalId` contains path traversal characters (e.g., `../../other-tenant/animals/target`), the resulting S3 key would break out of the intended prefix:
```
tenant-1/animals/../../tenant-2/animals/target/1234567890.jpg
```

S3 treats `/` as a delimiter but does process `..` literally — the key would be stored as-is. However, in the presign route, the `GetObjectCommand` uses the key for retrieval, and the tenant-isolation check in `/api/photos/url` only verifies `key.startsWith(tenant_id/)`. A crafted key like `tenant-1/../../tenant-2/secret` starts with `tenant-1/` but semantically references another tenant's namespace.

**Remediation:**
```typescript
// Sanitize IDs to prevent path traversal
if (!/^[a-zA-Z0-9_-]+$/.test(animalId) || !/^[a-zA-Z0-9_-]+$/.test(tenantId)) {
  return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
}
```

---

### MEDIUM-1: Early Access Route Uses Anon Key Without Rate Limiting

**File:** `src/app/api/early-access/route.ts`
**Severity:** MEDIUM
**CVSS:** 5.3

The early access endpoint:
1. Creates a Supabase client with the **anon key** directly (line 21), bypassing server-side auth entirely
2. Has **no rate limiting** — an attacker can spam the endpoint to fill the `early_access_requests` table
3. Has **no CAPTCHA or bot protection**
4. The RLS policy allows anonymous inserts (`with check (true)`)

**Impact:** Database storage exhaustion, spam entries, potential abuse for email harvesting or scraping.

**Remediation:**
- Add rate limiting (e.g., Amplify WAF, or application-level throttle)
- Add CAPTCHA verification
- Validate email format server-side
- Add a unique constraint on email to prevent duplicate submissions

---

### MEDIUM-2: Console Logging of Sensitive AWS Metadata in Production

**Files:**
- `src/app/api/photos/upload/route.ts:84-89` — logs credential source, accessKeyId presence, session token presence
- `src/app/api/photos/upload/route.ts:128-136` — logs bucket name, region

**Severity:** MEDIUM
**CVSS:** 4.3

Production console logs contain AWS credential metadata:
```typescript
console.log('[photo-upload] credentials resolved', {
  hasAccessKey: Boolean(creds.accessKeyId),
  hasSession: Boolean(creds.sessionToken),
  source: creds.accessKeyId?.startsWith('ASIA') ? 'sts/role' : 'static',
});
```

In AWS Amplify, console logs go to CloudWatch. If CloudWatch log group permissions are misconfigured, or if logs are shipped to a third-party service, this information aids attacker reconnaissance.

**Remediation:** Remove credential metadata logging. Log only timing information and success/failure status.

---

### MEDIUM-3: `resolve_auth_user` RPC Function is Overly Permissive

**File:** `supabase/migrations/00008_resolve_auth_user_rpc.sql`
**Severity:** MEDIUM
**CVSS:** 5.9

The `resolve_auth_user` function is `SECURITY DEFINER` (runs as the function owner, bypassing RLS) and accepts arbitrary `p_auth_uid` and `p_email` parameters. While it's meant to be called from the server-side API, **any authenticated Supabase client can call it directly via PostgREST RPC**:

```javascript
const { data } = await supabase.rpc('resolve_auth_user', {
  p_auth_uid: 'any-uuid',
  p_email: 'admin@dicksonhumane.org'
});
```

This allows any authenticated user to:
1. Look up any user's profile data (including role, permissions, tenant) by email
2. **Hijack another user's account** by linking their own `auth_uid` to a victim's email-matched user row (line 36: `update users set auth_uid = p_auth_uid where id = v_user.id`)

**Impact:** Account takeover. An attacker creates a Supabase auth account, then calls `resolve_auth_user` with their own `auth_uid` and a victim's email. The function links the attacker's auth identity to the victim's app user row, granting the attacker full access as that user (potentially an admin).

**Remediation:**
- Add a check that `p_auth_uid = auth.uid()` to prevent impersonation:
```sql
if p_auth_uid != auth.uid() then
  return null;
end if;
```
- Or revoke `EXECUTE` permission from the `anon` and `authenticated` roles and only call it from a service-role context

---

### LOW-1: XSS via User-Controlled Logo URL

**File:** `src/app/admin/page.tsx:867`
**Severity:** LOW
**CVSS:** 3.5

The branding tab renders a user-supplied URL directly in an `<img>` tag:
```tsx
<img src={brandingLogoUrl} alt="Shelter logo" className="..." />
```

While `<img src>` itself is not a direct XSS vector in modern browsers, a `javascript:` URI or a malicious SVG with embedded scripts (if the Content-Type is permissive) could be exploited. The URL is also stored in the database and rendered for all users of the tenant.

**Remediation:** Validate that the URL uses `https://` protocol before saving and rendering.

---

## Architecture Recommendations

### 1. S3 Bucket Policy
Ensure the S3 bucket has:
- **Block Public Access** enabled (all four settings)
- A bucket policy that restricts `PutObject` to the Amplify compute role only
- `s3:DeleteObject` permission should be restricted — currently the diagnose endpoint deletes objects (line 153)

### 2. Supabase Service Role Key
The application correctly uses only the anon key. Verify the service role key is **not** set in any Amplify environment variables, as it would bypass all RLS.

### 3. CORS Configuration
No explicit CORS configuration was found in the Next.js config. The presigned S3 URLs will require proper CORS on the S3 bucket to allow browser PUT requests. Ensure the CORS policy restricts `AllowedOrigins` to your domain only.

### 4. Cookie Security
Supabase SSR handles auth cookies. Verify that in production:
- `Secure` flag is set
- `SameSite=Lax` or `Strict`
- `HttpOnly` for session cookies

### 5. CSP Headers
No Content-Security-Policy headers are configured in `next.config.ts`. Add CSP headers to prevent XSS:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  headers: async () => [{
    source: '/(.*)',
    headers: [{
      key: 'Content-Security-Policy',
      value: "default-src 'self'; img-src 'self' https:; script-src 'self'"
    }]
  }]
};
```

---

## Risk Summary

| ID | Finding | Severity | Exploitability |
|---|---|---|---|
| CRITICAL-1 | Upload route missing tenant isolation | Critical | Easy — any authed user |
| CRITICAL-2 | Diagnose endpoint leaks AWS infra | Critical | Easy — any authed user |
| CRITICAL-3 | Open redirect in auth callback + login | Critical | Easy — crafted URL |
| HIGH-1 | /api/auth/me leaks all tenant data | High | Easy — any authed user |
| HIGH-2 | Amplify build dumps AWS_* env vars | High | Medium — requires artifact access |
| HIGH-3 | S3 key path traversal via animalId | High | Medium — requires authed user |
| MEDIUM-1 | Early access no rate limiting | Medium | Easy — unauthenticated |
| MEDIUM-2 | Console logging of AWS credential metadata | Medium | Low — requires log access |
| MEDIUM-3 | resolve_auth_user RPC account takeover | Medium | Easy — any authed Supabase client |
| LOW-1 | XSS via logo URL | Low | Low — requires admin access |

---

**Recommendation:** Address CRITICAL-1, CRITICAL-2, CRITICAL-3, and MEDIUM-3 immediately — they represent active, easily exploitable attack vectors that could compromise tenant data or backend infrastructure.
