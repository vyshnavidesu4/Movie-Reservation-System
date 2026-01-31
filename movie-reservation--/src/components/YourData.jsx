import React from "react";
import "./YourData.css";

const YourData = ({ user, onBack, onDeleteAccount }) => {

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
    <div className="userdata-page">
      
      {/* HEADER */}
      <header className="userdata-header">
        <button className="userdata-back-btn" onClick={onBack}>← Back</button>
        <h1 className="userdata-title">Your Account Details</h1>
      </header>

      {/* CARD */}
      <div className="userdata-card">
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

      {/* ⭐ DELETE ACCOUNT BUTTON */}
      <div className="userdata-delete-wrapper">
        <button className="userdata-delete-btn" onClick={handleDelete}>
          Delete My Account
        </button>
      </div>

    </div>
  );
};

export default YourData;
