import React, { useState } from 'react';
import './Auth.css';
import API_BASE_URL from '../config';

const Login = ({ onLoginSuccess, onSwitchToSignup, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            onLoginSuccess(data.user);
          } else {
            setLoginError(data.msg || "Invalid username or password");
          }
        })
        .catch(err => {
          console.error("Login Error:", err);
          setLoginError("Something went wrong. Try again.");
        });
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button className="close-auth-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your MovieBuzz account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {loginError && <div className="login-error">{loginError}</div>}
          
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
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-submit-btn">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <span className="auth-link" onClick={onSwitchToSignup}>Sign Up</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
