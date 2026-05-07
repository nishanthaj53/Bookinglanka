const API_BASE = import.meta.env.VITE_API_BASE_URL

export async function fetchHotels(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${API_BASE}/hotels?${qs}`)
  return res.json()
}

export async function fetchHotelDetails(id) {
  const res = await fetch(`${API_BASE}/hotels/${id}`)
  return res.json()
}

export async function fetchNearbyPlaces(id, radiusKm = 3) {
  const res = await fetch(`${API_BASE}/hotels/${id}/nearby?radiusKm=${radiusKm}`)
  return res.json()
}

