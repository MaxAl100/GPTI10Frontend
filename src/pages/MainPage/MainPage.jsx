import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import EventCard from "../../components/EventCard/EventCard";
import { useEffect, useState } from "react";
import "./MainPage.css";
import { getToken } from "../../api/auth";

export default function MainPage() {
  const [events, setEvents] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para los filtros
  const [filters, setFilters] = useState({
    categories: [],
    sources: [],
    location: "",
    free_text: "",
    prefer_free: false
  });

  // Opciones disponibles para los filtros (ajustar según tu backend)
  const filterOptions = {
    categories: [
      "Artes y Cultura",
      "Música y Espectáculos",
      "Educación y Humanidades",
      "Patrimonio y Museos",
      "Turismo y Medio Ambiente",
      "Gastronomía y Ferias"
    ],
    sources: [
      "ChileCultura",
      "DisfrutaSantiago"
    ]
  };

  // === MAPA DE MESES EN ESPAÑOL ===
  const monthMap = {
    "Enero": 0,
    "Febrero": 1,
    "Marzo": 2,
    "Abril": 3,
    "Mayo": 4,
    "Junio": 5,
    "Julio": 6,
    "Agosto": 7,
    "Septiembre": 8,
    "Octubre": 9,
    "Noviembre": 10,
    "Diciembre": 11
  };

  // === PARSER PROFESIONAL PARA FECHAS Y RANGOS ===
  function parseDateRange(dateStr) {
    try {
      const year = new Date().getFullYear();

      if (!dateStr.includes("-")) {
        const [dayStr, monthStr] = dateStr.trim().split(" ");
        return {
          start: new Date(year, monthMap[monthStr], parseInt(dayStr)),
          end: new Date(year, monthMap[monthStr], parseInt(dayStr))
        };
      }

      const parts = dateStr.split("-").map(p => p.trim());
      const startDay = parseInt(parts[0]);
      const endParts = parts[1].split(" ");

      if (endParts.length === 1) {
        const endDay = parseInt(endParts[0]);
        const monthStr = parts[1].split(" ")[1] || endParts[1];
        const month = monthMap[monthStr];

        return {
          start: new Date(year, month, startDay),
          end: new Date(year, month, endDay)
        };
      }

      const startMonthStr = parts[0].split(" ")[1] || endParts[1];
      const endDay = parseInt(endParts[0]);
      const endMonthStr = endParts[1];

      return {
        start: new Date(year, monthMap[startMonthStr], startDay),
        end: new Date(year, monthMap[endMonthStr], endDay)
      };

    } catch (e) {
      console.error("Error parsing date:", dateStr, e);
      return {
        start: new Date(0),
        end: new Date(0)
      };
    }
  }

  // === FUNCIÓN DE ORDENAMIENTO ===
  const sortEvents = (type) => {
    let sorted = [...events];

    if (type === "recientes") {
      sorted.sort((a, b) => {
        const da = parseDateRange(a.date);
        const db = parseDateRange(b.date);
        return da.start - db.start;
      });
    }

    if (type === "antiguos") {
      sorted.sort((a, b) => {
        const da = parseDateRange(a.date);
        const db = parseDateRange(b.date);
        return db.end - da.end;
      });
    }

    if (type === "nombre_asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (type === "nombre_desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (type === "destacado") {
      sorted.sort((a, b) => {
        if (b.saved_count !== a.saved_count) {
          return b.saved_count - a.saved_count;
        }
        return a.title.localeCompare(b.title);
      });
    }

    setEvents(sorted);
    setShowOptions(false);
  };

  // === FUNCIÓN PARA APLICAR FILTROS ===
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'categories' || filterType === 'sources') {
        const currentArray = prev[filterType];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        return { ...prev, [filterType]: newArray };
      }
      return { ...prev, [filterType]: value };
    });
  };

  // === FUNCIÓN PARA LIMPIAR FILTROS ===
  const clearFilters = () => {
    setFilters({
      categories: [],
      sources: [],
      location: "",
      free_text: "",
      prefer_free: false
    });
  };

  // === FUNCIÓN PARA CARGAR EVENTOS CON FILTROS ===
  const loadEvents = async () => {
    const token = getToken();
    const base = "http://localhost:8000/api/events/";
    const params = new URLSearchParams();

    // Construir query string según API: usar category_general, category_specific y source
    if (filters.categories.length) {
      // El backend espera `category_general`; enviamos cada categoría seleccionada.
      filters.categories.forEach((c) => params.append("category_general", c));
    } else {
      // Asegurar que el parámetro exista aunque esté vacío (como en el ejemplo)
      params.append("category_general", "");
    }

    // No tenemos categorías específicas en esta UI, enviar siempre parámetro (vacío si no hay)
    params.append("category_specific", "");

    if (filters.sources.length) {
      // El backend espera `source` (singular). Enviamos una entrada por cada fuente seleccionada.
      filters.sources.forEach((s) => params.append("source", s));
    } else {
      params.append("source", "");
    }

    // Location (si está vacío, también lo enviamos como cadena vacía para consistencia)
    if (filters.location) params.append("location", filters.location);
    else params.append("location", "");

    if (filters.free_text) params.append("free_text", filters.free_text);
    if (filters.prefer_free) params.append("prefer_free", "true");

    const url = base + (params.toString() ? `?${params.toString()}` : "");

    try {
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (!res.ok) throw new Error("Error al cargar eventos");
      const data = await res.json();
      setEvents(data.results);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  // === CARGAR EVENTOS AL MONTAR Y CUANDO CAMBIEN LOS FILTROS ===
  useEffect(() => {
    loadEvents();
  }, [filters]);

  return (
    <div className="mainpage-wrapper">
      <main style={{ backgroundColor: "#f4f4f4", minHeight: "80vh" }}>
        
        {/* === BARRA DE FILTROS === */}
        <div className="barra-filtros">
          <h2 className="titulo-seccion">🎭 Panoramas destacados</h2>

          <div className="filtros-derecha">
            <button 
              className="btn-filtro"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtro {Object.values(filters).some(f => 
                (Array.isArray(f) && f.length) || (typeof f === 'string' && f) || (typeof f === 'boolean' && f)
              ) && "✓"}
            </button>

            <div className="ordenar-container">
              <button
                className="btn-ordenar"
                onClick={() => setShowOptions((prev) => !prev)}
              >
                Ordenar por ▾
              </button>

              {showOptions && (
                <ul className="ordenar-menu">
                  <li onClick={() => sortEvents("destacado")}>Destacado</li>
                  <li onClick={() => sortEvents("recientes")}>Fecha: más cercanos primero</li>
                  <li onClick={() => sortEvents("antiguos")}>Fecha: más lejanos primero</li>
                  <li onClick={() => sortEvents("nombre_asc")}>Nombre ascendente</li>
                  <li onClick={() => sortEvents("nombre_desc")}>Nombre descendente</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* === PANEL DE FILTROS === */}
        {showFilters && (
          <div className="filtros-panel">
            <div className="filtros-content">
              
              {/* Búsqueda por texto */}
              <div className="filtro-grupo">
                <label>🔍 Buscar:</label>
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={filters.free_text}
                  onChange={(e) => handleFilterChange('free_text', e.target.value)}
                  className="filtro-input"
                />
              </div>

              {/* Categorías */}
              <div className="filtro-grupo">
                <label>📁 Categorías:</label>
                <div className="filtro-opciones">
                  {filterOptions.categories.map(cat => (
                    <label key={cat} className="filtro-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat)}
                        onChange={() => handleFilterChange('categories', cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Fuentes */}
              <div className="filtro-grupo">
                <label>🎫 Fuentes:</label>
                <div className="filtro-opciones">
                  {filterOptions.sources.map(src => (
                    <label key={src} className="filtro-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.sources.includes(src)}
                        onChange={() => handleFilterChange('sources', src)}
                      />
                      {src}
                    </label>
                  ))}
                </div>
              </div>

              {/* Ubicación */}
              <div className="filtro-grupo">
                <label>📍 Ubicación:</label>
                <input
                  type="text"
                  placeholder="Ej: Santiago, Providencia..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="filtro-input"
                />
              </div>

              {/* Eventos gratuitos */}
              <div className="filtro-grupo">
                <label className="filtro-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.prefer_free}
                    onChange={(e) => handleFilterChange('prefer_free', e.target.checked)}
                  />
                  💰 Preferir eventos gratuitos
                </label>
              </div>

              {/* Botones de acción */}
              <div className="filtros-acciones">
                <button onClick={clearFilters} className="btn-limpiar">
                  Limpiar filtros
                </button>
                <button onClick={() => setShowFilters(false)} className="btn-aplicar">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === GRID === */}
        <div className="event-grid">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                image_url={event.image_url}
                link={event.link}
                initialSaved={event.is_saved}
                initialSaves={event.saved_count}
              />
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                width: "100%",
                padding: "50px",
                color: "#555"
              }}
            >
              {Object.values(filters).some(f => 
                (Array.isArray(f) && f.length) || (typeof f === 'string' && f) || (typeof f === 'boolean' && f)
              ) 
                ? "No se encontraron eventos con estos filtros"
                : "Cargando panoramas..."
              }
            </p>
          )}
        </div>

      </main>
    </div>
  );
}