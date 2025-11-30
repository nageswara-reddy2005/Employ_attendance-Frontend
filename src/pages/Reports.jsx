import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import './Reports.css';
import './PremiumManagerPages.css';

const Reports = () => {
  const [filters, setFilters] = useState({ start: '', end: '', employeeId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleShowTable = async () => {
    if (!filters.start || !filters.end) {
      setError('Please select both start and end dates');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const response = await axiosInstance.get('/attendance/all', {
        params: { ...filters, page: 1, limit: 100 }
      });
      setReportData(response.data.attendance);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch report');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!filters.start || !filters.end) {
      setError('Please select both start and end dates');
      return;
    }

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
      link.setAttribute('download', `attendance-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.error || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="premium-manager-pages-container">
      <div className="premium-manager-pages-inner">
        <div className="premium-manager-pages-header">
          <h1>📊 Attendance Reports</h1>
          <p>Generate and export attendance reports for analysis</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>{error}</div>}

        <div className="premium-manager-pages-card">
          <div className="premium-manager-pages-card-header">
            <h3 className="premium-manager-pages-card-title">📋 Generate Report</h3>
          </div>

          <div className="premium-manager-pages-filters">
            <div className="premium-manager-pages-filter-group">
              <label className="premium-manager-pages-filter-label">Start Date</label>
              <input
                type="date"
                className="premium-manager-pages-filter-input"
                name="start"
                value={filters.start}
                onChange={handleFilterChange}
              />
            </div>

            <div className="premium-manager-pages-filter-group">
              <label className="premium-manager-pages-filter-label">End Date</label>
              <input
                type="date"
                className="premium-manager-pages-filter-input"
                name="end"
                value={filters.end}
                onChange={handleFilterChange}
              />
            </div>

            <div className="premium-manager-pages-filter-group">
              <label className="premium-manager-pages-filter-label">Employee ID (Optional)</label>
              <input
                type="text"
                className="premium-manager-pages-filter-input"
                name="employeeId"
                value={filters.employeeId}
                onChange={handleFilterChange}
                placeholder="e.g., EMP001"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', flex: 1 }}
              onClick={handleShowTable}
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : '📋 Show Table'}
            </button>
            <button
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', flex: 1 }}
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? '⏳ Exporting...' : '📥 Export CSV'}
            </button>
          </div>
        </div>

        {/* Report Information */}
        <div className="premium-manager-pages-card">
          <div className="premium-manager-pages-card-header">
            <h3 className="premium-manager-pages-card-title">ℹ️ Report Information</h3>
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
            <p>
              Generate comprehensive attendance reports for a specific date range. Filter by employee ID to get individual reports.
            </p>
            <p><strong>Report includes:</strong></p>
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Employee ID, Name, Email, Department</li>
              <li>Attendance Date</li>
              <li>Check In and Check Out Times</li>
              <li>Attendance Status (Present, Absent, Late, Half-Day)</li>
              <li>Total Hours Worked</li>
            </ul>
            <p style={{ marginTop: '15px' }}><strong>Export Formats:</strong></p>
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>CSV format for easy import to Excel or other tools</li>
              <li>Includes all filtered records</li>
              <li>Ready for analysis and archival</li>
            </ul>
          </div>
        </div>

        {/* Report Results */}
        {reportData && (
          <div className="premium-manager-pages-card">
            <div className="premium-manager-pages-card-header">
              <h3 className="premium-manager-pages-card-title">📋 Report Results</h3>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>{reportData.length} records</span>
            </div>

            {reportData.length > 0 ? (
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
                  {reportData.map((record) => (
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
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '20px' }}>No records found for the selected criteria</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
