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
    <div className="dashboard-container">
      <h1 className="dashboard-header">Dashboard</h1>
      {error && <p className="error">{error}</p>}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => nav('/companies')}>
          <div className="stat-icon companies"></div>
          <h2>{stats.companies}</h2>
          <p>Companies</p>
          <small>Click to view</small>
        </div>
        <div className="stat-card" onClick={() => nav('/departments')}>
          <div className="stat-icon departments"></div>
          <h2>{stats.departments}</h2>
          <p>Departments</p>
          <small>Click to view</small>
        </div>
        <div className="stat-card" onClick={() => nav('/employees')}>
          <div className="stat-icon employees"></div>
          <h2>{stats.employees}</h2>
          <p>Employees</p>
          <small>Click to view</small>
        </div>
      </div>
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => nav('/companies')}>Manage Companies</button>
          <button className="btn btn-secondary" onClick={() => nav('/employees/create')}>
            Add Employee
          </button>
        </div>
      </div>
    </div>
  )
}