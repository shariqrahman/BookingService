const express = require('express');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/SeatRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/Seat', bookingRoutes);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});