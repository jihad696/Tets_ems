import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { validateEmail, validateMobile } from '../../utils/validators'

export default function EmployeeEdit() {
  const { id } = useParams()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    address: '',
    designation: '',
    company: '',
    department: '',
    hired_date: '',
  })
  const [companies, setCompanies] = useState([])
  const [departments, setDepartments] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    if (form.company) {
      fetchDepartments(form.company)
    }
  }, [form.company])

  const fetchData = async () => {
    try {
      const [empRes, compRes] = await Promise.all([
        api.get(`/employees/${id}/`),
        api.get('/companies/'),
      ])
      const employee = empRes.data
      setForm({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        mobile_number: employee.mobile_number,
        address: employee.address,
        designation: employee.designation,
        company: employee.company,
        department: employee.department,
        hired_date: employee.hired_date || '',
      })
      setCompanies(compRes.data)
      if (employee.company) {
        fetchDepartments(employee.company)
      }
    } catch (err) {
      setErrors({ submit: 'Failed to load employee' })
    } finally {
      setLoading(false)
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
      await api.put(`/employees/${id}/`, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        mobile_number: form.mobile_number,
        address: form.address,
        designation: form.designation,
        company: parseInt(form.company),
        department: parseInt(form.department),
        hired_date: form.hired_date || null,
      })
      nav('/employees')
    } catch (err) {
      setErrors({ submit: err.response?.data?.detail || 'Failed to update employee' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h1>Edit Employee</h1>
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
          <label>Address</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            style={{ minHeight: '80px' }}
          />
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

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Employee'}
        </button>
        <button type="button" className="btn secondary" onClick={() => nav('/employees')}>
          Cancel
        </button>
      </form>
    </div>
  )
}
