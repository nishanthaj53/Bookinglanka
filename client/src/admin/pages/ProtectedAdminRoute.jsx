import { Navigate } from "react-router-dom"
import { isTokenExpired, isAdminToken } from "../../utils/tokenUtils"

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("adminAccessToken")

  if (!token) {
    alert("Admin access only. Please login as admin.")
    return <Navigate to="/admin/login" replace />
  }

  if (isTokenExpired(token)) {
    alert("Session expired. Please login again.")
    localStorage.removeItem("adminAccessToken")
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdminToken(token)) {
    alert("Access denied. Admins only.")
    localStorage.clear()
    return <Navigate to="/admin/login" replace />
  }

  return children
}
