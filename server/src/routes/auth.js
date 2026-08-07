import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/client.js'
import { generateAccessToken, generateRefreshToken } from '../utils/token.js'
import { PORTAL_ACCESS_DENIED_MESSAGE } from '../constants/portalAuth.js'
import {
  createEmailVerificationToken,
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from '../services/emailService.js'

const router = Router()

async function issueVerificationEmail(user, portal = 'user') {
  const token = createEmailVerificationToken(user, portal)
  try {
    await sendEmailVerificationEmail(user.email, token, portal)
  } catch (e) {
    console.error('Verification email failed:', e?.message || e)
  }
}

function requiresEmailVerification(user) {
  if (user.roles.includes('ADMIN')) return false
  return !user.emailVerified
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, roles = ['USER'] } = req.body
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) return res.status(400).json({ error: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        roles,
        emailVerified: false,
      },
    })

    await issueVerificationEmail(user, 'user')

    res.status(201).json({
      message:
        'Account created. Please check your email to verify your address before signing in.',
      requiresVerification: true,
      user: { id: user.id, email: user.email, roles: user.roles },
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
    const normalizedEmail = String(email || '').trim().toLowerCase()

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
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

    if (requiresEmailVerification(user)) {
      return res.status(403).json({
        error: 'Please verify your email before signing in. Check your inbox for the verification link.',
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email,
      })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, roles: user.roles },
      tokens: { accessToken, refreshToken },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const token = String(req.body?.token || '')
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' })
    }

    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return res.status(400).json({ error: 'Invalid or expired verification link' })
    }

    if (!payload?.sub || payload?.purpose !== 'email-verify') {
      return res.status(400).json({ error: 'Invalid verification token' })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) {
      return res.status(404).json({ error: 'Account not found' })
    }

    if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      })
    }

    const portal = payload.portal === 'manager' ? 'manager' : 'user'
    res.json({
      message: 'Email verified successfully. You can now sign in.',
      portal,
      email: user.email,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Email verification failed' })
  }
})

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase()
    const portal = String(req.body?.portal || 'user')

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (user && !user.emailVerified) {
      await issueVerificationEmail(user, portal === 'manager' ? 'manager' : 'user')
    }

    res.json({
      message:
        'If this email is registered and not yet verified, a new verification link has been sent.',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not resend verification email' })
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
