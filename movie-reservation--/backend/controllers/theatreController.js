import TheatreAssignment from "../models/TheatreAssignment.js";
import Movie from "../models/Movie.js";
import { cityTheatres } from "../data/cityTheatres.js";

export const getTheatres = async (req, res) => {

  try {

    const { city, movieId } = req.params;

    // 1️⃣ Check if theatres already assigned
    const existingAssignment = await TheatreAssignment.findOne({
      movieId,
      city
    });

    if (existingAssignment) {
      return res.json(existingAssignment.theatres);
    }

    // 2️⃣ Get movie from DB
    const movie = await Movie.findOne({ movieId });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const movieLanguages = movie.language;

    // 3️⃣ Get theatres for city
    const theatres = cityTheatres[city] || [];

    // 4️⃣ Filter theatres by movie language
    const validTheatres = theatres.filter(t =>
      movieLanguages.includes(t.language)
    );

    if (validTheatres.length === 0) {
      return res.json([]);
    }

    // 5️⃣ Shuffle theatres randomly
    const shuffled = validTheatres.sort(() => 0.5 - Math.random());

    // Pick 2-3 theatres
    const selectedTheatres = shuffled.slice(
      0,
      Math.floor(Math.random() * 2) + 2
    );

    // 6️⃣ Save assignment
    const assignment = new TheatreAssignment({
      movieId,
      city,
      theatres: selectedTheatres
    });

    await assignment.save();

    res.json(selectedTheatres);

  } catch (error) {

    console.error("Error getting theatres:", error);
    res.status(500).json({ error: error.message });

  }
  

};