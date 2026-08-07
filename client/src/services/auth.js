const API_BASE = import.meta.env.VITE_API_BASE_URL

async function parseJson(res) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

export async function signup(email, password) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Signup failed')
  return data
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await parseJson(res)
  if (!res.ok) {
    const err = new Error(data.error || 'Login failed')
    if (data.redirectPath) err.redirectPath = data.redirectPath
    if (data.code) err.code = data.code
    if (data.email) err.email = data.email
    throw err
  }
  return data
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export async function resetPassword(token, password) {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Reset failed')
  return data
}

export async function verifyEmail(token) {
  const res = await fetch(`${API_BASE}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Verification failed')
  return data
}

export async function resendVerification(email, portal = 'user') {
  const res = await fetch(`${API_BASE}/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, portal }),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Could not resend email')
  return data
}
