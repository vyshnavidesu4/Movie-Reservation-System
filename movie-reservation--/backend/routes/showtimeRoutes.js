import express from "express";
import Showtime from "../models/Showtime.js";

const router = express.Router();

// 1) Get (or create) a showtime and return booked seats
router.post("/getShowtime", async (req, res) => {
  try {
    const { movieId, movieTitle, city, theatreName, date, time } = req.body;

    let showtime = await Showtime.findOne({
      movieId,
      theatreName,
      date,
      time
    });

    // If showtime doesn't exist yet, create it
    if (!showtime) {
      showtime = new Showtime({
        movieId,
        movieTitle,
        city,
        theatreName,
        date,
        time
      });
      await showtime.save();
    }

    res.json(showtime);
  } catch (err) {
    console.error("Error in /getShowtime:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2) Book seats for a showtime
router.post("/bookSeats", async (req, res) => {
  try {
    const { movieId, theatreName, date, time, seats } = req.body;

    const showtime = await Showtime.findOne({
      movieId,
      theatreName,
      date,
      time
    });

    if (!showtime) {
      return res.status(404).json({ error: "Showtime not found" });
    }

    // Check if any seat is already booked
    const alreadyBooked = seats.some(seat =>
      showtime.bookedSeats.includes(seat)
    );

    if (alreadyBooked) {
      return res
        .status(400)
        .json({ error: "Some of these seats are already booked" });
    }

    // Append new seats
    showtime.bookedSeats = [...showtime.bookedSeats, ...seats];

    await showtime.save();

    res.json({ success: true, bookedSeats: showtime.bookedSeats });
  } catch (err) {
    console.error("Error in /bookSeats:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
