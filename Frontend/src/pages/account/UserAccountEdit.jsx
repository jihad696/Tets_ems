import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function UserAccountEdit() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.patch(`/auth/user/`, form);
      setUser(res.data);
      nav('/account');
    } catch (err) {
      console.error('Error:', err.response?.data);
      setErrors({ submit: err.response?.data?.detail || 'Failed to update account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Edit Account</h1>
      <form onSubmit={handleSubmit} className="form">
        {errors.submit && <p className="error">{errors.submit}</p>}

        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
          {errors.first_name && <p className="error-msg">{errors.first_name}</p>}
        </div>

        <div className="form-group">
          <label>Last Name *</label>
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
          {errors.last_name && <p className="error-msg">{errors.last_name}</p>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="error-msg">{errors.email}</p>}
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Account'}
        </button>
        <button type="button" className="btn secondary" onClick={() => nav('/account')}>
          Cancel
        </button>
      </form>
    </div>
  );
}
