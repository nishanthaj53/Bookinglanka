// client/src/pages/ProtectedUserRoute.jsx
import { Navigate } from "react-router-dom"
import { isTokenExpired, isUserToken, isManagerToken } from "../../utils/tokenUtils"

export default function ProtectedUserRoute({ children }) {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("managerAccessToken")

  // No token
  if (!token) {
    alert("Please login to continue.")
    return <Navigate to="/login" replace />
  }

  // Expired token
  if (isTokenExpired(token)) {
    alert("Your session has expired. Please login again.")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("managerAccessToken")
    return <Navigate to="/login" replace />
  }

  // ❌ Manager trying to access user portal
  if (isManagerToken(token)) {
    alert("Access denied — manager accounts are not authorized here.")
    localStorage.removeItem("managerAccessToken")
    return <Navigate to="/manager/login" replace />
  }

  // ✅ Valid user token
  if (isUserToken(token)) {
    return children
  }

  // Fallback
  alert("Unauthorized access. Please login again.")
  localStorage.removeItem("accessToken")
  return <Navigate to="/login" replace />
}
