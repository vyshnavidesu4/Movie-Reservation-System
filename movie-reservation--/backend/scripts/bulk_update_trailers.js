import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "../models/Movie.js";

dotenv.config({ path: "./.env" });

// ✅ ADD YOUR REAL YOUTUBE TRAILER LINKS HERE
// Format: "Movie Title": "https://www.youtube.com/watch?v=VIDEO_ID"
const trailerMap = {
  "Little Hearts":       "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Mirai":               "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Maha Avatar Narasimha":"https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Kishkindhapuri":      "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Lokah":               "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Baby John":           "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Eleven":              "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Vettaiyan":           "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Param Sundari":       "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Ghaati":              "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Dancing Dad":         "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "OG":                  "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "3 BHK":               "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Telusu Kada":         "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  // "Maalik" already has a working trailer link
  "Paradha":             "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Rajasaab":            "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Ace":                 "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Padakkalam":          "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Biker":               "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
  "Dhurandhar":          "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
};

const bulkUpdateTrailers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...\n");

    let updated = 0;
    let skipped = 0;

    for (const [title, trailerLink] of Object.entries(trailerMap)) {
      if (trailerLink.includes("REPLACE_WITH_REAL_ID")) {
        console.log(`⏭️  Skipping "${title}" — no real URL provided yet`);
        skipped++;
        continue;
      }

      const movie = await Movie.findOneAndUpdate(
        { title: new RegExp(`^${title}$`, "i") },
        { trailerLink },
        { new: true }
      );

      if (movie) {
        console.log(`✅ Updated: ${movie.title} → ${trailerLink}`);
        updated++;
      } else {
        console.log(`❌ Not found: ${title}`);
      }
    }

    console.log(`\n--- Done! Updated: ${updated} | Skipped: ${skipped} ---`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

bulkUpdateTrailers();
