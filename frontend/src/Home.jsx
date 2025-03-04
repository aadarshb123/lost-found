import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import beeImage from './assets/bee.png';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [bees, setBees] = useState([]);

  // 🟡 STEP 1: Initialize bees on page load
  useEffect(() => {
    const newBees = Array.from({ length: 10 }, (_, index) => ({
      id: index,
      top: Math.random() * 80 + '%',
      left: Math.random() * 80 + '%',
    }));
    setBees(newBees);
  }, []);

  // 🔵 STEP 2: Make bees move continuously
  useEffect(() => {
    const moveBees = () => {
      setBees((prevBees) =>
        prevBees.map((bee) => ({
          ...bee,
          top: Math.random() * 80 + '%',
          left: Math.random() * 80 + '%',
        }))
      );
    };

    // Move bees every 2 seconds indefinitely
    const interval = setInterval(moveBees, 2000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="background">
      {/* 🐝 STEP 3: Render bees with smooth movement */}
      {bees.map((bee) => (
        <img
          key={bee.id}
          src={beeImage}
          className="bee"
          style={{ top: bee.top, left: bee.left }}
          alt="Bee"
        />
      ))}

      {/* Background Decorations */}
      <div className="goldshape"></div>
      <div className="blueshape"></div>

      {/* Main Content */}
      <div className="homeBox">
        <h2>Welcome to</h2>
        <h1>GT Lost & Found</h1>
        <p className="introText">
          Lost something on campus? <br />
          <span className="hl"><strong>Don’t panic</strong></span>—we’re here to help!
        </p>
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
