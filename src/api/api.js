const BASE_URL = import.meta.env.VITE_API_BASE || '/api'

export async function getEvents() {
  const res = await fetch(`${BASE_URL}/events/`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}
