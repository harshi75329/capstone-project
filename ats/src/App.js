import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import UserHomePage from './UserHomePage';
import TeamDetailsPage from './TeamDetailsPage';
import UserProfilesPage from './UserProfilesPage';
import AdminHomePage from './AdminHomePage';
import AdminTeamDetailsPage from './AdminTeamDetailsPage';
import AdminProfilesPage from './AdminProfilesPage';
import './App.css';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/user-home"
            element={<ProtectedRoute role="user"><UserHomePage /></ProtectedRoute>}
          />
          <Route
            path="/team-details/:teamName"
            element={<ProtectedRoute role="user"><TeamDetailsPage /></ProtectedRoute>}
          />
          <Route
            path="/user-profiles"
            element={<ProtectedRoute role="user"><UserProfilesPage /></ProtectedRoute>}
          />
          <Route
            path="/admin-home"
            element={<ProtectedRoute role="admin"><AdminHomePage /></ProtectedRoute>}
          />
          <Route
            path="/admin-team-details/:teamName"
            element={<ProtectedRoute role="admin"><AdminTeamDetailsPage /></ProtectedRoute>}
          />
          <Route
            path="/admin-profiles"
            element={<ProtectedRoute role="admin"><AdminProfilesPage /></ProtectedRoute>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;