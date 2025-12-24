import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function DepartmentsList() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const res = await api.get('/departments/')
      setDepartments(res.data)
    } catch (err) {
      setError('Failed to load departments')
    } finally {
      setLoading(false)
    }
  }

  const deleteDepartment = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/departments/${id}/`)
        setDepartments(departments.filter((d) => d.id !== id))
      } catch (err) {
        setError('Failed to delete department')
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h1>Departments</h1>
      {error && <p className="error">{error}</p>}
      <button className="btn" onClick={() => nav('/departments/create')}>
        Add Department
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.company_name}</td>
              <td>
                <Link to={`/departments/${d.id}`}>View</Link>
                <Link to={`/departments/${d.id}/edit`}>Edit</Link>
                <button onClick={() => deleteDepartment(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
