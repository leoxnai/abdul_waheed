import { Router } from 'express'
import { supabase } from '../supabase/client.js'
import { config } from '../config/env.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields required' })
    }

    // Store in Supabase
    const { error } = await supabase.from('messages').insert({
      name,
      email,
      subject,
      message,
    })

    if (error) throw error

    res.json({ success: true, message: 'Message sent successfully!' })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

export default router
