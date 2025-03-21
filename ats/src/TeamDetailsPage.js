'use client'; // Mark this as a Client Component

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const TeamDetailsPage = () => {
  const { teamName } = useParams();
  const [team, setTeam] = useState(null);
  const [usersData, setUsersData] = useState({});
  const { logout } = useAuth();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/scrumTeams?name=${teamName}`);
        const foundTeam = response.data.find(t => t.name === teamName);
        setTeam(foundTeam);

        // Fetch all user details
        const userPromises = foundTeam.users.map(id => axios.get(`http://localhost:3001/users/${id}`));
        const userResponses = await Promise.all(userPromises);
        const userMap = userResponses.reduce((acc, resp) => ({ ...acc, [resp.data.id]: resp.data }), {});
        setUsersData(userMap);
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };
    fetchTeamDetails();
  }, [teamName]);

  if (!team) return <div>Loading...</div>;

  return (
    <div>
      <h1>Scrum Details for {teamName}</h1>
      <nav>
        <Link to="/user-home">Dashboard</Link> | <Link to="/user-profiles">Profiles</Link> |{' '}
        <Link to="/login"><button onClick={logout}>Logout</button></Link>
      </nav>
      <h2>Tasks</h2>
      <ul>
        {team.tasks.map(task => (
          <li key={task.id}>
            {task.title}: {task.description} - {task.status}
          </li>
        ))}
      </ul>
      <h2>Users</h2>
      <ul>
        {team.users.map(userId => {
          const user = usersData[userId];
          return user ? <li key={userId}>{user.name} ({user.email})</li> : null;
        })}
      </ul>
    </div>
  );
};

export default TeamDetailsPage;