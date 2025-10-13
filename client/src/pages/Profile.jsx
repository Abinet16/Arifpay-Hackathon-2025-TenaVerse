import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          {/* Add more profile information */}
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
}

export default Profile;