const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./database')

async function uploadData() {
    try {
        const seatsData = await processCSVFile('Seats.csv');
        await uploadSeatsData(pool, seatsData);

        const seatsPricingData = await processCSVFile('SeatPricing.csv');
        await uploadSeatsPricingData(pool, seatsPricingData);

        console.log('Data uploaded successfully!');
    } catch (error) {
        console.error('Error uploading data:', error);
    }
    finally {
        pool.end();
    }
}

async function processCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const csvData = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                csvData.push(row);
            })
            .on('end', () => {
                resolve(csvData);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

async function uploadSeatsData(pool, data) {
    for (const row of data) {
        const id = row.id;
        const identifier = row.seat_identifier;
        const seatClassValue = row.seat_class;

        await pool.execute(
            'insert into Seats (SeatId, SeatIdentifier, SeatClass) values (?, ?, ?)',
            [id, identifier, seatClassValue]
        );
    }
}

async function uploadSeatsPricingData(pool, data) {
    for (const row of data) {
        const id = row.id;
        const seatClass = row.seat_class;
        const minPrice = row.min_price ? parseFloat(row.min_price.replace('$', '')) : null;
        const normalPrice = row.normal_price ? parseFloat(row.normal_price.replace('$', '')) : null;
        const maxPrice = row.max_price ? parseFloat(row.max_price.replace('$', '')) : null;

        await pool.execute(
            'insert into SeatPricing (id, SeatClass, minPrice, normalPrice, maxPrice) values (?, ?, ?, ?, ?)',
            [id, seatClass, minPrice, normalPrice, maxPrice]
        );
    }
}

uploadData();
