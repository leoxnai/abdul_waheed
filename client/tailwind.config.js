/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00E676',
        'primary-dark': '#00C853',
        secondary: '#101010',
        background: '#050505',
        card: '#111111',
        'text-white': '#FFFFFF',
        gray: '#A0A0A0',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        animation: ['Satoshi', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00E676, #00C853)',
        'gradient-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 230, 118, 0.1), transparent)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'scroll-indicator': 'scrollIndicator 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 230, 118, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 230, 118, 0.6)' },
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
