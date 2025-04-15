import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import beeImage from './assets/bee.png';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [bees, setBees] = useState([]);
  const homeBoxRef = useRef(null);

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

  const handleMouseMove = (e) => {
    const box = homeBoxRef.current;
    const rect = box.getBoundingClientRect();

    // Calculate mouse position relative to the box
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation values
    const rotateX = ((y / rect.height) - 0.5) * 10; 
    const rotateY = ((x / rect.width) - 0.5) * -10;

    // Apply the transformation
    box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    // Reset the transformation when the mouse leaves
    const box = homeBoxRef.current;
    box.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

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
      <div
        className="homeBox"
        ref={homeBoxRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
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
