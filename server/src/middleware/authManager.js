import jwt from "jsonwebtoken"

export const authenticateManager = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" })
    }

    // Bearer token extraction
    const token = authHeader.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    if (!decoded || !decoded.roles || !decoded.roles.includes("MANAGER")) {
      return res.status(403).json({ error: "Access denied — manager only" })
    }

    // Attach decoded user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles,
    }

    next()
  } catch (err) {
    console.error("Manager auth error:", err)
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" })
    }
    return res.status(401).json({ error: "Invalid or missing token" })
  }
}
