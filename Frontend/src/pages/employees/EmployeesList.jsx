import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function EmployeesList() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    fetchEmployees()
  }, [filterStatus])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const params = filterStatus ? `?status=${filterStatus}` : ''
      const res = await api.get(`/employees/${params}`)
      setEmployees(res.data)
    } catch (err) {
      setError('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/employees/${id}/`)
        setEmployees(employees.filter((e) => e.id !== id))
      } catch (err) {
        setError('Failed to delete employee')
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h1>Employees</h1>
      {error && <p className="error">{error}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn" onClick={() => nav('/employees/create')}>
          Add Employee
        </button>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
        >
          <option value="">All Status</option>
          <option value="application_received">Application Received</option>
          <option value="interview_scheduled">Interview Scheduled</option>
          <option value="hired">Hired</option>
          <option value="not_accepted">Not Accepted</option>
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Company</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.full_name}</td>
              <td>{e.email}</td>
              <td>{e.designation}</td>
              <td>{e.company_name}</td>
              <td>
                <span className={`badge badge-${e.status}`}>
                  {e.status.replace('_', ' ')}
                </span>
              </td>
              <td>
                <Link to={`/employees/${e.id}`}>View</Link>
                <Link to={`/employees/${e.id}/edit`}>Edit</Link>
                <button onClick={() => deleteEmployee(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
