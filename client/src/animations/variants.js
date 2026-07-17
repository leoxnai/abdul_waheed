export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  },
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  },
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  },
}

export const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: 'easeOut' }
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
}

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -8,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
}

export const slideReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: { 
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 1, ease: [0.77, 0, 0.18, 1] }
  },
}

export const textReveal = {
  hidden: { y: 100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  },
}

export const letterReveal = {
  hidden: { y: 50, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export const counterAnimation = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.5, ease: 'easeOut' }
  },
}
