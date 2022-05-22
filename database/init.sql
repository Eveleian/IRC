ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'irc';
DROP TABLES IF EXISTS `Users`;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(50) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARACTER SET utf8;
DROP TABLES IF EXISTS `User_messages`;
CREATE TABLE `User_messages` (
  `user_message_id` int NOT NULL AUTO_INCREMENT,
  `from_user_id` int NOT NULL,
  `to_user_id` int NOT NULL,
  `message` varchar(4096) DEFAULT NULL,
  PRIMARY KEY (`user_message_id`),
  FOREIGN KEY (from_user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES Users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARACTER SET utf8;
DROP TABLES IF EXISTS `Channels`;
CREATE TABLE `Channels` (
  `channel_id` int NOT NULL AUTO_INCREMENT,
  `channel_name` varchar(100) NOT NULL,
  PRIMARY KEY (`channel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARACTER SET utf8;
DROP TABLES IF EXISTS `Channel_messages`;
CREATE TABLE `Channel_messages` (
  `channel_message_id` int NOT NULL AUTO_INCREMENT,
  `channel_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` varchar(4096) DEFAULT NULL,
  PRIMARY KEY (`channel_message_id`),
  FOREIGN KEY (channel_id) REFERENCES Channels(channel_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARACTER SET utf8;
INSERT INTO `Users` VALUES ("1", "admin", "admin");
INSERT INTO `Users` VALUES ("2", "azerty", "azerty");
INSERT INTO `Users` VALUES ("3", "Raph", "aze");
INSERT INTO `Users` VALUES ("4", "Justine", "aze");
INSERT INTO `Users` VALUES ("5", "Valentin", "aze");
INSERT INTO `User_messages` VALUES ("1", "1", "2", "Coucou!");
INSERT INTO `User_messages` VALUES ("2", "2", "1", "Salut!");
INSERT INTO `User_messages` VALUES ("3", "1", "3", "Coucou!");
INSERT INTO `User_messages` VALUES ("4", "3", "1", "Salut!");
INSERT INTO `User_messages` VALUES ("5", "1", "4", "Coucou!");
INSERT INTO `User_messages` VALUES ("6", "4", "1", "Salut!");
INSERT INTO `User_messages` VALUES ("7", "1", "5", "Ca va?");
INSERT INTO `User_messages` VALUES ("8", "5", "1", "Ca va?");
INSERT INTO `Channels` VALUES ("1", "Global chat");
INSERT INTO `Channels` VALUES ("2", "Channel 2");
INSERT INTO `Channels` VALUES ("3", "Channel 3");
INSERT INTO `Channels` VALUES ("4", "Channel 4");
INSERT INTO `Channels` VALUES ("5", "Channel 5");
INSERT INTO `Channel_messages` VALUES ("1", "1", "1", "Coucou sur le channel");
INSERT INTO `Channel_messages` VALUES ("2", "1", "2", "Coucou sur le channel");
INSERT INTO `Channel_messages` VALUES ("3", "1", "3", "Coucou sur le channel");
INSERT INTO `Channel_messages` VALUES ("4", "1", "4", "Coucou sur le channel");
INSERT INTO `Channel_messages` VALUES ("5", "1", "5", "Coucou sur le channel");
INSERT INTO `Channel_messages` VALUES ("6", "2", "1", "Coucou sur le channel");
INSERT INTO `Channel_messages` VALUES ("7", "3", "2", "Coucou sur le channel");
INSERT INTO `Channel_messages` VALUES ("8", "4", "3", "Coucou sur le channel");
INSERT INTO `Channel_messages` VALUES ("9", "5", "4", "Coucou sur le channel");