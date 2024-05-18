/*
  Warnings:

  - A unique constraint covering the columns `[model_id]` on the table `reset_password_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `reset_password_tokens_model_id_key` ON `reset_password_tokens`(`model_id`);
