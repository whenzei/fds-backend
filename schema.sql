CREATE TYPE MONTH_ENUM AS ENUM
(
      'Jan', 
	'Feb',
	'Mar', 
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
);

CREATE TYPE CUISINE_ENUM AS ENUM
(
      'Western', 
	'Chinese',
	'Japanese', 
	'Indonesian',
	'Korean',
	'Indian',
	'Mediterranean',
	'Thai',
	'Vietnamese',
	'Lebanese'
);




CREATE TABLE Users (
	uid			SERIAL primary key,
	name			VARCHAR(100) not null,
	userName		VARCHAR(100) not null unique,
	salt			VARCHAR(100) not null,
	passwordHash	VARCHAR(100) not null
);


CREATE TABLE Managers (
	uid			INTEGER references Users on delete cascade,
	primary key (uid)
);


CREATE TABLE Riders (
	uid			INTEGER references Users on delete cascade,
	primary key (uid)
);

CREATE TABLE PartTimers (
	uid			INTEGER references Riders on delete cascade,
	primary key (uid)
);

CREATE TABLE FullTimers (
	uid			INTEGER references Riders on delete cascade,
	primary key (uid)
);

CREATE TABLE PTSchedule (
	uid			INTEGER,
	date			DATE,
	startTime		INTEGER check (startTime >= 10 and endTime - startTime >= 1 and endTime - startTime <= 4),

	endTime 		INTEGER check (endTime <= 22 and endTime - startTime >= 1 and endTime - startTime <= 4),

	primary key (uid, date, startTime, endTime),
	foreign key (uid) references PartTimers on delete cascade
);

CREATE TABLE FTSchedule (
	scheduleId		SERIAL primary key,
	uid			INTEGER not null,
	month			MONTH_ENUM not null,
	year			INTEGER not null,
	startDayOfMonth	INTEGER
	check (startDayOfMonth > 0 and startDayOfMonth < 7),
	foreign key (uid) references FullTimers on delete cascade
);

CREATE TABLE Shifts (
	shiftId		SERIAL primary key,
	startTime1		INTEGER check (startTime1 >= 10 and startTime1 <= 22 and startTime1 < endTime1),
	endTime1		INTEGER check (endTime1 >= 10 and endTime1 <= 22 and endTime1 < startTime2),
	startTime2		INTEGER check (startTime2 >= 10 and startTime2 <= 22 and startTime2 < endTime2),
	endTime2		INTEGER check (endTime2 >= 10 and endTime2 <= 22)
);


CREATE TABLE Consists (
	scheduleId		INTEGER references FTSchedule on delete cascade,
	relativeDay		INTEGER check (relativeDay in (0, 1, 2, 3, 4)),
	shiftId		INTEGER references Shifts on delete cascade,
	primary key (scheduleId, shiftId)
);

CREATE TABLE Payout (
	payId			SERIAL primary key,
	date			DATE,
	baseSalary		INTEGER check (baseSalary >= 0),
	commission		INTEGER check (commission >= 0),
	hoursClocked	INTEGER check (hoursClocked >= 0)
);




CREATE TABLE Rates (
	month			MONTH_ENUM not null,
	year			INTEGER check (year >= 0),
	isWeekend		BOOLEAN not NULL,
	hourlyPay		INTEGER check (hourlyPay >= 0),
	primary key (month, year)
);

CREATE TABLE Receives (
	payId			INTEGER references Payout,
	month			MONTH_ENUM,
	year			INTEGER,
	uid			INTEGER references Riders on delete set null,
	foreign key (month, year)
	references Rates (month, year) match full on delete set null,
	primary key (payId, month, year)
);

CREATE TABLE Customers (
	uid				INTEGER,
	creditCard		      CHAR(16),
	points			INTEGER,
	primary key (uid),
	foreign key(uid) references Users
);

CREATE TABLE Address (
	addrId          SERIAL primary key,
	unit			VARCHAR(10),
	streetName		VARCHAR(100) not NULL,
	postalCode 		INTEGER check (postalCode > 99999 and postalCode < 10000000),
);

CREATE TABLE Frequents (
	uid			INTEGER references Customers,
	addrId		INTEGER references Address,
	lastUsed		TIMESTAMP not NULL,
	primary key (uid, addrId)
);


CREATE TABLE Restaurants (
	rid 			SERIAL primary key,
	minSpending		INTEGER not NULL,
	rname			VARCHAR(100) not NULL
);

CREATE TABLE Promotions (
	pid				INTEGER primary key,
	points			INTEGER,
	startDate			DATE not NULL,
	endDate 			DATE,
	percentOff 			INTEGER check ((percentOff > 0 and percentOff <= 100) 
		or NULL),
	minSpending			INTEGER,
	monthsWithNoOrders 	INTEGER
	/*monthsWithNoOrders is the number of months with no order to be eligible for this promo. E.g. if monthsWithNoOrders = 3 then to be eligible for this promo, customer must not have ordered in the last 3 months*/
);

CREATE TABLE GlobalPromos (
	pid 		INTEGER references Promotions on delete cascade,
	primary key (pid)
);

CREATE TABLE RestaurantPromos (
	pid 		INTEGER references Promotions on delete cascade,
	rid			INTEGER references Restaurants not NULL,
	primary key (pid)
);

CREATE TABLE Orders (
	oid				SERIAL primary key,
	riderId			INTEGER references Riders(uid) on delete set NULL,
	customerId			INTEGER references Customers(uid) on delete set NULL,
	orderTime			TIME not NULL,
	deliveredTime 		TIME,
	deliveryFee 		INTEGER not NULL,
	isDeliveryFeeWaived	BOOLEAN default FALSE,
	departForR			TIME,
	arriveAtR			TIME,
	departFromR			TIME,
	finalPrice			INTEGER not NULL,
	addrId				INTEGER not NULL,
	pid				INTEGER references Promotions,
	foreign key (addrId) references Address
);

CREATE TABLE Reviews (
	stars			INTEGER check (stars in (0, 1, 2, 3, 4, 5)),
	comment		TEXT,
	date			DATE,
	oid			INTEGER primary key references Orders
);

CREATE TABLE Ratings (
	value			INTEGER check (value in (0, 1, 2, 3, 4, 5)),
	date			DATE,
	oid			INTEGER primary key references Orders
);


CREATE TABLE Staff (
	uid			INTEGER references Users on delete cascade,
	rid			INTEGER not NULL references Restaurants,	
	primary key (uid)
);

CREATE TABLE Food (
	fname			VARCHAR(100),
	rid				INTEGER references Restaurants,
	price			INTEGER not NULL,
	category		CUISINE_ENUM not NULL,
	dailyLimit		INTEGER not NULL,
	numOrders		INTEGER DEFAULT 0,
	primary key (rid, fname),
	check  (numOrders <= dailyLimit)
);

CREATE TABLE Collates (
	fname			VARCHAR(100),
	rid				INTEGER,
	oid				INTEGER,
	totalPrice		INTEGER check (totalPrice >= 0),
	qty				INTEGER check (qty > 0),
	primary key (oid, fname),
	foreign key references (rid, fname) Food match full,
	foreign key (oid) references Orders
);