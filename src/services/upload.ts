import { UploadedFile } from 'express-fileupload';
import { AWS } from '../config';
import { S3 } from './s3';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = S3.client;

export async function uploadFile(file: UploadedFile) {
  const extension = extname(file.name);
  const filename = `${file.name}-${randomUUID()}${extension}`;

  const command = new PutObjectCommand({
    Bucket: AWS.BUCKET_NAME,
    Key: filename,
    Body: file.data,
  });

  await s3Client.send(command);

  return getUploadedFileUri(filename);
}

function getUploadedFileUri(filename: string) {
  return AWS.PUBLIC_BUCKET_URI + '/' + filename;
}
