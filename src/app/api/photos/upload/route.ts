import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket, isS3Configured } from '@/lib/s3';
import { createServerSupabase } from '@/lib/supabase-server';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/photos/upload
 *
 * Accepts a multipart form with:
 *   - file: the image file
 *   - tenantId: the uploading user's tenant
 *   - animalId: the animal record ID
 *
 * Stores the image in S3 under `{tenantId}/animals/{animalId}/{timestamp}.{ext}`
 * so that tenant data is physically separated.
 *
 * Returns { key } — the S3 object key to store in the animal's photo_url column.
 */
export async function POST(request: NextRequest) {
  // ── Check S3 first (fast fail) ──
  if (!isS3Configured()) {
    return NextResponse.json({ error: 'Photo storage is not configured' }, { status: 503 });
  }

  // ── Auth check ──
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const s3 = getS3Client()!;
  const bucket = getS3Bucket();

  // ── Parse multipart form ──
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const tenantId = formData.get('tenantId') as string | null;
  const animalId = formData.get('animalId') as string | null;

  if (!file || !tenantId || !animalId) {
    return NextResponse.json({ error: 'Missing file, tenantId, or animalId' }, { status: 400 });
  }

  // ── Validate ──
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size: ${MAX_SIZE / 1024 / 1024} MB` },
      { status: 400 }
    );
  }

  // ── Build key with tenant isolation ──
  const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
  const key = `${tenantId}/animals/${animalId}/${Date.now()}.${ext}`;

  // ── Upload to S3 ──
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // No ACL — bucket is private, access only via signed URLs
    })
  );

  return NextResponse.json({ key });
}
