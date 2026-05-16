import React, { useState } from 'react';
import './Help.css';

const Help = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    {
      question: "How do I book a ticket?",
      answer: "Select a movie from the home page, choose your city, select the theater and showtime, pick your seats, and complete the payment. Your ticket will be generated instantly!"
    },
    {
      question: "Can I cancel my booking?",
      answer: "Cancellation policies vary by theater. Look for the 'Cancellable' tag on theaters during the selection process. Currently, most bookings are final once payment is confirmed."
    },
    {
      question: "Where can I find my booked tickets?",
      answer: "You can find your booking history in the 'Your History' section of the Dashboard. You can also download your e-ticket as a PDF from there."
    },
    {
      question: "How do I use the QR code?",
      answer: "Your e-ticket contains a unique QR code. Present this at the theater entrance. The staff will scan it to verify your booking."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support all major Credit/Debit cards, UPI (GPay, PhonePe, Paytm), and popular Digital Wallets."
    }
  ];

  const guides = [
    {
      title: "Finding Movies",
      steps: [
        "Browse the 'Now Showing' or 'Coming Soon' sections.",
        "Use the search bar to find specific movies by title, genre, or language.",
        "Filter movies by selecting your city and preferred language/genre."
      ]
    },
    {
      title: "Managing Your Account",
      steps: [
        "Sign up or Log in using the button in the header.",
        "Access your profile via 'Your Data' in the Dashboard.",
        "Enable notifications for upcoming movies by clicking 'Notify Me' on coming soon posters."
      ]
    }
  ];

  return (
    <div className="help-page">
      <header className="help-header">
        <div className="help-header-content">
          <button className="back-btn-help" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <span>BACK</span>
          </button>
          <h1 className="logo">MOVIEBUZZ HELP</h1>
        </div>
      </header>

      <main className="help-content">
        <div className="help-hero">
          <h2>How can we help you today?</h2>
          <p>Everything you need to know about using MovieBuzz</p>
        </div>

        <div className="help-tabs">
          <button 
            className={`help-tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQs
          </button>
          <button 
            className={`help-tab ${activeTab === 'guides' ? 'active' : ''}`}
            onClick={() => setActiveTab('guides')}
          >
            User Guides
          </button>
          <button 
            className={`help-tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Us
          </button>
        </div>

        <div className="help-body">
          {activeTab === 'faq' && (
            <div className="faq-section">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'guides' && (
            <div className="guides-section">
              {guides.map((guide, index) => (
                <div key={index} className="guide-card">
                  <h3>{guide.title}</h3>
                  <ul>
                    {guide.steps.map((step, sIndex) => (
                      <li key={sIndex}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="contact-section">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email Support</h3>
                <p>support@moviebuzz.com</p>
                <span>Typical response time: 2-4 hours</span>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3>Phone Support</h3>
                <p>1800-MOVIE-HELP</p>
                <span>Available 9 AM - 9 PM daily</span>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <h3>Headquarters</h3>
                <p>123 Cinematic Plaza, Film City, Mumbai - 400001</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="help-footer">
        <p>&copy; 2026 MovieBuzz. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Help;
