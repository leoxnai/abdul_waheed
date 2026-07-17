import { Router } from 'express'
import { supabase } from '../supabase/client.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email required' })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return res.json({ success: true, message: 'Already subscribed!' })
    }

    const { error } = await supabase.from('newsletter').insert({ email })

    if (error) throw error

    res.json({ success: true, message: 'Subscribed successfully!' })
  } catch (error) {
    console.error('Newsletter error:', error)
    res.status(500).json({ error: 'Failed to subscribe' })
  }
})

export default router
