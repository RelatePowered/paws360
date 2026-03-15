import { S3Client } from '@aws-sdk/client-s3';

let _client: S3Client | null = null;

export function getS3Client(): S3Client | null {
  const region = process.env.S3_REGION;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) return null;

  if (!_client) {
    _client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
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
    process.env.S3_REGION &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  );
}
