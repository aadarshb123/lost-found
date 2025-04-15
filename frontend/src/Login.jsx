import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from React Router
import { loginUser } from './utils/api';
import './Login.css'; // For custom styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginUser(email, password);
      navigate('/Map'); // Navigate to map page after successful login
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    navigate('/SignUp'); // Navigate to the sign-up page
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    navigate('/ForgotPassword'); // Navigate to the forgot password page
  }

  return (
    <div className="background">
      <div className="goldshape"></div>
      <div className="blueshape"></div>
      <div className="login-container">
        <div className="header">
          <h1>Log In</h1>
          <img src="src/assets/bee.png" alt="Designer" className="logo" />
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">GT Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div className="forgot-password">
            <a href="#" onClick={handleForgotPasswordClick}>Forgot Password</a>
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Continue'}
          </button>
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
