import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function DepartmentEdit() {
  const { id } = useParams()
  const [form, setForm] = useState({
    name: '',
    company: '',
    description: '',
  })
  const [companies, setCompanies] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [deptRes, compRes] = await Promise.all([
        api.get(`/departments/${id}/`),
        api.get('/companies/'),
      ])
      setForm(deptRes.data)
      setCompanies(compRes.data)
    } catch (err) {
      setErrors({ submit: 'Failed to load department' })
    } finally {
      setLoading(false)
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

    setSubmitting(true)
    try {
      await api.put(`/departments/${id}/`, {
        ...form,
        company: parseInt(form.company),
      })
      nav('/departments')
    } catch (err) {
      setErrors({ submit: err.response?.data?.detail || 'Failed to update department' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h1>Edit Department</h1>
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

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Department'}
        </button>
        <button type="button" className="btn secondary" onClick={() => nav('/departments')}>
          Cancel
        </button>
      </form>
    </div>
  )
}