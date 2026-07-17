import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
