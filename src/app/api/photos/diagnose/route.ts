import { NextResponse } from 'next/server';
import { HeadBucketCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket, isS3Configured } from '@/lib/s3';
import { createServerSupabase } from '@/lib/supabase-server';

/**
 * GET /api/photos/diagnose
 *
 * Runs a step-by-step diagnostic of the photo upload pipeline and reports
 * timing + pass/fail for each phase. Restricted to super_admin users.
 */
export async function GET() {
  const results: Record<string, unknown> = {};
  const overall = Date.now();

  // ── 1. Environment ──
  results.env = {
    isS3Configured: isS3Configured(),
  };

  if (!isS3Configured()) {
    results.conclusion = 'Photo storage env vars are missing. Check environment configuration.';
    return NextResponse.json(results);
  }

  // ── 2. Auth + authorization ──
  try {
    const authStart = Date.now();
    const supabase = await createServerSupabase();
    if (!supabase) {
      results.auth = { pass: false, error: 'Server client unavailable', ms: Date.now() - authStart };
      results.conclusion = 'Auth service unavailable.';
      return NextResponse.json(results);
    }
    const { data: { user }, error } = await supabase.auth.getUser();
    results.auth = {
      pass: Boolean(user),
      ms: Date.now() - authStart,
      ...(error ? { error: error.message } : {}),
    };
    if (!user) {
      results.conclusion = 'Not authenticated. Sign in and retry.';
      return NextResponse.json(results);
    }

    // Require super_admin role
    const { data: appUser } = await supabase
      .from('users')
      .select('role')
      .eq('auth_uid', user.id)
      .single();

    if (!appUser || (appUser as Record<string, unknown>).role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden — super_admin access required' }, { status: 403 });
    }
  } catch (err) {
    results.auth = { pass: false, error: err instanceof Error ? err.message : String(err) };
    results.conclusion = 'Auth check threw an exception.';
    return NextResponse.json(results);
  }

  const s3 = getS3Client()!;
  const bucket = getS3Bucket();

  // ── 3. Credential resolution (timing only — no metadata exposed) ──
  try {
    const credStart = Date.now();
    await s3.config.credentials();
    results.credentials = {
      pass: true,
      ms: Date.now() - credStart,
    };
  } catch (err) {
    results.credentials = {
      pass: false,
      ms: Date.now() - overall,
      error: err instanceof Error ? err.message : String(err),
    };
    results.conclusion = 'Credential resolution failed. The compute role may not be reachable from this environment.';
    return NextResponse.json(results);
  }

  // ── 4. HeadBucket (verifies bucket exists + IAM can reach it) ──
  try {
    const headStart = Date.now();
    await s3.send(new HeadBucketCommand({ Bucket: bucket }), {
      abortSignal: AbortSignal.timeout(10_000),
    });
    results.headBucket = { pass: true, ms: Date.now() - headStart };
  } catch (err) {
    const name = err instanceof Error ? err.name : 'Unknown';
    const code = (err as Record<string, unknown>)?.$metadata
      ? ((err as Record<string, unknown>).$metadata as Record<string, unknown>)?.httpStatusCode
      : undefined;
    results.headBucket = {
      pass: false,
      ms: Date.now() - overall,
      errorName: name,
      httpStatus: code,
    };
    if (code === 403) {
      results.conclusion = 'IAM role can resolve credentials but is denied access to the bucket. Check the bucket policy and IAM permissions.';
    } else if (code === 404) {
      results.conclusion = 'Bucket does not exist. Verify the bucket name in environment configuration.';
    } else if (name === 'AbortError' || name === 'TimeoutError') {
      results.conclusion = 'HeadBucket timed out. The compute environment may not have network access to the S3 endpoint.';
    } else {
      results.conclusion = `HeadBucket failed: ${name}`;
    }
    return NextResponse.json(results);
  }

  // ── 5. Test write (tiny object, then delete) ──
  const testKey = `_diagnose/${Date.now()}.txt`;
  try {
    const putStart = Date.now();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: testKey,
        Body: Buffer.from('diagnostic test'),
        ContentType: 'text/plain',
      }),
      { abortSignal: AbortSignal.timeout(10_000) },
    );
    results.testWrite = { pass: true, ms: Date.now() - putStart };
  } catch (err) {
    const name = err instanceof Error ? err.name : 'Unknown';
    const code = (err as Record<string, unknown>)?.$metadata
      ? ((err as Record<string, unknown>).$metadata as Record<string, unknown>)?.httpStatusCode
      : undefined;
    results.testWrite = {
      pass: false,
      ms: Date.now() - overall,
      errorName: name,
      httpStatus: code,
    };
    if (code === 403) {
      results.conclusion = 'IAM role can reach the bucket but s3:PutObject is denied. Add PutObject to the IAM policy.';
    } else if (name === 'AbortError' || name === 'TimeoutError') {
      results.conclusion = 'PutObject timed out. Network connectivity issue between compute and S3.';
    } else {
      results.conclusion = `PutObject failed: ${name}`;
    }
    return NextResponse.json(results);
  }

  // Clean up test object (best effort)
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: testKey }), {
      abortSignal: AbortSignal.timeout(5_000),
    });
  } catch { /* non-critical */ }

  results.totalMs = Date.now() - overall;
  results.conclusion = 'All checks passed. Photo upload pipeline is healthy.';

  return NextResponse.json(results);
}
