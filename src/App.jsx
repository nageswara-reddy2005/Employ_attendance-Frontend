import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Chatbot from './components/Chatbot';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AttendanceMark from './pages/AttendanceMark';
import MyAttendance from './pages/MyAttendance';
import MyProfile from './pages/MyProfile';
import ManagerDashboard from './pages/ManagerDashboard';
import AllAttendance from './pages/AllAttendance';
import TeamCalendar from './pages/TeamCalendar';
import Reports from './pages/Reports';

import './App.css';

function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-container"><p>Loading...</p></div>;
  }

  return (
    <>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

        {/* Employee Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              {user?.role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />}
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance/mark"
          element={
            <PrivateRoute>
              <AttendanceMark />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance/history"
          element={
            <PrivateRoute>
              <MyAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <PrivateRoute requiredRole="manager">
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/attendance"
          element={
            <PrivateRoute requiredRole="manager">
              <AllAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/calendar"
          element={
            <PrivateRoute requiredRole="manager">
              <TeamCalendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/reports"
          element={
            <PrivateRoute requiredRole="manager">
              <Reports />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {isAuthenticated && <Chatbot />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
