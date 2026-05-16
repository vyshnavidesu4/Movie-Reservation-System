import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import API_BASE_URL from '../config';

const Home = ({

  user,
  onLogout,
  onAuthButtonClick,
  onGreetingClick,
  onSeeAllMovies,
  onMovieSelect,
  selectedCity,
  setSelectedCity,
  onOpenUserData,
  onOpenNotifications,
  onOpenHistory,
  onOpenHelp
}) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [allMovies, setAllMovies] = useState([]);
  const [cityTheatres, setCityTheatres] = useState({});
  const [cities, setCities] = useState(["Select City"]);
  const [languages, setLanguages] = useState(["All Languages"]);
  const [genres, setGenres] = useState(["All Genres"]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");

  const sliderRef = useRef(null);
  const dropdownRef = useRef(null);
  const dashboardRef = useRef(null);

  const dashboardItems = [
    { id: 1, label: 'Your Data' },
    { id: 2, label: 'Your History' },
    { id: 3, label: 'Notifications' },
    { id: 4, label: 'Help' }
  ];



  // Close dropdowns
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);



  // Fetch Movies
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



  // Fetch Theatres + Cities
  useEffect(() => {

    fetch(`${API_BASE_URL}/theatres/allCities`)
      .then(res => res.json())
      .then(data => {

        setCityTheatres(data);

        const cityNames = Object.keys(data);
        setCities(["Select City", ...cityNames]);

      })
      .catch(err => console.error("Error loading theatres:", err));

  }, []);



  // Movies available in selected city
  const getMoviesForSelectedCity = () => {

    if (selectedCity === "Select City") return allMovies;

    const theatres = cityTheatres[selectedCity];

    if (!theatres) return [];

    return allMovies.filter(movie =>
      theatres.some(t => movie.language.includes(t.language))
    );

  };

  const availableMoviesInCity = getMoviesForSelectedCity();



  // Languages based on city
  useEffect(() => {

    if (selectedCity === "Select City") {

      setLanguages(["All Languages"]);
      return;

    }

    const theatres = cityTheatres[selectedCity];

    if (!theatres) return;

    const cityLanguages = [...new Set(theatres.map(t => t.language))];

    setLanguages(cityLanguages);

  }, [selectedCity, cityTheatres]);



  // Genres based on movies
  useEffect(() => {

    let movies = availableMoviesInCity;

    if (selectedLanguage !== "All Languages") {

      movies = movies.filter(movie =>
        movie.language.includes(selectedLanguage)
      );

    }

    const genreSet = new Set();

    movies.forEach(movie => {

      movie.genre?.split(" • ").forEach(g => {
        genreSet.add(g.trim());
      });

    });

    setGenres(["All Genres", ...genreSet]);

  }, [availableMoviesInCity, selectedLanguage]);



  // Reset filters when city changes
  useEffect(() => {

    setSelectedLanguage("All Languages");
    setSelectedGenre("All Genres");

  }, [selectedCity]);



  // Filtering movies
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



  const scrollLeft = () =>
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });

  const scrollRight = () =>
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });



  const handleSearch = (e) => {

    e.preventDefault();

    if (searchTerm.trim()) {
      alert(`Searching for: ${searchTerm}`);
    }

  };



  const toggleDropdown = () => setShowLanguageDropdown(!showLanguageDropdown);
  const toggleDashboard = () => setShowDashboard(!showDashboard);

  const closeDropdowns = () => {
    setShowDashboard(false);
    setShowLanguageDropdown(false);
  };



  const handleAuthClick = () => {

    if (user) onGreetingClick();
    else onAuthButtonClick();

  };



  const handleDashboardItemClick = (item) => {
    if (item.label === "Your Data") {
      onOpenUserData();
      setShowDashboard(false);
      return;
    }
    if (item.label === "Your History") {
      onOpenHistory();
      setShowDashboard(false);
      return;
    }
    if (item.label === "Notifications") {
      onOpenNotifications();
      setShowDashboard(false);
      return;
    }

    if (item.label === "Help") {
      onOpenHelp();
      setShowDashboard(false);
      return;
    }

    alert(`Clicked: ${item.label}`);
    setShowDashboard(false);
  };



  const handleNotifyMe = (title, id, e, movieReleaseDate) => {
    e.stopPropagation();
    if (!user) {
      alert("Please signup to get notifications");
      onAuthButtonClick(id);
      return;
    }

    fetch(`${API_BASE_URL}/notifications/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        movieId: id,
        movieTitle: title,
        releaseDate: movieReleaseDate || "Coming Soon"
      })
    })
      .then(res => res.json())
      .then(data => setNotifyMsg(data.msg))
      .catch(err => {
        console.error(err);
        setNotifyMsg("Failed to add notification.");
      });
  };



  const clearFilters = () => {

    setSelectedLanguage('All Languages');
    setSelectedGenre('All Genres');
    setSearchTerm('');

  };



  // ===== UI STARTS HERE =====

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
                      onClick={(e)=>handleNotifyMe(movie.title, movie.id, e, movie.releaseDate)}
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

      {/* Notify Popup */}
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

export default Home;
