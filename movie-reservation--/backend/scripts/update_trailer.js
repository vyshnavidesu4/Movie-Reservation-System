import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "../models/Movie.js";

dotenv.config({ path: "./.env" });

const updateMovieTrailer = async (movieTitle, newUrl) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Find by title (case-insensitive) and update
    const movie = await Movie.findOneAndUpdate(
      { title: new RegExp(`^${movieTitle}$`, "i") },
      { trailerLink: newUrl },
      { new: true }
    );

    if (movie) {
      console.log(`✅ Success! Updated trailer for: ${movie.title}`);
      console.log(`New URL: ${movie.trailerLink}`);
    } else {
      console.log(`❌ Movie not found: ${movieTitle}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error updating trailer:", err);
    process.exit(1);
  }
};

// USAGE: node scripts/update_trailer.js "Movie Name" "https://youtube.com/..."
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node scripts/update_trailer.js "Movie Name" "New Link"');
  process.exit(1);
}

updateMovieTrailer(args[0], args[1]);
