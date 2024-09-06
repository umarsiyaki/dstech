
  // Login.js (React)
  import React, { useState } from 'react';
  import axios from 'axios';

  function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('/api/login', { email, password });
        localStorage.setItem('token', response.data.token);
        // Redirect to dashboard or another secure page
      } catch (err) {
        console.error('Login failed:', err.response.data.error);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    );
  }

  export default Login;