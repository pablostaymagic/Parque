import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import LogisticsLogin from './pages/LogisticsLogin'
import LogisticsForm from './pages/LogisticsForm'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Admin Routes - Hidden from public navigation */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Logistics Routes - Separate access system */}
        <Route path="/logistica" element={<LogisticsLogin />} />
        <Route path="/logistica/form" element={<LogisticsForm />} />
      </Routes>
    </Router>
  )
}

export default App
