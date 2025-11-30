import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-brand">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Attendance System
        </Link>
      </div>

      <nav className="header-nav">
        {user?.role === 'employee' && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/attendance/mark">Mark Attendance</Link>
            <Link to="/attendance/history">My Attendance</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {user?.role === 'manager' && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/manager/attendance">All Attendance</Link>
            <Link to="/manager/calendar">Team Calendar</Link>
            <Link to="/manager/reports">Reports</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </nav>

      <div className="header-user">
        <div className="header-user-info">
          <div>{user?.name}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            {user?.role === 'manager' ? 'Manager' : 'Employee'}
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
