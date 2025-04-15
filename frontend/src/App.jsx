import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
// import Verification from './Verification'; // Remove Verification component
import ForgotPassword from './ForgotPassword';
import Map from './Map';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/verification" element={<Verification />} /> */}
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/Map" element={<Map />} />
      </Routes>
    </Router>
  );
}

export default App;
