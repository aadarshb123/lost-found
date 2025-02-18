import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Verification from './verification'; // Import Verification component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verification" element={<Verification />} /> {/* Add route for Verification */}
      </Routes>
    </Router>
  );
}

export default App;
