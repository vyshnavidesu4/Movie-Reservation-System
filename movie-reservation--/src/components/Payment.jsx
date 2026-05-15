import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Payment.css';
import API_BASE_URL from '../config';

const Payment = ({ selectedSeats, bookingSelection, selectedCity, movieId, onPaymentSuccess, onBack }) => {

  const [allMovies, setAllMovies] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState('card');

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');

  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletPin, setWalletPin] = useState('');

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
  if (!movie) {
  return <div className="payment-page">Loading booking details...</div>;
}

  const totalPrice = selectedSeats.length * seatPrice;

  // ----------------------------
  // INPUT HANDLER
  // ----------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  // ----------------------------
  // PAYMENT FUNCTION
  // ----------------------------
  const handlePay = async () => {

    // CARD VALIDATION
    if (paymentMethod === 'card') {

      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert('Please fill all card details');
        return;
      }

      if (cardDetails.number.length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return;
      }

      if (cardDetails.cvv.length !== 3) {
        alert('Please enter a valid 3-digit CVV');
        return;
      }
    }

    // UPI VALIDATION
    if (paymentMethod === 'upi') {

      if (!selectedUpiApp) {
        alert('Please select a UPI app');
        return;
      }

      if (!upiId || !upiId.includes('@')) {
        alert('Please enter a valid UPI ID');
        return;
      }
    }

    // WALLET VALIDATION
    if (paymentMethod === 'wallet') {

      if (!selectedWallet) {
        alert('Please select a wallet');
        return;
      }

      if (!walletPin || walletPin.length !== 4) {
        alert('Please enter a valid 4-digit PIN');
        return;
      }
    }

    // ----------------------------
    // BOOK SEATS IN BACKEND
    // ----------------------------
    try {

      await axios.post(
        `${API_BASE_URL}/showtime/bookSeats`,
        {
          movieId,
          theatreName: bookingSelection.theatre.name,
          date: bookingSelection.date.toDateString(),
          time: bookingSelection.time,
          seats: selectedSeats
        }
      );

      alert('Payment successful! Your tickets are booked.');

      onPaymentSuccess();

    } catch (err) {

      console.error(err);
      alert("Payment succeeded, but booking failed. Please try again.");

    }

  };

  // ----------------------------
  // INVALID BOOKING PROTECTION
  // ----------------------------
  if (!bookingSelection) {

    return (
      <div className="payment-page">

        <header className="header">
          <button onClick={onBack}>Back</button>
          <h1>Invalid Booking Information</h1>
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
  // MOVIE LOADING PROTECTION
  // ----------------------------
  if (!movie) {

    return (
      <div className="payment-page">
        <div className="loading">Loading movie...</div>
      </div>
    );

  }

  return (

    <div className="payment-page">

      <header className="header">
        <button onClick={onBack}>Back</button>
        <h1>Payment for {movie.title}</h1>
      </header>

      <main>

        <div className="payment-container">

          {/* BOOKING SUMMARY */}
          <div className="booking-summary">

            <h2>Booking Summary</h2>

            <div className="summary-grid">

              <div className="summary-item">
                <span className="label">Movie:</span>
                <span className="value">{movie.title}</span>
              </div>

              <div className="summary-item">
                <span className="label">City:</span>
                <span className="value">{selectedCity}</span>
              </div>

              <div className="summary-item">
                <span className="label">Theatre:</span>
                <span className="value">{bookingSelection.theatre.name}</span>
              </div>

              <div className="summary-item">
                <span className="label">Address:</span>
                <span className="value">{bookingSelection.theatre.address}</span>
              </div>

              <div className="summary-item">
                <span className="label">Date:</span>
                <span className="value">

                  {bookingSelection.date.toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }
                  )}

                </span>
              </div>

              <div className="summary-item">
                <span className="label">Showtime:</span>
                <span className="value">{bookingSelection.time}</span>
              </div>

              <div className="summary-item">
                <span className="label">Seats:</span>
                <span className="value">
                  {selectedSeats.map(s => s + 1).join(', ')}
                </span>
              </div>

              <div className="summary-item total">
                <span className="label">Total Amount:</span>
                <span className="value">₹{totalPrice}</span>
              </div>

            </div>

          </div>

          {/* PAYMENT FORM (UNCHANGED UI) */}

          {/* YOUR EXISTING PAYMENT FORM CODE CONTINUES HERE */}
          {/* No functional changes required */}

          {/* Payment UI unchanged */}
          <div className="payment-form">
            <h2>Payment Method</h2>

            <div className="payment-methods">
              <button 
                className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Card
              </button>

              <button 
                className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                📱 UPI
              </button>

              <button 
                className={`method-btn ${paymentMethod === 'wallet' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                🪙 Wallet
              </button>
            </div>


            {/* Card form */}
            {paymentMethod === 'card' && (
              <div className="card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text"
                    name="number"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={handleInputChange}
                    maxLength="16"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input 
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={handleInputChange}
                      maxLength="5"
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input 
                      type="password"
                      name="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={handleInputChange}
                      maxLength="3"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input 
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}


            {/* UPI form */}
            {paymentMethod === 'upi' && (
              <div className="upi-form">
                <div className="upi-apps">
                  <h3>Select UPI App</h3>

                  <div className="upi-apps-grid">
                    <button 
                      className={`upi-app-btn ${selectedUpiApp === 'phonepay' ? 'active' : ''}`}
                      onClick={() => setSelectedUpiApp('phonepay')}
                    >
                      <img src="https://res.cloudinary.com/dsfmvdxgi/image/upload/v1775304232/phonepay_cd09tq.png" alt="PhonePe" className="upi-logo" />
                    </button>

                    <button 
                      className={`upi-app-btn ${selectedUpiApp === 'googlepay' ? 'active' : ''}`}
                      onClick={() => setSelectedUpiApp('googlepay')}
                    >
                      <img src="https://res.cloudinary.com/dsfmvdxgi/image/upload/v1775304295/gpay_f9qrao.png" alt="Google Pay" className="upi-logo" />
                    </button>

                    <button 
                      className={`upi-app-btn ${selectedUpiApp === 'paytm' ? 'active' : ''}`}
                      onClick={() => setSelectedUpiApp('paytm')}
                    >
                      <img src="https://res.cloudinary.com/dsfmvdxgi/image/upload/v1775304321/paytm_pzqafl.png" alt="Paytm" className="upi-logo" />
                    </button>
                  </div>
                </div>

                {selectedUpiApp && (
                  <div className="form-group">
                    <label>Enter UPI ID</label>
                    <input 
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}


            {/* Wallet form */}
            {paymentMethod === 'wallet' && (
              <div className="wallet-form">
                <div className="form-group">
                  <label>Select Wallet</label>
                  <select 
                    value={selectedWallet}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                  >
                    <option value="">Choose a wallet</option>
                    <option value="paytm">Paytm Wallet</option>
                    <option value="phonepe">PhonePe Wallet</option>
                    <option value="amazon">Amazon Pay</option>
                  </select>
                </div>

                {selectedWallet && (
                  <>
                    <div className="wallet-balance">
                      <p>Available Balance: <strong>₹1,500</strong></p>
                      <p className="balance-note">Amount to pay: ₹{totalPrice}</p>
                    </div>

                    <div className="form-group">
                      <label>Enter Wallet PIN</label>
                      <input 
                        type="password"
                        placeholder="Enter 4-digit PIN"
                        value={walletPin}
                        onChange={(e) => setWalletPin(e.target.value)}
                        maxLength="4"
                      />
                    </div>

                    <div className="wallet-terms">
                      <p>By proceeding, you agree to debit ₹{totalPrice} from your {selectedWallet} wallet</p>
                    </div>
                  </>
                )}
              </div>
            )}

            <button className="pay-now-btn" onClick={handlePay}>
              Pay ₹{totalPrice} Now
            </button>

            <div className="security-note">
              <p>🔒 Your payment is secure and encrypted</p>
                        </div>
          </div>



        </div>

      </main>

    </div>

  );

};

export default Payment;