import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axios';
import './EmployeeDashboard.css';
import './PremiumDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/employee');
      const data = response.data || {};
      setDashboard({
        todayStatus: data.todayStatus || { message: 'No check-in today' },
        monthSummary: data.monthSummary || { present: 0, absent: 0, late: 0, halfDay: 0, totalHours: 0 },
        recentDays: data.recentDays || []
      });
      
      // Check if already checked in
      if (data.todayStatus && data.todayStatus.checkInTime && !data.todayStatus.checkOutTime) {
        setIsCheckedIn(true);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setDashboard({
        todayStatus: { message: 'No check-in today' },
        monthSummary: { present: 0, absent: 0, late: 0, halfDay: 0, totalHours: 0 },
        recentDays: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      await axiosInstance.post('/attendance/checkin');
      setIsCheckedIn(true);
      fetchDashboard();
    } catch (err) {
      console.error('Check-in failed:', err);
    }
  };

  const handleCheckOut = async () => {
    try {
      await axiosInstance.post('/attendance/checkout');
      setIsCheckedIn(false);
      fetchDashboard();
    } catch (err) {
      console.error('Check-out failed:', err);
    }
  };

  if (loading) return <div className="premium-dashboard-container"><p>Loading...</p></div>;

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="premium-dashboard-container">
      <div className="premium-container">
        {/* Header */}
        <div className="premium-header">
          <div className="premium-header-left">
            <h1>✨ Welcome Back, {user?.name?.split(' ')[0]}!</h1>
            <p>Ready to make today productive?</p>
          </div>
          <div className="premium-header-right">
            <div className="premium-notifications">🔔</div>
            <div className="premium-user-profile">
              <div className="premium-user-avatar">{userInitials}</div>
              <div className="premium-user-info">
                <h3>{user?.name || 'Employee'}</h3>
                <p>{user?.employeeId || 'N/A'} • {user?.department || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Card - Today's Status */}
        <div className="premium-hero-card">
          <div className="premium-hero-content">
            <div className="premium-hero-left">
              <h2>Today's Attendance</h2>
              <div className="premium-hero-left date">
                📅 <span>{currentDate}</span>
              </div>
            </div>
            <div className="premium-time-display">
              <div className="premium-current-time">{timeStr}</div>
              <div className={`premium-status-indicator ${isCheckedIn ? 'checked-in' : ''}`}>
                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
              </div>
            </div>
            <div className="premium-hero-actions">
              {!isCheckedIn ? (
                <button className="premium-hero-btn check-in" onClick={handleCheckIn}>
                  ✓ Check In
                </button>
              ) : (
                <button className="premium-hero-btn check-out" onClick={handleCheckOut}>
                  ✗ Check Out
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="premium-stats-grid">
          <div className="premium-stat-card">
            <div className="premium-stat-header">
              <div>
                <div className="premium-stat-value">{dashboard?.monthSummary?.present || 0}</div>
                <div className="premium-stat-label">Present Days</div>
                <div className="premium-stat-change">↑ 5% from last month</div>
              </div>
              <div className="premium-stat-icon present">✓</div>
            </div>
          </div>

          <div className="premium-stat-card">
            <div className="premium-stat-header">
              <div>
                <div className="premium-stat-value">{dashboard?.monthSummary?.absent || 0}</div>
                <div className="premium-stat-label">Absent Days</div>
                <div className="premium-stat-change negative">↓ 1 less than last month</div>
              </div>
              <div className="premium-stat-icon absent">✗</div>
            </div>
          </div>

          <div className="premium-stat-card">
            <div className="premium-stat-header">
              <div>
                <div className="premium-stat-value">{dashboard?.monthSummary?.late || 0}</div>
                <div className="premium-stat-label">Late Arrivals</div>
                <div className="premium-stat-change">↑ Same as last month</div>
              </div>
              <div className="premium-stat-icon late">⏰</div>
            </div>
          </div>

          <div className="premium-stat-card">
            <div className="premium-stat-header">
              <div>
                <div className="premium-stat-value">{Math.round(dashboard?.monthSummary?.totalHours || 0)}h</div>
                <div className="premium-stat-label">Total Hours</div>
                <div className="premium-stat-change">↑ 8h more than expected</div>
              </div>
              <div className="premium-stat-icon hours">⏱</div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="premium-main-grid">
          {/* Recent Attendance */}
          <div className="premium-card">
            <div className="premium-card-header">
              <h2 className="premium-card-title">📊 Recent Attendance</h2>
              <button className="premium-view-all-btn" onClick={() => navigate('/attendance/history')}>View All →</button>
            </div>
            <table className="premium-attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.recentDays && dashboard.recentDays.length > 0 ? (
                  dashboard.recentDays.map((record) => (
                    <tr key={record._id}>
                      <td>{record.date}</td>
                      <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td>{record.totalHours ? `${record.totalHours}h` : '-'}</td>
                      <td>
                        <span className={`premium-badge premium-badge-${record.status}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sidebar */}
          <div>
            {/* Quick Actions */}
            <div className="premium-card">
              <div className="premium-card-header">
                <h2 className="premium-card-title">⚡ Quick Actions</h2>
              </div>
              <div className="premium-quick-actions-grid">
                <div className="premium-action-card" onClick={() => navigate('/attendance/history')}>
                  <div className="premium-action-icon">📈</div>
                  <div className="premium-action-content">
                    <h4>My History</h4>
                    <p>View full attendance</p>
                  </div>
                </div>
                <div className="premium-action-card" onClick={() => navigate('/profile')}>
                  <div className="premium-action-icon">👤</div>
                  <div className="premium-action-content">
                    <h4>My Profile</h4>
                    <p>Update info</p>
                  </div>
                </div>
                <div className="premium-action-card" onClick={() => navigate('/attendance/history')}>
                  <div className="premium-action-icon">📄</div>
                  <div className="premium-action-content">
                    <h4>Reports</h4>
                    <p>Monthly summary</p>
                  </div>
                </div>
                <div className="premium-action-card" onClick={() => alert('Leave request feature coming soon!')}>
                  <div className="premium-action-icon">🏖️</div>
                  <div className="premium-action-content">
                    <h4>Leave Request</h4>
                    <p>Apply for leave</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Calendar - Last 7 Days */}
            <div className="premium-card" style={{ marginTop: '20px' }}>
              <div className="premium-calendar-header">
                <span>Last 7 Days</span>
              </div>
              <div className="premium-calendar-container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                  {(() => {
                    const days = [];
                    const today = new Date();
                    
                    // Generate last 7 days
                    for (let i = 6; i >= 0; i--) {
                      const date = new Date(today);
                      date.setDate(date.getDate() - i);
                      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                      const record = dashboard?.recentDays?.find(r => r.date === dateStr);
                      
                      days.push(
                        <div 
                          key={dateStr}
                          className={`premium-mini-calendar-day ${record ? `premium-mini-calendar-day-${record.status}` : 'premium-mini-calendar-day-empty'}`}
                          title={record ? `${record.status} - ${record.totalHours || 0}h` : dateStr}
                          style={{
                            padding: '12px 8px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: record ? `rgba(${record.status === 'present' ? '16, 185, 129' : record.status === 'absent' ? '239, 68, 68' : '245, 158, 11'}, 0.2)` : 'rgba(255, 255, 255, 0.05)',
                            border: record ? `2px solid rgba(${record.status === 'present' ? '16, 185, 129' : record.status === 'absent' ? '239, 68, 68' : '245, 158, 11'}, 0.4)` : '1px solid rgba(255, 255, 255, 0.1)',
                            color: record ? (record.status === 'present' ? '#10b981' : record.status === 'absent' ? '#ef4444' : '#f59e0b') : 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.15)';
                            e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                            e.target.style.zIndex = '10';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = 'none';
                            e.target.style.zIndex = '1';
                          }}
                        >
                          <div style={{ fontSize: '10px', marginBottom: '4px' }}>{dayName}</div>
                          <div>{date.getDate()}</div>
                        </div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
