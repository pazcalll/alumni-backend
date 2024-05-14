/*
  Warnings:

  - You are about to drop the column `is_admin_verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `is_admin_verified`,
    ADD COLUMN `is_approved` BOOLEAN NOT NULL DEFAULT false;
