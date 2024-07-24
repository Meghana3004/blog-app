-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: pocauroradb.cluster-ctdy54v3otyc.eu-west-1.rds.amazonaws.com    Database: POCDB1
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `username_idx` (`username`),
  CONSTRAINT `username_fk` FOREIGN KEY (`username`) REFERENCES `Signup` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (6,15,'abc123','hey','2024-06-19 12:29:27'),(7,15,'abc123','hey','2024-06-19 12:29:28'),(8,15,'abc123','hey','2024-06-19 12:40:13'),(9,15,'abc123','hey','2024-06-19 12:42:56'),(10,15,'abc123','1','2024-06-19 12:47:17'),(11,15,'abc123','hey','2024-06-19 12:49:55'),(12,15,'abc123','.','2024-06-19 12:52:46'),(13,15,'abc123','h','2024-06-19 12:53:58'),(14,15,'abc123','hey','2024-06-19 12:55:38'),(15,15,'abc123','.','2024-06-19 13:12:23'),(16,15,'abc123','.','2024-06-19 13:12:24'),(17,15,'abc123','hi','2024-06-19 13:12:33'),(18,4,'abc123','hello','2024-06-19 13:24:56'),(19,4,'abc123','ok','2024-06-19 13:26:57'),(20,4,'abc123','.','2024-06-19 13:27:14'),(21,4,'abc123','ok','2024-06-19 14:07:35'),(22,4,'abc123','ok','2024-06-19 14:08:06'),(23,5,'Meghana123','hi','2024-06-19 14:11:05'),(25,3,'Meghana123','hey','2024-06-21 15:40:45'),(26,5,'Meghana123','hi','2024-06-26 15:39:04');
/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-24 12:32:08
