import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Client, getS3Bucket, isS3Configured } from '@/lib/s3';
import { createServerSupabase } from '@/lib/supabase-server';

/**
 * GET /api/photos/url?key=...
 *
 * Returns a short-lived signed URL for the given S3 object key.
 * The key must start with the authenticated user's tenant ID
 * (or the user must be a super_admin) — this enforces cross-tenant isolation.
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  // ── Auth + tenant isolation ──
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the app user to get their tenant
  const { data: appUser } = await supabase
    .from('users')
    .select('tenant_id, role')
    .eq('auth_uid', authUser.id)
    .single();

  if (!appUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 403 });
  }

  const row = appUser as Record<string, unknown>;
  // Enforce tenant isolation: key must start with the user's tenant ID
  // unless the user is a super_admin
  if (row.role !== 'super_admin' && !key.startsWith(`${row.tenant_id}/`)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!isS3Configured()) {
    return NextResponse.json({ error: 'S3 not configured' }, { status: 503 });
  }

  const s3 = getS3Client()!;
  const bucket = getS3Bucket();

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 900 } // 15 minutes
  );

  return NextResponse.json({ url });
}
