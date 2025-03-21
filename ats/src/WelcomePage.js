import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const WelcomePage = () => {
  const [scrumTeams, setScrumTeams] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/scrumTeams')
      .then(response => setScrumTeams(response.data))
      .catch(error => console.error('Error fetching scrum teams:', error));
  }, []);

  return (
    <div>
      <h1>Scrum Teams</h1>
      <h2>Welcome to Agile Track System</h2>
      <nav>
        <Link to="/">Dashboard</Link> | <Link to="/login">Login</Link>
      </nav>
      <ul>
        {scrumTeams.map(team => (
          <li key={team.id}>
            {team.name} <Link to="/login"><button>Get Details</button></Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WelcomePage;