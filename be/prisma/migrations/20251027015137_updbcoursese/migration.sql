/*
  Warnings:

  - You are about to drop the `Block` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivateMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chatmessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grubchat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `joinwebinar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webinar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Block` DROP FOREIGN KEY `Block_blockedId_fkey`;

-- DropForeignKey
ALTER TABLE `Block` DROP FOREIGN KEY `Block_blockerId_fkey`;

-- DropForeignKey
ALTER TABLE `ChatParticipant` DROP FOREIGN KEY `ChatParticipant_chatRoomId_fkey`;

-- DropForeignKey
ALTER TABLE `ChatParticipant` DROP FOREIGN KEY `ChatParticipant_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Follower` DROP FOREIGN KEY `Follower_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `Follower` DROP FOREIGN KEY `Follower_followingId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PrivateMessage` DROP FOREIGN KEY `PrivateMessage_chatRoomId_fkey`;

-- DropForeignKey
ALTER TABLE `PrivateMessage` DROP FOREIGN KEY `PrivateMessage_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `chatmessage` DROP FOREIGN KEY `chatmessage_grubchatUuid_fkey`;

-- DropForeignKey
ALTER TABLE `chatmessage` DROP FOREIGN KEY `chatmessage_userUuid_fkey`;

-- DropForeignKey
ALTER TABLE `grubchat` DROP FOREIGN KEY `grubchat_webinarUuid_fkey`;

-- DropForeignKey
ALTER TABLE `joinwebinar` DROP FOREIGN KEY `joinwebinar_webinarUuid_fkey`;

-- DropTable
DROP TABLE `Block`;

-- DropTable
DROP TABLE `ChatParticipant`;

-- DropTable
DROP TABLE `ChatRoom`;

-- DropTable
DROP TABLE `Comment`;

-- DropTable
DROP TABLE `Follower`;

-- DropTable
DROP TABLE `Like`;

-- DropTable
DROP TABLE `PlanFeature`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `PrivateMessage`;

-- DropTable
DROP TABLE `chatmessage`;

-- DropTable
DROP TABLE `grubchat`;

-- DropTable
DROP TABLE `joinwebinar`;

-- DropTable
DROP TABLE `webinar`;
