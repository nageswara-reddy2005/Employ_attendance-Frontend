import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      const { token, user } = response.data;
      setAuthData(user, token);
      
      // Redirect to home - App.jsx will handle role-based routing
      navigate('/', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left-panel">
          <div className="login-left-content">
            <h2 className="login-company-logo">📊 ATTEND</h2>
            <h1 className="login-welcome-title">Employee Attendance System</h1>
            <p className="login-welcome-text">Track, manage, and optimize your team's attendance with our comprehensive attendance management platform. Real-time insights, automated reports, and seamless integration.</p>
            <p className="login-footer-text">© 2025 Attendance Management System</p>
          </div>
        </div>
        <div className="login-card">
          <div className="login-header">
            <h1>Login</h1>
            <p>Welcome! Login to get amazing discounts and offers only for you.</p>
          </div>

        {apiError && <div className="login-alert error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="login-submit-btn" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register">Create one here</Link>
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '12px' }}>
              Demo: manager@example.com / Pass1234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
