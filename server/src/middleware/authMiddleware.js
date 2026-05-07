import jwt from 'jsonwebtoken'

/**
 * Middleware: checks JWT token and attaches user info to req.user
 */
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    req.user = decoded // attach { id, email, roles } to req.user
    next()
  } catch (err) {
    console.error('❌ JWT verify failed:', err.message)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}
