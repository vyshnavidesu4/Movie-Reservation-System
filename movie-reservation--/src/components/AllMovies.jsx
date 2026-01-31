import React, { useState, useRef, useEffect } from 'react';
import './AllMovies.css';
import { allMovies } from './AllMoviesData';
import { theatresByCity } from './TheatresData';

const AllMovies = ({ user, onLogout, onAuthButtonClick, onGreetingClick, onBackToHome, onMovieSelect, selectedCity, setSelectedCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const dropdownRef = useRef(null);
  const dashboardRef = useRef(null);

  const cities = [
    'Select City',
    'Ahmedabad',
    'Bangalore',
    'Calicut',
    'Chennai',
    'Coimbatore',
    'Delhi',
    'Guntur',
    'Hyderabad',
    'Kochi',
    'Kolkata',
    'Madurai',
    'Mumbai',
    'Mysore',
    'Nizamabad',
    'Trivandrum',
    'Vijayawada',
    'Vizag',
    'Warangal'
  ];

  const allLanguages = [
    'All Languages', 'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 
    'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi'
  ];

  const allGenres = [
    'All Genres', 'Action', 'Drama', 'Comedy', 'Thriller',
    'Romance', 'Sci-Fi', 'Horror', 'Adventure', 'Fantasy',
    'Animation', 'Crime', 'Mystery', 'Family', 'Musical'
  ];

  const dashboardItems = [
    { id: 1, label: 'Your Data'},
    { id: 2, label: 'Your History'},
    { id: 3, label: 'Notifications'},
    { id: 4, label: 'Help'}
  ];

  // Get available languages and genres for selected city
  const getAvailableLanguagesAndGenres = () => {
    if (selectedCity === 'Select City') {
      return { languages: allLanguages, genres: allGenres };
    }

    const cityTheatres = theatresByCity[selectedCity];
    if (!cityTheatres) return { languages: [], genres: allGenres };

    // Get unique languages from theatres in the city
    const availableLanguages = new Set();
    cityTheatres.forEach(theatre => {
      availableLanguages.add(theatre.language);
    });

    // Get all movie IDs available in the city
    const availableMovieIds = new Set();
    cityTheatres.forEach(theatre => {
      theatre.movies.forEach(movieId => {
        availableMovieIds.add(movieId);
      });
    });

    // Get genres from available movies
    const availableGenres = new Set(['All Genres']);
    allMovies.forEach(movie => {
      if (availableMovieIds.has(movie.id)) {
        const movieGenres = movie.genre.split(' • ');
        movieGenres.forEach(genre => availableGenres.add(genre.trim()));
      }
    });

    return {
      languages: ['All Languages', ...Array.from(availableLanguages)],
      genres: Array.from(availableGenres)
    };
  };

  const { languages, genres } = getAvailableLanguagesAndGenres();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
      if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {
        setShowDashboard(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get movies available in selected city
  const getMoviesForSelectedCity = () => {
    if (selectedCity === 'Select City') {
      return allMovies; // Show all movies when no city is selected
    }

    const cityTheatres = theatresByCity[selectedCity];
    if (!cityTheatres) return [];

    // Get all unique movie IDs from all theatres in the selected city
    const availableMovieIds = new Set();
    cityTheatres.forEach(theatre => {
      theatre.movies.forEach(movieId => {
        availableMovieIds.add(movieId);
      });
    });

    // Filter movies that are available in the selected city
    return allMovies.filter(movie => availableMovieIds.has(movie.id));
  };

  const availableMoviesInCity = getMoviesForSelectedCity();

  // Filter movies based on selections - Only show "now-showing" movies
  const filteredMovies = availableMoviesInCity.filter(movie => {
    const isNowShowing = movie.status === 'now-showing';
    const matchesLanguage = selectedLanguage === 'All Languages' || movie.language.includes(selectedLanguage);
    const matchesGenre = selectedGenre === 'All Genres' || movie.genre.includes(selectedGenre);
    const matchesSearch = searchTerm === '' || 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.language.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isNowShowing && matchesLanguage && matchesGenre && matchesSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      alert(`Searching for: ${searchTerm}`);
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setShowLanguageDropdown(false);
  };

  const toggleDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const closeDropdowns = () => {
    setShowLanguageDropdown(false);
    setShowDashboard(false);
  };

  const handleAuthClick = () => {
    if (user) {
      onGreetingClick();
    } else {
      onAuthButtonClick();
    }
  };

  const handleDashboardItemClick = (item) => {
    alert(`Clicked: ${item.label}`);
    setShowDashboard(false);
  };

  const clearFilters = () => {
    setSelectedLanguage('All Languages');
    setSelectedGenre('All Genres');
    setSearchTerm('');
  };

  return (
    <div className="all-movies-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">MOVIEBUZZ</h1>
          
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search movies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <select 
            className="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <button className="auth-btn" onClick={handleAuthClick}>
            {user ? `Hello! ${user.preferredName}` : 'SIGNUP/LOGIN'}
          </button>
          
          {/* Dashboard Menu Button */}
          <div className="dashboard-container" ref={dashboardRef}>
            <button className="dashboard-btn" onClick={toggleDashboard}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            
            {showDashboard && (
              <div className="dashboard-menu">
                <div className="dashboard-header">
                  <h3>Dashboard</h3>
                  <button className="close-btn" onClick={closeDropdowns}>
                    ×
                  </button>
                </div>
                <div className="dashboard-items">
                  {dashboardItems.map(item => (
                    <button
                      key={item.id}
                      className="dashboard-item"
                      onClick={() => handleDashboardItemClick(item)}
                    >
                      <span className="dashboard-icon">{item.icon}</span>
                      <span className="dashboard-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* City Selection Header */}
      {selectedCity !== 'Select City' && (
        <div className="city-selection-header">
          <div className="city-sub-heading">
            <span>You can select your preferred Language/Genre in {selectedCity}</span>
            <div className="dropdown-container" ref={dropdownRef}>
              <button 
                className="language-genre-btn"
                onClick={toggleDropdown}
              >
                <span>Select Language/Genre</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              
              {showLanguageDropdown && (
                <>
                  <div className="dropdown-overlay" onClick={closeDropdowns}></div>
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <h3>Select Preferences for {selectedCity}</h3>
                      <button className="close-btn" onClick={closeDropdowns}>
                        ×
                      </button>
                    </div>
                    
                    <div className="dropdown-sections">
                      <div className="dropdown-section">
                        <h4>Available Languages</h4>
                        <div className="dropdown-scroll">
                          {languages.map(language => (
                            <button
                              key={language}
                              className={`dropdown-item ${selectedLanguage === language ? 'active' : ''}`}
                              onClick={() => handleLanguageSelect(language)}
                            >
                              {language}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="dropdown-section">
                        <h4>Available Genres</h4>
                        <div className="dropdown-scroll">
                          {genres.map(genre => (
                            <button
                              key={genre}
                              className={`dropdown-item ${selectedGenre === genre ? 'active' : ''}`}
                              onClick={() => handleGenreSelect(genre)}
                            >
                              {genre}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Clear Filters Button - Only show when language or genre is selected */}
          {(selectedLanguage !== 'All Languages' || selectedGenre !== 'All Genres' || searchTerm) && (
            <div className="active-filters">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="all-movies-content">
        <div className="all-movies-header">
          <div className="section-header-with-line">
            <div className="red-line"></div>
            <h2>All Movies ({filteredMovies.length})</h2>
          </div>
          <button className="back-to-home-btn" onClick={onBackToHome}>
            ← Back to Home
          </button>
        </div>
        
        <div className="all-movies-grid">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="movie-card-small" onClick={() => onMovieSelect(movie.id)}>
              <div className="movie-poster-small">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="poster-fallback-small">{movie.title}</div>
              </div>
              <div className="movie-details-small">
                <h3>{movie.title}</h3>
                <div className="movie-info-small">
                  <span className="rating">⭐ {movie.rating}</span>
                  <span className="genre">{movie.genre}</span>
                  <span className="language">{movie.language}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="no-results">
            <h3>No movies found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllMovies;