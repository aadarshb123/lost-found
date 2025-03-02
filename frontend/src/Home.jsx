import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bees from './assets/bee.png'; // Adjust path if needed
import './Home.css'; // For custom styling

function Home() {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="goldshape"></div>
      <div className="blueshape"></div>
      <div className="homeBox">
        <h2>Welcome to</h2>
        <h1>GT Lost & Found</h1>
        <p className="introText">Lost something on campus? <br></br><span className='hl'><strong>Don’t panic</strong></span>—we’re here to help! </p>
        <ul className="features">
          <li><span className="hoverable">Report</span> a lost or found item in seconds</li>
          <li><span className="hoverable">Browse</span> reported items to see if yours has been found</li>
          <li><span className="hoverable">Connect</span> with the person who found your belongings</li>
          <li><span className="hoverable">Help</span> others by returning lost items</li>
        </ul>
        <div className="getStartedButtons">
          <p className="getStarted">Get Started:</p>
          <button className="loginButton" onClick={() => navigate('/login')}>Log In</button>
          <button className="signupButton" onClick={() => navigate('/signup')}>Create an Account</button>
        </div>
      </div>
    </div>
  );
}

export default Home;


/*
 // Dark Mode Toggle Component
const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div>
      <button onClick={toggleDarkMode} id="theme-toggle-btn">
        {isDarkMode ? '🌞' : '🌙'}
      </button>
    </div>
  );
};
*/



