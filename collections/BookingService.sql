create database BookingService;

use BookingService;

create table Seats (
  SeatId int primary key,
  SeatIdentifier varchar(255),
  SeatClass varchar(255),
  IsBooked boolean default false,
  CreatedAt timestamp default current_timestamp,
  UpdatedAt timestamp default current_timestamp
);

create table SeatPricing (
  id int primary key,
  SeatClass varchar(255),
  minPrice DECIMAL(10, 2),
  normalPrice DECIMAL(10, 2),
  maxPrice DECIMAL(10, 2)
);

create table Bookings (
  bookingId int primary key auto_increment,
  SeatIds VARCHAR(255),
  name VARCHAR(255),
  phoneNumber VARCHAR(255),
  totalAmount DECIMAL(10, 3),
  CreatedAt timestamp default current_timestamp
);

select * from Seats;
select * from SeatPricing;
select * from Bookings;