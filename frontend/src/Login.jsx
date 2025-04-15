import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 👈 Axios added
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      console.log('Login Success:', res.data);
      navigate('/'); // Navigate to home or dashboard
    } catch (err) {
      console.error('Login Error:', err.response?.data?.message || err.message);
      alert('Login failed. Please check your email and password.');
    }
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    navigate('/SignUp');
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate('/ForgotPassword');
  };

  return (
    <div className="background">
      <div className="goldshape"></div>
      <div className="blueshape"></div>
      <div className="login-container">
        <div className="header">
          <h1>Log In</h1>
          <img src="src/assets/bee.png" alt="Designer" className="logo" />
        </div>
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
            <a href="#" onClick={handleForgotPasswordClick}>Forgot Password</a>
          </div>
          <button type="submit" className="login-btn">Continue</button>
        </form>
        <div className="create-account">
          <p>
            Don't have an account? <br />
            <a href="#" onClick={handleSignUpClick}>Create an Account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
