import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const UserHomePage = () => {
  const [scrumTeams, setScrumTeams] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:3001/scrumTeams')
      .then(response => setScrumTeams(response.data))
      .catch(error => console.error('Error fetching scrum teams:', error));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Scrum Teams</h1>
      <nav>
        <Link to="/user-home">Dashboard</Link> | <Link to="/user-profiles">Profiles</Link> |{' '}
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <ul>
        {scrumTeams.map(team => (
          <li key={team.id}>
            {team.name} <Link to={`/team-details/${team.name}`}><button>Get Details</button></Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHomePage;