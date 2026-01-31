import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import { allMovies } from './AllMoviesData';
import { theatresByCity } from './TheatresData';

const Home = ({ 
  user, 
  onLogout, 
  onAuthButtonClick, 
  onGreetingClick, 
  onSeeAllMovies, 
  onMovieSelect, 
  selectedCity, 
  setSelectedCity,
  onOpenUserData    
}) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const sliderRef = useRef(null);
  const dropdownRef = useRef(null);
  const dashboardRef = useRef(null);

  const cities = [
    'Select City','Ahmedabad','Bangalore','Calicut','Chennai','Coimbatore','Delhi',
    'Guntur','Hyderabad','Kochi','Kolkata','Madurai','Mumbai','Mysore','Nizamabad',
    'Trivandrum','Vijayawada','Vizag','Warangal'
  ];

  const allLanguages = [
    'All Languages','English','Hindi','Tamil','Telugu','Kannada','Malayalam',
    'Bengali','Marathi','Gujarati','Punjabi'
  ];

  const allGenres = [
    'All Genres','Action','Drama','Comedy','Thriller','Romance','Sci-Fi','Horror',
    'Adventure','Fantasy','Animation','Crime','Mystery','Family','Musical'
  ];

  const dashboardItems = [
    { id: 1, label: 'Your Data' },
    { id: 2, label: 'Your History' },
    { id: 3, label: 'Notifications' },
    { id: 4, label: 'Help' }
  ];

  // languages + genres
  const getAvailableLanguagesAndGenres = () => {
    if (selectedCity === 'Select City') {
      return { languages: allLanguages, genres: allGenres };
    }

    const cityTheatres = theatresByCity[selectedCity];
    if (!cityTheatres) return { languages: [], genres: allGenres };

    const availableLanguages = new Set();
    const availableMovieIds = new Set();

    cityTheatres.forEach(theatre => {
      availableLanguages.add(theatre.language);
      theatre.movies.forEach(id => availableMovieIds.add(id));
    });

    const availableGenres = new Set(['All Genres']);
    allMovies.forEach(movie => {
      if (availableMovieIds.has(movie.id)) {
        movie.genre.split(' • ').forEach(g => availableGenres.add(g.trim()));
      }
    });

    return {
      languages: ['All Languages', ...Array.from(availableLanguages)],
      genres: Array.from(availableGenres)
    };
  };

  const { languages, genres } = getAvailableLanguagesAndGenres();

  // close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowLanguageDropdown(false);
      }
      if (dashboardRef.current && !dashboardRef.current.contains(e.target)) {
        setShowDashboard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // get movies for selected city
  const getMoviesForSelectedCity = () => {
    if (selectedCity === 'Select City') return allMovies;

    const cityTheatres = theatresByCity[selectedCity];
    if (!cityTheatres) return [];

    const idSet = new Set();
    cityTheatres.forEach(th => th.movies.forEach(id => idSet.add(id)));

    return allMovies.filter(m => idSet.has(m.id));
  };

  const availableMoviesInCity = getMoviesForSelectedCity();

  // filtering
  const filteredPopularMovies = availableMoviesInCity.filter(movie => {
    const searchLower = searchTerm.toLowerCase();
    return (
      movie.status === 'now-showing' &&
      (selectedLanguage === 'All Languages' || movie.language.includes(selectedLanguage)) &&
      (selectedGenre === 'All Genres' || movie.genre.includes(selectedGenre)) &&
      (
        !searchTerm ||
        movie.title.toLowerCase().includes(searchLower) ||
        movie.genre.toLowerCase().includes(searchLower) ||
        movie.language.toLowerCase().includes(searchLower)
      )
    );
  });

  const filteredUpcomingMovies = availableMoviesInCity.filter(movie => {
    const searchLower = searchTerm.toLowerCase();
    return (
      movie.status === 'upcoming' &&
      (selectedLanguage === 'All Languages' || movie.language.includes(selectedLanguage)) &&
      (selectedGenre === 'All Genres' || movie.genre.includes(selectedGenre)) &&
      (
        !searchTerm ||
        movie.title.toLowerCase().includes(searchLower) ||
        movie.genre.toLowerCase().includes(searchLower) ||
        movie.language.toLowerCase().includes(searchLower)
      )
    );
  });

  const scrollLeft = () => sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) alert(`Searching for: ${searchTerm}`);
  };

  const toggleDropdown = () => setShowLanguageDropdown(!showLanguageDropdown);
  const toggleDashboard = () => setShowDashboard(!showDashboard);
  const closeDropdowns = () => { setShowDashboard(false); setShowLanguageDropdown(false); };

  const handleAuthClick = () => {
    if (user) onGreetingClick();
    else onAuthButtonClick();
  };

  // ⭐⭐⭐ ONLY IMPORTANT PART — do NOT modify functionality ⭐⭐⭐
  const handleDashboardItemClick = (item) => {
    if (item.label === "Your Data") {
      onOpenUserData();   // calls App.jsx navigation
      setShowDashboard(false);
      return;
    }
    alert(`Clicked: ${item.label}`);
    setShowDashboard(false);
  };

  const handleNotifyMe = (title, id, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please signup to get notifications");
      onAuthButtonClick(id);
      return;
    }
    alert(`You will be notified about "${title}"`);
  };

  const clearFilters = () => {
    setSelectedLanguage('All Languages');
    setSelectedGenre('All Genres');
    setSearchTerm('');
  };

  return (
    <div className="home-page">

      {/* HEADER */}
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
            {user ? `Hello! ${user.preferredName}` : "SIGNUP/LOGIN"}
          </button>

          {/* DASHBOARD BUTTON */}
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
                  <button className="close-btn" onClick={closeDropdowns}>×</button>
                </div>

                <div className="dashboard-items">
                  {dashboardItems.map(item => (
                    <button
                      key={item.id}
                      className="dashboard-item"
                      onClick={() => handleDashboardItemClick(item)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* CITY SELECTION HEADER */}
      {selectedCity !== 'Select City' && (
        <div className="city-selection-header">
          <div className="city-sub-heading">
            <span>You can select your preferred Language/Genre in {selectedCity}</span>

            <div className="dropdown-container" ref={dropdownRef}>
              <button className="language-genre-btn" onClick={toggleDropdown}>
                <span>Select Language/Genre</span>
                <svg width="12" height="12"><path d="M7 10l5 5 5-5z"/></svg>
              </button>

              {showLanguageDropdown && (
                <>
                  <div className="dropdown-overlay" onClick={closeDropdowns}></div>

                  <div className="dropdown-menu">

                    <div className="dropdown-header">
                      <h3>Select Preferences for {selectedCity}</h3>
                      <button className="close-btn" onClick={closeDropdowns}>×</button>
                    </div>

                    <div className="dropdown-sections">

                      <div className="dropdown-section">
                        <h4>Available Languages</h4>
                        <div className="dropdown-scroll">
                          {languages.map(lang => (
                            <button
                              key={lang}
                              className={`dropdown-item ${selectedLanguage === lang ? 'active' : ''}`}
                              onClick={() => { setSelectedLanguage(lang); setShowLanguageDropdown(false); }}
                            >
                              {lang}
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
                              onClick={() => { setSelectedGenre(genre); setShowLanguageDropdown(false); }}
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

          {(selectedLanguage !== 'All Languages' || selectedGenre !== 'All Genres' || searchTerm) && (
            <div className="active-filters">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* NOW SHOWING */}
        <section className="movies-section now-showing-section">

          <div className="section-header-with-line">
            <div className="red-line"></div>
            <div className="section-header">
              <h2>NOW SHOWING ({filteredPopularMovies.length})</h2>
              <button className="see-all-btn" onClick={onSeeAllMovies}>See All</button>
            </div>
          </div>

          {filteredPopularMovies.length === 0 ? (
            <div className="no-results">
              <h3>No movies found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="slider-container">

              <button className="slider-nav-btn left" onClick={scrollLeft}>
                <svg width="24" height="24"><path d="M15.41 7.41 14 6l-6 6 6 6z"/></svg>
              </button>

              <div className="movies-slider" ref={sliderRef}>
                {filteredPopularMovies.map(movie => (
                  <div 
                    key={movie.id} 
                    className="movie-card"
                    onClick={() => onMovieSelect(movie.id)}
                  >
                    <div className="movie-poster">
                      <img 
                        src={movie.image}
                        alt={movie.title}
                        onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
                      />
                      <div className="poster-fallback">{movie.title}</div>
                    </div>

                    <div className="movie-details">
                      <h3>{movie.title}</h3>
                      <div className="movie-info">
                        <span className="rating">⭐ {movie.rating}</span>
                        <span className="votes">{movie.votes}</span>
                        <span className="genre">{movie.genre}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              <button className="slider-nav-btn right" onClick={scrollRight}>
                <svg width="24" height="24"><path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59z"/></svg>
              </button>

            </div>
          )}

        </section>

        {/* COMING SOON */}
        <section className="movies-section">

          <div className="section-header-with-line">
            <div className="red-line"></div>
            <h2>COMING SOON ({filteredUpcomingMovies.length})</h2>
          </div>

          {filteredUpcomingMovies.length === 0 ? (
            <div className="no-results">
              <h3>No upcoming movies</h3>
              <p>Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="movies-grid">

              {filteredUpcomingMovies.map(movie => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => onMovieSelect(movie.id)}
                >
                  <div className="movie-poster">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      onError={(e)=>{e.target.style.display="none"; e.target.nextSibling.style.display="flex";}}
                    />
                    <div className="poster-fallback">{movie.title}</div>
                  </div>

                  <div className="movie-details">
                    <h3>{movie.title}</h3>

                    <div className="movie-info">
                      <span className="release-date">📅 {movie.releaseDate}</span>
                      <span className="genre">{movie.genre}</span>
                    </div>

                    <button 
                      className="update-btn" 
                      onClick={(e)=>handleNotifyMe(movie.title, movie.id, e)}
                    >
                      Notify Me
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default Home;
