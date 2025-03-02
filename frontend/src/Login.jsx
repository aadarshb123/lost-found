import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from React Router
import './Login.css'; // For custom styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email, 'Password:', password);

    // Navigate to the dashboard or home page after login (if needed)
  };

  const handleSignUpClick = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    navigate('/SignUp'); // Navigate to the sign-up page
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
            <a href="#">Forgot Password</a>
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
