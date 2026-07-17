import { Link, useLocation } from 'react-router-dom'
import {
  FiGrid, FiUser, FiBriefcase, FiFolder, FiLayers, FiCode,
  FiUsers, FiMail, FiSend, FiSettings, FiLink, FiMessageSquare,
  FiSearch, FiLogOut, FiTrendingUp
} from 'react-icons/fi'

const menuItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/hero', icon: FiUser, label: 'Hero' },
  { path: '/admin/about', icon: FiBriefcase, label: 'About' },
  { path: '/admin/services', icon: FiLayers, label: 'Services' },
  { path: '/admin/projects', icon: FiFolder, label: 'Projects' },
  { path: '/admin/categories', icon: FiLayers, label: 'Categories' },
  { path: '/admin/stats', icon: FiTrendingUp, label: 'Stats' },
  { path: '/admin/skills', icon: FiCode, label: 'Skills' },
  { path: '/admin/team', icon: FiUsers, label: 'Team' },
  { path: '/admin/messages', icon: FiMail, label: 'Messages' },
  { path: '/admin/newsletter', icon: FiSend, label: 'Newsletter' },
  { path: '/admin/social-links', icon: FiLink, label: 'Social Links' },
  { path: '/admin/chatbot', icon: FiMessageSquare, label: 'Chatbot' },
  { path: '/admin/seo', icon: FiSearch, label: 'SEO' },
  { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
]

export default function AdminSidebar() {
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin/login'
  }

  const isActive = location.pathname

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-white/5 z-50 flex flex-col">
      {/* Logo — fixed at top */}
      <div className="p-6 flex-shrink-0">
        <Link to="/" className="text-2xl font-heading font-bold text-gradient">AW</Link>
      </div>

      {/* Scrollable nav items — flex-1 fills remaining space */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 scrollbar-thin">
        {menuItems.map((item) => {
          const active = isActive === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full ${
                active
                  ? 'bg-gradient-primary/10 text-primary'
                  : 'text-gray hover:text-white hover:bg-white/5'
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
              <item.icon size={18} className="flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section — always visible, never overlaps */}
      <div className="flex-shrink-0 border-t border-white/5 p-3 space-y-1">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 w-full"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
