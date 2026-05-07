import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/client.js'
import { generateAccessToken, generateRefreshToken } from '../utils/token.js'
import { PORTAL_ACCESS_DENIED_MESSAGE } from '../constants/portalAuth.js'
import { sendPasswordResetEmail } from '../services/emailService.js'

const router = Router()

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, roles = ['USER'] } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashed, roles }
    })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.status(201).json({
      message: 'Signup successful',
      user: { id: user.id, email: user.email, roles: user.roles },
      tokens: { accessToken, refreshToken }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Signup failed' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: 'Invalid email or password' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' })

    if (user.roles.includes('ADMIN')) {
      return res.status(403).json({
        error: PORTAL_ACCESS_DENIED_MESSAGE,
        redirectPath: '/admin/login',
      })
    }
    if (user.roles.includes('MANAGER')) {
      return res.status(403).json({
        error: PORTAL_ACCESS_DENIED_MESSAGE,
        redirectPath: '/manager/login',
      })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, roles: user.roles },
      tokens: { accessToken, refreshToken }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Forgot password: always returns generic success response.
router.post('/forgot-password', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase()
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      const token = jwt.sign(
        { sub: user.id, email: user.email, purpose: 'password-reset' },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
      )
      try {
        await sendPasswordResetEmail(user.email, token)
      } catch (e) {
        console.error('Password reset email failed:', e?.message || e)
      }
    }

    res.json({
      message:
        'If this email is registered, a password reset link has been sent.',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Forgot password failed' })
  }
})

// Reset password with email token
router.post('/reset-password', async (req, res) => {
  try {
    const token = String(req.body?.token || '')
    const password = String(req.body?.password || '')
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' })
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters' })
    }

    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    if (!payload?.sub || payload?.purpose !== 'password-reset') {
      return res.status(400).json({ error: 'Invalid reset token' })
    }

    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { id: payload.sub },
      data: { password: hashed },
    })

    res.json({ message: 'Password reset successful' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Reset password failed' })
  }
})

export default router
