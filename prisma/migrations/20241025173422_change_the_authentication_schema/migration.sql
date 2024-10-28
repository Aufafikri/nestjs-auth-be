/*
  Warnings:

  - You are about to drop the column `githubId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `User` table. All the data in the column will be lost.
  - Added the required column `updateAT` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_githubId_key";

-- DropIndex
DROP INDEX "User_googleId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubId",
DROP COLUMN "googleId",
DROP COLUMN "profile",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "updateAT" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "isVerified" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
