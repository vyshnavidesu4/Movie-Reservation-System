import React, { useState, useEffect } from 'react';
import './MovieDetails.css';
import RateNow from './RateNow';
import API_BASE_URL from '../config';

const MovieDetails = ({ movieId, user, onLogout, onAuthButtonClick, onGreetingClick, onBack, selectedCity, setSelectedCity, onBookTickets }) => {

  const [movie, setMovie] = useState(null);
  const [availableCities, setAvailableCities] = useState([]);
  const [showRateNow, setShowRateNow] = useState(false);
  const [cityTheatres, setCityTheatres] = useState({});
  const [reviews, setReviews] = useState([]);
  const [notifyMsg, setNotifyMsg] = useState("");


  // ⭐ FIND CITIES WHERE MOVIE IS AVAILABLE
  const getAvailableCitiesForMovie = (movieId) => {

  const citiesWithMovie = [];

  Object.keys(cityTheatres).forEach(city => {

    const theatres = cityTheatres[city];

    const hasMovie = theatres.some(theatre =>
  movie?.language?.includes(theatre.language)
);

    if (hasMovie) {
      citiesWithMovie.push(city);
    }

  });

  return citiesWithMovie;
};


  // ⭐ FETCH MOVIES
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
          releaseDate: movie.releaseDate,
          trailerLink: movie.trailerLink,
          story: movie.story || "",
          cast: movie.cast || [],
          crew: movie.crew || []
        }));

        const foundMovie = formattedMovies.find(m => m.id === parseInt(movieId));
        setMovie(foundMovie);

      })
      .catch(err => console.error(err));

    fetch(`${API_BASE_URL}/reviews/${movieId}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews", err));

  }, [movieId]);


  // ⭐ FETCH THEATRES FROM BACKEND
  useEffect(() => {

    fetch(`${API_BASE_URL}/theatres/allCities`)
      .then(res => res.json())
      .then(data => {
        setCityTheatres(data);
      })
      .catch(err => console.error("Error loading theatres:", err));

  }, []);


  // ⭐ DETERMINE AVAILABLE CITIES AFTER MOVIE + THEATRES LOAD
  useEffect(() => {

    if (movie && Object.keys(cityTheatres).length > 0) {

      const cities = getAvailableCitiesForMovie(movieId);
      setAvailableCities(cities);

    }

  }, [movie, cityTheatres]);



  // ⭐ BOOK TICKETS
  const handleBookTickets = () => {

    if (!user) {
      alert('Please login to book tickets');
      onAuthButtonClick(movieId);
      return;
    }

    if (selectedCity === 'Select City') {
      alert('Please select a city first');
      return;
    }

    onBookTickets();
  };


  // ⭐ NOTIFY ME
  const handleNotifyMe = () => {
    if (!user) {
      alert('Please signup to get notifications');
      onAuthButtonClick(movieId);
      return;
    }

    fetch(`${API_BASE_URL}/notifications/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        movieId: movie.id || movieId,
        movieTitle: movie.title,
        releaseDate: movie.releaseDate || "Coming Soon"
      })
    })
      .then(res => res.json())
      .then(data => setNotifyMsg(data.msg))
      .catch(err => {
        console.error(err);
        setNotifyMsg("Failed to add notification.");
      });
  };


  const handleRateNow = () => {
    alert("Please go to 'Your History' from the Dashboard to rate a movie you've watched.");
  };


  const handleCloseRateNow = () => {
    setShowRateNow(false);
  };


  const handleSubmitRating = (rating, review) => {

    console.log(`Rating submitted for ${movie.title}:`, { rating, review });

    alert(`Thank you for rating "${movie.title}" with ${rating}/10 stars!`);

    // Future backend save
  };


  const handleAuthClick = () => {

    if (user) {
      onGreetingClick();
    } else {
      onAuthButtonClick(movieId);
    }
  };


  if (!movie) {
    return (
      <div className="movie-details-page">
        <div className="loading">Movie not found</div>
        <button className="back-btn" onClick={onBack}>Back</button>
      </div>
    );
  }



  const isNowShowing = movie.status === 'now-showing';
  const mainButtonText = isNowShowing ? 'Book Tickets' : 'Notify Me';
  const mainButtonHandler = isNowShowing ? handleBookTickets : handleNotifyMe;

  return (
    <div className="movie-details-page">
      {/* Header - Match Home structure but with Back button */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn-header" onClick={onBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              <span>BACK</span>
            </button>
            <h1 className="logo">MOVIEBUZZ</h1>
          </div>

          <div className="header-right">
             <select 
              className="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="Select City">Select City</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <button className="greeting-btn" onClick={handleAuthClick}>
               {user ? `Hello! ${user.preferredName}` : 'Signup / Login'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Vertical Poster + Info Side-by-Side */}
      <div className="movie-hero-container">
        <div className="movie-hero-content">
          <div className="movie-poster-vertical">
            <img src={movie.image} alt={movie.title} />
          </div>
          <div className="movie-data-right">
            <h1 className="movie-title-details">{movie.title}</h1>
            <div className="quick-meta">
               <span className="meta-rating">⭐ {movie.rating}</span>
               <span className="meta-votes">{movie.votes}</span>
            </div>
            <div className="detail-tags">
               <div className="tag-row">
                  <span className="tag-label">Language:</span>
                  <span className="tag-val">{movie.language}</span>
               </div>
               <div className="tag-row">
                  <span className="tag-label">Duration:</span>
                  <span className="tag-val">{movie.duration}</span>
               </div>
               <div className="tag-row">
                  <span className="tag-label">Genre:</span>
                  <span className="tag-val">{movie.genre}</span>
               </div>
               <div className="tag-row">
                  <span className="tag-label">Release Date:</span>
                  <span className="tag-val">{movie.releaseDate}</span>
               </div>
            </div>
            
            <div className="cta-buttons">
              <button className="btn-primary-red" onClick={mainButtonHandler}>
                {mainButtonText}
              </button>
              <button className="btn-secondary-dark" onClick={() => window.open(movie.trailerLink, '_blank')}>
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-content-container">
        {/* About Section */}
        <section className="movie-section">
          <h2 className="section-title">The Story</h2>
          <p className="movie-description-text">
            {movie.story || `${movie.title} is an epic journey designed to captivate your imagination. Step into a world where every scene is crafted with cinematic excellence. Experience the thrill, the emotion, and the spectacle that makes this movie a must-watch event of the season.`}
          </p>
        </section>

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <section className="movie-section">
            <h2 className="section-title">Lead Cast</h2>
            <div className="cast-grid">
              {movie.cast.map((person, index) => (
                <div key={index} className="cast-card">
                  <div className="cast-avatar">
                    <img src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=333&color=fff&size=200`} alt={person.name} />
                  </div>
                  <div className="cast-info">
                    <span className="cast-name">{person.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Crew Section */}
        {movie.crew && movie.crew.length > 0 && (
          <section className="movie-section">
            <h2 className="section-title">Crew</h2>
            <div className="crew-grid">
              {movie.crew.map((member, index) => (
                <div key={index} className="crew-card">
                  <div className="crew-avatar">
                    <img src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=222&color=fff&size=200`} alt={member.name} />
                  </div>
                  <div className="crew-info">
                    <span className="crew-role">{member.role}</span>
                    <span className="crew-name">{member.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section / Audience Buzz */}
        <section className="movie-section">
          <h2 className="section-title">Audience Buzz</h2>
          {reviews.length === 0 ? (
            <p className="no-reviews-msg text-center">No reviews yet. Be the first to share your thoughts!</p>
          ) : (
            <div className="reviews-buzz-grid">
              {reviews.map(review => (
                <div key={review._id} className="buzz-card">
                  <div className="buzz-card-header">
                    <div className="buzz-user">
                      <div>
                         <span className="buzz-username">{review.username}</span>
                         <div className="buzz-rating">⭐⭐⭐⭐⭐ <span>{review.rating}/10</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="buzz-body">
                     {review.hashtags && <p className="buzz-hashtags">{review.hashtags}</p>}
                     <p className="buzz-text">"{review.reviewText || "Amazing movie, highly recommended!"}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {notifyMsg && (
        <div className="notify-popup-overlay" onClick={() => setNotifyMsg("")}>
          <div className="notify-popup" onClick={e => e.stopPropagation()}>
            <h3>Notification</h3>
            <p>{notifyMsg}</p>
            <button onClick={() => setNotifyMsg("")}>OK</button>
          </div>
        </div>
      )}

    </div>
  );
};



export default MovieDetails;