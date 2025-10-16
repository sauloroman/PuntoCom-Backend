/*
  Warnings:

  - A unique constraint covering the columns `[sale_code]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sale_code` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "sale_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_sale_code_key" ON "Sale"("sale_code");
