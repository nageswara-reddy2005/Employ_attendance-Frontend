import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import './PremiumManagerPages.css';

const TeamCalendar = () => {
  const [summary, setSummary] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/attendance/summary', {
        params: { start: startDate, end: endDate }
      });
      setSummary(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  if (loading) return <div className="premium-manager-pages-container"><p>Loading...</p></div>;

  return (
    <div className="premium-manager-pages-container">
      <div className="premium-manager-pages-inner">
        <div className="premium-manager-pages-header">
          <h1>📅 Team Calendar & Summary</h1>
          <p>View team attendance summary and calendar</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>{error}</div>}

        <div className="premium-manager-pages-card">
          <div className="premium-manager-pages-card-header">
            <h3 className="premium-manager-pages-card-title">📆 Date Range</h3>
          </div>
          <div className="premium-manager-pages-filters">
            <div className="premium-manager-pages-filter-group">
              <label className="premium-manager-pages-filter-label">Start Date</label>
              <input
                type="date"
                className="premium-manager-pages-filter-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="premium-manager-pages-filter-group">
              <label className="premium-manager-pages-filter-label">End Date</label>
              <input
                type="date"
                className="premium-manager-pages-filter-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {summary && (
          <>
            <div className="premium-manager-pages-grid">
              <div className="premium-manager-pages-stat-card">
                <div className="premium-manager-pages-stat-value">{summary.statusSummary.present}</div>
                <div className="premium-manager-pages-stat-label">Total Present</div>
              </div>
              <div className="premium-manager-pages-stat-card">
                <div className="premium-manager-pages-stat-value">{summary.statusSummary.absent}</div>
                <div className="premium-manager-pages-stat-label">Total Absent</div>
              </div>
              <div className="premium-manager-pages-stat-card">
                <div className="premium-manager-pages-stat-value">{summary.statusSummary.late}</div>
                <div className="premium-manager-pages-stat-label">Total Late</div>
              </div>
              <div className="premium-manager-pages-stat-card">
                <div className="premium-manager-pages-stat-value">{summary.statusSummary.halfDay}</div>
                <div className="premium-manager-pages-stat-label">Half Days</div>
              </div>
            </div>

            <div className="premium-manager-pages-card">
              <div className="premium-manager-pages-card-header">
                <h3 className="premium-manager-pages-card-title">🏢 Department Summary</h3>
              </div>
              <table className="premium-manager-pages-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Half Day</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary.departmentSummary).map(([dept, stats]) => (
                    <tr key={dept}>
                      <td>{dept}</td>
                      <td>{stats.present}</td>
                      <td>{stats.absent}</td>
                      <td>{stats.late}</td>
                      <td>{stats.halfDay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamCalendar;
