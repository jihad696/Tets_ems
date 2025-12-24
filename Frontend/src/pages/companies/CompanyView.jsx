import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function CompanyView() {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    fetchCompany()
  }, [id])

  const fetchCompany = async () => {
    try {
      const res = await api.get(`/companies/${id}/`)
      setCompany(res.data)
    } catch (err) {
      setError('Failed to load company')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!company) return <p className="error">Company not found</p>

  return (
    <div className="page">
      <h1>{company.name}</h1>
      {error && <p className="error">{error}</p>}
      <div className="details">
        <p><strong>Email:</strong> {company.email}</p>
        <p><strong>Address:</strong> {company.address}</p>
        <p><strong>Phone:</strong> {company.phone}</p>
        <p><strong>Website:</strong> {company.website || 'N/A'}</p>
      </div>
      <button className="btn" onClick={() => nav(`/companies/${id}/edit`)}>Edit</button>
      <button className="btn secondary" onClick={() => nav('/companies')}>Back</button>
    </div>
  )
}
