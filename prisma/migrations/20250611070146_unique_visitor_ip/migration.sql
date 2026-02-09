/*
  Warnings:

  - A unique constraint covering the columns `[ipAddress]` on the table `Visitor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Visitor_ipAddress_key" ON "Visitor"("ipAddress");
