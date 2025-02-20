
// src/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import beeImage from './assets/bee.webp'; // Adjust path if needed
import './index.css';

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };


  return (
    <>
      <img 
        src={beeImage} 
        alt="Georgia Tech Bee" 
        width="100" 
        height="100" 
        style={{ borderRadius: '50%' }}
      />
      <h1>Georgia Tech Lost & Found</h1>
      <h2>Find Your Missing Items!</h2>
      <div className="card">
        <button onClick={handleLogin}>Log In</button>
      </div>
    </>
  );
}

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

export { App, DarkModeToggle };
