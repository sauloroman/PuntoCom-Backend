/*
  Warnings:

  - Added the required column `adjustment_prev_quantity` to the `Inventory_Adjustment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inventory_Adjustment" ADD COLUMN     "adjustment_prev_quantity" INTEGER NOT NULL;
