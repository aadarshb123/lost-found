// src/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Login.css'; // Reuse Login.css for SignUp styling

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign-up logic here
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
    } else {
      console.log('Email:', email, 'Password:', password);
      // Navigate to the verification page after successful sign-up
      navigate('/verification'); // Navigate to the verification page
    }
  };

  return (
    <div className="background">
      <img src="src/assets/bee.png" alt="beeLogo" className="logo" />
      <div className="goldshape"></div>
      <div className="blueshape"></div>
      <div className="login-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Continue</button>
        </form>
        <div className="create-account">
          <p>
            Have an Account? <br />
            <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
