/*
  Warnings:

  - You are about to drop the column `ext` on the `Vod` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `Vod` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[viewCounterId]` on the table `Vod` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `thumbnailUrl` to the `Vod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedFilename` to the `Vod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewCounterId` to the `Vod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vod" DROP COLUMN "ext",
DROP COLUMN "filename",
ADD COLUMN     "allowDownloads" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allowShare" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL,
ADD COLUMN     "uploadedFilename" TEXT NOT NULL,
ADD COLUMN     "viewCounterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CrewMembership" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "vodId" TEXT NOT NULL,

    CONSTRAINT "CrewMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewCounter" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ViewCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vod_viewCounterId_key" ON "Vod"("viewCounterId");

-- AddForeignKey
ALTER TABLE "Vod" ADD CONSTRAINT "Vod_viewCounterId_fkey" FOREIGN KEY ("viewCounterId") REFERENCES "ViewCounter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMembership" ADD CONSTRAINT "CrewMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMembership" ADD CONSTRAINT "CrewMembership_vodId_fkey" FOREIGN KEY ("vodId") REFERENCES "Vod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
