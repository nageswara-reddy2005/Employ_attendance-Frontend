import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import './AllAttendance.css';
import './PremiumManagerPages.css';

const AllAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({ employeeId: '', date: '', status: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/attendance/all', {
        params: { ...filters, page, limit: 30 }
      });
      setAttendance(response.data.attendance);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ employeeId: '', date: '', status: '' });
    setPage(1);
  };

  const handleExport = async () => {
    try {
      setError('');
      setExporting(true);
      const response = await axiosInstance.get('/attendance/export', {
        params: filters,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.error || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="premium-manager-pages-container"><p>Loading...</p></div>;

  return (
    <div className="premium-manager-pages-container">
      <div className="premium-manager-pages-inner">
        <div className="premium-manager-pages-header">
          <h1>📊 All Attendance Records</h1>
          <p>View and manage employee attendance data</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>{error}</div>}

        {/* Filters Section */}
        <div className="premium-manager-pages-card">
          <div className="premium-manager-pages-card-header">
            <h3 className="premium-manager-pages-card-title">🔍 Filters</h3>
          </div>
          <div className="premium-manager-pages-filters">
            <div className="premium-manager-pages-filter-group">
              <label className="premium-manager-pages-filter-label">Employee ID</label>
              <input
                type="text"
                className="premium-manager-pages-filter-input"
                name="employeeId"
                value={filters.employeeId}
                onChange={handleFilterChange}
                placeholder="e.g., EMP001"
              />
            </div>
            <div className="premium-manager-pages-filter-group">
              <label className="premium-manager-pages-filter-label">Date</label>
              <input
                type="date"
                className="premium-manager-pages-filter-input"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>
            <div className="premium-manager-pages-filter-group">
              <label className="premium-manager-pages-filter-label">Status</label>
              <select 
                className="premium-manager-pages-filter-input"
                name="status" 
                value={filters.status} 
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button 
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', flex: 1 }}
              onClick={() => setPage(1)}
            >
              🔍 Apply Filters
          </button>
          <button className="btn-reset" onClick={handleResetFilters}>
            ↻ Reset
          </button>
          <button className="btn-export" onClick={handleExport} disabled={exporting}>
            {exporting ? '⏳ Exporting...' : '📥 Export CSV'}
          </button>
        </div>
      </div>

      {/* Attendance Table Section */}
      <div className="attendance-table-section">
        <div className="table-header">
          <h3>Attendance Records</h3>
          <div className="record-count">
            {pagination ? `${pagination.total} total records` : 'Loading...'}
          </div>
        </div>

        <div className="table-container">
          <table className="premium-manager-pages-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance.map((record) => (
                  <tr key={record._id}>
                    <td><strong>{record.userId.employeeId}</strong></td>
                    <td>{record.userId.name}</td>
                    <td>{record.userId.department}</td>
                    <td>{record.date}</td>
                    <td><span className={`premium-manager-pages-badge premium-manager-pages-badge-${record.status.replace('-', '-')}`}>{record.status}</span></td>
                    <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td>{record.totalHours ? `${record.totalHours}h` : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="premium-manager-pages-pagination">
            <button onClick={() => setPage(1)} disabled={page === 1}>First</button>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>← Prev</button>
            <span>Page {page} of {pagination.pages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === pagination.pages}>Next →</button>
            <button onClick={() => setPage(pagination.pages)} disabled={page === pagination.pages}>Last</button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AllAttendance;
