const isLocal = import.meta.env.DEV;

const API_URL = isLocal
  ? "http://127.0.0.1:8000/api/events/"
  : "https://gpti10backend.onrender.com/api/events/";

export async function getEvents(page = 1) {
  try {
    const response = await fetch(`${API_URL}?page=${page}`);
    if (!response.ok) {
      throw new Error("Error al cargar los eventos");
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
}
