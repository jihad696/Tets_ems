import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState({ companies: 0, departments: 0, employees: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [compRes, deptRes, empRes] = await Promise.all([
        api.get('/companies/'),
        api.get('/departments/'),
        api.get('/employees/'),
      ])
      setStats({
        companies: compRes.data?.length || 0,
        departments: deptRes.data?.length || 0,
        employees: empRes.data?.length || 0,
      })
      setError('')
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError('Failed to load dashboard stats. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {error && <p className="error">{error}</p>}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => nav('/companies')}>
          <h2>{stats.companies}</h2>
          <p>Companies</p>
          <small>Click to view</small>
        </div>
        <div className="stat-card" onClick={() => nav('/departments')}>
          <h2>{stats.departments}</h2>
          <p>Departments</p>
          <small>Click to view</small>
        </div>
        <div className="stat-card" onClick={() => nav('/employees')}>
          <h2>{stats.employees}</h2>
          <p>Employees</p>
          <small>Click to view</small>
        </div>
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: '1rem' }}>Quick Actions:</p>
        <button className="btn" onClick={() => nav('/companies')}>Manage Companies</button>
        <button className="btn" style={{ marginLeft: '1rem' }} onClick={() => nav('/employees/create')}>
          Add Employee
        </button>
      </div>
    </div>
  )
}