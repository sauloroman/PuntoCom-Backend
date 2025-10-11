/*
  Warnings:

  - You are about to drop the column `used` on the `PasswordResetCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PasswordResetCode" DROP COLUMN "used";
