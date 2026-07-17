import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiDownload, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp, FaLinkedin, FaBehance, FaDribbble } from 'react-icons/fa'
import { useMousePosition } from '../../hooks/useMousePosition'
import { useApp } from '../../context/AppContext'

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { normalized } = useMousePosition()
  const { heroData, socialLinks } = useApp()

  const roles = heroData?.typing_titles || ['Graphic Designer', 'Brand Identity Designer', 'UI Designer', 'Motion Designer']
  const badgeText = heroData?.badge_text || 'Available for Freelance Projects'
  const heroName = heroData?.name || 'Abdul Waheed'
  const introParagraph = heroData?.intro_paragraph || 'Crafting premium visual identities and digital experiences that make brands unforgettable.'

  useEffect(() => {
    const currentRole = roles[roleIndex]
    let timeout

    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    } else {
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentRole.slice(0, displayText.length - 1)
            : currentRole.slice(0, displayText.length + 1)
        )
      }, isDeleting ? 50 : 100)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, roleIndex])

  const socialIconMap = {
    whatsapp: FaWhatsapp,
    linkedin: FaLinkedin,
    behance: FaBehance,
    dribbble: FaDribbble,
  }

  return (
    <section className="relative min-h-screen pt-20 md:pt-24 flex items-center overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 animated-grid opacity-50" />

      {/* Gradient Orbs */}
      <div
        className="blob blob-1"
        style={{
          transform: `translate(${(normalized.x - 0.5) * 30}px, ${(normalized.y - 0.5) * 30}px)`,
        }}
      />
      <div
        className="blob blob-2"
        style={{
          transform: `translate(${(normalized.x - 0.5) * -30}px, ${(normalized.y - 0.5) * -30}px)`,
        }}
      />

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-10 w-20 h-20 border border-primary/20 rounded-full"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-40 right-10 w-32 h-32 border border-primary/10 rounded-full"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                {badgeText}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-tight"
            >
              {heroName.split(' ')[0]}
              <br />
              <span className="text-gradient glow-text">{heroName.split(' ').slice(1).join(' ') || heroName}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl sm:text-3xl font-animation text-gray">I'm a</span>
              <span className="text-2xl sm:text-3xl font-animation text-gradient font-bold">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-gray text-lg max-w-lg leading-relaxed"
            >
              {introParagraph}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/contact"
                className="group relative px-8 py-4 bg-gradient-primary text-background font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Hire Me</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/projects"
                className="px-8 py-4 border border-white/10 rounded-full text-white font-semibold hover:bg-white/5 transition-all duration-300 flex items-center space-x-2"
              >
                <span>View Portfolio</span>
              </Link>
              {heroData?.resume_url && (
                <a
                  href={heroData.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border border-white/10 rounded-full text-gray hover:text-white font-semibold hover:border-white/30 transition-all duration-300 flex items-center space-x-2"
                >
                  <FiDownload />
                  <span>Resume</span>
                </a>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center space-x-4"
            >
              <span className="text-gray text-sm">Follow me:</span>
              <div className="flex space-x-3">
                {(socialLinks?.length > 0 ? socialLinks : []).map((link) => {
                  const Icon = socialIconMap[link.platform] || FiArrowRight
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray hover:bg-primary hover:text-background transition-all duration-300"
                    >
                      <Icon size={16} />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Right - Photo/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-96 h-96">
              {/* Decorative rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 border border-primary/10 rounded-full"
              />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
              <div className="absolute inset-12 rounded-full bg-card border border-white/10 flex items-center justify-center overflow-hidden">
                {heroData?.photo_url ? (
                  <img
                    src={heroData.photo_url}
                    alt="Abdul Waheed"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-8xl font-heading font-bold text-gradient">AW</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2"
      >
        <span className="text-gray text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  )
}
