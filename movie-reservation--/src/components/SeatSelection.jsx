import React, { useState, useEffect } from 'react';
import axios from "axios";
import './SeatSelection.css';
import API_BASE_URL from '../config';

const SeatSelection = ({ bookingSelection, onSeatsSelect, onBack, movieId }) => {

  const [allMovies, setAllMovies] = useState([]);
  const [localSelectedSeats, setLocalSelectedSeats] = useState([]);
  const [bookedSeatsFromDB, setBookedSeatsFromDB] = useState([]);

  const rows = 10;
  const cols = 10;
  const totalSeats = rows * cols;

  const seatPrice = 200;

  // ----------------------------
  // FETCH MOVIES FROM BACKEND
  // ----------------------------
  useEffect(() => {

    fetch(`${API_BASE_URL}/movies`)
      .then(res => res.json())
      .then(data => {

        const formattedMovies = data.map(movie => ({
          id: movie.movieId,
          title: movie.title,
          image: movie.poster,
          rating: movie.rating,
          votes: movie.votes,
          genre: movie.genre.join(" • "),
          language: movie.language.join(","),
          status: movie.status,
          duration: movie.duration,
          releaseDate: movie.releaseDate
        }));

        setAllMovies(formattedMovies);

      })
      .catch(err => console.error(err));

  }, []);

  const movie = allMovies.find(m => m.id === parseInt(movieId));

  // ----------------------------
  // GET BOOKED SEATS FROM BACKEND
  // ----------------------------
  useEffect(() => {

    if (!bookingSelection || !movie) return;

    const loadShowtime = async () => {
      try {

        const res = await axios.post(
          `${API_BASE_URL}/showtime/getShowtime`,
          {
            movieId,
            movieTitle: movie.title,
            city: bookingSelection.theatre.address,
            theatreName: bookingSelection.theatre.name,
            date: bookingSelection.date.toDateString(),
            time: bookingSelection.time
          }
        );

        setBookedSeatsFromDB(res.data.bookedSeats || []);

      } catch (error) {
        console.log("Error loading showtime:", error);
      }
    };

    loadShowtime();

  }, [bookingSelection, movieId, movie]);

  const bookedSeats = bookedSeatsFromDB;

  // ----------------------------
  // HANDLE SEAT CLICK
  // ----------------------------
  const toggleSeat = (seatId) => {

    if (bookedSeats.includes(seatId)) return;

    setLocalSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };

  // ----------------------------
  // PROCEED TO PAYMENT
  // ----------------------------
  const handleProceed = () => {

    if (localSelectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    onSeatsSelect(localSelectedSeats);
  };

  // ----------------------------
  // INVALID BOOKING PROTECTION
  // ----------------------------
  if (!bookingSelection) {
    return (
      <div className="seat-selection-page">
        <header className="header">
          <button onClick={onBack}>Back</button>
          <h1>Invalid Booking Selection</h1>
        </header>

        <main>
          <div className="error-message">
            <p>Booking information is missing. Please go back and try again.</p>
            <button onClick={onBack}>Go Back</button>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------
  // LOADING MOVIE
  // ----------------------------
  if (!movie) {
    return (
      <div className="seat-selection-page">
        <div className="loading">Loading movie...</div>
      </div>
    );
  }

  return (
    <div className="seat-selection-page">

      {/* Header */}
      <header className="header">

        <button onClick={onBack}>Back</button>

        <h1>
          Select Seats for {movie.title} at {bookingSelection.theatre.name}
          <br />

          <span className="showtime-info">
            {bookingSelection.date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} - {bookingSelection.time}
          </span>

        </h1>

      </header>

      {/* MAIN CONTENT */}
      <main>

        <div className="screen-indicator">
          <div className="screen">SCREEN</div>
        </div>

        <div className="seat-grid">

          {Array.from({ length: totalSeats }).map((_, index) => (

            <div
              key={index}
              className={`seat 
                ${bookedSeats.includes(index) ? 'booked' : ''} 
                ${localSelectedSeats.includes(index) ? 'selected' : ''}`}
              onClick={() => toggleSeat(index)}
            >
              {index + 1}
            </div>

          ))}

        </div>

        <div className="seat-legend">

          <div className="legend-item">
            <div className="legend-seat available"></div>
            <span>Available</span>
          </div>

          <div className="legend-item">
            <div className="legend-seat selected"></div>
            <span>Selected</span>
          </div>

          <div className="legend-item">
            <div className="legend-seat booked"></div>
            <span>Booked</span>
          </div>

        </div>

        <div className="summary">

          <div className="summary-details">

            <p>
              <strong>Selected Seats:</strong>{" "}
              {localSelectedSeats.length > 0
                ? localSelectedSeats.map(s => s + 1).join(', ')
                : "None"}
            </p>

            <p>
              <strong>Total Price:</strong>{" "}
              ₹{localSelectedSeats.length * seatPrice}
            </p>

          </div>

          <button
            className="proceed-btn"
            onClick={handleProceed}
          >
            Proceed to Payment
          </button>

        </div>

      </main>

    </div>
  );
};

export default SeatSelection;