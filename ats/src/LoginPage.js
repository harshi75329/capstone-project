import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    if (!email.includes('@')) {
      setError("Please include an '@'");
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/users');
      const user = response.data.find(u => u.email === email && u.password === password);
      if (user) {
        login(user); // This sets the user object
        navigate(user.role === 'admin' ? '/admin-home' : '/user-home');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin}>Login</button>
      <Link to="/signup"><button>Sign Up</button></Link>
    </div>
  );
};

export default LoginPage;