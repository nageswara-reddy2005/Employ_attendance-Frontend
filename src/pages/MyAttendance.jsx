import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import './MyAttendance.css';
import './PremiumAttendance.css';

const MyAttendance = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'calendar' or 'table'

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/attendance/my-history', {
        params: { month, page, limit: 30 }
      });
      setAttendance(response.data.attendance);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, page]);

  if (loading) return <div className="container"><p>Loading...</p></div>;

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month - 1, 1).getDay();

  const [year, monthNum] = month.split('-');
  const daysInMonth = getDaysInMonth(year, monthNum);
  const firstDay = getFirstDayOfMonth(year, monthNum);

  const attendanceMap = {};
  attendance.forEach(record => {
    attendanceMap[record.date] = record;
  });


  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push(dateStr);
  }

  // Calculate stats
  const stats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    totalHours: attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0),
    attendanceRate: attendance.length > 0 ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100) : 0
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleExportCSV = () => {
    const csv = [
      ['Date', 'Day', 'Check In', 'Check Out', 'Hours', 'Status'],
      ...attendance.map(record => [
        record.date,
        new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }),
        record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-',
        record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-',
        record.totalHours || '-',
        record.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${month}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="attendance-page-container">
      {/* Header */}
      <div className="attendance-header">
        <div className="attendance-header-left">
          <button className="attendance-back-btn" onClick={handleGoBack}>←</button>
          <div className="attendance-header-title">
            <h1>📊 My Attendance History</h1>
            <p>Track and manage your attendance records</p>
          </div>
        </div>
        <div className="attendance-header-actions">
          <button className="attendance-header-btn attendance-btn-print" onClick={handlePrint}>
            🖨️ Print
          </button>
          <button className="attendance-header-btn attendance-btn-export" onClick={handleExportCSV}>
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="attendance-stats-bar">
        <div className="attendance-stat-box">
          <div className="attendance-stat-icon">✅</div>
          <div className="attendance-stat-value">{stats.present}</div>
          <div className="attendance-stat-label">Present Days</div>
        </div>
        <div className="attendance-stat-box">
          <div className="attendance-stat-icon">❌</div>
          <div className="attendance-stat-value">{stats.absent}</div>
          <div className="attendance-stat-label">Absent Days</div>
        </div>
        <div className="attendance-stat-box">
          <div className="attendance-stat-icon">⏰</div>
          <div className="attendance-stat-value">{stats.late}</div>
          <div className="attendance-stat-label">Late Arrivals</div>
        </div>
        <div className="attendance-stat-box">
          <div className="attendance-stat-icon">⏱️</div>
          <div className="attendance-stat-value">{Math.round(stats.totalHours)}h</div>
          <div className="attendance-stat-label">Total Hours</div>
        </div>
        <div className="attendance-stat-box">
          <div className="attendance-stat-icon">📈</div>
          <div className="attendance-stat-value">{stats.attendanceRate}%</div>
          <div className="attendance-stat-label">Attendance Rate</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="attendance-content-grid">
        {/* Table View */}
        <div className="attendance-card">
          <div className="attendance-card-header">
            <h2 className="attendance-card-title">📋 Attendance Records</h2>
            <div className="attendance-view-toggle">
              <button 
                className={`attendance-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Table
              </button>
              <button 
                className={`attendance-view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                Calendar
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="attendance-filters">
            <div className="attendance-filter-group">
              <label className="attendance-filter-label">From Date</label>
              <input type="date" className="attendance-filter-input" defaultValue={month + '-01'} />
            </div>
            <div className="attendance-filter-group">
              <label className="attendance-filter-label">To Date</label>
              <input type="date" className="attendance-filter-input" defaultValue={month + '-30'} />
            </div>
            <div className="attendance-filter-group">
              <label className="attendance-filter-label">Status</label>
              <select className="attendance-filter-input">
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="halfday">Half Day</option>
              </select>
            </div>
            <button className="attendance-filter-btn" onClick={() => fetchAttendance()}>🔍 Filter</button>
          </div>

          {/* Table */}
          {viewMode === 'table' && (
            <div id="tableView">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="attendanceTableBody">
                  {attendance.length > 0 ? (
                    attendance.map((record) => (
                      <tr key={record._id}>
                        <td>{record.date}</td>
                        <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                        <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                        <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                        <td>{record.totalHours ? `${record.totalHours}h` : '-'}</td>
                        <td><span className={`attendance-badge attendance-badge-${record.status}`}>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="attendance-pagination">
                  <button className="attendance-page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button 
                      key={p}
                      className={`attendance-page-btn ${page === p ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button className="attendance-page-btn" onClick={() => setPage(pagination.pages)} disabled={page === pagination.pages}>»</button>
                </div>
              )}
            </div>
          )}

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <div className="attendance-calendar-view">
              <div className="attendance-calendar-header">
                <div className="attendance-month-selector">
                  <button className="attendance-month-nav" onClick={() => {
                    const prevMonth = new Date(year, monthNum - 2);
                    setMonth(`${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`);
                  }}>←</button>
                  <div className="attendance-month-name">{new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                  <button className="attendance-month-nav" onClick={() => {
                    const nextMonth = new Date(year, monthNum);
                    setMonth(`${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`);
                  }}>→</button>
                </div>
              </div>

              <div className="attendance-calendar-grid" id="calendarGrid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="attendance-calendar-day attendance-calendar-header-day">{day}</div>
                ))}
                
                {calendarDays.map((date, idx) => {
                  const record = date ? attendanceMap[date] : null;
                  const day = date ? parseInt(date.split('-')[2]) : null;
                  return (
                    <div 
                      key={idx}
                      className={`attendance-calendar-day ${!date ? 'future' : ''} ${record ? `${record.status}` : 'future'}`}
                      title={record ? `${record.status} - ${record.totalHours || 0}h` : ''}
                    >
                      {day && (
                        <>
                          <div className="attendance-day-number">{day}</div>
                          {record && <div className="attendance-day-hours">{record.totalHours || 0}h</div>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="attendance-calendar-legend">
                <div className="attendance-legend-item">
                  <div className="attendance-legend-color present"></div>
                  <span>Present</span>
                </div>
                <div className="attendance-legend-item">
                  <div className="attendance-legend-color absent"></div>
                  <span>Absent</span>
                </div>
                <div className="attendance-legend-item">
                  <div className="attendance-legend-color late"></div>
                  <span>Late</span>
                </div>
                <div className="attendance-legend-item">
                  <div className="attendance-legend-color halfday"></div>
                  <span>Half Day</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;
