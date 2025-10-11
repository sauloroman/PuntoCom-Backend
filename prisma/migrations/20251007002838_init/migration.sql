-- CreateTable
CREATE TABLE "PasswordResetCode" (
    "reset_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "PasswordResetCode_pkey" PRIMARY KEY ("reset_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetCode_code_key" ON "PasswordResetCode"("code");

-- AddForeignKey
ALTER TABLE "PasswordResetCode" ADD CONSTRAINT "PasswordResetCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
