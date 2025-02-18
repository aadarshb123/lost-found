import React, { useState } from 'react';
import './Login.css'; // Reuse Login.css for styling

function Verification() {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = [React.createRef(), React.createRef(), React.createRef(), React.createRef()]; // Store references to input elements

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to the next input field if a digit is entered
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle verification logic here, for now, we just log the code
    const enteredCode = code.join('');
    console.log('Entered Code:', enteredCode);
    // Add your verification logic here, like calling an API for validation
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
                ref={inputRefs[index]} // Set ref for each input
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
