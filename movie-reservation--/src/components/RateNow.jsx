// RateNow.jsx
import React, { useState } from 'react';
import './RateNow.css';

const RateNow = ({ movieTitle, onClose, onSubmitRating }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating before submitting');
      return;
    }
    onSubmitRating(rating, review);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="rate-now-modal-overlay">
      <div className="rate-now-modal">
        <div className="rate-now-header">
          <h2>Rate "{movieTitle}"</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>
        
        <div className="rating-section">
          <div className="stars-container">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
              >
                {star}
              </button>
            ))}
          </div>
          <div className="rating-display">
            <span className="current-rating">{rating || hoverRating || 0}</span>
            <span className="rating-out-of">/10</span>
          </div>
        </div>

        <div className="review-section">
          <label htmlFor="review">Your Review (Optional)</label>
          <textarea
            id="review"
            className="review-textarea"
            placeholder="Share your thoughts about this movie..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
          />
        </div>

        <div className="rate-now-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateNow;