const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, adminOrStationMaster } = require('../middlewares/authMiddleware');

router.post('/', protect, bookingController.createBooking);
router.get('/my', protect, bookingController.getUserBookings);
router.get('/', protect, adminOrStationMaster, bookingController.getAllBookings);

module.exports = router; 