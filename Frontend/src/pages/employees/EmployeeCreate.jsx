import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { validateEmail, validateMobile } from '../../utils/validators'

export default function EmployeeCreate() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    designation: '',
    company: '',
    department: '',
    hired_date: '',
    status: 'application_received',
  })
  const [companies, setCompanies] = useState([])
  const [departments, setDepartments] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (form.company) {
      fetchDepartments(form.company)
    }
  }, [form.company])

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies/')
      setCompanies(res.data)
    } catch (err) {
      console.error('Failed to load companies')
    }
  }

  const fetchDepartments = async (companyId) => {
    try {
      const res = await api.get(`/departments/?company=${companyId}`)
      setDepartments(res.data)
    } catch (err) {
      console.error('Failed to load departments')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format'
    if (!form.mobile_number.trim()) newErrors.mobile_number = 'Mobile is required'
    else if (!validateMobile(form.mobile_number)) newErrors.mobile_number = 'Invalid mobile format'
    if (!form.designation.trim()) newErrors.designation = 'Designation is required'
    if (!form.company) newErrors.company = 'Company is required'
    if (!form.department) newErrors.department = 'Department is required'
    if (form.status === 'hired' && !form.hired_date) {
        newErrors.hired_date = 'Hire date is required when status is Hired'
    }
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
      await api.post('/employees/', {
        ...form,
        company: parseInt(form.company),
        department: parseInt(form.department),
        hired_date: form.status === 'hired' ? form.hired_date : null,
      })
      nav('/employees')
    } catch (err) {
      console.error('Error:', err.response?.data)
      const backendErrors = err.response?.data
      const customErrors = {}
      if(backendErrors){
          for(const key in backendErrors){
              customErrors[key] = backendErrors[key].join(' ')
          }
      }
      setErrors({ ...newErrors, ...customErrors, submit: customErrors.non_field_errors || 'Failed to create employee' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Create Employee</h1>
      <form onSubmit={handleSubmit} className="form">
        {errors.submit && <p className="error">{errors.submit}</p>}
        
        {/* Form Fields */}
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

        <div className="form-group">
          <label>Mobile *</label>
          <input
            type="tel"
            value={form.mobile_number}
            onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
          />
          {errors.mobile_number && <p className="error-msg">{errors.mobile_number}</p>}
        </div>

        <div className="form-group">
          <label>Designation *</label>
          <input
            type="text"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
          />
          {errors.designation && <p className="error-msg">{errors.designation}</p>}
        </div>

        <div className="form-group">
          <label>Company *</label>
          <select
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value, department: '' })}
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.company && <p className="error-msg">{errors.company}</p>}
        </div>

        <div className="form-group">
          <label>Department *</label>
          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            disabled={!form.company}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {errors.department && <p className="error-msg">{errors.department}</p>}
        </div>

        <div className="form-group">
            <label>Status *</label>
            <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
                <option value="application_received">Application Received</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="hired">Hired</option>
                <option value="not_accepted">Not Accepted</option>
            </select>
            {errors.status && <p className="error-msg">{errors.status}</p>}
        </div>

        {form.status === 'hired' && (
            <div className="form-group">
            <label>Hire Date *</label>
            <input
                type="date"
                value={form.hired_date}
                onChange={(e) => setForm({ ...form, hired_date: e.target.value })}
            />
            {errors.hired_date && <p className="error-msg">{errors.hired_date}</p>}
            </div>
        )}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Employee'}
        </button>
        <button type="button" className="btn secondary" onClick={() => nav('/employees')}>
          Cancel
        </button>
      </form>
    </div>
  )
}
