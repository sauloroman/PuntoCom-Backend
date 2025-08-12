/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Purchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `InventoryAdjustment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleProductDetail` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."RoleEnum" AS ENUM ('Administrador', 'Supervisor', 'Vendedor');

-- DropForeignKey
ALTER TABLE "public"."InventoryAdjustment" DROP CONSTRAINT "InventoryAdjustment_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."InventoryAdjustment" DROP CONSTRAINT "InventoryAdjustment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Purchase" DROP CONSTRAINT "Purchase_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Purchase" DROP CONSTRAINT "Purchase_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseDetail" DROP CONSTRAINT "PurchaseDetail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseDetail" DROP CONSTRAINT "PurchaseDetail_purchase_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sale" DROP CONSTRAINT "Sale_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SaleProductDetail" DROP CONSTRAINT "SaleProductDetail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SaleProductDetail" DROP CONSTRAINT "SaleProductDetail_sale_id_fkey";

-- AlterTable
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "category_id" DROP DEFAULT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ALTER COLUMN "category_name" SET DATA TYPE TEXT,
ALTER COLUMN "category_description" SET DATA TYPE TEXT,
ALTER COLUMN "category_icon" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id");
DROP SEQUENCE "Category_category_id_seq";

-- AlterTable
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "product_id" DROP DEFAULT,
ALTER COLUMN "product_id" SET DATA TYPE TEXT,
ALTER COLUMN "product_name" SET DATA TYPE TEXT,
ALTER COLUMN "product_description" SET DATA TYPE TEXT,
ALTER COLUMN "product_image" SET DATA TYPE TEXT,
ALTER COLUMN "product_code" SET DATA TYPE TEXT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id");
DROP SEQUENCE "Product_product_id_seq";

-- AlterTable
ALTER TABLE "public"."Purchase" DROP CONSTRAINT "Purchase_pkey",
ALTER COLUMN "purchase_id" DROP DEFAULT,
ALTER COLUMN "purchase_id" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY ("purchase_id");
DROP SEQUENCE "Purchase_purchase_id_seq";

-- AlterTable
ALTER TABLE "public"."Sale" DROP CONSTRAINT "Sale_pkey",
ALTER COLUMN "sale_id" DROP DEFAULT,
ALTER COLUMN "sale_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sale_pkey" PRIMARY KEY ("sale_id");
DROP SEQUENCE "Sale_sale_id_seq";

-- AlterTable
ALTER TABLE "public"."Supplier" DROP CONSTRAINT "Supplier_pkey",
ALTER COLUMN "supplier_id" DROP DEFAULT,
ALTER COLUMN "supplier_id" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_name" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_lastname" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_company" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_phone" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_email" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_address" SET DATA TYPE TEXT,
ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY ("supplier_id");
DROP SEQUENCE "Supplier_supplier_id_seq";

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "user_id" DROP DEFAULT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_name" SET DATA TYPE TEXT,
ALTER COLUMN "user_lastname" SET DATA TYPE TEXT,
ALTER COLUMN "user_email" SET DATA TYPE TEXT,
ALTER COLUMN "user_password" SET DATA TYPE TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "public"."RoleEnum" NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");
DROP SEQUENCE "User_user_id_seq";

-- DropTable
DROP TABLE "public"."InventoryAdjustment";

-- DropTable
DROP TABLE "public"."PurchaseDetail";

-- DropTable
DROP TABLE "public"."SaleProductDetail";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "public"."Purchase_Detail" (
    "purchase_detail_id" TEXT NOT NULL,
    "purchase_quantity" INTEGER NOT NULL,
    "purchase_unit_price" DECIMAL(11,2) NOT NULL,
    "product_id" TEXT NOT NULL,
    "purchase_id" TEXT NOT NULL,

    CONSTRAINT "Purchase_Detail_pkey" PRIMARY KEY ("purchase_detail_id")
);

-- CreateTable
CREATE TABLE "public"."Sale_Product_Detail" (
    "sale_product_detail_id" TEXT NOT NULL,
    "sale_product_detail_quantity" INTEGER NOT NULL,
    "sale_product_detail_unit_price" DECIMAL(11,2) NOT NULL,
    "sale_product_discount" DECIMAL(11,2) NOT NULL DEFAULT 0.0,
    "sale_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Sale_Product_Detail_pkey" PRIMARY KEY ("sale_product_detail_id")
);

-- CreateTable
CREATE TABLE "public"."Inventory_Adjustment" (
    "adjustment_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "adjustment_type" "public"."AdjustmentType" NOT NULL,
    "adjustment_quantity" INTEGER NOT NULL,
    "adjustment_reason" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "adjustment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_Adjustment_pkey" PRIMARY KEY ("adjustment_id")
);

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase_Detail" ADD CONSTRAINT "Purchase_Detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase_Detail" ADD CONSTRAINT "Purchase_Detail_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "public"."Purchase"("purchase_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale_Product_Detail" ADD CONSTRAINT "Sale_Product_Detail_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."Sale"("sale_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale_Product_Detail" ADD CONSTRAINT "Sale_Product_Detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inventory_Adjustment" ADD CONSTRAINT "Inventory_Adjustment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inventory_Adjustment" ADD CONSTRAINT "Inventory_Adjustment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
