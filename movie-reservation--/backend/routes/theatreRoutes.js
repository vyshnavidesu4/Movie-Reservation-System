import express from "express";
import { getTheatres } from "../controllers/theatreController.js";
import { cityTheatres } from "../data/cityTheatres.js";

const router = express.Router();

// ✅ NEW API for Home.jsx
router.get("/allCities", (req, res) => {
  res.json(cityTheatres);
});

// Existing API
router.get("/:city/:movieId", getTheatres);

export default router;