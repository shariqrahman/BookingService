const Booking = require('../models/Booking');

const calculateTotalAmount = async (seats) => {
  if (!Array.isArray(seats)) throw new Error('Invalid seats Ids. Expected an array.');
  
  const bookedCount = await Booking.getBookedCount();
  const totalSeats = 500;

  const occupancyPercentage = (bookedCount / totalSeats).toFixed(1);

  let totalAmount = 0;

  for (const seatId of seats) {
    try {
      const seat = await Booking.getSeatById(seatId);

      if (seat) {
        const { minPrice, normalPrice, maxPrice } = seat;
        if (occupancyPercentage <= 0.4) {
          totalAmount += parseFloat(minPrice !== null ? minPrice : normalPrice);
        }
        else if (occupancyPercentage > 0.4 && occupancyPercentage < 0.6) {
          totalAmount += parseFloat(normalPrice !== null ? normalPrice : maxPrice);
        }
        else {
          totalAmount += parseFloat(maxPrice !== null ? maxPrice : normalPrice);
        }
      }
    } catch (error) {
      throw error;
    }
  }
  return totalAmount.toFixed(2);
};



class BookingController {

  // Booking Seats
  static async createBooking(req, res) {
    const { seats, name, phoneNumber } = req.body;
  
    try {
      const alreadyBookedSeats = [];
      const availableSeats = [];
      const totalSeats = 500;
      const uniqueSeats = Array.from(new Set(seats));
  
      for (const seat of uniqueSeats) {
        if (seat > totalSeats) {
          return res.status(400).json({ error: `Invalid seat ID: ${seat}` });
        }
  
        const isBooked = await Booking.isSeatBooked(seat);
        if (isBooked) {
          alreadyBookedSeats.push(seat);
        } else {
          availableSeats.push(seat);
        }
      }
  
      if (alreadyBookedSeats.length > 0) {
        const errorMessage = `The following seats are already booked: ${alreadyBookedSeats.join(', ')}`;
        return res.status(400).json({ error: errorMessage });
      }
  
      const totalAmount = await calculateTotalAmount(availableSeats);
   
      const BookingSeat = await Booking.create(availableSeats, name, phoneNumber, totalAmount);
  
      for (const seat of availableSeats) {
        await Booking.updateSeatStatus(seat, true);
      }
  
      res.status(201).json({ Booking: BookingSeat, });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  // Fetch Bookings
  static async getBookings (req, res) {
    const phoneNumber = req.query.phoneNumber;
  
    if (!phoneNumber) {
      return res.status(400).json({ error: 'User identifier is required' });
    }
  
    try {
      const bookings = await Booking.getBookings(phoneNumber);
      if (bookings.length > 0) {
        return res.status(200).json({ Bookings: bookings });
      }
  
      return res.status(404).json({  message: 'Seat is not booked', Bookings: [] });

    }
    catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
}

module.exports = BookingController;
