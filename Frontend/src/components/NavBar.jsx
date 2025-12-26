import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()

  function doLogout(){
    logout()
    nav('/login')
  }

  return (
    <nav className="nav">
      <div style={{flex:1}}>
        <Link to="/">EMS</Link>
      </div>
      {user ? (
        <>
          <Link to="/companies">Companies</Link>
          <Link to="/departments">Departments</Link>
          <Link to="/employees">Employees</Link>
          <Link to="/reports/employees">Employee Report</Link>
          <Link to="/account">My Account</Link>
          <button className="btn" onClick={doLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  )
}
