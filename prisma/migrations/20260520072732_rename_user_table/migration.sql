/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_fkey";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
