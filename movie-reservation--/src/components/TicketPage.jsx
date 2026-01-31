import React from "react";
import { allMovies } from "./AllMoviesData";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./TicketPage.css";

const TicketPage = ({ bookingData, onBackHome }) => {
  if (!bookingData) {
    return (
      <div className="ticket-page">
        <h1>No Ticket Found</h1>
        <button onClick={onBackHome}>Go Home</button>
      </div>
    );
  }

  const movie = allMovies.find(m => m.id === parseInt(bookingData.movieId));

  // Map city -> language (same idea as your theatres data)
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

  // Use city-based language first, fall back to movie's first language
  const selectedLanguage =
    cityLanguageMap[bookingData.city] ||
    movie.language?.split(",")[0] ||
    "Unknown";

  // Download Ticket PDF
  const downloadPDF = async () => {
    const ticketElement = document.getElementById("ticket-card");
    const canvas = await html2canvas(ticketElement, { scale: 2 });
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

        {/* Correct Language (based on city) */}
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

          {/* Amount (₹200 per seat) */}
          <div className="ticket-row">
            <span className="label">Amount:</span>
            <span className="value">
              ₹{bookingData.seats.length * 200}
            </span>
          </div>
        </div>

        {/* QR Code */}
        <div className="qr-section">
          <QRCodeCanvas
            value={JSON.stringify(bookingData)}
            size={150}
          />
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
