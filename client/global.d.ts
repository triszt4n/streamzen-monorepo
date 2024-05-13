declare global {
  namespace NodeJS {
    interface ProcessEnv {
      S3_REGION: string
      S3_ACCESS_KEY_ID: string
      S3_SECRET_ACCESS_KEY: string
      S3_BUCKET_NAME: string
      POSTGRES_PRISMA_URL: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
      MAX_FILE_TOTAL_SIZE_IN_MB: string
    }
  }
}
