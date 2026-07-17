import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp, FaRobot } from 'react-icons/fa'
import { HiArrowUp } from 'react-icons/hi'
import { useApp } from '../../context/AppContext'

export default function FloatingButtons() {
  const { siteSettings } = useApp()
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openWhatsApp = () => {
    const waNumber = siteSettings?.whatsapp || '923291966097'
    window.open(`https://wa.me/${waNumber}`, '_blank')
  }

  const toggleChatbot = () => {
    document.getElementById('chatbot-toggle')?.click()
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center space-y-4">
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-card border border-white/10 flex items-center justify-center text-white hover:border-primary hover:text-primary transition-all duration-300 shadow-lg flex-shrink-0"
            aria-label="Scroll to top"
          >
            <HiArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChatbot}
        className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-background shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex-shrink-0"
        aria-label="Open AI Assistant"
      >
        <FaRobot size={18} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openWhatsApp}
        className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
        aria-label="Contact via WhatsApp"
      >
        <FaWhatsapp size={20} />
      </motion.button>
    </div>
  )
}
