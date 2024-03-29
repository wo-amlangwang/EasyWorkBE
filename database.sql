-- MySQL dump 10.13  Distrib 5.5.62, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: easywork
-- ------------------------------------------------------
-- Server version	5.7.39

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '项目ID',
  `project_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '项目名称',
  `project_details` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '项目详情',
  `create_uid` int(11) NULL DEFAULT NULL COMMENT '创建者',
  `create_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `deleted` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除deleted  0:未删除 1;已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `key_project_name`(`project_name`) USING BTREE,
  INDEX `key_project_create_uid`(`create_uid`) USING BTREE,
  CONSTRAINT `key_project_create_uid` FOREIGN KEY (`create_uid`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for project_user_rel
-- ----------------------------
DROP TABLE IF EXISTS `project_user_rel`;
CREATE TABLE `project_user_rel`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '项目-成员 逻辑视图 ID',
  `m_id` int(11) NULL DEFAULT NULL COMMENT '项目成员id',
  `p_id` int(11) NOT NULL COMMENT '项目ID',
  `deleted` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除deleted  0:未删除 1;已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `index_project_member_mid`(`m_id`) USING BTREE,
  INDEX `index_project_member_pid`(`p_id`) USING BTREE,
  CONSTRAINT `key_project_member_mid` FOREIGN KEY (`m_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `key_project_member_pid` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `task_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '任务名称',
  `task_details` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '任务详情',
  `p_id` int(11) NOT NULL COMMENT '归属项目ID',
  `type` int(1) NOT NULL DEFAULT 0 COMMENT '任务类型type  0:任务 1:BUG 2:功能 3:测试',
  `create_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建者',
  `update_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '更新者',
  `priority` int(1) NOT NULL DEFAULT 0 COMMENT '任务优先级priority  0：低级 1：中级 2：高级',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `deadline` datetime NOT NULL COMMENT '截止日期',
  `assignee` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '指派人',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '任务状态status  0:未完成 1：进行中 2：已完成',
  `task_comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '任务评论',
  `deleted` int(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除deleted  0:未删除 1;已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `index_task_project_id`(`p_id`) USING BTREE,
  CONSTRAINT `key_task_project_id` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 12436 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for time_line
-- ----------------------------
DROP TABLE IF EXISTS `time_line`;
CREATE TABLE `time_line`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `tid` int(11) NULL DEFAULT NULL COMMENT '任务ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `type` int(11) NULL DEFAULT NULL COMMENT '操作类型 1为操作，2为评论',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `create_user` int(11) NULL DEFAULT NULL COMMENT '操作者',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `time_line_tid_idx`(`tid`) USING BTREE,
  INDEX `me_line_uid_key`(`create_user`) USING BTREE,
  CONSTRAINT `me_line_tid_key` FOREIGN KEY (`tid`) REFERENCES `task` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `me_line_uid_key` FOREIGN KEY (`create_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '密码',
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `user_pic` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '用户头像',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
