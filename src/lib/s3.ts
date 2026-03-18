import { S3Client } from '@aws-sdk/client-s3';

let _client: S3Client | null = null;

/**
 * Returns an S3Client that uses the default AWS credential provider chain.
 * In AWS Amplify this automatically picks up the IAM role attached to the
 * compute environment — no access keys required.
 */
export function getS3Client(): S3Client | null {
  const region = process.env.S3_REGION ?? process.env.AWS_REGION;
  if (!region) return null;

  if (!_client) {
    _client = new S3Client({
      region,
      requestHandler: {
        requestTimeout: 10_000,   // 10s max per HTTP request
        connectionTimeout: 5_000, // 5s to establish connection
      } as Record<string, unknown>,
    });
  }
  return _client;
}

export function getS3Bucket(): string {
  return process.env.S3_BUCKET_NAME ?? '';
}

export function isS3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET_NAME &&
    (process.env.S3_REGION || process.env.AWS_REGION)
  );
}
