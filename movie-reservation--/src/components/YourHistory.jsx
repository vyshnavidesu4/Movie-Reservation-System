import React, { useState, useEffect } from 'react';
import './YourHistory.css';
import API_BASE_URL from '../config';
import RateNow from './RateNow';

const YourHistory = ({ user, onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingMovie, setRatingMovie] = useState(null); // stores {id, title} to rate

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE_URL}/bookings/${user.username}`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const handleRateClick = (movieId, movieTitle) => {
    setRatingMovie({ id: movieId, title: movieTitle });
  };

  const handleCloseRate = () => {
    setRatingMovie(null);
  };

  const handleSubmitRating = (rating, review, hashtags) => {
    fetch(`${API_BASE_URL}/reviews/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.preferredName || user.username,
        movieId: ratingMovie.id,
        movieTitle: ratingMovie.title,
        rating,
        reviewText: review,
        hashtags
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Rating submitted successfully!");
        } else {
          alert("Error: " + data.msg);
        }
      })
      .catch(err => console.error(err));
  };

  if (loading) {
    return (
      <div className="your-history-page">
        <header className="history-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>Loading History...</h2>
        </header>
      </div>
    );
  }

  return (
    <div className="your-history-page">
      <header className="history-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>Your Booking History</h2>
      </header>

      <div className="history-list">
        {history.length === 0 ? (
          <p className="no-history-msg">You have not booked any tickets yet.</p>
        ) : (
          history.map(booking => (
            <div key={booking._id} className="history-card">
              <div className="history-info">
                <h3>{booking.movieTitle}</h3>
                <div className="history-details-row">
                  <span><strong>Date:</strong> {booking.date}</span>
                  <span><strong>Time:</strong> {booking.time}</span>
                </div>
                <div className="history-details-row">
                  <span><strong>Theatre:</strong> {booking.theatre}, {booking.city}</span>
                </div>
                <div className="history-details-row">
                  <span><strong>Seats:</strong> {booking.seats?.join(', ')}</span>
                  <span><strong>Amount:</strong> ₹{booking.amount}</span>
                </div>
              </div>
              <div className="history-actions">
                <button 
                  className="rate-history-btn" 
                  onClick={() => handleRateClick(booking.movieId, booking.movieTitle)}
                >
                  Rate Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {ratingMovie && (
        <RateNow 
          movieTitle={ratingMovie.title} 
          onClose={handleCloseRate} 
          onSubmitRating={handleSubmitRating} 
        />
      )}
    </div>
  );
};

export default YourHistory;
