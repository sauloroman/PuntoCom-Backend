/*
  Warnings:

  - Added the required column `product_image_code` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "product_image_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_phone" TEXT NOT NULL DEFAULT 'Usuario sin numero';
