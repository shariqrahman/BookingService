const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'BookingService',
    connectionLimit: 10
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the MySQL database');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();

module.exports = pool;
