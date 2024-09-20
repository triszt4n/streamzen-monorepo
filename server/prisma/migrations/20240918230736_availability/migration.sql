-- CreateEnum
CREATE TYPE "PublishState" AS ENUM ('DRAFT', 'PUBLISHED', 'UNLISTED');

-- AlterTable
ALTER TABLE "Vod" ADD COLUMN     "availability" "PublishState" NOT NULL DEFAULT 'DRAFT';
