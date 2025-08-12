-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Administrador', 'Supervisor', 'Vendedor');

-- CreateEnum
CREATE TYPE "public"."AdjustmentType" AS ENUM ('entrada', 'salida');

-- CreateTable
CREATE TABLE "public"."Product" (
    "product_id" SERIAL NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "product_description" VARCHAR(220) NOT NULL DEFAULT 'Producto sin descripción',
    "product_image" VARCHAR(200) NOT NULL DEFAULT 'Producto sin imagen',
    "product_code" VARCHAR(15) NOT NULL,
    "product_selling_price" DECIMAL(11,2) NOT NULL,
    "product_stock" INTEGER NOT NULL,
    "product_stock_min" INTEGER NOT NULL,
    "product_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_updatedAt" TIMESTAMP(3) NOT NULL,
    "product_is_active" BOOLEAN NOT NULL DEFAULT true,
    "category_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(100) NOT NULL,
    "category_description" VARCHAR(220) NOT NULL DEFAULT 'Categoría sin descripción',
    "category_icon" VARCHAR(100) NOT NULL DEFAULT 'Categoría sin ícono',
    "category_is_active" BOOLEAN NOT NULL DEFAULT true,
    "category_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "public"."Supplier" (
    "supplier_id" SERIAL NOT NULL,
    "supplier_name" VARCHAR(100) NOT NULL,
    "supplier_lastname" VARCHAR(100) NOT NULL,
    "supplier_company" VARCHAR(100) NOT NULL,
    "supplier_phone" VARCHAR(12) NOT NULL DEFAULT 'Proveedor sin teléfono',
    "supplier_email" VARCHAR(100) NOT NULL DEFAULT 'Proveedor sin correo',
    "supplier_address" VARCHAR(200) NOT NULL DEFAULT 'Proveedor sin dirección',
    "supplier_is_active" BOOLEAN NOT NULL DEFAULT true,
    "supplier_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplier_updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "public"."Purchase" (
    "purchase_id" SERIAL NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchase_total" DECIMAL(11,2) NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateTable
CREATE TABLE "public"."PurchaseDetail" (
    "purchase_detail_id" SERIAL NOT NULL,
    "purchase_quantity" INTEGER NOT NULL,
    "purchase_unit_price" DECIMAL(11,2) NOT NULL,
    "product_id" INTEGER NOT NULL,
    "purchase_id" INTEGER NOT NULL,

    CONSTRAINT "PurchaseDetail_pkey" PRIMARY KEY ("purchase_detail_id")
);

-- CreateTable
CREATE TABLE "public"."Sale" (
    "sale_id" SERIAL NOT NULL,
    "sale_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sale_total" DECIMAL(11,2) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("sale_id")
);

-- CreateTable
CREATE TABLE "public"."SaleProductDetail" (
    "sale_product_detail_id" SERIAL NOT NULL,
    "sale_product_detail_quantity" INTEGER NOT NULL,
    "sale_product_detail_unit_price" DECIMAL(11,2) NOT NULL,
    "sale_product_discount" DECIMAL(11,2) NOT NULL DEFAULT 0.0,
    "sale_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "SaleProductDetail_pkey" PRIMARY KEY ("sale_product_detail_id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(60) NOT NULL,
    "user_lastname" VARCHAR(60) NOT NULL,
    "user_email" VARCHAR(200) NOT NULL,
    "user_password" VARCHAR(100) NOT NULL,
    "user_is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."InventoryAdjustment" (
    "adjustment_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "adjustment_type" "public"."AdjustmentType" NOT NULL,
    "adjustment_quantity" INTEGER NOT NULL,
    "adjustment_reason" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "adjustment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryAdjustment_pkey" PRIMARY KEY ("adjustment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_name_key" ON "public"."Product"("product_name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_code_key" ON "public"."Product"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_name_key" ON "public"."Category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplier_company_key" ON "public"."Supplier"("supplier_company");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplier_email_key" ON "public"."Supplier"("supplier_email");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "public"."User"("user_email");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PurchaseDetail" ADD CONSTRAINT "PurchaseDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PurchaseDetail" ADD CONSTRAINT "PurchaseDetail_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "public"."Purchase"("purchase_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleProductDetail" ADD CONSTRAINT "SaleProductDetail_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."Sale"("sale_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleProductDetail" ADD CONSTRAINT "SaleProductDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
