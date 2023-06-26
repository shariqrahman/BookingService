const pool = require('../../database');

class Booking {
  static async create(bookingData, name, phoneNumber, totalAmount) {

    try {
      const [result] = await pool.execute('insert into Bookings (SeatIds, name, phoneNumber, totalAmount) values (?, ?, ?, ?)',
        [bookingData, name, phoneNumber, totalAmount]);
      const bookingId = result.insertId;
      return { bookingId, totalAmount: totalAmount };
    } catch (error) {
      throw error;
    }
  }

  static async updateSeatStatus(seatId, isBooked) {
    try {
      const [result] = await pool.execute('update Seats set IsBooked = ? where SeatId = ?', [isBooked, seatId]);
      return result;
    }
    catch (error) {
      throw error;
    }
  }

  static async isSeatBooked(seatId) {
    try {
      const [rows] = await pool.execute('select IsBooked from Seats where SeatId = ?', [seatId]);
      if (rows.length > 0) {
        return rows[0].is_booked === 1;
      }
      return false;
    }
    catch (error) {
      throw error;
    }
  }

  static async getBookedCount() {
    try {
      const [rows] = await pool.execute('select count(*) as totalBooked from Seats where IsBooked = 1');
      return rows[0].totalBooked;
    }
    catch (error) {
      throw error;
    }
  }

  static async getSeatById(seatId) {
    try {
      const [results] = await pool.execute(`
          select S.*, SP.minPrice, SP.maxPrice, SP.normalPrice
          from Seats S
          join SeatPricing SP on S.SeatClass = SP.SeatClass
          where S.SeatId = ?
          `,
        [seatId]);

      return results[0];
    }
    catch (error) {
      throw error;
    }
  }


  static async getBookings(phoneNumber) {
    try {
      const [rows] = await pool.execute('select * from Bookings where phoneNumber = ?', [phoneNumber]);
      if (rows.length > 0) {
        return rows;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Booking;
