import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const AdminHomePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [scrumName, setScrumName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do');
  const [assignTo, setAssignTo] = useState('');
  const [scrumTeams, setScrumTeams] = useState([]);
  const [users, setUsers] = useState([]); // New state for users
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchScrumTeams();
    fetchUsers(); // Fetch users when component mounts
  }, []);

  const fetchScrumTeams = () => {
    axios.get('http://localhost:3001/scrumTeams')
      .then(response => setScrumTeams(response.data))
      .catch(error => console.error('Error fetching scrum teams:', error));
  };

  const fetchUsers = () => {
    axios.get('http://localhost:3001/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  };

  const handleAddScrum = async () => {
    if (!scrumName || !taskTitle || !taskDesc || !assignTo) {
      setError('All fields are required');
      return;
    }

    try {
      const newScrum = {
        name: scrumName,
        tasks: [{ title: taskTitle, description: taskDesc, status: taskStatus, assignedTo: (assignTo) }],
        users: [(assignTo)]
      };
      await axios.post('http://localhost:3001/scrumTeams', newScrum);
      setShowForm(false);
      setError('');
      fetchScrumTeams(); // Refresh scrum teams after adding
    } catch (err) {
      setError('Failed to add scrum');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Scrum Teams</h1>
      <nav>
        <Link to="/admin-home">Dashboard</Link> | <Link to="/admin-profiles">Profiles</Link> |{' '}
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <button onClick={() => setShowForm(!showForm)}>Add New Scrum</button>
      {showForm && (
        <form>
          <input type="text" value={scrumName} onChange={(e) => setScrumName(e.target.value)} placeholder="Scrum Name" />
          <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task Title" />
          <input type="text" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder="Task Description" />
          <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {error && <p className="error">{error}</p>}
          <button type="button" onClick={handleAddScrum}>Create Scrum</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
      <ul>
        {scrumTeams.map(team => (
          <li key={team.id}>
            {team.name} <Link to={`/admin-team-details/${team.name}`}><button>Get Details</button></Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHomePage;