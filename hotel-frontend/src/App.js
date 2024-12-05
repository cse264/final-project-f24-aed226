// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Comments from './pages/Comments';
import WeatherInfo from './pages/WeatherInfo';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  // manage whether a user is logged in or not
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedAuthState = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole');
    if (storedAuthState && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  // handle login
  const handleLogin = (role) => {
    console.log("Setting role:", role);
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* redirect to login if not authenticated */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />
          {/* login route*/}
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          {/* register route */}
          <Route
            path="/register"
            element={<Register />}
          />
          {/* dashboard route */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <>
                  {console.log("User role being passed to Dashboard:", userRole)}
                  <Dashboard onLogout={handleLogout} userRole={userRole} />
                  </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/comments"
            element={isAuthenticated ? <Comments /> : <Navigate to="/login" />}
          />
          <Route
            path="/weather"
            element={<WeatherInfo />}
          />
          <Route
            path="/admin"
            element={isAuthenticated && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;