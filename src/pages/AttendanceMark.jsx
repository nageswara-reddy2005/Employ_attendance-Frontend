import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import './AttendanceMark.css';
import './PremiumAttendanceMark.css';

const AttendanceMark = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const response = await axiosInstance.get('/attendance/today');
      setTodayAttendance(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setTodayAttendance(null);
      } else {
        setError(err.response?.data?.error || 'Failed to fetch attendance');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setError('');
      setSuccess('');
      setCheckingIn(true);
      const response = await axiosInstance.post('/attendance/checkin');
      setTodayAttendance(response.data.attendance);
      setSuccess('Checked in successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setError('');
      setSuccess('');
      setCheckingOut(true);
      const response = await axiosInstance.post('/attendance/checkout');
      setTodayAttendance(response.data.attendance);
      setSuccess('Checked out successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Check-out failed');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <div className="premium-mark-attendance-container"><p>Loading...</p></div>;

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="premium-mark-attendance-container">
      <div className="premium-mark-attendance-container-inner">
        <div className="premium-mark-attendance-header">
          <h1>📍 Mark Attendance</h1>
          <p>Check in and out to track your working hours</p>
        </div>

        {error && <div className="premium-mark-attendance-error"><span>✗</span><span>{error}</span></div>}
        {success && <div className="premium-mark-attendance-success"><span>✓</span><span>{success}</span></div>}

        {!todayAttendance ? (
          <div className="premium-mark-attendance-hero">
            <div className="premium-mark-attendance-hero-content">
              <div className="premium-mark-attendance-hero-left">
                <h2>Ready to Check In?</h2>
                <div className="date">
                  📅 <span>{currentDate}</span>
                </div>
              </div>
              <div className="premium-mark-attendance-time-display">
                <div className="premium-mark-attendance-current-time">{currentTime}</div>
                <div className="premium-mark-attendance-status">Not Checked In</div>
              </div>
              <div className="premium-mark-attendance-actions">
                <button 
                  className="premium-mark-attendance-btn check-in" 
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                >
                  {checkingIn ? '⏳ Checking In...' : '✓ Check In Now'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="premium-mark-attendance-card">
            <div className="premium-mark-attendance-card-header">
              <h2 className="premium-mark-attendance-card-title">📊 Today's Attendance</h2>
              <span className={`premium-manager-badge premium-manager-badge-${todayAttendance.status.replace('-', '-')}`}>
                {todayAttendance.status.charAt(0).toUpperCase() + todayAttendance.status.slice(1)}
              </span>
            </div>

            <div className="premium-mark-attendance-info-box">
              <div className="premium-mark-attendance-info-label">Check In Time</div>
              <div className="premium-mark-attendance-info-value">
                {new Date(todayAttendance.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {todayAttendance.checkOutTime ? (
              <>
                <div className="premium-mark-attendance-info-box">
                  <div className="premium-mark-attendance-info-label">Check Out Time</div>
                  <div className="premium-mark-attendance-info-value">
                    {new Date(todayAttendance.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="premium-mark-attendance-info-box" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  <div className="premium-mark-attendance-info-label">Total Hours</div>
                  <div className="premium-mark-attendance-info-value" style={{ color: '#10b981' }}>
                    {todayAttendance.totalHours} hrs
                  </div>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '15px', borderRadius: '10px', textAlign: 'center', marginTop: '20px' }}>
                  ✓ You have completed your attendance for today.
                </div>
              </>
            ) : (
              <>
                <div className="premium-mark-attendance-info-box">
                  <div className="premium-mark-attendance-info-label">Time Elapsed</div>
                  <div className="premium-mark-attendance-info-value">
                    {Math.floor((new Date() - new Date(todayAttendance.checkInTime)) / 3600000)} hrs
                  </div>
                </div>
                <button 
                  className="premium-mark-attendance-btn check-out" 
                  onClick={handleCheckOut}
                  disabled={checkingOut}
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  {checkingOut ? '⏳ Checking Out...' : '✗ Check Out Now'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceMark;
