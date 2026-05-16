import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  movieId: { type: Number, required: true },
  movieTitle: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  reviewText: { type: String, default: "" },
  hashtags: { type: String, default: "" },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);
