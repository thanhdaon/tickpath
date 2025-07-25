import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

const s3 = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export async function generateS3UserAvatarUploadUrl(file: File) {
  const key = `avatars/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: file.type,
    ContentLength: file.size,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  return { signedUrl, key, bucket: env.S3_BUCKET };
}
