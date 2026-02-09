/*
  Warnings:

  - You are about to drop the column `authorId` on the `Featured` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Featured" DROP CONSTRAINT "Featured_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Featured" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId";

-- DropTable
DROP TABLE "Author";
