import React from "react";
import "./YourData.css";

const YourData = ({ user, onBack, onDeleteAccount, onLogout }) => {

  // Format registered date/time
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    : "Not Available";

  // ⭐ Delete Handler
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?\nThis action cannot be undone."
    );
    if (confirmDelete) {
      onDeleteAccount();  // call parent App.jsx function
    }
  };

  return (
    <div className="userdata-overlay" onClick={onBack}>
      <div className="userdata-sidebar" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <header className="userdata-header">
          <h1 className="userdata-title">Your Account Details</h1>
          <button className="userdata-close-btn" onClick={onBack}>&times;</button>
        </header>

        {/* DETAILS */}
        <div className="userdata-content">
          <div className="userdata-row">
            <span className="userdata-label">Preferred Name:</span>
            <span className="userdata-value">{user?.preferredName}</span>
          </div>

          <div className="userdata-row">
            <span className="userdata-label">Username:</span>
            <span className="userdata-value">{user?.username}</span>
          </div>

          <div className="userdata-row">
            <span className="userdata-label">Email:</span>
            <span className="userdata-value">{user?.email}</span>
          </div>

          <div className="userdata-row">
            <span className="userdata-label">Mobile Number:</span>
            <span className="userdata-value">{user?.mobile}</span>
          </div>

          <div className="userdata-row">
            <span className="userdata-label">Registered On:</span>
            <span className="userdata-value">{formattedDate}</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="userdata-actions">
          <button className="userdata-logout-btn" onClick={onLogout}>
            Logout
          </button>
          
          <button className="userdata-delete-btn" onClick={handleDelete}>
            Delete My Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default YourData;
