import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../services/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data?.session) {
        localStorage.setItem('admin_token', data.session.access_token)
        navigate('/admin')
      } else {
        throw new Error('Login failed')
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-gradient">AW</h1>
          <h2 className="text-2xl font-heading font-bold mt-4">Admin Login</h2>
          <p className="text-gray text-sm mt-2">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray/50"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray/50"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-primary text-background font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
