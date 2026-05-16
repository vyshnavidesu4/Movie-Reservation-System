import express from "express";
import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

const router = express.Router();

function parseVotes(voteStr) {
  if (!voteStr) return 0;
  const match = voteStr.match(/([\d.]+)([KM]?)\s*Votes?/i);
  if (!match) return parseInt(voteStr.replace(/\D/g, "")) || 0;
  let num = parseFloat(match[1]);
  const multiplier = match[2].toUpperCase();
  if (multiplier === 'K') num *= 1000;
  if (multiplier === 'M') num *= 1000000;
  return Math.round(num);
}

function formatVotes(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M Votes";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K Votes";
  } else {
    return num + " Votes";
  }
}

// Add a novel Review
router.post("/add", async (req, res) => {
  try {
    const { username, movieId, movieTitle, rating, reviewText, hashtags } = req.body;
    
    // Save the review
    const review = new Review({
      username,
      movieId,
      movieTitle,
      rating,
      reviewText,
      hashtags
    });
    await review.save();

    // Update Average Rating
    const movie = await Movie.findOne({ movieId });
    if (movie) {
      let currentRating = parseFloat(movie.rating) || 0;
      let currentVotesNum = parseVotes(movie.votes);

      let totalScore = currentRating * currentVotesNum;
      
      // Calculate new averages
      currentVotesNum += 1;
      totalScore += rating;
      
      let newAvg = totalScore / currentVotesNum;
      newAvg = Math.min(Math.max(newAvg, 0), 10); // cap 1-10

      // Format back to DB
      movie.rating = newAvg.toFixed(1);
      movie.votes = formatVotes(currentVotesNum);
      
      await movie.save();
    }

    res.json({ success: true, msg: "Review submitted successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Error submitting review." });
  }
});

// Get Reviews for a Movie
router.get("/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching reviews" });
  }
});

export default router;
