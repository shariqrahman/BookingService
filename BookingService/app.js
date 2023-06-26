const express = require('express');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/booking', bookingRoutes);

app.listen(3002, () => {
    console.log('Server started on port 3002');
});