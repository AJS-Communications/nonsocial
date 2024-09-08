-- CreateIndex
CREATE INDEX `Authenticator_id_idx` ON `Authenticator`(`id`);

-- CreateIndex
CREATE INDEX `Authenticator_credentialId_idx` ON `Authenticator`(`credentialId`);

-- CreateIndex
CREATE INDEX `Bookmark_id_idx` ON `Bookmark`(`id`);

-- CreateIndex
CREATE INDEX `Bookmark_authorId_idx` ON `Bookmark`(`authorId`);

-- CreateIndex
CREATE INDEX `Boost_id_idx` ON `Boost`(`id`);

-- CreateIndex
CREATE INDEX `Boost_authorId_idx` ON `Boost`(`authorId`);

-- CreateIndex
CREATE INDEX `Follow_id_idx` ON `Follow`(`id`);

-- CreateIndex
CREATE INDEX `Like_id_idx` ON `Like`(`id`);

-- CreateIndex
CREATE INDEX `Like_authorId_idx` ON `Like`(`authorId`);

-- CreateIndex
CREATE INDEX `Post_id_idx` ON `Post`(`id`);

-- CreateIndex
CREATE INDEX `User_id_idx` ON `User`(`id`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- CreateIndex
CREATE INDEX `User_username_idx` ON `User`(`username`);

-- RenameIndex
ALTER TABLE `Authenticator` RENAME INDEX `Authenticator_userId_fkey` TO `Authenticator_userId_idx`;

-- RenameIndex
ALTER TABLE `Bookmark` RENAME INDEX `Bookmark_postId_fkey` TO `Bookmark_postId_idx`;

-- RenameIndex
ALTER TABLE `Boost` RENAME INDEX `Boost_postId_fkey` TO `Boost_postId_idx`;

-- RenameIndex
ALTER TABLE `Follow` RENAME INDEX `Follow_authorId_fkey` TO `Follow_authorId_idx`;

-- RenameIndex
ALTER TABLE `Like` RENAME INDEX `Like_postId_fkey` TO `Like_postId_idx`;

-- RenameIndex
ALTER TABLE `Post` RENAME INDEX `Post_authorId_fkey` TO `Post_authorId_idx`;

-- RenameIndex
ALTER TABLE `Post` RENAME INDEX `Post_parentId_fkey` TO `Post_parentId_idx`;
