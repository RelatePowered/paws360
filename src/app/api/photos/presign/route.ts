import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Client, getS3Bucket, isS3Configured } from '@/lib/s3';
import { createServerSupabase } from '@/lib/supabase-server';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/photos/presign
 *
 * Returns a short-lived presigned PUT URL so the browser can upload
 * directly to S3, bypassing the serverless function body-size and
 * execution-time limits.
 *
 * Body: { tenantId, animalId, contentType, size }
 * Returns: { url, key }
 */
export async function POST(request: NextRequest) {
  if (!isS3Configured()) {
    return NextResponse.json({ error: 'Photo storage is not configured' }, { status: 503 });
  }

  // ── Auth ──
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Tenant isolation ──
  const { data: appUser } = await supabase
    .from('users')
    .select('tenant_id, role')
    .eq('auth_uid', authUser.id)
    .single();

  if (!appUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 403 });
  }

  const body = await request.json();
  const { tenantId, animalId, contentType, size } = body as {
    tenantId: string; animalId: string; contentType: string; size: number;
  };

  if (!tenantId || !animalId || !contentType) {
    return NextResponse.json({ error: 'Missing tenantId, animalId, or contentType' }, { status: 400 });
  }

  // Enforce tenant isolation: user can only upload to their own tenant
  const row = appUser as Record<string, unknown>;
  if (row.role !== 'super_admin' && row.tenant_id !== tenantId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 },
    );
  }

  if (size && size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size: ${MAX_SIZE / 1024 / 1024} MB` },
      { status: 400 },
    );
  }

  const ext = contentType.split('/')[1] === 'jpeg' ? 'jpg' : contentType.split('/')[1];
  const key = `${tenantId}/animals/${animalId}/${Date.now()}.${ext}`;

  const s3 = getS3Client()!;
  const bucket = getS3Bucket();

  try {
    const url = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: 300 }, // 5 minutes to complete the upload
    );
    return NextResponse.json({ url, key });
  } catch (err) {
    console.error('[photo-presign] failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Could not generate upload URL' }, { status: 502 });
  }
}
