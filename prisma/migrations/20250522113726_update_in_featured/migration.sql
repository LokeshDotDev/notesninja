/*
  Warnings:

  - Added the required column `authorId` to the `Featured` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Featured` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Featured` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Featured" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Featured" ADD CONSTRAINT "Featured_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Featured" ADD CONSTRAINT "Featured_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
