import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import DataTable from '../components/DataTable'
import { showToast } from '../../components/ui/Toast'

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    supabase.from('newsletter').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setSubscribers(data)
    })
  }, [])

  const handleDelete = async (item) => {
    if (!confirm('Delete this subscriber?')) return
    try {
      const { error } = await supabase.from('newsletter').delete().eq('id', item.id)
      if (error) throw error
      setSubscribers(subscribers.filter((s) => s.id !== item.id))
      showToast('Subscriber deleted!')
    } catch (err) {
      console.error('Error deleting subscriber:', err)
      showToast('Error deleting subscriber', 'error')
    }
  }

  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'created_at', label: 'Subscribed', render: (v) => v ? new Date(v).toLocaleDateString() : '-' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-8">Newsletter Subscribers</h2>
      <DataTable columns={columns} data={subscribers} onEdit={() => {}} onDelete={handleDelete} searchPlaceholder="Search emails..." />
    </div>
  )
}
