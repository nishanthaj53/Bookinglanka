// server/src/routes/admin/auth.js
import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../../db/client.js"
import { PORTAL_ACCESS_DENIED_MESSAGE } from "../../constants/portalAuth.js"

const router = express.Router()

// ✅ Admin Signup (Restricted — you can disable after creating first admin)
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: "Admin already exists" })

    const hashed = await bcrypt.hash(password, 10)

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashed,
        roles: ["ADMIN"],
        emailVerified: true,
      },
    })

    res.json({ message: "Admin account created", admin: { id: admin.id, email: admin.email } })
  } catch (err) {
    console.error("Admin signup error:", err)
    res.status(500).json({ error: "Signup failed" })
  }
})

// ✅ Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await prisma.user.findUnique({ where: { email } })
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return res.status(401).json({ error: "Invalid email or password" })

    if (!admin.roles.includes("ADMIN")) {
      const redirectPath = admin.roles.includes("MANAGER")
        ? "/manager/login"
        : "/login"
      return res.status(403).json({
        error: PORTAL_ACCESS_DENIED_MESSAGE,
        redirectPath,
      })
    }

    const accessToken = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        roles: admin.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    )

    const refreshToken = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      message: "Admin login successful",
      admin: { id: admin.id, email: admin.email },
      tokens: { accessToken, refreshToken },
    })
  } catch (err) {
    console.error("Admin login error:", err)
    res.status(500).json({ error: "Login failed" })
  }
})

export default router
