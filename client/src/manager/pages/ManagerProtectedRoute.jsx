// client/src/manager/pages/ProtectedManagerRoute.jsx
import { Navigate } from "react-router-dom"
import { isTokenExpired, isManagerToken, isUserToken } from "../../utils/tokenUtils"

export default function ProtectedManagerRoute({ children }) {
  const token = localStorage.getItem("managerAccessToken") || localStorage.getItem("accessToken")

  // No token
  if (!token) {
    alert("Please login as manager to continue.")
    return <Navigate to="/manager/login" replace />
  }

  // Expired token
  if (isTokenExpired(token)) {
    alert("Your session has expired. Please login again.")
    localStorage.removeItem("managerAccessToken")
    localStorage.removeItem("accessToken")
    return <Navigate to="/manager/login" replace />
  }

  // ❌ User trying to access manager portal
  if (isUserToken(token)) {
    alert("Access denied — user accounts are not authorized here.")
    localStorage.removeItem("accessToken")
    return <Navigate to="/login" replace />
  }

  // ✅ Valid manager token
  if (isManagerToken(token)) {
    return children
  }

  // Fallback for anything invalid
  alert("Unauthorized access. Please login again.")
  localStorage.removeItem("managerAccessToken")
  return <Navigate to="/manager/login" replace />
}
