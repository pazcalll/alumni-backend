/*
  Warnings:

  - You are about to drop the column `email` on the `reset_password_tokens` table. All the data in the column will be lost.
  - Added the required column `model` to the `reset_password_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_id` to the `reset_password_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reset_password_tokens` DROP FOREIGN KEY `reset_password_tokens_email_fkey`;

-- AlterTable
ALTER TABLE `reset_password_tokens` DROP COLUMN `email`,
    ADD COLUMN `model` VARCHAR(191) NOT NULL,
    ADD COLUMN `model_id` INTEGER NOT NULL;
