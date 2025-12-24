import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CompaniesList from './pages/companies/CompaniesList'
import CompanyView from './pages/companies/CompanyView'
import CompanyCreate from './pages/companies/CompanyCreate'
import CompanyEdit from './pages/companies/CompanyEdit'
import DepartmentsList from './pages/departments/DepartmentsList'
import DepartmentView from './pages/departments/DepartmentView'
import DepartmentCreate from './pages/departments/DepartmentCreate'
import DepartmentEdit from './pages/departments/DepartmentEdit'
import EmployeesList from './pages/employees/EmployeesList'
import EmployeeView from './pages/employees/EmployeeView'
import EmployeeCreate from './pages/employees/EmployeeCreate'
import EmployeeEdit from './pages/employees/EmployeeEdit'
import './styles.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  const { user } = useAuth()

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="/companies" element={<ProtectedRoute><CompaniesList /></ProtectedRoute>} />
        <Route path="/companies/create" element={<ProtectedRoute><CompanyCreate /></ProtectedRoute>} />
        <Route path="/companies/:id" element={<ProtectedRoute><CompanyView /></ProtectedRoute>} />
        <Route path="/companies/:id/edit" element={<ProtectedRoute><CompanyEdit /></ProtectedRoute>} />
        
        <Route path="/departments" element={<ProtectedRoute><DepartmentsList /></ProtectedRoute>} />
        <Route path="/departments/create" element={<ProtectedRoute><DepartmentCreate /></ProtectedRoute>} />
        <Route path="/departments/:id" element={<ProtectedRoute><DepartmentView /></ProtectedRoute>} />
        <Route path="/departments/:id/edit" element={<ProtectedRoute><DepartmentEdit /></ProtectedRoute>} />
        
        <Route path="/employees" element={<ProtectedRoute><EmployeesList /></ProtectedRoute>} />
        <Route path="/employees/create" element={<ProtectedRoute><EmployeeCreate /></ProtectedRoute>} />
        <Route path="/employees/:id" element={<ProtectedRoute><EmployeeView /></ProtectedRoute>} />
        <Route path="/employees/:id/edit" element={<ProtectedRoute><EmployeeEdit /></ProtectedRoute>} />
      </Routes>
    </>
  )
}
