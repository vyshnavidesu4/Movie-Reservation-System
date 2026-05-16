import express from "express";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    
    // ⭐ DELETE CORRESPONDING NOTIFICATION IF ANY
    try {
        await Notification.findOneAndDelete({ 
            username: req.body.username, 
            movieId: req.body.movieId 
        });
    } catch (notifErr) {
        console.error("Error deleting notification:", notifErr);
    }

    res.json({ success: true, msg: "Booking saved!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error saving booking" });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const bookings = await Booking.find({ username: req.params.username }).sort({ bookedAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching history" });
  }
});

export default router;
