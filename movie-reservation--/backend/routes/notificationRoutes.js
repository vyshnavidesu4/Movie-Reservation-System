import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// Add (Notify Me click)
router.post("/add", async (req, res) => {
  try {
    const { username, movieId, movieTitle, releaseDate } = req.body;
    
    // Upsert or avoid duplicates
    const exist = await Notification.findOne({ username, movieId });
    if (exist) {
      return res.json({ success: true, msg: "Already subscribed!" });
    }

    const notif = new Notification({
      username,
      movieId,
      movieTitle,
      releaseDate
    });
    
    await notif.save();
    res.json({ success: true, msg: "Notification saved!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error saving notification." });
  }
});

// Get for a user
router.get("/:username", async (req, res) => {
  try {
    const notifs = await Notification.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching notifications" });
  }
});

// Delete specific notification if needed
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "Notification removed" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error removing notification" });
  }
});

export default router;
