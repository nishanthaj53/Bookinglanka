const API_BASE = import.meta.env.VITE_API_BASE_URL

export async function managerSignup(email, password, name) {
  const res = await fetch(`${API_BASE}/manager/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name })
  })
  if (!res.ok) throw new Error((await res.json()).error || "Signup failed")
  return res.json()
}

export async function managerLogin(email, password) {
  const res = await fetch(`${API_BASE}/manager/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error((await res.json()).error || "Login failed")
  return res.json()
}
