const express = require('express');
const BookingController = require('../controllers/BookingController');

const router = express.Router();

router.post('/', BookingController.createBooking);
router.get('/', BookingController.getBookings);

module.exports = router;