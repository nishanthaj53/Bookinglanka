// client/src/services/apiClient.js
import axios from "axios"
import { isTokenExpired, isAdminToken, isManagerToken, isUserToken } from "../utils/tokenUtils"

// 🌐 Base API URL from .env
const API_BASE = import.meta.env.VITE_API_BASE_URL

// ✅ Export this for image URLs and general external use
export const BASE_URL = API_BASE

// One shared axios instance
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

// Decide context (admin / manager / user) based on current path
function pickContext() {
  const path = window.location.pathname

  if (path.startsWith("/admin")) {
    return {
      area: "admin",
      token: localStorage.getItem("adminAccessToken") || null,
      loginPath: "/admin/login",
    }
  }
  if (path.startsWith("/manager")) {
    return {
      area: "manager",
      token: localStorage.getItem("managerAccessToken") || null,
      loginPath: "/manager/login",
    }
  }
  return {
    area: "user",
    token: localStorage.getItem("accessToken") || null,
    loginPath: "/login",
  }
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { area, token, loginPath } = pickContext()

    // Public endpoints: no token needed unless path is protected
    if (!token) return config

    // JWT expired?
    if (isTokenExpired(token)) {
      localStorage.clear()
      window.location.href = loginPath
      return Promise.reject(new Error("Session expired"))
    }

    // 🔐 Role-based validations
    if (area === "admin" && !isAdminToken(token)) {
      localStorage.clear()
      window.location.href = "/admin/login"
      return Promise.reject(new Error("Admin auth required"))
    }
    if (area === "manager" && !isManagerToken(token)) {
      localStorage.clear()
      window.location.href = "/manager/login"
      return Promise.reject(new Error("Manager auth required"))
    }
    if (area === "user" && !isUserToken(token)) {
      localStorage.clear()
      window.location.href = "/login"
      return Promise.reject(new Error("User auth required"))
    }

    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      const { loginPath } = pickContext()
      localStorage.clear()
      window.location.href = loginPath
    }
    return Promise.reject(error)
  }
)

// ✅ Default export for main use
export default api
