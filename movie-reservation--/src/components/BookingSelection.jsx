import React, { useState, useEffect, useRef } from 'react';
import './BookingSelection.css';
import API_BASE_URL from '../config';

const BookingSelection = ({ selectedCity, onSeatSelection, onBack, movieId, user }) => {
  const [allMovies, setAllMovies] = useState([]);
  const [cityTheatres, setCityTheatres] = useState([]);

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

useEffect(() => {

  if (!selectedCity || !movieId) return;

  fetch(`${API_BASE_URL}/theatres/${selectedCity}/${movieId}`)
    .then(res => res.json())
    .then(data => {

      const formattedTheatres = data.map((theatre, index) => ({
        id: index + 1,
        name: theatre.name,
        address: theatre.address,
        language: theatre.language
      }));

      setCityTheatres(formattedTheatres);

    })
    .catch(err => console.error("Error loading theatres:", err));

}, [selectedCity, movieId]);

  const movie = allMovies.find(m => m.id === parseInt(movieId));

  // -------------------------------
  // ✅ GET THEATRES FOR THIS MOVIE + CITY
  // -------------------------------
  // -------------------------------
// GET THEATRES FROM BACKEND
// -------------------------------
const theatres = cityTheatres;
const [selectedDate, setSelectedDate] = useState(null);
const [selectedTheatre, setSelectedTheatre] = useState(null);
const [selectedTime, setSelectedTime] = useState(null);
const [currentTime, setCurrentTime] = useState(new Date());

const theatresSectionRef = useRef(null);
const datesSectionRef = useRef(null);
const proceedSectionRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date,
        formatted: date.toLocaleDateString('en-US', { 
          weekday: 'short', month: 'short', day: 'numeric' 
        }),
        isToday: i === 0,
        timestamp: date.getTime()
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Showtimes
  const showTimes = [
    { time: '10:00 AM', timestamp: getTimestampForTime(10, 0) },
    { time: '1:00 PM', timestamp: getTimestampForTime(13, 0) },
    { time: '4:00 PM', timestamp: getTimestampForTime(16, 0) },
    { time: '7:00 PM', timestamp: getTimestampForTime(19, 0) },
    { time: '10:00 PM', timestamp: getTimestampForTime(22, 0) }
  ];

  function getTimestampForTime(hours, minutes) {
    if (!selectedDate) return 0;
    const date = new Date(selectedDate);
    date.setHours(hours, minutes, 0, 0);
    return date.getTime();
  }

  const isShowtimeAvailable = (showtime) => {
    if (!selectedDate) return true;

    const today = new Date();
    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj.toDateString() !== today.toDateString()) {
      return true;
    }
    return showtime.timestamp > currentTime.getTime();
  };

  const canProceedToSeats = () => {
    if (!selectedDate || !selectedTheatre || !selectedTime) return false;
    const selectedShowtime = showTimes.find(st => st.time === selectedTime);
    if (!selectedShowtime) return false;
    return isShowtimeAvailable(selectedShowtime);
  };

  // Add cancellable flag
  const theatresWithDetails = theatres.map(theatre => ({
    ...theatre,
    cancellable: theatre.id % 2 === 0
  }));

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTheatre(null);
    setSelectedTime(null);

    setTimeout(() => {
      theatresSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleTheatreSelect = (theatre) => {
    setSelectedTheatre(theatre);
    setSelectedTime(null);

    setTimeout(() => {
      const theatreCard = document.querySelector(`.theatre-card[data-theatre-id="${theatre.id}"]`);
      theatreCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);

    setTimeout(() => {
      proceedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 300);
  };

  const handleProceedToSeats = () => {
    if (!selectedDate || !selectedTheatre || !selectedTime) {
      alert('Please select date, theatre, and showtime');
      return;
    }

    if (!user) {
      alert('Please login to book tickets');
      return;
    }

    const selectedShowtime = showTimes.find(st => st.time === selectedTime);
    if (selectedShowtime && !isShowtimeAvailable(selectedShowtime)) {
      alert('This showtime has already started.');
      return;
    }

    onSeatSelection({
      date: selectedDate,
      theatre: selectedTheatre,
      time: selectedTime
    });
  };

  if (!movie) {
    return (
      <div className="booking-selection-page">
        <div className="loading">Movie not found</div>
        <button className="back-btn" onClick={onBack}>Back</button>
      </div>
    );
  }

  return (
    <div className="booking-selection-page">

      {/* Header */}
      <header className="booking-header">
        <button className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Back
        </button>

        <div className="booking-movie-info">
          <h1>{movie.title}</h1>
          <span className="movie-duration">{movie.duration}</span>
        </div>

        <div className="booking-city">
          <span>{selectedCity}</span>
        </div>
      </header>

      {/* Hero */}
      <div className="booking-hero">
        <div className="booking-poster">
          <img src={movie.image} alt={movie.title} />
          <div className="booking-overlay">
            <h2>{movie.title}</h2>
            <p>{movie.genre} • {movie.language} • {movie.duration}</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <section className="dates-section" ref={datesSectionRef}>
        <div className="section-header"><h3>Select Date</h3></div>

        <div className="dates-container">
          {dates.map((dateObj, index) => (
            <button
              key={index}
              className={`date-btn 
                ${selectedDate?.getTime() === dateObj.timestamp ? 'selected' : ''} 
                ${dateObj.isToday ? 'today' : ''}`}
              onClick={() => handleDateSelect(dateObj.date)}
            >
              <span className="date-day">{dateObj.formatted.split(' ')[0]}</span>
              <span className="date-number">{dateObj.formatted.split(' ')[2]}</span>
              <span className="date-month">{dateObj.formatted.split(' ')[1]}</span>
              {dateObj.isToday && <span className="today-badge">Today</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Theatre Selection */}
      {selectedDate && (
        <section className="theatres-section" ref={theatresSectionRef}>
          <h3>Select Theatre & Showtime</h3>

          <div className="theatres-container">
            {theatresWithDetails.length === 0 && (
              <p className="no-theatres">No theatres available for this movie in {selectedCity}.</p>
            )}

            {theatresWithDetails.map(theatre => (
              <div
                key={theatre.id}
                data-theatre-id={theatre.id}
                className={`theatre-card ${selectedTheatre?.id === theatre.id ? 'selected' : ''}`}
              >
                <div className="theatre-info" onClick={() => handleTheatreSelect(theatre)}>
                  <div className="theatre-header">
                    <h4>{theatre.name}</h4>
                    <p className="cancellation-status">
                      {theatre.cancellable ? 'Cancellable' : 'Non-Cancellable'}
                    </p>
                  </div>
                  <p className="theatre-address">{theatre.address}</p>

                  {selectedTheatre?.id === theatre.id && (
                    <div className="showtimes-inside">
                      <h5>Available Showtimes:</h5>

                      <div className="showtimes-grid">
                        {showTimes.map((showtime, index) => {
                          const isAvailable = isShowtimeAvailable(showtime);
                          return (
                            <button
                              key={index}
                              className={`showtime-btn-inside 
                                ${selectedTime === showtime.time ? 'selected' : ''} 
                                ${!isAvailable ? 'disabled' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isAvailable) handleTimeSelect(showtime.time);
                              }}
                              disabled={!isAvailable}
                            >
                              {showtime.time}
                              {!isAvailable && <span className="showtime-passed">Passed</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="theatre-arrow">
                  {selectedTheatre?.id === theatre.id ? '▼' : '›'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Proceed */}
      {(selectedDate && selectedTheatre && selectedTime) && (
        <div className="proceed-section" ref={proceedSectionRef}>
          <div className="selection-summary">
            <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span>•</span>
            <span>{selectedTheatre.name}</span>
            <span>•</span>
            <span>{selectedTime}</span>

            {!canProceedToSeats() && (
              <span className="warning-text"> (Showtime has started)</span>
            )}
          </div>

          <button
            className={`proceed-btn ${!canProceedToSeats() ? 'disabled' : ''}`}
            onClick={handleProceedToSeats}
            disabled={!canProceedToSeats()}
          >
            {canProceedToSeats() ? 'Select Seats' : 'Showtime Started'}
          </button>
        </div>
      )}

    </div>
  );
};

export default BookingSelection; 