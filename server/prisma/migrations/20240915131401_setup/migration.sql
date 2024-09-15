-- CreateEnum
CREATE TYPE "LiveState" AS ENUM ('PREMIERE', 'ON_AIR', 'OFF_AIR');

-- CreateEnum
CREATE TYPE "LiveType" AS ENUM ('LOCAL_RTMP', 'EMBED_YOUTUBE', 'EMBED_TWITCH');

-- CreateEnum
CREATE TYPE "ProcessState" AS ENUM ('UNPROCESSED', 'PROCESSING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "authSchId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vod" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descMarkdown" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "ext" TEXT NOT NULL,
    "state" "ProcessState" NOT NULL DEFAULT 'UNPROCESSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Vod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authSchId_key" ON "User"("authSchId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Vod" ADD CONSTRAINT "Vod_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
