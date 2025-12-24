import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function DepartmentCreate() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    description: '',
  })
  const [companies, setCompanies] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies/')
      setCompanies(res.data)
    } catch (err) {
      console.error('Failed to load companies')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Department name is required'
    if (!form.company) newErrors.company = 'Company is required'
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
      await api.post('/departments/', {
        ...form,
        company: parseInt(form.company),
      })
      nav('/departments')
    } catch (err) {
      setErrors({ submit: err.response?.data?.detail || 'Failed to create department' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Create Department</h1>
      <form onSubmit={handleSubmit} className="form">
        {errors.submit && <p className="error">{errors.submit}</p>}
        
        <div className="form-group">
          <label>Department Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Company *</label>
          <select
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.company && <p className="error-msg">{errors.company}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ minHeight: '100px' }}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Department'}
        </button>
        <button type="button" className="btn secondary" onClick={() => nav('/departments')}>
          Cancel
        </button>
      </form>
    </div>
  )
}