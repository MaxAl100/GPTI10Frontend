// src/services/api.js
export async function getEvents() {
  try {
    const response = await fetch("/data/ejemplos.json");
    if (!response.ok) throw new Error("Error al cargar los datos locales");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return { results: [] };
  }
}
