import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import './ManagerDashboard.css';
import './PremiumManagerDashboard.css';

const ManagerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/manager');
      setDashboard(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="premium-manager-container"><p>Loading...</p></div>;

  const getMaxTrendValue = () => {
    if (!dashboard?.weeklyTrend) return 1;
    return Math.max(...dashboard.weeklyTrend.map(d => Math.max(d.present, d.absent, d.late)));
  };

  const maxTrendValue = getMaxTrendValue();

  return (
    <div className="premium-manager-container">
      <div className="premium-manager-container-inner">
        <div className="premium-manager-header">
          <h1>👔 Manager Dashboard</h1>
          <p>Overview of team attendance and performance</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>{error}</div>}

        {dashboard && (
          <>
            {/* Statistics Cards */}
            <div className="premium-manager-stats">
              <div className="premium-manager-stat-card">
                <div className="premium-manager-stat-value">{dashboard.totalEmployees}</div>
                <div className="premium-manager-stat-label">Total Employees</div>
                <div className="premium-manager-stat-icon total">👥</div>
              </div>
              <div className="premium-manager-stat-card">
                <div className="premium-manager-stat-value">{dashboard.todayStats.present}</div>
                <div className="premium-manager-stat-label">Present Today</div>
                <div className="premium-manager-stat-icon present">✓</div>
              </div>
              <div className="premium-manager-stat-card">
                <div className="premium-manager-stat-value">{dashboard.todayStats.absent}</div>
                <div className="premium-manager-stat-label">Absent Today</div>
                <div className="premium-manager-stat-icon absent">✗</div>
              </div>
              <div className="premium-manager-stat-card">
                <div className="premium-manager-stat-value">{dashboard.lateArrivals.length}</div>
                <div className="premium-manager-stat-label">Late Arrivals</div>
                <div className="premium-manager-stat-icon late">⏰</div>
              </div>
            </div>

          {/* Charts Section */}
          <div className="dashboard-content">
            {/* Weekly Trend Chart */}
            <div className="chart-card">
              <div className="chart-card-title">Weekly Attendance Trend</div>
              <div className="weekly-trend">
                {dashboard.weeklyTrend.map((day, idx) => {
                  const height = (day.present / maxTrendValue) * 100;
                  const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <div key={idx} style={{ flex: 1, position: 'relative', height: '100%' }}>
                      <div
                        className="trend-bar"
                        style={{ height: `${height}%` }}
                        title={`${dayName}: ${day.present} present, ${day.absent} absent, ${day.late} late`}
                      >
                        <div className="trend-bar-value">{day.present}</div>
                      </div>
                      <div className="trend-bar-label">{dayName}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '2rem', fontSize: '12px', color: '#7f8c8d' }}>
                <strong>Legend:</strong> Bar height represents number of employees present
              </div>
            </div>

            {/* Department Summary Chart */}
            <div className="chart-card">
              <div className="chart-card-title">Department Summary (Last 7 Days)</div>
              <div className="department-summary">
                {Object.entries(dashboard.departmentSummary).map(([dept, stats]) => {
                  const total = stats.present + stats.absent + stats.late + stats.halfDay;
                  const percentage = total > 0 ? (stats.present / total) * 100 : 0;
                  return (
                    <div key={dept} className="department-item">
                      <div className="department-name">{dept}</div>
                      <div
                        className="department-bar"
                        style={{ width: `${Math.max(percentage, 10)}%` }}
                        title={`${stats.present} present, ${stats.absent} absent, ${stats.late} late, ${stats.halfDay} half-day`}
                      >
                        {stats.present}
                      </div>
                      <div className="department-count">{total}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Employee Details Section */}
          <div className="late-arrivals-card">
            <div className="late-arrivals-title">👥 All Employees - Today's Status</div>
            {dashboard.allEmployees && dashboard.allEmployees.length > 0 ? (
              <div className="employee-table-container">
                <table className="employee-details-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Today's Status</th>
                      <th>Check In Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.allEmployees.map((emp) => (
                      <tr key={emp._id} className={`status-${emp.todayStatus?.status || 'absent'}`}>
                        <td><strong>{emp.employeeId}</strong></td>
                        <td>{emp.name}</td>
                        <td>{emp.department}</td>
                        <td>
                          <span className={`status-badge status-badge-${emp.todayStatus?.status || 'absent'}`}>
                            {emp.todayStatus?.status ? emp.todayStatus.status.charAt(0).toUpperCase() + emp.todayStatus.status.slice(1) : 'Absent'}
                          </span>
                        </td>
                        <td>{emp.todayStatus?.checkInTime ? new Date(emp.todayStatus.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>No employee data available</div>
            )}
          </div>

          {/* Late Arrivals */}
          <div className="late-arrivals-card">
            <div className="late-arrivals-title">⏰ Late Arrivals Today</div>
            {dashboard.lateArrivals.length === 0 ? (
              <div className="no-late-message">✓ No late arrivals today</div>
            ) : (
              <div className="late-arrivals-list">
                {dashboard.lateArrivals.map((emp) => (
                  <div key={emp.employeeId} className="late-employee-card">
                    <div className="employee-info">
                      <div className="employee-name">{emp.name}</div>
                      <div className="employee-details">
                        {emp.employeeId} • {emp.department}
                      </div>
                    </div>
                    <div className="check-in-time">
                      {new Date(emp.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
