CREATE DATABASE `isable` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `tblauthority` (
  `intAuthorityID` int(11) NOT NULL AUTO_INCREMENT,
  `strAuthorityUserName` varchar(30) NOT NULL,
  `strAuthorityPassword` varchar(30) NOT NULL,
  `booAuthorityUserType` tinyint(4) NOT NULL,
  `strAuthorityFirstName` varchar(50) NOT NULL,
  `strAuthorityLastName` varchar(50) NOT NULL,
  `strAuthorityMiddleName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`intAuthorityID`),
  UNIQUE KEY `strUserName_UNIQUE` (`strAuthorityUserName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `tbllicense` (
  `intLicenseID` int(11) NOT NULL AUTO_INCREMENT,
  `strLicenseLicenseNo` varchar(13) NOT NULL,
  `strLicenseSex` char(1) NOT NULL,
  `strLicenseFirstName` varchar(50) NOT NULL,
  `strLicenseLastName` varchar(50) NOT NULL,
  `strLicenseMiddleName` varchar(50) DEFAULT NULL,
  `strLicenseAddress` longtext NOT NULL,
  `strLicenseContactNumber` varchar(11) NOT NULL,
  `datLicenseBirthDate` date NOT NULL,
  `intLicenseHeight` int(11) NOT NULL,
  `intLicenseWeight` int(11) NOT NULL,
  `strLicenseNationality` varchar(3) NOT NULL,
  `intLicenseRestrictions` int(11) NOT NULL,
  `datLicenseExpirationDate` date NOT NULL,
  `strLicenseAGY` varchar(3) NOT NULL,
  `strLicenseCondition` varchar(3) DEFAULT NULL,
  `intLicenseUsersID` int(11) DEFAULT NULL,
  PRIMARY KEY (`intLicenseID`),
  UNIQUE KEY `intUserID_UNIQUE` (`intLicenseID`),
  UNIQUE KEY `strLicenseNo_UNIQUE` (`strLicenseLicenseNo`),
  UNIQUE KEY `intUsersID_UNIQUE` (`intLicenseUsersID`),
  CONSTRAINT `intUsersID` FOREIGN KEY (`intLicenseUsersID`) REFERENCES `tbluser` (`intUserID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `tbllicensetracking` (
  `intLicenseTrackingID` int(11) NOT NULL AUTO_INCREMENT,
  `strLicenseTrackingLicenseNo` varchar(13) NOT NULL,
  `strLocation` varchar(150) NOT NULL,
  PRIMARY KEY (`intLicenseTrackingID`),
  KEY `strLicenseNo_idx` (`strLicenseTrackingLicenseNo`),
  CONSTRAINT `strLicenseNo` FOREIGN KEY (`strLicenseTrackingLicenseNo`) REFERENCES `tbllicense` (`strLicenseLicenseNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tbluser` (
  `intUserID` int(11) NOT NULL AUTO_INCREMENT,
  `strUsername` varchar(45) NOT NULL,
  `strPassword` varchar(45) DEFAULT NULL,
  `strEmail` varchar(45) NOT NULL,
  `datBirthDate` date NOT NULL,
  `strLicenseNo` varchar(13) NOT NULL,
  `booIsVerified` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`intUserID`),
  UNIQUE KEY `strUsername_UNIQUE` (`strUsername`),
  UNIQUE KEY `strEmail_UNIQUE` (`strEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

CREATE TABLE `tbluserviolation` (
  `intUserViolationID` int(11) NOT NULL AUTO_INCREMENT,
  `intUserViolationViolationID` int(11) NOT NULL,
  `intUserViolationTicketID` int(11) NOT NULL,
  PRIMARY KEY (`intUserViolationID`),
  UNIQUE KEY `intUserViolationID_UNIQUE` (`intUserViolationID`),
  KEY `intViolationID_idx` (`intUserViolationViolationID`),
  CONSTRAINT `intViolationID` FOREIGN KEY (`intUserViolationViolationID`) REFERENCES `tblviolation` (`intViolationid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tblviolation` (
  `intViolationid` int(11) NOT NULL AUTO_INCREMENT,
  `strSection` varchar(15) NOT NULL,
  `strViolation` longtext NOT NULL,
  `intCharge` int(11) NOT NULL,
  `strPenalty` longtext,
  PRIMARY KEY (`intViolationid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
