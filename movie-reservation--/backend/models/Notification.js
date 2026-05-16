import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  movieId: { type: Number, required: true },
  movieTitle: { type: String, required: true },
  releaseDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
