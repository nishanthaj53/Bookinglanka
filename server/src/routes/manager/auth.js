import express from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../../db/client.js'
import { issueAccessToken, issueRefreshToken } from '../../utils/token.js'
import { PORTAL_ACCESS_DENIED_MESSAGE } from '../../constants/portalAuth.js'

const router = express.Router()

// ✅ MANAGER SIGNUP (role is auto-assigned)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      // Prevent multiple manager registrations with same email
      const ok = await bcrypt.compare(password, existing.password)
      if (!ok) {
        return res.status(400).json({ error: 'Invalid credentials for upgrade' })
      }

      if (existing.roles.includes('MANAGER')) {
        return res.status(409).json({ error: 'This account is already registered as a manager' })
      }

      // Upgrade user to manager
      const updated = await prisma.user.update({
        where: { email },
        data: {
          roles: [...existing.roles, 'MANAGER'],
          displayName: displayName ?? existing.displayName,
        },
      })

      const accessToken = issueAccessToken(updated)
      const refreshToken = issueRefreshToken(updated)

      return res.json({
        message: 'Upgraded to Manager successfully',
        user: { id: updated.id, email: updated.email, roles: updated.roles },
        tokens: { accessToken, refreshToken },
      })
    }

    // ✅ Create new manager (auto-role)
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        displayName: displayName ?? null,
        roles: ['MANAGER'],
      },
    })

    const accessToken = issueAccessToken(user)
    const refreshToken = issueRefreshToken(user)

    res.status(201).json({
      message: 'Manager registered successfully',
      user: { id: user.id, email: user.email, roles: user.roles },
      tokens: { accessToken, refreshToken },
    })
  } catch (err) {
    console.error('Manager signup error:', err)
    res.status(500).json({ error: 'Signup failed' })
  }
})

// ✅ MANAGER LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
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
