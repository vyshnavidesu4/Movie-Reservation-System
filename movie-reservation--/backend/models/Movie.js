import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({

  movieId: {
    type: Number,
    required: true,
    unique: true
  },

  title: {
    type: String,
    required: true
  },

  poster: {
    type: String,
    required: true
  },

  rating: String,

  votes: String,

  genre: [String],

  language: [String],

  status: {
    type: String,
    enum: ["now-showing", "upcoming"]
  },

  duration: String,

  releaseDate: String

}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);