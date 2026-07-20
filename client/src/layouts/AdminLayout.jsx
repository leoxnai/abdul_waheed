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
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#FFF8F2_0%,#FFF2E8_100%)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen flex bg-[linear-gradient(135deg,#FFF8F2_0%,#FFF2E8_100%)]">
      <AdminSidebar />
      <div className="ml-64 flex-1">
        <AdminHeader />
        <main className="p-6 pt-24">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  )
}
