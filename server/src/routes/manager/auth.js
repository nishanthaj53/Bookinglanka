import express from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../../db/client.js'
import { issueAccessToken, issueRefreshToken } from '../../utils/token.js'
import { PORTAL_ACCESS_DENIED_MESSAGE } from '../../constants/portalAuth.js'
import {
  createEmailVerificationToken,
  sendEmailVerificationEmail,
} from '../../services/emailService.js'

const router = express.Router()

async function issueVerificationEmail(user) {
  const token = createEmailVerificationToken(user, 'manager')
  try {
    await sendEmailVerificationEmail(user.email, token, 'manager')
  } catch (e) {
    console.error('Manager verification email failed:', e?.message || e)
  }
}

// MANAGER SIGNUP (role is auto-assigned)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (existing) {
      const ok = await bcrypt.compare(password, existing.password)
      if (!ok) {
        return res.status(400).json({ error: 'Invalid credentials for upgrade' })
      }

      if (existing.roles.includes('MANAGER')) {
        return res.status(409).json({ error: 'This account is already registered as a manager' })
      }

      const updated = await prisma.user.update({
        where: { email: normalizedEmail },
        data: {
          roles: [...existing.roles, 'MANAGER'],
          displayName: displayName ?? existing.displayName,
        },
      })

      if (!updated.emailVerified) {
        await issueVerificationEmail(updated)
        return res.json({
          message:
            'Manager role added. Please verify your email before signing in to the manager portal.',
          requiresVerification: true,
          user: { id: updated.id, email: updated.email, roles: updated.roles },
        })
      }

      return res.json({
        message: 'Upgraded to Manager successfully. You can now sign in.',
        user: { id: updated.id, email: updated.email, roles: updated.roles },
      })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hash,
        displayName: displayName ?? null,
        roles: ['MANAGER'],
        emailVerified: false,
      },
    })

    await issueVerificationEmail(user)

    res.status(201).json({
      message:
        'Manager account created. Please check your email to verify your address before signing in.',
      requiresVerification: true,
      user: { id: user.id, email: user.email, roles: user.roles },
    })
  } catch (err) {
    console.error('Manager signup error:', err)
    res.status(500).json({ error: 'Signup failed' })
  }
})

// MANAGER LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

    if (!user.roles.includes('MANAGER')) {
      const redirectPath = user.roles.includes('ADMIN')
        ? '/admin/login'
        : '/login'
      return res.status(403).json({
        error: PORTAL_ACCESS_DENIED_MESSAGE,
        redirectPath,
      })
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        error: 'Please verify your email before signing in. Check your inbox for the verification link.',
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email,
      })
    }

    const accessToken = issueAccessToken(user)
    const refreshToken = issueRefreshToken(user)

    res.json({
      message: 'Manager login successful',
      user: { id: user.id, email: user.email, roles: user.roles },
      tokens: { accessToken, refreshToken },
    })
  } catch (err) {
    console.error('Manager login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
