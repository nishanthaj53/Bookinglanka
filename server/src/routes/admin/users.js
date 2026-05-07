import express from "express"
import { prisma } from "../../db/client.js"
import { authenticateAdmin } from "../../middleware/authAdmin.js"

const router = express.Router()

function maskAccountNumber(raw) {
  const value = String(raw || "").trim()
  if (!value) return ""
  if (value.length <= 4) return value
  return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`
}

// ✅ List accounts: ?kind=guest (end users, no manager/admin) | ?kind=manager (branch managers) | omit = all
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const kind = String(req.query.kind || "").toLowerCase()
    let where = {}
    if (kind === "manager") {
      where = { roles: { has: "MANAGER" } }
    } else if (kind === "guest") {
      where = {
        AND: [{ NOT: { roles: { has: "MANAGER" } } }, { NOT: { roles: { has: "ADMIN" } } }],
      }
    }

    const selectManagers = {
      id: true,
      email: true,
      roles: true,
      createdAt: true,
      displayName: true,
      phone: true,
      payoutAcc: {
        select: {
          provider: true,
          status: true,
          accountId: true,
          detailsJson: true,
          updatedAt: true,
        },
      },
    }
    const selectGuests = {
      id: true,
      email: true,
      roles: true,
      createdAt: true,
      displayName: true,
      phone: true,
    }

    const rows = await prisma.user.findMany({
      where,
      select: kind === "guest" ? selectGuests : selectManagers,
      orderBy: { createdAt: "desc" },
    })

    const users = rows.map((u) => {
      if (kind === "guest" || !u.payoutAcc) {
        return {
          id: u.id,
          email: u.email,
          roles: u.roles,
          createdAt: u.createdAt,
          displayName: u.displayName,
          phone: u.phone,
          payout: null,
        }
      }
      const details =
        u.payoutAcc?.detailsJson && typeof u.payoutAcc.detailsJson === "object"
          ? u.payoutAcc.detailsJson
          : {}
      const payout = u.payoutAcc
        ? {
            provider: u.payoutAcc.provider || "bank",
            status: u.payoutAcc.status,
            maskedAccountId: maskAccountNumber(u.payoutAcc.accountId),
            bankName: String(details.bankName || ""),
            accountHolder: String(details.accountHolder || ""),
            updatedAt: u.payoutAcc.updatedAt,
          }
        : null
      return {
        id: u.id,
        email: u.email,
        roles: u.roles,
        createdAt: u.createdAt,
        displayName: u.displayName,
        phone: u.phone,
        payout,
      }
    })

    res.json(users)
  } catch (err) {
    console.error("Admin get users error:", err)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

export default router
