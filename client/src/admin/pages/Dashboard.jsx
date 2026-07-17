import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiFolder, FiMessageSquare, FiEye, FiTrendingUp, FiMail } from 'react-icons/fi'
import { adminSupabase as supabase } from '../../services/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    messages: 0,
    subscribers: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [projectsRes, servicesRes, messagesRes, newsletterRes] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter').select('*', { count: 'exact', head: true }),
    ])
    setStats({
      projects: projectsRes.count || 0,
      services: servicesRes.count || 0,
      messages: messagesRes.count || 0,
      subscribers: newsletterRes.count || 0,
    })
  }

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: FiFolder, color: 'from-blue-500 to-cyan-500' },
    { label: 'Services', value: stats.services, icon: FiTrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Messages', value: stats.messages, icon: FiMessageSquare, color: 'from-purple-500 to-pink-500' },
    { label: 'Subscribers', value: stats.subscribers, icon: FiMail, color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-8">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="text-white" size={20} />
              </div>
            </div>
            <p className="text-3xl font-heading font-bold">{card.value}</p>
            <p className="text-gray text-sm mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Project', href: '/admin/projects' },
              { label: 'Add Service', href: '/admin/services' },
              { label: 'View Messages', href: '/admin/messages' },
              { label: 'Edit Hero', href: '/admin/hero' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="px-4 py-3 rounded-xl bg-white/5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-300 text-center"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-bold mb-4">Recent Activity</h3>
          <p className="text-gray text-sm">No recent activity to show.</p>
        </div>
      </div>
    </div>
  )
}
