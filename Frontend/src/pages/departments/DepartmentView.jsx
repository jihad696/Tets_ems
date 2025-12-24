import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function DepartmentView() {
  const { id } = useParams()
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    fetchDepartment()
  }, [id])

  const fetchDepartment = async () => {
    try {
      const res = await api.get(`/departments/${id}/`)
      setDepartment(res.data)
    } catch (err) {
      setError('Failed to load department')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!department) return <p className="error">Department not found</p>

  return (
    <div className="page">
      <h1>{department.name}</h1>
      {error && <p className="error">{error}</p>}
      <div className="details">
        <p><strong>Company:</strong> {department.company_name}</p>
        <p><strong>Description:</strong> {department.description || 'N/A'}</p>
      </div>
      <button className="btn" onClick={() => nav(`/departments/${id}/edit`)}>Edit</button>
      <button className="btn secondary" onClick={() => nav('/departments')}>Back</button>
    </div>
  )
}
