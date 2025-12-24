import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  function doLogout() {
    logout()
    nav('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">EMS</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/companies">Companies</Link>
            <Link to="/departments">Departments</Link>
            <Link to="/employees">Employees</Link>
            <button className="btn btn-logout" onClick={doLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}
