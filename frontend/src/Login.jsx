// src/Login.jsx
import React, { useState } from 'react';
import './Login.css'; // For custom styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="background">
      <img src="src\assets\Designer copy.png" alt="Designer" className="logo" />
      <div className="goldshape"></div>
      <div className="blueshape"></div>
      <div className="login-container">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">GT Email</label>
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
          <div className="forgot-password">
            <a href="#">Forgot Password</a>
          </div>
          <button type="submit" className="login-btn">Continue</button>
        </form>
        <div className="create-account">
          <p>
            Don't have an account? <br />
            <a href="#">Create an Account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
