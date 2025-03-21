import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const AdminProfilesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for task history
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch users on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleAddUser = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (!email.includes('@')) {
      setError("Please include an '@'");
      return;
    }

    try {
      const newUser = { name, email, password, role: role.toLowerCase() };
      const response = await axios.post('http://localhost:3001/users', newUser);
      setUsers([...users, response.data]);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const getUserTasks = async (userId, userName) => {
    try {
      const response = await axios.get('http://localhost:3001/scrumTeams');
      const userTasks = response.data.flatMap(team =>
        team.tasks.filter(task => String(task.assignedTo) === String((userId)))
      );
      setTasks(userTasks);
      setSelectedUser(userName); // Set the selected user's name for the "Tasks Worked By" section
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      setError('Failed to fetch tasks');
    }
  };

  // Filter users to only include non-admin users (role !== 'admin')
  const nonAdminUsers = users.filter(user => user.role !== 'admin');

  return (
    <div>
      <nav>
        <Link to="/admin-home">DASHBOARD</Link>
        {' • '}
        <Link to="/admin-profiles">PROFILES</Link>
        {' • '}
        <Link to="/login"><button onClick={logout}>LOGOUT</button></Link>
      </nav>

      <h1>User Profiles</h1>
      <button onClick={() => setShowForm(!showForm)}>Add New User</button>
      {showForm && (
        <form>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>user</option>
            <option>admin</option>
          </select>
          {error && <p className="error">{error}</p>}
          <button type="button" onClick={handleAddUser}>Create User</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <ul>
        {nonAdminUsers.map(user => (
          <li key={user.id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <button onClick={() => getUserTasks(user.id, user.name)}>Get History</button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <>
          <h2>Tasks Worked By {selectedUser}</h2>
          {tasks.length > 0 ? (
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
        </>
      )}
    </div>
  );
};

export default AdminProfilesPage;