import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { useApp } from '../../context/AppContext'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Team', path: '/team' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('/')
  const location = useLocation()
  const { isScrolled } = useScrollPosition()
  const { siteSettings } = useApp()

  const logoText = siteSettings?.logo_text || 'AW'
  const logoImage = siteSettings?.logo_image_url || null

  useEffect(() => {
    setActiveSection(location.pathname)
  }, [location])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="relative group flex-shrink-0">
              {logoImage ? (
                <img src={logoImage} alt={logoText} className="h-8 md:h-10 w-auto" />
              ) : (
                <span className="text-xl md:text-2xl font-heading font-bold text-gradient">
                  {logoText}
                </span>
              )}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                    activeSection === link.path
                      ? 'text-primary'
                      : 'text-gray hover:text-white'
                  }`}
                >
                  {link.name}
                  {activeSection === link.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-primary"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}
              <Link
                to="/contact"
                className="ml-3 px-5 py-2 bg-gradient-primary text-background font-semibold rounded-full text-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 whitespace-nowrap"
              >
                Hire Me
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`text-3xl font-heading font-bold transition-colors duration-300 ${
                      activeSection === link.path
                        ? 'text-gradient'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/contact"
                  className="px-8 py-3 bg-gradient-primary text-background font-bold rounded-full text-lg"
                >
                  Hire Me
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
