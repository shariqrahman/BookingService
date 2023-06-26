const Seats = require('../models/Seats');

class SeatController {

  static async getAllSeats(req, res) {
    try {
      const seats = await Seats.getAllSeats();
      const totalSeats = seats.map((seat) =>  ({
        SeatClass: seat.SeatClass,
        SeatId: seat.SeatId,
        SeatIdentifier: seat.SeatIdentifier,
        IsBooked: seat.IsBooked === 1
      }));

      res.status(200).json({ TotalSeats: totalSeats });
    }
    catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getSeatPricing(req, res) {
    const seatId = req.params.id;
    if (!seatId) return res.json({ message: 'Enter Input Data' });
    try {
      const bookedCount = await Seats.getBookedCount();
      const totalSeats = 500;

      const occupancyPercentage = (bookedCount / totalSeats).toFixed(1);

      const seat = await Seats.getSeatPricingById(seatId);

      const { SeatId, SeatIdentifier, SeatClass, IsBooked, minPrice, maxPrice, normalPrice } = seat;
      let seatPrice;
      if (occupancyPercentage < 0.4) {
        seatPrice = minPrice || normalPrice;
      }
      else if (occupancyPercentage >= 0.4 && occupancyPercentage <= 0.6) {
        seatPrice = normalPrice || maxPrice;
      }
      else {
        seatPrice = maxPrice || normalPrice;
      }
      
      res.status(200).json({SeatDetails: {SeatId, SeatIdentifier, SeatClass, IsBooked, Price: seatPrice}});
    }
    catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

}

module.exports = SeatController;