import { Outlet, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AdminSidebar from '../admin/components/Sidebar'
import AdminHeader from '../admin/components/Header'
import Toast from '../components/ui/Toast'

export default function AdminLayout() {
  const [authState, setAuthState] = useState('loading')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    setAuthState(token ? 'authenticated' : 'unauthenticated')
  }, [])

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminHeader />
        <main className="p-6 pt-24">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  )
}
