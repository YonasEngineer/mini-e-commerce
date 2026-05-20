/*
  Warnings:

  - You are about to drop the column `orderNote` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderNote",
ADD COLUMN     "additionalNote" TEXT,
ADD COLUMN     "deliveryStreet" TEXT;
