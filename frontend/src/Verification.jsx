import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Verification() {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = [React.createRef(), React.createRef(), React.createRef(), React.createRef()];
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredCode = code.join('');
    console.log('Entered Code:', enteredCode);
  
    try {
      const res = await axios.get(
        'http://localhost:5000/api/auth/verify-email',
        {
          withCredentials: true, // 🔥 this sends the login cookie (JWT)
        }
      );
  
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      console.error('Verification failed:', err.response?.data?.message || err.message);
      alert('Verification failed. Please try again.');
    }
  };
  

    try {
      const res = await axios.get('http://localhost:5000/api/auth/verify-email', {
        withCredentials: true,
      });

      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      console.error('Verification failed:', err.response?.data?.message || err.message);
      alert('Verification failed. Please try again.');
    }
  };

  return (
    <div className="background">
      <img src="src/assets/Designer copy.png" alt="Designer" className="logo" />
      <div className="goldshape"></div>
      <div className="blueshape"></div>
      <div className="login-container">
        <h1>Verify Your Email</h1>
        <p>Code sent to example1@gatech.edu</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group verification-code">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                maxLength="1"
                required
                ref={inputRefs[index]}
              />
            ))}
          </div>
          <button type="submit" className="login-btn">Verify</button>
        </form>
        <div className="create-account">
          <p>
            Don't have an account? <br />
            <a href="/signup">Create an Account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Verification;
