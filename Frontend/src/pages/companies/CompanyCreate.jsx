import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { validateEmail } from '../../utils/validators'

export default function CompanyCreate() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    website: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Company name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await api.post('/companies/', form)
      nav('/companies')
    } catch (err) {
      setErrors({ submit: err.response?.data?.detail || 'Failed to create company' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Create Company</h1>
      <form onSubmit={handleSubmit} className="form">
        {errors.submit && <p className="error">{errors.submit}</p>}
        
        <div className="form-group">
          <label>Company Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}
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

        <div className="form-group">
          <label>Address *</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          {errors.address && <p className="error-msg">{errors.address}</p>}
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && <p className="error-msg">{errors.phone}</p>}
        </div>

        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Company'}
        </button>
        <button type="button" className="btn secondary" onClick={() => nav('/companies')}>
          Cancel
        </button>
      </form>
    </div>
  )
}