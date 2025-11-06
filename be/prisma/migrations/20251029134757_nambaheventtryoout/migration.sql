-- CreateTable
CREATE TABLE `Event` (
    `id_event` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `event_name` VARCHAR(200) NOT NULL,
    `event_desc` VARCHAR(191) NULL,
    `instruction` VARCHAR(191) NULL,
    `event_status` VARCHAR(100) NULL,
    `event_type` INTEGER NULL,
    `event_duration` INTEGER NULL,
    `event_image` VARCHAR(191) NULL,
    `event_passing_grade` INTEGER NULL,
    `event_start` DATETIME(3) NULL,
    `event_end` DATETIME(3) NULL,
    `branch_id` INTEGER NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Event_uuid_key`(`uuid`),
    PRIMARY KEY (`id_event`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventScript` (
    `id_event_script` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `no_event` VARCHAR(5) NULL,
    `type_no_question` VARCHAR(100) NULL,
    `auto_nest` BOOLEAN NULL DEFAULT false,
    `event_id` INTEGER NOT NULL,
    `script_id` INTEGER NULL,
    `created_date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EventScript_uuid_key`(`uuid`),
    PRIMARY KEY (`id_event_script`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventScore` (
    `id_event_score` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `score` INTEGER NULL,
    `no_event` INTEGER NULL,
    `event_score_status` VARCHAR(100) NULL,
    `event_session_start` DATETIME(3) NULL,
    `event_session_finish` DATETIME(3) NULL,
    `event_session_expired` DATETIME(3) NULL,
    `event_script_id` INTEGER NOT NULL,
    `event_member_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EventScore_uuid_key`(`uuid`),
    PRIMARY KEY (`id_event_score`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventMember` (
    `id_event_member` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `total_score` INTEGER NULL,
    `event_start` DATETIME(3) NULL,
    `event_end` DATETIME(3) NULL,
    `event_expired` DATETIME(3) NULL,
    `event_member_status` VARCHAR(100) NULL,
    `total_reset` INTEGER NULL,
    `event_id` INTEGER NOT NULL,
    `member_id` VARCHAR(150) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EventMember_uuid_key`(`uuid`),
    PRIMARY KEY (`id_event_member`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventBranch` (
    `id_event_branch` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `event_id` INTEGER NOT NULL,
    `branch_id` INTEGER NULL,

    UNIQUE INDEX `EventBranch_uuid_key`(`uuid`),
    PRIMARY KEY (`id_event_branch`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventScript` ADD CONSTRAINT `EventScript_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id_event`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventScore` ADD CONSTRAINT `EventScore_event_script_id_fkey` FOREIGN KEY (`event_script_id`) REFERENCES `EventScript`(`id_event_script`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventScore` ADD CONSTRAINT `EventScore_event_member_id_fkey` FOREIGN KEY (`event_member_id`) REFERENCES `EventMember`(`id_event_member`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventMember` ADD CONSTRAINT `EventMember_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id_event`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventBranch` ADD CONSTRAINT `EventBranch_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id_event`) ON DELETE RESTRICT ON UPDATE CASCADE;
