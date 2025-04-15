import axios from 'axios'; // 👈 add this at the top if missing

const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/signup',
      {
        name: 'GT User', // You can add a name field if you want to collect it
        email,
        password,
      }
    );

    alert('Signup successful! You can now log in.');
    navigate('/login'); // 👈 go directly to login now
  } catch (err) {
    console.error('Signup error:', err.response?.data?.message || err.message);
    alert(err.response?.data?.message || 'Signup failed. Try again.');
  }
};
