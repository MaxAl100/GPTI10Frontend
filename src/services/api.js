// src/services/api.js
export async function getEvents(filters = {}) {
  // Build query string according to backend expectations
  const base = "http://localhost:8000/api/events/";
  const params = new URLSearchParams();

  if (filters.categories && filters.categories.length) {
    filters.categories.forEach((c) => params.append("categories", c));
  }
  if (filters.subcategories && filters.subcategories.length) {
    filters.subcategories.forEach((s) => params.append("subcategories", s));
  }
  if (filters.sources && filters.sources.length) {
    filters.sources.forEach((s) => params.append("sources", s));
  }
  if (filters.location) params.append("location", filters.location);
  if (filters.free_text) params.append("free_text", filters.free_text);
  if (filters.prefer_free) params.append("prefer_free", "true");

  const url = base + (params.toString() ? `?${params.toString()}` : "");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (err) {
    console.warn("Unable to reach backend, falling back to local data:", err);
    // Fallback to local sample data for dev when backend isn't available
    try {
      const response = await fetch("/data/ejemplos.json");
      if (!response.ok) throw new Error("Error al cargar los datos locales");
      const data = await response.json();
      return data;
    } catch (e) {
      console.error("Error al obtener eventos locales:", e);
      return { results: [] };
    }
  }
}

export async function getComments(eventId) {
  const res = await fetch(`http://localhost:8000/api/events/${eventId}/comments/`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return await res.json();
}

