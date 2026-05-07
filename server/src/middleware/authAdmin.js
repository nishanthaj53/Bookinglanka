// server/src/middleware/authAdmin.js
import jwt from "jsonwebtoken"

export const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded.roles?.includes("ADMIN")) {
      return res.status(403).json({ error: "Access denied. Admins only." })
    }

    req.user = decoded
    next()
  } catch (err) {
    console.error("Admin JWT verification failed:", err.message)
    res.status(401).json({ error: "Invalid or expired token" })
  }
}
