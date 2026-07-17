import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import DataTable from '../components/DataTable'
import { showToast } from '../../components/ui/Toast'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    supabase.from('messages').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setMessages(data)
    })
  }, [])

  const handleDelete = async (item) => {
    if (!confirm('Delete this message?')) return
    try {
      const { error } = await supabase.from('messages').delete().eq('id', item.id)
      if (error) throw error
      setMessages(messages.filter((m) => m.id !== item.id))
      showToast('Message deleted!')
    } catch (err) {
      console.error('Error deleting message:', err)
      showToast('Error deleting message', 'error')
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    { key: 'message', label: 'Message', render: (v) => v?.substring(0, 50) + '...' },
    { key: 'created_at', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '-' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-8">Messages</h2>
      <DataTable columns={columns} data={messages} onEdit={() => {}} onDelete={handleDelete} searchPlaceholder="Search messages..." />
    </div>
  )
}
