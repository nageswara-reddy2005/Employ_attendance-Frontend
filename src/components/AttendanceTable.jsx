import React from 'react';
import { formatTime, formatDate, getStatusBadgeClass } from '../utils/format';
import './AttendanceTable.css';

/**
 * Generic Attendance Table Component
 * Renders attendance records in a table format
 * 
 * @param {Array} data - Array of attendance records
 * @param {Boolean} showEmployeeId - Show employee ID column (for managers)
 * @param {Boolean} loading - Loading state
 * @param {String} emptyMessage - Message to show when no data
 */
const AttendanceTable = ({ 
  data = [], 
  showEmployeeId = false, 
  loading = false,
  emptyMessage = 'No attendance records found'
}) => {
  if (loading) {
    return (
      <div className="attendance-table-container">
        <div className="table-loading">Loading attendance data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="attendance-table-container">
        <div className="table-empty">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="attendance-table-container">
      <table className="attendance-table">
        <thead>
          <tr>
            {showEmployeeId && <th>Employee ID</th>}
            <th>Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record._id} className={`status-${record.status}`}>
              {showEmployeeId && (
                <td className="employee-id">
                  <strong>{record.userId?.employeeId || '-'}</strong>
                </td>
              )}
              <td className="date">{formatDate(record.date)}</td>
              <td className="status">
                <span className={`badge ${getStatusBadgeClass(record.status)}`}>
                  {record.status}
                </span>
              </td>
              <td className="check-in">
                {formatTime(record.checkInTime)}
              </td>
              <td className="check-out">
                {formatTime(record.checkOutTime)}
              </td>
              <td className="hours">
                {record.totalHours ? `${record.totalHours}h` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
