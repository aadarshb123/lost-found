import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import beeImage from './assets/bee.png'; // Your bee image
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [bees, setBees] = useState([]);

  // 🟡 STEP 1: Create bees when page loads
  useEffect(() => {
    const newBees = Array.from({ length: 5 }, (_, index) => ({
      id: index,
      top: Math.random() * 80 + '%',
      left: Math.random() * 80 + '%',
    }));
    setBees(newBees);
  }, []);

  // 🔵 STEP 2: Automatically move bees every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBees((prevBees) =>
        prevBees.map((bee) => ({
          ...bee,
          top: Math.random() * 80 + '%',
          left: Math.random() * 80 + '%',
        }))
      );
    }, 2000); // Moves bees every 2 seconds

    return () => clearInterval(interval); // Cleanup when component unmounts
  }, []);

  return (
    <div className="background">
      {/* 🐝 STEP 3: Render the bees */}
      {bees.map((bee) => (
        <img
          key={bee.id}
          src={beeImage}
          className="bee"
          style={{ top: bee.top, left: bee.left }}
          alt="Bee"
        />
      ))}

      {/* Background Elements */}
      <div className="goldshape"></div>
      <div className="blueshape"></div>

      {/* Home Box (Main Content) */}
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
