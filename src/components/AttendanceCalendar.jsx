import React, { useState } from 'react';
import { getStatusColor } from '../utils/format';
import './AttendanceCalendar.css';

/**
 * Attendance Calendar Component
 * Displays a calendar with color-coded attendance status
 * 
 * @param {String} month - Month in YYYY-MM format
 * @param {Function} onMonthChange - Callback when month changes
 * @param {Object} attendanceMap - Map of date -> attendance record
 * @param {Function} onDateClick - Callback when date is clicked
 */
const AttendanceCalendar = ({ 
  month, 
  onMonthChange, 
  attendanceMap = {}, 
  onDateClick 
}) => {
  const [hoveredDate, setHoveredDate] = useState(null);

  const getDaysInMonth = (year, monthNum) => new Date(year, monthNum, 0).getDate();
  const getFirstDayOfMonth = (year, monthNum) => new Date(year, monthNum - 1, 1).getDay();

  const [year, monthNum] = month.split('-');
  const daysInMonth = getDaysInMonth(year, monthNum);
  const firstDay = getFirstDayOfMonth(year, monthNum);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#27ae60';
      case 'absent':
        return '#e74c3c';
      case 'late':
        return '#f39c12';
      case 'half-day':
        return '#e67e22';
      default:
        return '#ecf0f1';
    }
  };

  const handlePrevMonth = () => {
    const [y, m] = month.split('-');
    let prevMonth = parseInt(m) - 1;
    let prevYear = parseInt(y);
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    onMonthChange(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [y, m] = month.split('-');
    let nextMonth = parseInt(m) + 1;
    let nextYear = parseInt(y);
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    onMonthChange(`${nextYear}-${String(nextMonth).padStart(2, '0')}`);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push(dateStr);
  }

  const monthName = new Date(year, monthNum - 1).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="attendance-calendar">
      <div className="calendar-header">
        <button className="nav-btn" onClick={handlePrevMonth}>←</button>
        <h3>{monthName}</h3>
        <button className="nav-btn" onClick={handleNextMonth}>→</button>
      </div>

      <div className="weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((date, idx) => {
          const record = date ? attendanceMap[date] : null;
          const day = date ? parseInt(date.split('-')[2]) : null;
          const isHovered = hoveredDate === date;

          return (
            <div
              key={idx}
              className={`calendar-day ${!date ? 'empty' : ''} ${isHovered ? 'hovered' : ''}`}
              style={record ? { backgroundColor: getStatusColor(record.status) } : {}}
              onClick={() => date && onDateClick && onDateClick(date)}
              onMouseEnter={() => date && setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
              title={record ? `${date}: ${record.status}` : ''}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  {record && (
                    <div className="day-status-indicator" title={record.status}>
                      {record.status.charAt(0).toUpperCase()}
                    </div>
                  )}
                </>
              )}
              {isHovered && record && (
                <div className="tooltip">
                  <div className="tooltip-date">{date}</div>
                  <div className="tooltip-status">{record.status}</div>
                  {record.checkInTime && (
                    <div className="tooltip-time">
                      In: {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                  {record.checkOutTime && (
                    <div className="tooltip-time">
                      Out: {new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#27ae60' }}></span>
          <span>Present</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#e74c3c' }}></span>
          <span>Absent</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#f39c12' }}></span>
          <span>Late</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#e67e22' }}></span>
          <span>Half-Day</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
