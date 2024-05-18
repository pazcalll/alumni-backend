/*
  Warnings:

  - Added the required column `id` to the `reset_password_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `reset_password_tokens_model_id_key` ON `reset_password_tokens`;

-- DropIndex
DROP INDEX `reset_password_tokens_token_key` ON `reset_password_tokens`;

-- AlterTable
ALTER TABLE `reset_password_tokens` ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
