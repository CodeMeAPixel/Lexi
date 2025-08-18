import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION ?? "us-east-1";
const bucket = process.env.S3_BUCKET_NAME;

if (!endpoint) {
  console.warn(
    "S3_ENDPOINT not configured - uploads will fail until configured.",
  );
}

export const s3 = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "",
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
});

export async function uploadBufferToBucket(
  key: string,
  buffer: Buffer | Uint8Array,
  contentType = "application/octet-stream",
) {
  if (!bucket) throw new Error("S3 bucket not configured (S3_BUCKET_NAME)");
  if (!endpoint) throw new Error("S3 endpoint not configured (S3_ENDPOINT)");

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(cmd);

  // Return a public URL using path-style (endpoint/bucket/key)
  return `${endpoint.replace(/\/$/, "")}/${bucket}/${encodeURIComponent(key)}`;
}
