import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import Login from './pages/Login'
import Register from './pages/Register'
import PublicInvoicePay from './pages/PublicInvoicePay'
import Dashboard from './pages/Dashboard'
import Business from './pages/Business'
import Settings from './pages/Settings'
import InvoiceList from './pages/invoices/InvoiceList'
import InvoiceCreate from './pages/invoices/InvoiceCreate'
import InvoiceDetail from './pages/invoices/InvoiceDetail'
import AdvanceList from './pages/advances/AdvanceList'
import AdminDashboard from './pages/admin/AdminDashboard'
import KycReview from './pages/admin/KycReview'
import { useAuth } from './context/AuthContext'

export default function App() {
  return (
    <Routes>
      {/* Public, unauthenticated */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pay/:token" element={<PublicInvoicePay />} />

      {/* SME-owner app */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<RoleHome />} />
        <Route path="/business" element={<Business />} />
        <Route path="/business/setup" element={<Business />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/new" element={<InvoiceCreate />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/advances" element={<AdvanceList />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kyc"
          element={
            <ProtectedRoute requireRole="ADMIN">
              <KycReview />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

 
function RoleHome() {
  const { user } = useAuth()
  return user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Dashboard />
}
