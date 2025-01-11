CREATE DATABASE  IF NOT EXISTS `bobby` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bobby`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: bobby
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

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `accountId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatarPath` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `gender` enum('Man','Woman','Something else','Prefer not to say') NOT NULL,
  `role` enum('User','Artist','Administrator') NOT NULL,
  PRIMARY KEY (`accountId`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'bobby','bobby@gmail.com',NULL,'$2b$10$YasRkHlmDIBrXNe12NwvoOpcdw8FPEc3/mQOBzhUCjuC1BhPhTA.6','2001-05-01','Man','Administrator'),(3,'Bruno Mars','brunomars@example.com','avatars/1736591227925-22bf045f79d3.jpg','$2a$10$1IyAIe5S0UH8oOFOmfZjpepXo6aDNyojWf.dpMhyW2r6RZVKJQiMy','1985-10-08','Man','Artist'),(4,'Justin Bieber','justinbieber@example.com','avatars/1736592350029-bc89f88199e7.jpg','$2a$10$2MjiWFZ8RyAqRRZh.gYiR.3NSQu.M2q8KIIfK.emEj5x0qWwVt32e','1994-03-01','Man','Artist'),(5,'Taylor Swift','taylorswift@example.com','avatars/1736607527185-9800ef1ee8ea.jpg','$2a$10$1cD4.ovhvWqd6EhVNcX4g.7DhmlixwWXYr77TXDNZmQEMRXbmxou.','1989-12-13','Woman','Artist'),(6,'Maroon 5','maroon5@example.com','avatars/1736608641750-e8de05b236ed.jpg','$2a$10$S76zJkR3HMlAIp.0eMbMOO7MF5M1oZzyvbhvjmlOMAxOJrlJ20C86','1994-06-01','Prefer not to say','Artist'),(7,'One Direction','onedirection@example.com','avatars/1736609721339-c52b8a32a3ce.jpg','$2a$10$NZtS5PNjR8r2pfAWbcO3Ze0nYtVqmhJxUMC5LzkdgrGjd9D.nvGOa','2010-06-01','Prefer not to say','Artist'),(9,'Nam Bobby','lethpnam27@gmail.com','avatars/1736613049069-31dfb4e202fb.png','$2a$10$DaPqxIGDcsxpkFSjR62AdeGv99A/oXfLt5VBYuz/Fkll9IVFV8c5G','2001-05-02','Man','User');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `administrators`
--

DROP TABLE IF EXISTS `administrators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrators` (
  `adminId` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `accountId` int DEFAULT NULL,
  PRIMARY KEY (`adminId`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `administrators_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrators`
--

LOCK TABLES `administrators` WRITE;
/*!40000 ALTER TABLE `administrators` DISABLE KEYS */;
INSERT INTO `administrators` VALUES (1,'2025-01-09 18:02:19','2025-01-09 18:02:19',1);
/*!40000 ALTER TABLE `administrators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `albums`
--

DROP TABLE IF EXISTS `albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `albums` (
  `albumId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `thumbnailPath` varchar(255) DEFAULT NULL,
  `createdDate` datetime NOT NULL,
  `publishedYear` int DEFAULT NULL,
  `artistId` int NOT NULL,
  PRIMARY KEY (`albumId`),
  KEY `artistId` (`artistId`),
  CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`artistId`) REFERENCES `artists` (`artistId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `albums`
--

LOCK TABLES `albums` WRITE;
/*!40000 ALTER TABLE `albums` DISABLE KEYS */;
INSERT INTO `albums` VALUES (1,'An Evening With Silk Sonic','Bruno Mars','src\\uploads\\albums\\1736591317548-9f35744bb114.jpg','2025-01-11 17:28:37',2021,2),(2,'My World 2.0','Justin Bieber','src\\uploads\\albums\\1736605867698-30ef57381aef.jpg','2025-01-11 21:31:07',2010,3),(3,'Purpose','Justin Bieber','src\\uploads\\albums\\1736605894856-f4a818357977.jpg','2025-01-11 21:31:34',2015,3),(4,'Lover','Taylor Swift','src\\uploads\\albums\\1736607695194-f214d02045ae.jpg','2025-01-11 22:01:35',2019,4),(5,'Songs About Jane','Maroon 5','src\\uploads\\albums\\1736608718716-e3445fcb99dc.jpg','2025-01-11 22:18:38',2002,5),(6,'V','Maroon 5','src\\uploads\\albums\\1736608743606-ff015003964a.jpg','2025-01-11 22:19:03',2015,5),(7,'Overexposed','Maroon 5','src\\uploads\\albums\\1736608786820-c07d5deaa106.jpg','2025-01-11 22:19:46',2012,5),(8,'FOUR','One Direction','src\\uploads\\albums\\1736609802322-b180214addce.jpg','2025-01-11 22:36:42',2014,6),(9,'Made In The A.M.','One Direction','src\\uploads\\albums\\1736609847901-7187fff3903e.jpg','2025-01-11 22:37:27',2015,6),(10,'Midnight Memories','One Direction','src\\uploads\\albums\\1736609905349-7c2ff199aed0.jpg','2025-01-11 22:38:25',2013,6),(11,'Up All Night','One Direction','src\\uploads\\albums\\1736609930188-4862966f219a.jpg','2025-01-11 22:38:50',2012,6);
/*!40000 ALTER TABLE `albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artists` (
  `artistId` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `accountId` int DEFAULT NULL,
  PRIMARY KEY (`artistId`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `artists_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` VALUES (2,'2025-01-11 17:19:27','2025-01-11 17:19:27',3),(3,'2025-01-11 17:20:50','2025-01-11 17:20:50',4),(4,'2025-01-11 17:22:53','2025-01-11 17:22:53',5),(5,'2025-01-11 17:24:35','2025-01-11 17:24:35',6),(6,'2025-01-11 17:25:47','2025-01-11 17:25:47',7);
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `music`
--

DROP TABLE IF EXISTS `music`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `music` (
  `musicId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `thumbnailPath` varchar(255) DEFAULT NULL,
  `uploadDate` datetime NOT NULL,
  `publishedYear` int DEFAULT NULL,
  `artistId` int NOT NULL,
  `albumId` int DEFAULT NULL,
  PRIMARY KEY (`musicId`),
  KEY `artistId` (`artistId`),
  KEY `albumId` (`albumId`),
  CONSTRAINT `music_ibfk_1` FOREIGN KEY (`artistId`) REFERENCES `artists` (`artistId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `music_ibfk_2` FOREIGN KEY (`albumId`) REFERENCES `albums` (`albumId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `music`
--

LOCK TABLES `music` WRITE;
/*!40000 ALTER TABLE `music` DISABLE KEYS */;
INSERT INTO `music` VALUES (1,'777','Bruno Mars','R&B/Hip Hop/Rap','src\\uploads\\music\\1736591671697-25869a7995d5.mp3','Bruno Mars, Anderson .Paak, Silk Sonic','src\\uploads\\music\\thumbnails\\1736591671709-721a00407510.jpg','2025-01-11 17:34:31',2021,2,1),(2,'Fly As Me','Bruno Mars','R&B/Hip Hop/Rap','src\\uploads\\music\\1736591798583-d6f1b6536f55.mp3','Bruno Mars, Anderson .Paak, Silk Sonic\r\n','src\\uploads\\music\\thumbnails\\1736591798609-828a984a7c85.jpg','2025-01-11 17:36:38',2021,2,1),(3,'Leave The Door Open','Bruno Mars','R&B/Hip Hop/Rap','src\\uploads\\music\\1736591893141-e20745e17c44.mp3','Bruno Mars, Anderson .Paak, Silk Sonic\r\n','src\\uploads\\music\\thumbnails\\1736591893171-d95578b411e3.jpg','2025-01-11 17:38:13',2021,2,1),(4,'Silk Sonic Intro','Bruno Mars','R&B/Hip Hop/Rap','src\\uploads\\music\\1736591994123-fbbf043a1785.mp3','Bruno Mars, Anderson .Paak, Silk Sonic','src\\uploads\\music\\thumbnails\\1736591994126-4ac06e412046.jpg','2025-01-11 17:39:54',2021,2,1),(5,'Skate','Bruno Mars','R&B/Hip Hop/Rap','src\\uploads\\music\\1736592047738-01a50f80cd6d.mp3','Bruno Mars, Anderson .Paak, Silk Sonic','src\\uploads\\music\\thumbnails\\1736592047758-d1b159c58c94.jpg','2025-01-11 17:40:47',2021,2,1),(6,'APT.','Bruno Mars','Pop','src\\uploads\\music\\1736592125277-b38c029e6e82.mp3','ROSÉ, Bruno Mars','src\\uploads\\music\\thumbnails\\1736592125286-d2c53e2a9410.jpg','2025-01-11 17:42:05',2024,2,NULL),(7,'Die With A Smile','Bruno Mars','Pop','src\\uploads\\music\\1736592202544-80253e357045.mp3','Lady Gaga, Bruno Mars','src\\uploads\\music\\thumbnails\\1736592202571-27c7cde47685.jpg','2025-01-11 17:43:22',2024,2,NULL),(8,'I\'ll Show You','Justin Bieber','Pop','src\\uploads\\music\\1736606249410-bb876bd98681.mp3','Justin Bieber','src\\uploads\\music\\thumbnails\\1736606249428-df31b3275366.jpg','2025-01-11 21:37:29',2015,3,3),(9,'What Do You Mean?','Justin Bieber','Pop','src\\uploads\\music\\1736606408616-18494ab8d9b0.mp3','Justin Bieber','src\\uploads\\music\\thumbnails\\1736606408636-530cd849aceb.jpg','2025-01-11 21:40:08',2015,3,3),(10,'Love Yourself','Justin Bieber','Pop','src\\uploads\\music\\1736606521269-417c576cd38e.mp3','Justin Bieber','src\\uploads\\music\\thumbnails\\1736606521280-ec9fc9b677c8.jpg','2025-01-11 21:42:01',2015,3,3),(11,'Mark My Words','Justin Bieber','Pop','src\\uploads\\music\\1736606713624-c1078e17f0a7.mp3','Justin Bieber','src\\uploads\\music\\thumbnails\\1736606713632-5110966b3452.jpg','2025-01-11 21:45:13',2015,3,3),(12,'Sorry','Justin Bieber','Pop','src\\uploads\\music\\1736606777500-3b3384e56610.mp3','Justin Bieber','src\\uploads\\music\\thumbnails\\1736606777511-27acf9ff5744.jpg','2025-01-11 21:46:17',2015,3,3),(13,'Baby','Justin Bieber','Pop','src\\uploads\\music\\1736606899971-ff0fe27b408e.mp3','Justin Bieber, Ludacris','src\\uploads\\music\\thumbnails\\1736606899982-0a6ab4bfcd2e.jpg','2025-01-11 21:48:19',2010,3,2),(14,'Never Let You Go','Justin Bieber','Pop','src\\uploads\\music\\1736607060110-22499bb80a76.mp3','Justin Bieber','src\\uploads\\music\\thumbnails\\1736607060136-b4c12eec7491.jpg','2025-01-11 21:51:00',2010,3,2),(15,'U Smile','Justin Bieber','Pop','src\\uploads\\music\\1736607222302-c25391f64589.mp3','Justin Bieber','src\\uploads\\music\\thumbnails\\1736607222315-5e153280757e.jpg','2025-01-11 21:53:42',2010,3,2),(16,'Somebody To Love','Justin Bieber','Pop','src\\uploads\\music\\1736607334246-ac476f9f0be9.mp3','Justin Bieber','src\\uploads\\music\\thumbnails\\1736607334257-ddbb54d23351.jpg','2025-01-11 21:55:34',2010,3,2),(17,'Up','Justin Bieber','Pop','src\\uploads\\music\\1736607400629-b9573fc3f11c.mp3','Justin Bieber','src\\uploads\\music\\thumbnails\\1736607400640-b1316e08d61b.jpg','2025-01-11 21:56:40',2010,3,2),(18,'Fortnight','Taylor Swift','Pop','src\\uploads\\music\\1736607783228-0893befca898.mp3','Taylor Swift, Post Malone','src\\uploads\\music\\thumbnails\\1736607783264-41c757020a22.jpg','2025-01-11 22:03:03',2024,4,NULL),(19,'I Can Do It With A Broken Heart','Taylor Swift','Pop','src\\uploads\\music\\1736607879061-ed9670ae6925.mp3','Taylor Swift','src\\uploads\\music\\thumbnails\\1736607879088-b2c597d87e5c.jpg','2025-01-11 22:04:39',2024,4,NULL),(20,'Daylight','Taylor Swift','Pop','src\\uploads\\music\\1736607986470-5ac5c93fd9dc.mp3','Taylor Swift','src\\uploads\\music\\thumbnails\\1736607986514-909f0565d716.jpg','2025-01-11 22:06:26',2019,4,4),(21,'I Forgot That You Existed','Taylor Swift','Pop','src\\uploads\\music\\1736608253079-dccbfed9d7b2.mp3','Taylor Swift','src\\uploads\\music\\thumbnails\\1736608253088-ebf1acc192be.jpg','2025-01-11 22:10:53',2019,4,4),(22,'London Boy','Taylor Swift','Pop','src\\uploads\\music\\1736608350415-d66b6f7a56bd.mp3','Taylor Swift','src\\uploads\\music\\thumbnails\\1736608350429-6128a92551f7.jpg','2025-01-11 22:12:30',2019,4,4),(23,'Lover','Taylor Swift','Pop','src\\uploads\\music\\1736608446131-96cf317a01eb.mp3','Taylor Swift','src\\uploads\\music\\thumbnails\\1736608446153-26c787885eae.jpg','2025-01-11 22:14:06',2019,4,4),(24,'Cruel Summer','Taylor Swift','Pop','src\\uploads\\music\\1736608533998-4fb71c7fa014.mp3','Taylor Swift','src\\uploads\\music\\thumbnails\\1736608534009-c1675f02e102.jpg','2025-01-11 22:15:34',2019,4,4),(25,'Animals','Maroon 5','Pop','src\\uploads\\music\\1736608894711-831c24a76a33.mp3','Maroon 5','src\\uploads\\music\\thumbnails\\1736608894761-fb7c85daa63c.jpg','2025-01-11 22:21:34',2015,5,6),(26,'Maps','Maroon 5','Pop','src\\uploads\\music\\1736608953000-49edeed5d5df.mp3','Maroon 5','src\\uploads\\music\\thumbnails\\1736608953014-72f9fa7ee9f3.jpg','2025-01-11 22:22:33',2015,5,6),(27,'Sugar','Maroon 5','Pop','src\\uploads\\music\\1736609058389-40aa9de5835f.mp3','Maroon 5','src\\uploads\\music\\thumbnails\\1736609058416-9e82d48f5b0e.jpg','2025-01-11 22:24:18',2015,5,6),(28,'One More Night','Maroon 5','Pop','src\\uploads\\music\\1736609247461-2553670bf86c.mp3','Maroon 5','src\\uploads\\music\\thumbnails\\1736609247482-52ffbbf5a609.jpg','2025-01-11 22:27:27',2012,5,7),(29,'Payphone','Maroon 5','Pop','src\\uploads\\music\\1736609323144-b963af995a0d.mp3','Maroon 5','src\\uploads\\music\\thumbnails\\1736609323172-a2e539622df0.jpg','2025-01-11 22:28:43',2012,5,7),(30,'She Will Be Loved','Maroon 5','Pop','src\\uploads\\music\\1736609421893-43d77edcfefc.mp3','Maroon 5','src\\uploads\\music\\thumbnails\\1736609421926-fa2225b9c5ad.jpg','2025-01-11 22:30:21',2002,5,5),(31,'Sunday Morning','Maroon 5','Pop','src\\uploads\\music\\1736609549719-7fec4782ea70.mp3','Maroon 5','src\\uploads\\music\\thumbnails\\1736609549755-2c55ee461068.jpg','2025-01-11 22:32:29',2002,5,5),(32,'This Love','Maroon 5','Pop','src\\uploads\\music\\1736609662121-aa859a7ebe48.mp3','Maroon 5','src\\uploads\\music\\thumbnails\\1736609662148-a8bec50fcee2.jpg','2025-01-11 22:34:22',2002,5,5),(33,'18','One Direction','Pop','src\\uploads\\music\\1736610171827-4d6ec124421b.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736610171861-32c630d5ffd6.jpg','2025-01-11 22:42:51',2014,6,8),(34,'Night Changes','One Direction','Pop','src\\uploads\\music\\1736610306487-d7e926f84605.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736610306512-d593d5bd6d53.jpg','2025-01-11 22:45:06',2014,6,8),(35,'Steal My Girl','One Direction','Pop','src\\uploads\\music\\1736610373162-483a288e78c4.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736610373184-09ccb10d14ba.jpg','2025-01-11 22:46:13',2014,6,8),(36,'Drag Me Down','One Direction','Pop','src\\uploads\\music\\1736610457863-17b002d6082b.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736610457878-0b39f012f4bd.jpg','2025-01-11 22:47:37',2015,6,9),(37,'Perfect','One Direction','Pop','src\\uploads\\music\\1736610536062-dabf25d54c8b.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736610536089-c593a5e70763.jpg','2025-01-11 22:48:56',2015,6,9),(38,'Best Song Ever','One Direction','Pop','src\\uploads\\music\\1736610665441-4e82a7a886a4.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736610665458-52b263fb6df1.jpg','2025-01-11 22:51:05',2013,6,10),(39,'Right Now','One Direction','Pop','src\\uploads\\music\\1736610761332-65ed464ce047.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736610761349-a197c4d7af56.jpg','2025-01-11 22:52:41',2013,6,10),(40,'You & I','One Direction','Pop','src\\uploads\\music\\1736610840542-8c1b151130e5.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736610840573-4e8b95bce35c.jpg','2025-01-11 22:54:00',2013,6,10),(41,'More Than This','One Direction','Pop','src\\uploads\\music\\1736610918686-8d3765fc9010.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736610918709-be355154fed5.jpg','2025-01-11 22:55:18',2012,6,11),(42,'One Thing','One Direction','Pop','src\\uploads\\music\\1736611004536-a5fe3ff24655.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736611004553-f1fa4a38631b.jpg','2025-01-11 22:56:44',2012,6,11),(43,'What Makes You Beautiful','One Direction','Pop','src\\uploads\\music\\1736611067737-7953447c2fd6.mp3','One Direction','src\\uploads\\music\\thumbnails\\1736611067760-2ddfaecc0c90.jpg','2025-01-11 22:57:47',2012,6,11);
/*!40000 ALTER TABLE `music` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `otpId` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `otp` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `accountId` int NOT NULL,
  PRIMARY KEY (`otpId`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `otps_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlistmusics`
--

DROP TABLE IF EXISTS `playlistmusics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlistmusics` (
  `playlistId` int NOT NULL,
  `musicId` int NOT NULL,
  PRIMARY KEY (`playlistId`,`musicId`),
  UNIQUE KEY `playlistmusics_musicId_playlistId_unique` (`playlistId`,`musicId`),
  KEY `musicId` (`musicId`),
  CONSTRAINT `playlistmusics_ibfk_1` FOREIGN KEY (`playlistId`) REFERENCES `playlists` (`playlistId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `playlistmusics_ibfk_2` FOREIGN KEY (`musicId`) REFERENCES `music` (`musicId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlistmusics`
--

LOCK TABLES `playlistmusics` WRITE;
/*!40000 ALTER TABLE `playlistmusics` DISABLE KEYS */;
INSERT INTO `playlistmusics` VALUES (1,3),(1,6),(1,7),(1,9),(1,10),(1,28),(1,29),(1,43);
/*!40000 ALTER TABLE `playlistmusics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlists` (
  `playlistId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `thumbnailPath` varchar(255) DEFAULT NULL,
  `creationDate` datetime NOT NULL,
  `accountId` int NOT NULL,
  PRIMARY KEY (`playlistId`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists`
--

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;
INSERT INTO `playlists` VALUES (1,'Liked Music',NULL,'2025-01-11 23:32:12',9);
/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userfollows`
--

DROP TABLE IF EXISTS `userfollows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userfollows` (
  `userfollowId` int NOT NULL AUTO_INCREMENT,
  `accountId` int NOT NULL,
  `followType` enum('Album','Artist') NOT NULL,
  `artistId` int DEFAULT NULL,
  `albumId` int DEFAULT NULL,
  PRIMARY KEY (`userfollowId`),
  KEY `accountId` (`accountId`),
  KEY `artistId` (`artistId`),
  KEY `albumId` (`albumId`),
  CONSTRAINT `userfollows_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userfollows_ibfk_2` FOREIGN KEY (`artistId`) REFERENCES `accounts` (`accountId`),
  CONSTRAINT `userfollows_ibfk_3` FOREIGN KEY (`albumId`) REFERENCES `albums` (`albumId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userfollows`
--

LOCK TABLES `userfollows` WRITE;
/*!40000 ALTER TABLE `userfollows` DISABLE KEYS */;
INSERT INTO `userfollows` VALUES (30,9,'Artist',3,NULL),(31,9,'Album',NULL,4);
/*!40000 ALTER TABLE `userfollows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `accountId` int DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'2025-01-11 23:29:23','2025-01-11 23:29:23',9);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-12  0:12:06
