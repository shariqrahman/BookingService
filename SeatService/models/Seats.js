const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'host.docker.internal',  // if use docker
    // host: 'localhost',         // if code run directly
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'BookingService',
    connectionLimit: 10
});

class Seats {

    static async getAllSeats() {
        try {
            const [results] = await pool.execute('select * from Seats order by SeatClass');
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async getBookedCount() {
        const [rows] = await pool.execute('select count(*) as TotalBooked from Seats where IsBooked = 1');
        return rows[0].TotalBooked;
    }

    static async getSeatPricingById(seatId) {
        try {
            const [results] = await pool.execute(`
                    select S.*, SP.minPrice, SP.maxPrice, SP.normalPrice
                    from Seats S
                    join SeatPricing SP on S.SeatClass = SP.SeatClass
                    where S.SeatId = ?
                `,
                [seatId]
            );
            return results[0];
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = Seats;
