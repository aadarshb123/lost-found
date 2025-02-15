import { useState, useEffect } from 'react'
import './index.css'

function App() {
  return (
    <>
      <h1>
      🐝
      </h1>
      <h1>Georgia Tech Lost & Found</h1>
      <h2>Find Your Missing Items!</h2>
      <div className="card">
        <button>
          Log In
        </button>
      </div>
    </>
  )
}

// Dark Mode
const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Set the initial theme based on user's preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode class to the body
  // runs whenever isDarkMode state changes
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

export {App, DarkModeToggle};
