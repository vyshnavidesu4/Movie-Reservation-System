import React, { useState, useEffect } from 'react';
import './Notifications.css';
import API_BASE_URL from '../config';

const Notifications = ({ user, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE_URL}/notifications/${user.username}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="notifications-overlay" onClick={onClose}>
      <div className="notifications-sidebar" onClick={(e) => e.stopPropagation()}>
        
        <header className="notifications-header">
          <h2 className="notifications-title">Notifications</h2>
          <button className="notifications-close-btn" onClick={onClose}>&times;</button>
        </header>

        <div className="notifications-content">
          {loading ? (
            <p className="notif-msg">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="notif-msg">No notifications. Click "Notify Me" to get alerts!</p>
          ) : (
            notifications.map(notif => (
              <div key={notif._id} className="notification-card">
                <h3>{notif.movieTitle}</h3>
                <p>Release Date: <strong>{notif.releaseDate}</strong></p>
                <span className="notif-subtext">You will be notified when bookings open.</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Notifications;
