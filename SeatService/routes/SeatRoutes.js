const express = require('express');
const SeatController = require('../controllers/SeatController');

const router = express.Router();

router.get('/', SeatController.getAllSeats);
router.get('/:id', SeatController.getSeatPricing);

module.exports = router;
