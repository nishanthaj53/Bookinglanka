import { jwtDecode } from "jwt-decode"

export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token)
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function isUserToken(token) {
  try {
    const decoded = jwtDecode(token)
    return decoded.roles?.includes("USER")
  } catch {
    return false
  }
}

export function isManagerToken(token) {
  try {
    const decoded = jwtDecode(token)
    return decoded.roles?.includes("MANAGER")
  } catch {
    return false
  }
}

export function isAdminToken(token) {
  try {
    const decoded = jwtDecode(token)
    return decoded.roles?.includes("ADMIN")
  } catch {
    return false
  }
}


