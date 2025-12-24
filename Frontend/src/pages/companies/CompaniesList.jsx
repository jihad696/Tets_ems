import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function CompaniesList() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const res = await api.get('/companies/')
      setCompanies(res.data)
    } catch (err) {
      setError('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  const deleteCompany = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/companies/${id}/`)
        setCompanies(companies.filter((c) => c.id !== id))
      } catch (err) {
        setError('Failed to delete company')
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h1>Companies</h1>
      {error && <p className="error">{error}</p>}
      <button className="btn" onClick={() => nav('/companies/create')}>
        Add Company
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>
                <Link to={`/companies/${c.id}`}>View</Link>
                <Link to={`/companies/${c.id}/edit`}>Edit</Link>
                <button onClick={() => deleteCompany(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
