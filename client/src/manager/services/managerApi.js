const API_BASE = import.meta.env.VITE_API_BASE_URL

// Helper to get token
function getHeaders() {
  const token = localStorage.getItem("managerAccessToken")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export const managerApi = {
  // ---- HOTELS ----
  getHotels: async () => {
    const res = await fetch(`${API_BASE}/manager/hotels`, { headers: getHeaders() })
    return res.json()
  },

  createHotel: async (data) => {
    const res = await fetch(`${API_BASE}/manager/hotels`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return res.json()
  },

  updateHotel: async (id, data) => {
    const res = await fetch(`${API_BASE}/manager/hotels/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return res.json()
  },

  // ---- ROOMS ----
  getRooms: async (hotelId) => {
    const res = await fetch(`${API_BASE}/manager/rooms/${hotelId}`, { headers: getHeaders() })
    return res.json()
  },

  createRoom: async (data) => {
    const res = await fetch(`${API_BASE}/manager/rooms`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return res.json()
  },

  // ---- BOOKINGS ----
  getBookings: async () => {
    const res = await fetch(`${API_BASE}/manager/bookings`, { headers: getHeaders() })
    return res.json()
  },

  updateBookingStatus: async (bookingId, status) => {
    const res = await fetch(`${API_BASE}/manager/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    })
    return res.json()
  },
}
