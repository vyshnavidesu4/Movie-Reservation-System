import express from "express";
import Movie from "../models/Movie.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// GET ALL MOVIES
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ movieId: 1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET SINGLE MOVIE
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findOne({ movieId: req.params.id });
    if (!movie) return res.status(404).json({ msg: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD MOVIE (POST)
router.post("/add", upload.single("poster"), async (req, res) => {
  try {
    const { movieId, title, rating, votes, genre, language, status, duration, releaseDate } = req.body;

    const movie = new Movie({
      movieId,
      title,
      poster: req.file ? req.file.path : "", // Cloudinary URL
      rating,
      votes,
      genre: Array.isArray(genre) ? genre : genre.split(",").map(g => g.trim()),
      language: Array.isArray(language) ? language : language.split(",").map(l => l.trim()),
      status,
      duration,
      releaseDate
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE MOVIE (PUT)
router.put("/:id", upload.single("poster"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.poster = req.file.path;
    }

    if (updateData.genre && typeof updateData.genre === "string") {
      updateData.genre = updateData.genre.split(",").map(g => g.trim());
    }
    if (updateData.language && typeof updateData.language === "string") {
      updateData.language = updateData.language.split(",").map(l => l.trim());
    }

    const updatedMovie = await Movie.findOneAndUpdate(
      { movieId: req.params.id },
      updateData,
      { new: true }
    );

    if (!updatedMovie) return res.status(404).json({ msg: "Movie not found" });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE MOVIE (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findOneAndDelete({ movieId: req.params.id });
    if (!deletedMovie) return res.status(404).json({ msg: "Movie not found" });
    res.json({ msg: "Movie deleted successfully", movie: deletedMovie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;