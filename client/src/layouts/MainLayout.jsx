import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingButtons from '../components/layout/FloatingButtons'
import CursorEffect from '../components/ui/CursorEffect'
import LoadingScreen from '../components/ui/LoadingScreen'
import Chatbot from '../components/chatbot/Chatbot'
import { useApp } from '../context/AppContext'

export default function MainLayout() {
  const { loading } = useApp()

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-background text-white">
      <CursorEffect />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
      <Chatbot />
    </div>
  )
}
