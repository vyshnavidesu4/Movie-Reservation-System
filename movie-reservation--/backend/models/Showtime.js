import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema({
  movieId: { type: Number, required: true },
  movieTitle: { type: String, required: true },
  city: { type: String, required: true },
  theatreName: { type: String, required: true },

  date: { type: String, required: true }, // e.g. "2025-09-24"
  time: { type: String, required: true }, // e.g. "7:00 PM"

  totalSeats: { type: Number, default: 100 },
  bookedSeats: { type: [Number], default: [] },

  price: { type: Number, default: 200 }
});

const Showtime = mongoose.model("Showtime", showtimeSchema);

export default Showtime;
