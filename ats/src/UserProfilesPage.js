'use client'; // Mark as Client Component for async/await

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const UserProfilesPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Logged-in user:', user); // Debug: Check user object
        if (!user || !user.id) {
          setError('User ID not found');
          return;
        }

        const response = await axios.get('http://localhost:3001/scrumTeams'); // Ensure port 3001
        console.log('API Response:', response.data); // Debug: Check response data

        const userTasks = response.data.flatMap(team =>
          team.tasks.filter(task => String(task.assignedTo) === String((user.id))) // Ensure type match
        );
        console.log('Filtered Tasks for User ID', user.id, ':', userTasks); // Debug: Check filtered tasks
        setTasks(userTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch tasks');
      }
    };
    fetchData();
  }, [user]);

  return (
    <div>
      <h1>User Profile Page</h1>
      <nav>
        <Link to="/user-home">Dashboard</Link> | <Link to="/user-profiles">Profiles</Link> |{' '}
        <Link to="/login"><button onClick={logout}>Logout</button></Link>
      </nav>
      <h2>Tasks Worked By {user.name}</h2>
      {error ? (
        <p>{error}</p>
      ) : tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <p>Title: {task.title}</p>
              <p>Description: {task.description}</p>
              <p>Status: {task.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks assigned</p>
      )}
    </div>
  );
};

export default UserProfilesPage;