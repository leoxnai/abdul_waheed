import { useLocation } from 'react-router-dom'
import { useScrollPosition } from '../../hooks/useScrollPosition'

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/hero': 'Hero Section',
  '/admin/about': 'About Section',
  '/admin/services': 'Services',
  '/admin/projects': 'Projects',
  '/admin/categories': 'Categories',
  '/admin/skills': 'Skills',
  '/admin/team': 'Team',
  '/admin/messages': 'Messages',
  '/admin/newsletter': 'Newsletter',
  '/admin/social-links': 'Social Links',
  '/admin/chatbot': 'Chatbot',
  '/admin/seo': 'SEO',
  '/admin/settings': 'Settings',
}

export default function AdminHeader() {
  const location = useLocation()
  const { isScrolled } = useScrollPosition()
  const pageTitle = pageTitles[location.pathname] || 'Admin Panel'

  return (
    <header
      className={`fixed top-0 right-0 left-64 z-40 h-16 flex items-center justify-between px-6 transition-all duration-300 ${
        isScrolled ? 'bg-background border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div>
        <nav className="flex items-center space-x-2 text-sm text-gray mb-0.5">
          <span>Admin</span>
          <span>/</span>
          <span className="text-white">{pageTitle}</span>
        </nav>
      </div>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-xl hover:bg-primary/20 transition-all duration-300"
      >
        View Site
      </a>
    </header>
  )
}
