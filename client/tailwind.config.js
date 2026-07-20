/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F47A20',
        'primary-dark': '#DB5F0D',
        secondary: '#FFF2E8',
        background: '#FFF8F2',
        card: '#FFFFFF',
        'text-dark': '#1F1F1F',
        gray: '#6B7280',
      },
      fontFamily: {
        heading: ['Manrope', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        animation: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #F47A20 0%, #FF9A3D 100%)',
        'gradient-soft': 'radial-gradient(circle at top left, rgba(244, 122, 32, 0.16), transparent 40%), radial-gradient(circle at bottom right, rgba(255, 154, 61, 0.12), transparent 40%)',
        mesh: 'linear-gradient(135deg, rgba(244, 122, 32, 0.08) 0%, rgba(255, 255, 255, 0.95) 55%, rgba(255, 242, 232, 0.95) 100%)',
      },
      boxShadow: {
        premium: '0 30px 70px -24px rgba(244, 122, 32, 0.28)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'scroll-indicator': 'scrollIndicator 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scrollIndicator: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(20px)' },
        },
      },
    },
  },
  plugins: [],
}
