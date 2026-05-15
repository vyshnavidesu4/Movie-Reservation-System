import React, { useState } from 'react';
import './Auth.css';
import API_BASE_URL from '../config';

const Signup = ({ onSignupSuccess, onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    mobile: '',
    email: '',
    password: '',
    preferredName: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate preferred name to allow only letters
    if (name === 'preferredName') {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: lettersOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.preferredName.trim()) {
      newErrors.preferredName = 'Preferred name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.preferredName)) {
      newErrors.preferredName = 'Preferred name can only contain letters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate successful signup
      const userData = {
        username: formData.username,
        preferredName: formData.preferredName,
        email: formData.email
      };
      fetch(`${API_BASE_URL}/auth/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData)
})
  .then(res => res.json())
  .then(data => {
    if (data.user) {
      onSignupSuccess(data.user);
    } else {
      alert(data.msg || "Signup failed");
    }
  })
  .catch(err => console.error("Signup Error:", err));

    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button className="close-auth-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="auth-header">
          <h2>Create Your Account</h2>
          <p>Join MovieBuzz to book tickets and get updates</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className={errors.mobile ? 'error' : ''}
            />
            {errors.mobile && <span className="error-text">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="preferredName"
              placeholder="Your Preferred Name (Letters only)"
              value={formData.preferredName}
              onChange={handleChange}
              className={errors.preferredName ? 'error' : ''}
            />
            {errors.preferredName && <span className="error-text">{errors.preferredName}</span>}
          </div>

          <button type="submit" className="auth-submit-btn">
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <span className="auth-link" onClick={onSwitchToLogin}>Login</span></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;