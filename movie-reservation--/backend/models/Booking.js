import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  movieId: Number,
  movieTitle: String,
  city: String,
  theatre: String,
  time: String,
  date: String,
  seats: [Number],
  amount: Number,
  bookedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);
