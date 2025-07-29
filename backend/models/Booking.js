const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  travelType: { type: String, enum: ['business', 'economy'], required: true },
  fromStation: { type: String, required: true },
  toStation: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seats: [{ number: Number }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema); 