const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { travelType, fromStation, toStation, date, time, seats } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // Check for seat conflicts
    const existing = await Booking.find({
      fromStation,
      toStation,
      date,
      time,
      'seats.number': { $in: seats.map(s => s.number) }
    });
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Some seats are already booked for this time.' });
    }

    // Calculate total amount (simple example)
    const seatCount = seats.length;
    const price = travelType === 'business' ? 5500 : 4000;
    const totalAmount = seatCount * price;

    const booking = await Booking.create({
      user: user._id,
      username: user.username,
      travelType,
      fromStation,
      toStation,
      date,
      time,
      seats,
      totalAmount,
      status: 'confirmed'
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 