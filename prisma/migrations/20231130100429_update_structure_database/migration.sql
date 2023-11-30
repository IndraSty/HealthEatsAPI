-- CreateTable
CREATE TABLE `diseases` (
    `id_disease` INTEGER NOT NULL,
    `name` VARCHAR(100) NULL,
    `id_food` INTEGER NULL,
    `description` TEXT NULL,

    INDEX `id_food`(`id_food`),
    PRIMARY KEY (`id_disease`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foods` (
    `id_food` INTEGER NOT NULL AUTO_INCREMENT,
    `food_name` VARCHAR(100) NOT NULL,
    `ingredients` TEXT NULL,
    `steps` TEXT NULL,
    `image` VARCHAR(200) NULL,

    PRIMARY KEY (`id_food`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recommendations` (
    `id_recommendation` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_disease` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `id_disease`(`id_disease`),
    INDEX `id_user`(`id_user`),
    PRIMARY KEY (`id_recommendation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `born` DATE NULL,
    `phone` INTEGER NULL,
    `image` VARCHAR(200) NULL,
    `refreshToken` VARCHAR(300) NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `diseases` ADD CONSTRAINT `diseases_ibfk_1` FOREIGN KEY (`id_food`) REFERENCES `foods`(`id_food`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recommendations` ADD CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recommendations` ADD CONSTRAINT `recommendations_ibfk_2` FOREIGN KEY (`id_disease`) REFERENCES `diseases`(`id_disease`) ON DELETE NO ACTION ON UPDATE NO ACTION;
