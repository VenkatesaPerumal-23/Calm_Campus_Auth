/*
  Warnings:

  - You are about to alter the column `user_id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `coins` DROP FOREIGN KEY `Coins_userId_fkey`;

-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_userId1_fkey`;

-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_userId2_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `Messages_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `Messages_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `rsvp` DROP FOREIGN KEY `RSVP_userId_fkey`;

-- DropForeignKey
ALTER TABLE `rsvp` DROP FOREIGN KEY `RSVP_webinarId_fkey`;

-- DropForeignKey
ALTER TABLE `streak` DROP FOREIGN KEY `Streak_userId_fkey`;

-- DropForeignKey
ALTER TABLE `surveyresponses` DROP FOREIGN KEY `SurveyResponses_surveyId_fkey`;

-- DropForeignKey
ALTER TABLE `surveyresponses` DROP FOREIGN KEY `SurveyResponses_userId_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `Transactions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `usermetrics` DROP FOREIGN KEY `UserMetrics_userId_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `user_id` VARCHAR(191) NOT NULL;
