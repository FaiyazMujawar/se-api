import { S3Client } from '@aws-sdk/client-s3';
import { AWS } from '../config';

export class S3 {
  private static s3: S3Client = undefined;
  public static get client() {
    if (S3.s3 === undefined) {
      S3.s3 = new S3Client({
        region: 'us-east-1',
        endpoint: 'https://' + AWS.STORAGE_ENDPOINT,
        credentials: {
          accessKeyId: AWS.ACCESS_KEY_ID,
          secretAccessKey: AWS.SECRET_ACCESS_KEY,
        },
      });
    }
    return S3.s3;
  }
}
