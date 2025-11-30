import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axios';
import './MyProfile.css';

const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formChanged, setFormChanged] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '+1 234 567 8900',
    dateOfBirth: user?.dateOfBirth || '1995-05-15',
    gender: user?.gender || 'Male',
    address: user?.address || '123 Tech Street, Innovation City, CA 94043',
    department: user?.department || 'Engineering',
    position: user?.position || 'Senior Developer',
    workLocation: user?.workLocation || 'San Francisco Office',
    emailNotifications: true,
    smsNotifications: false,
    attendanceReminders: true,
    weeklyReports: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormChanged(true);
  };

  const toggleSwitch = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setFormChanged(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.put('/user/profile', {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        department: formData.department
      });

      console.log('Profile update response:', response.data);
      setSuccessMessage('Profile updated successfully!');
      setFormChanged(false);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMsg = error.response?.data?.error || 'Error saving profile. Please try again.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (formChanged) {
      if (window.confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="profile-page-container">
      {successMessage && (
        <div className="profile-success-message">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-left">
          <button className="profile-back-btn" onClick={handleGoBack}>←</button>
          <div className="profile-header-title">
            <h1>My Profile</h1>
            <p>Update your personal information</p>
          </div>
        </div>
        <button 
          className="profile-save-btn" 
          onClick={handleSaveProfile}
          disabled={loading}
        >
          💾 {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Profile Grid */}
      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">{userInitials}</div>
              <label className="profile-avatar-upload">
                📷
                <input type="file" accept="image/*" onChange={(e) => {
                  if (e.target.files[0]) {
                    alert('Avatar upload feature coming soon!');
                  }
                }} />
              </label>
            </div>
            <div className="profile-name">{user?.name || 'User'}</div>
            <div className="profile-role">{user?.position || 'Employee'} • {user?.employeeId || 'N/A'}</div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat-box">
              <div className="profile-stat-value">95%</div>
              <div className="profile-stat-label">Attendance</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-value">2.5y</div>
              <div className="profile-stat-label">Experience</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-value">176h</div>
              <div className="profile-stat-label">This Month</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-value">22</div>
              <div className="profile-stat-label">Present Days</div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="profile-action-button" onClick={() => alert('Change password feature coming soon!')}>
              🔒 Change Password
            </button>
            <button className="profile-action-button" onClick={() => alert('Download data feature coming soon!')}>
              📥 Download My Data
            </button>
            <button className="profile-action-button" onClick={() => alert('Activity log feature coming soon!')}>
              📊 Activity Log
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div>
          <div className="profile-card profile-form-section">
            <h2 className="profile-section-title">👤 Personal Information</h2>
            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label className="profile-form-label">First Name <span className="profile-required">*</span></label>
                <input 
                  type="text" 
                  className="profile-form-input" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Last Name <span className="profile-required">*</span></label>
                <input 
                  type="text" 
                  className="profile-form-input" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Email Address <span className="profile-required">*</span></label>
                <input 
                  type="email" 
                  className="profile-form-input" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="profile-form-input" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Date of Birth</label>
                <input 
                  type="date" 
                  className="profile-form-input" 
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Gender</label>
                <select 
                  className="profile-form-input" 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
              <div className="profile-form-group profile-form-group-full">
                <label className="profile-form-label">Address</label>
                <textarea 
                  className="profile-form-input" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                />
              </div>
            </div>

            <h2 className="profile-section-title">💼 Work Information</h2>
            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label className="profile-form-label">Employee ID</label>
                <input 
                  type="text" 
                  className="profile-form-input" 
                  value={user?.employeeId || 'N/A'}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Department</label>
                <select 
                  className="profile-form-input" 
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option>Engineering</option>
                  <option>Human Resources</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>Finance</option>
                </select>
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Position</label>
                <input 
                  type="text" 
                  className="profile-form-input" 
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Work Location</label>
                <select 
                  className="profile-form-input" 
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleInputChange}
                >
                  <option>San Francisco Office</option>
                  <option>New York Office</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>

            <h2 className="profile-section-title">🔔 Notification Preferences</h2>
            <div className="profile-toggle-group">
              <span className="profile-toggle-label">Email Notifications</span>
              <div 
                className={`profile-toggle-switch ${formData.emailNotifications ? 'active' : ''}`}
                onClick={() => toggleSwitch('emailNotifications')}
              >
                <div className="profile-toggle-slider"></div>
              </div>
            </div>
            <div className="profile-toggle-group">
              <span className="profile-toggle-label">SMS Notifications</span>
              <div 
                className={`profile-toggle-switch ${formData.smsNotifications ? 'active' : ''}`}
                onClick={() => toggleSwitch('smsNotifications')}
              >
                <div className="profile-toggle-slider"></div>
              </div>
            </div>
            <div className="profile-toggle-group">
              <span className="profile-toggle-label">Attendance Reminders</span>
              <div 
                className={`profile-toggle-switch ${formData.attendanceReminders ? 'active' : ''}`}
                onClick={() => toggleSwitch('attendanceReminders')}
              >
                <div className="profile-toggle-slider"></div>
              </div>
            </div>
            <div className="profile-toggle-group">
              <span className="profile-toggle-label">Weekly Reports</span>
              <div 
                className={`profile-toggle-switch ${formData.weeklyReports ? 'active' : ''}`}
                onClick={() => toggleSwitch('weeklyReports')}
              >
                <div className="profile-toggle-slider"></div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="profile-danger-zone">
              <h3>⚠️ Danger Zone</h3>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <button 
                className="profile-danger-btn" 
                onClick={() => {
                  if (window.confirm('Are you absolutely sure? This action cannot be undone!')) {
                    if (window.confirm('This will permanently delete all your data. Continue?')) {
                      alert('Account deletion initiated. You will receive a confirmation email.');
                    }
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
