import mongoose from 'mongoose';
import { MemoryBooking } from '../data/memoryStore.js';

const useMemory = process.env.USE_MEMORY_DB === '1';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['flight', 'hotel', 'bus', 'package'], required: true },

    from: { type: String },
    to: { type: String },
    flightCode: { type: String },
    airline: { type: String },
    departure: { type: String },
    arrival: { type: String },
    duration: { type: String },

    travelDate: { type: String },
    returnDate: { type: String },
    passengers: { type: Number, default: 1 },
    extras: { type: [String], default: [] },

    basePrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    status: { type: String, enum: ['confirmed', 'upcoming', 'cancelled', 'completed'], default: 'confirmed' },

    destinationName: { type: String },
    destinationImage: { type: String },
    hotel: { type: String },
  },
  { timestamps: true }
);

const MongoBooking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default useMemory ? MemoryBooking : MongoBooking;
