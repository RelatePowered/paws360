import { NextResponse } from 'next/server';
import { isS3Configured } from '@/lib/s3';

/**
 * GET /api/photos/status
 *
 * Lightweight check for whether photo storage (S3) is configured.
 * No auth required — just returns { configured: boolean }.
 * Used by the PhotoUpload component to fail fast before attempting
 * a multipart upload that would hang waiting for a 503.
 */
export async function GET() {
  return NextResponse.json({ configured: isS3Configured() });
}
