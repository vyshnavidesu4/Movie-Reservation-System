import mongoose from "mongoose";

const theatreAssignmentSchema = new mongoose.Schema({

  movieId: {
    type: Number,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  theatres: [
    {
      name: String,
      address: String,
      language: String
    }
  ]

});

export default mongoose.model(
  "TheatreAssignment",
  theatreAssignmentSchema
);