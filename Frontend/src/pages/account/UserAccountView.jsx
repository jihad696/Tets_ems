import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function UserAccountView() {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="page">
      <h1>My Account</h1>
      <div className="card">
        <p><strong>First Name:</strong> {user.first_name}</p>
        <p><strong>Last Name:</strong> {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <Link to="/account/edit" className="btn">Edit Account</Link>
      </div>
    </div>
  );
}
