import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const AdminTeamDetailsPage = () => {
  const { teamName } = useParams();
  const [team, setTeam] = useState(null);
  const { logout } = useAuth();
  const [usersData, setUsersData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamResponse = await axios.get(`http://localhost:3001/scrumTeams?name=${teamName}`);
        const foundTeam = teamResponse.data[0];
        setTeam(foundTeam);

        // Fetch all user details
        const userPromises = foundTeam.users.map(id => axios.get(`http://localhost:3001/users/${id}`));
        const userResponses = await Promise.all(userPromises);
        const userMap = userResponses.reduce((acc, resp) => ({ ...acc, [resp.data.id]: resp.data }), {});
        setUsersData(userMap);
      } catch (error) {
        console.error('Error fetching team details or user data:', error);
      }
    };

    fetchData();
  }, [teamName]);

  const updateStatus = async (taskId, newStatus) => {
    const updatedTasks = team.tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    await axios.patch(`http://localhost:3001/scrumTeams/${team.id}`, { tasks: updatedTasks });
    setTeam({ ...team, tasks: updatedTasks });
  };

  if (!team) return <div>Loading...</div>;

  return (
    <div>
      <h1>Scrum Details for {teamName}</h1>
      <nav>
        <Link to="/admin-home">Dashboard</Link> | <Link to="/admin-profiles">Profiles</Link> |{' '}
        <Link to="/login"><button onClick={logout}>Logout</button></Link>
      </nav>
      <h2>Tasks</h2>
      {team.tasks.map(task => (
        <div key={task.id}>
          <p>{task.title} - {task.description}</p>
          <select
            value={task.status}
            onChange={(e) => updateStatus(task.id, e.target.value)}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      ))}
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

export default AdminTeamDetailsPage;