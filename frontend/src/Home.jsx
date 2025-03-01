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
        <h2>Welcome</h2>
        <h1>GT Lost & Found</h1>
        <p className="introText">Lost something on campus? <span className='hl'>Don’t panic</span>—we’re here to help! Easily report missing items, find what’s been lost, and reconnect with your belongings.</p>
        <div className="getStartedButtons">
          <p>Get Started:</p>
          <button onClick={() => navigate('/login')}>Log In</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
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
