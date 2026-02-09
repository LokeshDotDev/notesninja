/*
  Warnings:

  - Added the required column `publicId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "publicId" TEXT NOT NULL;
