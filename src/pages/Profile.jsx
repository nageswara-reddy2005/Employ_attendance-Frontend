import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setProfile(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h1>My Profile</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {profile && (
        <div className="card">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <strong>Name:</strong> {profile.name}
            </div>
            <div>
              <strong>Email:</strong> {profile.email}
            </div>
            <div>
              <strong>Employee ID:</strong> {profile.employeeId || 'N/A'}
            </div>
            <div>
              <strong>Department:</strong> {profile.department || 'N/A'}
            </div>
            <div>
              <strong>Role:</strong> {profile.role === 'manager' ? 'Manager' : 'Employee'}
            </div>
            <div>
              <strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
