/*
  Warnings:

  - Added the required column `gender` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "gender" TEXT NOT NULL;
