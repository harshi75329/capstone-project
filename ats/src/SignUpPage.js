import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (!email.includes('@')) {
      setError("Please include an '@'");
      return;
    }

    try {
      const newUser = { name, email, password, role: 'user' };
      const response = await axios.post('http://localhost:3001/users', newUser);
      login(response.data);
      navigate('/user-home');
    } catch (err) {
      setError('Failed to sign up');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
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
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUpPage;