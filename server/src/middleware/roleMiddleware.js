// server/src/middleware/roleMiddleware.js
export function authorizeRoles(...roles) {
  return (req, _res, next) => {
    const userRoles = req.user?.roles || []
    const allowed = roles.some(r => userRoles.includes(r))
    if (!allowed) {
      return next({ status: 403, message: 'Forbidden: insufficient role' })
    }
    next()
  }
}
