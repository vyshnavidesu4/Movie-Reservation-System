import React, { useState, useEffect } from 'react';
import './MovieDetails.css';
import RateNow from './RateNow';
import API_BASE_URL from '../config';

const MovieDetails = ({ movieId, user, onLogout, onAuthButtonClick, onGreetingClick, onBack, selectedCity, setSelectedCity, onBookTickets }) => {

  const [movie, setMovie] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [showRateNow, setShowRateNow] = useState(false);
  const [cityTheatres, setCityTheatres] = useState({});


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
          releaseDate: movie.releaseDate
        }));

        const foundMovie = formattedMovies.find(m => m.id === parseInt(movieId));
        setMovie(foundMovie);

      })
      .catch(err => console.error(err));

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


  // ⭐ SCROLL LISTENER
  useEffect(() => {

    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);


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

    alert(`You will be notified about "${movie.title}"`);
  };


  const handleRateNow = () => {

    if (!user) {
      alert('Please sign in to rate movies');
      onAuthButtonClick(movieId);
      return;
    }

    setShowRateNow(true);
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


  const castData = getCastData(movie.title);
  const crewData = getCrewData(movie.title);

  const isNowShowing = movie.status === 'now-showing';
  const mainButtonText = isNowShowing ? 'Book Tickets' : 'Notify Me';
  const mainButtonHandler = isNowShowing ? handleBookTickets : handleNotifyMe;
  const stickyButtonText = isNowShowing ? 'Book Tickets' : 'Notify Me';

  return (
    <div className="movie-details-page">
      <header className="header">
        <div className="header-content">
          <button className="back-button" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back
          </button>
          
          <h1 className="logo">MOVIEBUZZ</h1>

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

          <button className="auth-btn" onClick={handleAuthClick}>
            {user ? `Hello! ${user.preferredName}` : 'Signup/Login'}
          </button>
        </div>
      </header>

      <div className="movie-hero">
        <div className="movie-poster-large">
          <img src={movie.image} alt={movie.title} />
        </div>
        
        <div className="movie-info-sidebar">
          <div className="sticky-info">
            <h1>{movie.title}</h1>
            
            <div className="rating-section">
              <div className="rating-display">
                <span className="rating-star">⭐</span>
                <span className="rating-value">{movie.rating}</span>
                <span className="rating-votes">{movie.votes}</span>
              </div>
              <button className="rate-now-btn" onClick={handleRateNow}>
                Rate Now
              </button>
            </div>

            <div className="movie-meta">
              <div className="meta-item">
                <span className="meta-label">Language:</span>
                <span className="meta-value">{movie.language}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{movie.duration}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Genre:</span>
                <span className="meta-value">{movie.genre}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Release Date:</span>
                <span className="meta-value">{movie.releaseDate}</span>
              </div>
            </div>

            <button className="book-tickets-btn" onClick={mainButtonHandler}>
              {mainButtonText}
            </button>
          </div>
        </div>
      </div>

      <div className={`sticky-movie-header ${isSticky ? 'sticky' : ''}`}>
        <div className="sticky-header-content">
          <h2>{movie.title}</h2>
          <button className="sticky-book-btn" onClick={mainButtonHandler}>
            {stickyButtonText}
          </button>
        </div>
      </div>

      <div className="movie-content">
        <section className="content-section">
          <h2>About the Movie</h2>
          <p className="movie-description">
            {movie.title} is an exciting cinematic experience that brings together incredible storytelling, 
            stunning visuals, and powerful performances. This movie takes you on an unforgettable journey 
            through its engaging narrative and breathtaking action sequences. With a perfect blend of 
            emotion and entertainment, it's a must-watch for all cinema lovers.
          </p>
        </section>

        <section className="content-section">
          <h2>Cast</h2>
          <div className="cast-list">
            {castData.map((person, index) => (
              <div key={index} className="cast-item">
                <strong>{person.name}</strong>
                <span>{person.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>Crew</h2>
          <div className="crew-list">
            {crewData.map((member, index) => (
              <div key={index} className="crew-item">
                <strong>{member.role}</strong>
                <span>{member.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* RateNow Modal */}
      {showRateNow && movie && (
        <RateNow
          movieTitle={movie.title}
          onClose={handleCloseRateNow}
          onSubmitRating={handleSubmitRating}
        />
      )}
    </div>
  );
};

// Helper functions
const getCastData = (movieTitle) => {
  const castMap = {
    'JOLLY L.B3': [
      { name: 'Akshay Kumar', role: 'Actor' },
      { name: 'Arshad Warsi', role: 'Actor' },
      { name: 'Saurabh Shukla', role: 'Actor' },
      { name: 'Amrita Rao', role: 'Actor' },
      { name: 'Huma Qureshi', role: 'Actor' }
    ],
    'Singham Again': [
      { name: 'Ajay Devgn', role: 'Actor' },
      { name: 'Kareena Kapoor', role: 'Actor' },
      { name: 'Akshay Kumar', role: 'Actor' },
      { name: 'Tiger Shroff', role: 'Actor' },
      { name: 'Deepika Padukone', role: 'Actor' }
    ]
  };
  
  return castMap[movieTitle] || [
    { name: 'Lead Actor', role: 'Actor' },
    { name: 'Lead Actress', role: 'Actor' },
    { name: 'Supporting Actor', role: 'Actor' },
    { name: 'Supporting Actress', role: 'Actor' },
    { name: 'Villain', role: 'Actor' }
  ];
};

const getCrewData = (movieTitle) => {
  const crewMap = {
    'JOLLY L.B3': [
      { role: 'Director, Writer', name: 'Subhash Kapoor' },
      { role: 'Musician', name: 'Anurag Saikia' },
      { role: 'Musician', name: 'Vikram Montrose' },
      { role: 'Editor', name: 'Chandrashekhar Prajapati' },
      { role: 'Background Score', name: 'Mangesh Dhakde' }
    ],
    'Singham Again': [
      { role: 'Director', name: 'Rohit Shetty' },
      { role: 'Producer', name: 'Rohit Shetty Picturez' },
      { role: 'Music Director', name: 'Tanishk Bagchi' },
      { role: 'Cinematographer', name: 'Jomon T. John' },
      { role: 'Screenplay', name: 'Yunus Sajawal' }
    ]
  };
  
  return crewMap[movieTitle] || [
    { role: 'Director', name: 'Famous Director' },
    { role: 'Producer', name: 'Production House' },
    { role: 'Music Director', name: 'Renowned Composer' },
    { role: 'Cinematographer', name: 'Award Winning DOP' },
    { role: 'Screenplay', name: 'Talented Writer' }
  ];
};

export default MovieDetails;