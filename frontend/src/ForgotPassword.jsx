import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from React Router
import './Login.css'; // Reuse the same CSS for styling

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate password reset logic
    setMessage('If this email is registered, you will receive a reset link.');

    // In a real app, you would send a request to the backend here
  };

  return (
    <div className="background">
      <div className="goldshape"></div>
      <div className="blueshape"></div>
      <div className="login-container">
        <div className="header">
          <h1 className='forgotPassword'>Forgot Password</h1>
          <img src="src/assets/bee.png" alt="Bee Icon" className="logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Enter your GT Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          <button type="submit" className="login-btn">Send Reset Link</button>
        </form>
        <div className="existing-account">
          <p>
            Remembered your password? <br />
            <a href="#" onClick={() => navigate('/login')}>Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
