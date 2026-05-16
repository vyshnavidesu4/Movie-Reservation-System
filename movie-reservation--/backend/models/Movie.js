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

  releaseDate: String,

  trailerLink: {
    type: String,
    default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },

  story: {
    type: String,
    default: ""
  },

  cast: [{
    name: { type: String, required: true },
    image: { type: String, required: true }
  }],

  crew: [{
    name: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, required: true }
  }]

}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);