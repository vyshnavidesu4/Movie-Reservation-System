import React, { useState } from 'react';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import AllMovies from './components/AllMovies';
import MovieDetails from './components/MovieDetails';
import BookingSelection from './components/BookingSelection';
import SeatSelection from './components/SeatSelection';
import Payment from './components/Payment';
import YourData from './components/YourData';

// ⭐ NEW — Ticket Page
import TicketPage from './components/TicketPage';

import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [previousPage, setPreviousPage] = useState('home');
  const [selectedCity, setSelectedCity] = useState('Select City');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pageBeforeAuth, setPageBeforeAuth] = useState('home');
  const [bookingSelection, setBookingSelection] = useState(null);
  const [movieIdForAuth, setMovieIdForAuth] = useState(null);

  // ⭐ NEW — redirect after login/signup
  const [goToUserDataAfterAuth, setGoToUserDataAfterAuth] = useState(false);

  // ⭐ NEW — Ticket Data (for TicketPage)
  const [ticketData, setTicketData] = useState(null);

  const handleSignupSuccess = (userData) => {
    setUser(userData);

    if (goToUserDataAfterAuth) {
      setGoToUserDataAfterAuth(false);
      setCurrentPage("userdata");
      return;
    }

    if (movieIdForAuth) {
      setSelectedMovieId(movieIdForAuth);
      setCurrentPage('moviedetails');
      setMovieIdForAuth(null);
    } else {
      setCurrentPage(pageBeforeAuth);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);

    if (goToUserDataAfterAuth) {
      setGoToUserDataAfterAuth(false);
      setCurrentPage("userdata");
      return;
    }

    if (movieIdForAuth) {
      setSelectedMovieId(movieIdForAuth);
      setCurrentPage('moviedetails');
      setMovieIdForAuth(null);
    } else {
      setCurrentPage(pageBeforeAuth);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleMovieSelect = (movieId, fromPage) => {
    setSelectedMovieId(movieId);
    setPreviousPage(fromPage);
    setCurrentPage('moviedetails');
  };

  const handleBackFromMovieDetails = () => {
    setCurrentPage(previousPage);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleSeeAllMovies = () => {
    setCurrentPage('allmovies');
  };

  const handleBookTickets = () => {
    setCurrentPage('booking');
  };

  const handleBookingSelection = (selection) => {
    setBookingSelection(selection);
    setCurrentPage('seatselection');
  };

  const handleSeatsSelect = (seats) => {
    setSelectedSeats(seats);
    setCurrentPage('payment');
  };

  // ⭐ UPDATED — redirect to TicketPage instead of Home
  const handlePaymentSuccess = () => {

    // Build Ticket Data
    setTicketData({
      movieId: selectedMovieId,
      theatre: bookingSelection.theatre,
      city: selectedCity,
      date: bookingSelection.date.toDateString(),
      time: bookingSelection.time,
      seats: selectedSeats.map(s => s + 1)
    });

    // Move to TicketPage
    setCurrentPage("ticketpage");

    // Clear booking states
    setBookingSelection(null);
    setSelectedSeats([]);
  };

  const handleAuthButtonClick = (fromPage, movieId = null) => {
    const pageToStore = fromPage || currentPage;
    setPageBeforeAuth(pageToStore);
    setMovieIdForAuth(movieId);
    setCurrentPage('signup');
  };

  const handleGreetingClick = () => {};

  // OPEN USER DATA
  const handleOpenUserData = () => {
    if (!user) {
      alert("Please login to view your data.");
      setGoToUserDataAfterAuth(true);
      setPageBeforeAuth(currentPage);
      setCurrentPage("login");
      return;
    }
    setCurrentPage("userdata");
  };

  // DELETE ACCOUNT
  const handleDeleteAccount = () => {
    if (!user) return;

    fetch("http://localhost:5000/api/auth/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg);
        setUser(null);
        setCurrentPage("home");
      })
      .catch(err => console.error("Delete Error:", err));
  };

  const renderPage = () => {
    switch (currentPage) {

      case 'signup':
        return (
          <Signup
            onSignupSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setCurrentPage('login')}
            onClose={() => setCurrentPage(pageBeforeAuth)}
          />
        );

      case 'login':
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setCurrentPage('signup')}
            onClose={() => setCurrentPage(pageBeforeAuth)}
          />
        );

      case 'allmovies':
        return (
          <AllMovies
            user={user}
            onLogout={handleLogout}
            onAuthButtonClick={() => handleAuthButtonClick('allmovies')}
            onGreetingClick={handleGreetingClick}
            onBackToHome={handleBackToHome}
            onMovieSelect={(movieId) => handleMovieSelect(movieId, 'allmovies')}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        );

      case 'moviedetails':
        return (
          <MovieDetails
            movieId={selectedMovieId}
            user={user}
            onLogout={handleLogout}
            onAuthButtonClick={(movieId) =>
              handleAuthButtonClick('moviedetails', movieId)
            }
            onGreetingClick={handleGreetingClick}
            onBack={handleBackFromMovieDetails}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onBookTickets={handleBookTickets}
          />
        );

      case 'booking':
        return (
          <BookingSelection
            selectedCity={selectedCity}
            onSeatSelection={handleBookingSelection}
            onBack={() => setCurrentPage('moviedetails')}
            movieId={selectedMovieId}
            user={user}
          />
        );

      case 'seatselection':
        return (
          <SeatSelection
            bookingSelection={bookingSelection}
            onSeatsSelect={handleSeatsSelect}
            onBack={() => setCurrentPage('booking')}
            movieId={selectedMovieId}
          />
        );

      case 'payment':
        return (
          <Payment
            selectedSeats={selectedSeats}
            bookingSelection={bookingSelection}
            selectedCity={selectedCity}
            movieId={selectedMovieId}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setCurrentPage('seatselection')}
          />
        );

      // ⭐ NEW TICKET PAGE
      case 'ticketpage':
        return (
          <TicketPage
            bookingData={ticketData}
            onBackHome={() => setCurrentPage('home')}
          />
        );

      case 'userdata':
        return (
          <YourData
            user={user}
            onBack={() => setCurrentPage('home')}
            onDeleteAccount={handleDeleteAccount}
          />
        );

      default:
        return (
          <Home
            user={user}
            onLogout={handleLogout}
            onAuthButtonClick={(movieId) =>
              handleAuthButtonClick('home', movieId)
            }
            onGreetingClick={handleGreetingClick}
            onSeeAllMovies={handleSeeAllMovies}
            onMovieSelect={(movieId) => handleMovieSelect(movieId, 'home')}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onOpenUserData={handleOpenUserData}
          />
        );
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;
