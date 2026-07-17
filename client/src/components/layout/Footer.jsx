import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowUp } from 'react-icons/hi'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { FaWhatsapp, FaLinkedin, FaBehance, FaDribbble, FaTwitter, FaInstagram, FaFacebook, FaGithub, FaYoutube } from 'react-icons/fa'
import { useApp } from '../../context/AppContext'
import { adminAPI } from '../../services/api'

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Team', path: '/team' },
  { name: 'Contact', path: '/contact' },
]

const socialIconMap = {
  whatsapp: FaWhatsapp,
  linkedin: FaLinkedin,
  behance: FaBehance,
  dribbble: FaDribbble,
  twitter: FaTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
  github: FaGithub,
  youtube: FaYoutube,
}

export default function Footer() {
  const { siteSettings, socialLinks } = useApp()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await adminAPI.subscribe(email)
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus(''), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-card border-t border-white/5 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand — bio text from settings */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-heading font-bold text-gradient">
              AW
            </Link>
            <p className="text-gray text-sm leading-relaxed">
              {siteSettings?.site_description || 'Creating premium visual experiences that elevate brands and leave lasting impressions.'}
            </p>
            <div className="flex space-x-3">
              {(socialLinks || []).filter(s => s.active !== false).map((link) => {
                const Icon = socialIconMap[link.platform] || FiMail
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray hover:bg-primary hover:text-background transition-all duration-300"
                    title={link.platform}
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — values from siteSettings */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray">
                <FiMail className="mt-0.5 text-primary flex-shrink-0" size={16} />
                <span>{siteSettings?.contact_email || 'abdulwaheedgraphics097@gmail.com'}</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray">
                <FiPhone className="mt-0.5 text-primary flex-shrink-0" size={16} />
                <span>{siteSettings?.phone || '+92 329 1966097'}</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray">
                <FiMapPin className="mt-0.5 text-primary flex-shrink-0" size={16} />
                <span>{siteSettings?.address || 'Lahore, Pakistan'}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Newsletter</h3>
            <p className="text-gray text-sm mb-4">
              Subscribe for design insights and updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray/50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-4 py-3 bg-gradient-primary text-background font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {status === 'success' && (
                <p className="text-primary text-xs">Subscribed successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-xs">Something went wrong.</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray text-sm">
            {siteSettings?.copyright_text || `© ${new Date().getFullYear()} ${siteSettings?.site_name || 'Abdul Waheed'}. All rights reserved.`}
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center space-x-2 text-gray hover:text-primary transition-colors duration-300"
          >
            <span className="text-sm">Back to top</span>
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <HiArrowUp />
            </motion.span>
          </button>
        </div>

        {/* Developer Credit */}
        <div className="mt-4 pt-4 border-t border-white/[0.03] flex items-center justify-center">
          <p className="text-xs text-gray/40 hover:text-gray/60 transition-colors duration-300 text-center">
            Crafted with precision by <a href="https://anssol.com" target="_blank" rel="noopener noreferrer" className="text-gray/50 hover:text-primary transition-colors">anssol.com</a> — Developer{' '}
            <a href="https://wa.me/923102850365" target="_blank" rel="noopener noreferrer" className="text-gray/50 hover:text-primary transition-colors">Ali Hassan</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
