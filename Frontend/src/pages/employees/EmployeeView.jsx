import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function EmployeeView() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusLoading, setStatusLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    fetchEmployee()
  }, [id])

  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/employees/${id}/`)
      setEmployee(res.data)
    } catch (err) {
      setError('Failed to load employee')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    const hiredDate = newStatus === 'hired' 
      ? window.prompt('Enter hired date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
      : null

    if (newStatus === 'hired' && !hiredDate) return

    setStatusLoading(true)
    try {
      const res = await api.post(`/employees/${id}/change_status/`, {
        status: newStatus,
        ...(hiredDate && { hired_date: hiredDate })
      })
      setEmployee(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status')
    } finally {
      setStatusLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!employee) return <p className="error">Employee not found</p>

  const getValidTransitions = (status) => {
    const transitions = {
      'application_received': ['interview_scheduled', 'not_accepted'],
      'interview_scheduled': ['hired', 'not_accepted'],
      'hired': [],
      'not_accepted': [],
    }
    return transitions[status] || []
  }

  return (
    <div className="page">
      <h1>{employee.full_name}</h1>
      {error && <p className="error">{error}</p>}
      <div className="details">
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Mobile:</strong> {employee.mobile_number}</p>
        <p><strong>Address:</strong> {employee.address || 'N/A'}</p>
        <p><strong>Designation:</strong> {employee.designation}</p>
        <p><strong>Company:</strong> {employee.company_name}</p>
        <p><strong>Department:</strong> {employee.department_name}</p>
        <p><strong>Status:</strong> <span className={`badge badge-${employee.status}`}>{employee.status.replace('_', ' ').toUpperCase()}</span></p>
        {employee.hired_date && <p><strong>Hired On:</strong> {new Date(employee.hired_date).toLocaleDateString()}</p>}
        {employee.days_employed !== null && <p><strong>Days Employed:</strong> {employee.days_employed}</p>}
      </div>

      {getValidTransitions(employee.status).length > 0 && (
        <div className="workflow-actions" style={{ marginTop: '2rem' }}>
          <p><strong>Update Status:</strong></p>
          {getValidTransitions(employee.status).map((status) => (
            <button
              key={status}
              className="btn"
              onClick={() => handleStatusChange(status)}
              disabled={statusLoading}
              style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
            >
              Mark as {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button className="btn" onClick={() => nav(`/employees/${id}/edit`)}>Edit</button>
        <button className="btn secondary" onClick={() => nav('/employees')} style={{ marginLeft: '0.5rem' }}>Back</button>
      </div>
    </div>
  )
}
