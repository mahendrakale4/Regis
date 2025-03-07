/*
  Warnings:

  - You are about to drop the column `paymentMode` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Registration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "paymentMode",
DROP COLUMN "transactionId",
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentStatus" TEXT DEFAULT 'pending';
