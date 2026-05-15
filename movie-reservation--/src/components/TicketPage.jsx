import React, { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./TicketPage.css";
import API_BASE_URL from '../config';

const TicketPage = ({ bookingData, onBackHome }) => {

  const [allMovies, setAllMovies] = useState([]);
  const qrRef = useRef(null);

  // Fetch movies from backend
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

  if (!bookingData) {
    return (
      <div className="ticket-page">
        <h1>No Ticket Found</h1>
        <button onClick={onBackHome}>Go Home</button>
      </div>
    );
  }

  const movie = allMovies.find(
    m => m.id === parseInt(bookingData.movieId)
  );

  if (!movie) {
    return (
      <div className="ticket-page">
        <h2>Loading ticket...</h2>
      </div>
    );
  }

  // Map city -> language
  const cityLanguageMap = {
    Ahmedabad: "Hindi",
    Bangalore: "Kannada",
    Calicut: "Malayalam",
    Chennai: "Tamil",
    Coimbatore: "Tamil",
    Delhi: "Hindi",
    Guntur: "Telugu",
    Hyderabad: "Telugu",
    Kochi: "Malayalam",
    Kolkata: "Hindi",
    Madurai: "Tamil",
    Mumbai: "Hindi",
    Mysore: "Kannada",
    Nizamabad: "Telugu",
    Trivandrum: "Malayalam",
    Vijayawada: "Telugu",
    Vizag: "Telugu",
    Warangal: "Telugu",
  };

  const selectedLanguage =
    cityLanguageMap[bookingData.city] ||
    movie.language?.split(",")[0] ||
    "Unknown";

  // Download Ticket PDF
  const downloadPDF = async () => {

    const ticketElement = document.getElementById("ticket-card");

    const canvas = await html2canvas(ticketElement, {
      scale: 3,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 10, width, height);

    pdf.save("MovieTicket.pdf");
  };

  return (
    <div className="ticket-page">
      
      <div className="ticket-card" id="ticket-card">

        {/* Small Poster */}
        <img
          src={movie.image}
          alt={movie.title}
          className="ticket-poster-small"
        />

        {/* Movie Title */}
        <h2 className="ticket-movie-title">{movie.title}</h2>

        {/* Language */}
        <p className="ticket-language">
          Language: <strong>{selectedLanguage}</strong>
        </p>

        {/* Ticket Info */}
        <div className="ticket-details">

          <div className="ticket-row">
            <span className="label">Date:</span>
            <span className="value">{bookingData.date}</span>
          </div>

          <div className="ticket-row">
            <span className="label">Time:</span>
            <span className="value">{bookingData.time}</span>
          </div>

          <div className="ticket-row">
            <span className="label">City:</span>
            <span className="value">{bookingData.city}</span>
          </div>

          <div className="ticket-row">
            <span className="label">Theatre:</span>
            <span className="value">{bookingData.theatre.name}</span>
          </div>

          {/* Seat Number */}
          <div className="ticket-row">
            <span className="label">Seat No:</span>
            <span className="value">{bookingData.seats.join(", ")}</span>
          </div>

          {/* Amount */}
          <div className="ticket-row">
            <span className="label">Amount:</span>
            <span className="value">
              ₹{bookingData.seats.length * 200}
            </span>
          </div>

        </div>

        {/* QR Code */}
        <div className="qr-section">
          <div ref={qrRef}>
            <QRCodeCanvas
              value={JSON.stringify(bookingData)}
              size={150}
              includeMargin={true}
            />
          </div>
          <p className="qr-text">Scan to verify ticket</p>
        </div>

      </div>

      {/* Buttons */}
      <button className="download-btn" onClick={downloadPDF}>
        📥 Download Ticket (PDF)
      </button>

      <button className="home-btn" onClick={onBackHome}>
        ⬅ Back to Home
      </button>

    </div>
  );
};

export default TicketPage;