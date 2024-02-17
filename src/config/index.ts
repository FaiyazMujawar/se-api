import { config } from 'dotenv';

config();

// Database
export const DB_URI = process.env.DB_URI!;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION!;
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION!;

// AWS
export const AWS = {
  STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT!,
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  BUCKET_NAME: process.env.AWS_BUCKET_NAME!,
  PUBLIC_BUCKET_URI: process.env.PUBLIC_BUCKET_URI!,
};
