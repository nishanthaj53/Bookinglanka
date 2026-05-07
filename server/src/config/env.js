//server/src/config/env.js

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8080),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  dbUrl: process.env.DATABASE_URL ?? '',
  jwtAccess: process.env.JWT_ACCESS_SECRET ?? '',
  jwtRefresh: process.env.JWT_REFRESH_SECRET ?? '',
  redisUrl: process.env.REDIS_URL ?? '',

  // ✅ Image storage config (read from .env)
  storageType: process.env.STORAGE_TYPE ?? "local", // can be "s3" once after launch
  awsAccessKey: process.env.AWS_ACCESS_KEY ?? "",
  awsSecretKey: process.env.AWS_SECRET_KEY ?? "",
  awsRegion: process.env.AWS_REGION ?? "",
  awsS3Bucket: process.env.AWS_S3_BUCKET ?? "",
}
