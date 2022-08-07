-- MySQL dump 10.13  Distrib 5.5.62, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: easywork
-- ------------------------------------------------------
-- Server version	5.7.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '项目ID',
  `project_name` varchar(255) NOT NULL COMMENT '项目名称',
  `project_details` varchar(255) DEFAULT NULL COMMENT '项目详情',
  `create_uid` int(11) DEFAULT NULL COMMENT '创建者',
  `create_user` varchar(255) NOT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `deleted` int(1) NOT NULL DEFAULT '0' COMMENT '逻辑删除deleted  0:未删除 1;已删除',
  PRIMARY KEY (`id`),
  KEY `key_project_name` (`project_name`),
  KEY `key_project_create_uid` (`create_uid`),
  CONSTRAINT `key_project_create_uid` FOREIGN KEY (`create_uid`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Table structure for table `project_user_rel`
--

DROP TABLE IF EXISTS `project_user_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_user_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '项目-成员 逻辑视图 ID',
  `p_name` varchar(255) NOT NULL COMMENT '项目名称',
  `m_id` int(11) DEFAULT NULL COMMENT '项目成员id',
  `p_id` int(11) NOT NULL COMMENT '项目ID',
  `deleted` int(1) NOT NULL DEFAULT '0' COMMENT '逻辑删除deleted  0:未删除 1;已删除',
  PRIMARY KEY (`id`),
  KEY `index_project_member_mid` (`m_id`) USING HASH,
  KEY `index_project_member_pid` (`p_id`) USING HASH,
  CONSTRAINT `key_project_member_mid` FOREIGN KEY (`m_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `task_name` varchar(255) NOT NULL COMMENT '任务名称',
  `task_details` varchar(255) DEFAULT NULL COMMENT '任务详情',
  `project_name` varchar(255) NOT NULL COMMENT '项目名称',
  `p_id` int(11) NOT NULL COMMENT '归属项目ID',
  `type` int(1) NOT NULL DEFAULT '0' COMMENT '任务类型type  0:任务 1:BUG 2:功能 3:测试',
  `create_user` varchar(255) NOT NULL COMMENT '创建者',
  `update_user` varchar(255) NOT NULL COMMENT '更新者',
  `priority` int(1) NOT NULL DEFAULT '0' COMMENT '任务优先级priority  0：低级 1：中级 2：高级',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `deadline` datetime NOT NULL COMMENT '截止日期',
  `assignee` varchar(255) DEFAULT NULL COMMENT '指派人',
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '任务状态status  0:未完成 1：进行中 2：已完成',
  `task_comment` varchar(255) DEFAULT NULL COMMENT '任务评论',
  `deleted` int(1) NOT NULL DEFAULT '0' COMMENT '逻辑删除deleted  0:未删除 1;已删除',
  PRIMARY KEY (`id`),
  KEY `index_task_project_id` (`p_id`),
  CONSTRAINT `key_task_project_id` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(255) NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET ascii NOT NULL COMMENT '密码',
  `nickname` varchar(255) DEFAULT NULL COMMENT '昵称',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `user_pic` text COMMENT '用户头像',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;