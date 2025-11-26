import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import EventCard from "../../components/EventCard/EventCard";
import { useEffect, useState } from "react";
import "./MainPage.css";
import { getToken } from "../../api/auth";
import { useLocation } from "react-router-dom";


export default function MainPage() {
  const [events, setEvents] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    categories: [],
    sources: [],
    location: "",
    free_text: "",
    prefer_free: false,
  });

  // Estado para saber con qué se está ordenando
  const [currentSort, setCurrentSort] = useState("destacado");

  const location = useLocation();

  // Etiquetas lindas para mostrar al usuario
  const sortLabels = {
    destacado: "Destacados",
    recientes: "Fecha: más cercanos primero",
    antiguos: "Fecha: más lejanos primero",
    nombre_asc: "Nombre ascendente",
    nombre_desc: "Nombre descendente",
  };

  // Opciones de filtros
  const filterOptions = {
    categories: [
      "Artes y Cultura",
      "Música y Espectáculos",
      "Educación y Humanidades",
      "Patrimonio y Museos",
      "Turismo y Medio Ambiente",
      "Gastronomía y Ferias",
    ],
    sources: ["ChileCultura", "DisfrutaSantiago"],
  };

  // === MAPA DE MESES EN ESPAÑOL ===
  const monthMap = {
    Enero: 0,
    Febrero: 1,
    Marzo: 2,
    Abril: 3,
    Mayo: 4,
    Junio: 5,
    Julio: 6,
    Agosto: 7,
    Septiembre: 8,
    Octubre: 9,
    Noviembre: 10,
    Diciembre: 11,
  };

  const [pendingFilters, setPendingFilters] = useState({
    categories: [],
    sources: [],
    location: "",
    free_text: "",
    prefer_free: false,
  });
  

  // === PARSER PROFESIONAL PARA FECHAS Y RANGOS ===
  function parseDateRange(dateStr) {
    try {
      const year = new Date().getFullYear();

      if (!dateStr.includes("-")) {
        const [dayStr, monthStr] = dateStr.trim().split(" ");
        return {
          start: new Date(year, monthMap[monthStr], parseInt(dayStr)),
          end: new Date(year, monthMap[monthStr], parseInt(dayStr)),
        };
      }

      const parts = dateStr.split("-").map((p) => p.trim());
      const startDay = parseInt(parts[0]);
      const endParts = parts[1].split(" ");

      if (endParts.length === 1) {
        const endDay = parseInt(endParts[0]);
        const monthStr = parts[1].split(" ")[1] || endParts[1];
        const month = monthMap[monthStr];

        return {
          start: new Date(year, month, startDay),
          end: new Date(year, month, endDay),
        };
      }

      const startMonthStr = parts[0].split(" ")[1] || endParts[1];
      const endDay = parseInt(endParts[0]);
      const endMonthStr = endParts[1];

      return {
        start: new Date(year, monthMap[startMonthStr], startDay),
        end: new Date(year, monthMap[endMonthStr], endDay),
      };
    } catch (e) {
      console.error("Error parsing date:", dateStr, e);
      return {
        start: new Date(0),
        end: new Date(0),
      };
    }
  }

  // === NORMALIZAR TÍTULOS PARA ORDENAR (ignorar signos, acentos, may/min) ===
  function normalizeTitle(title = "") {
    return title
      .normalize("NFD") // separa letras y acentos
      .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
      .replace(/^[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/, "") // elimina signos al inicio (¡, ¿, etc.)
      .trim()
      .toLowerCase();
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
      sorted.sort((a, b) =>
        normalizeTitle(a.title).localeCompare(normalizeTitle(b.title), "es", {
          sensitivity: "base",
        })
      );
    }

    if (type === "nombre_desc") {
      sorted.sort((a, b) =>
        normalizeTitle(b.title).localeCompare(normalizeTitle(a.title), "es", {
          sensitivity: "base",
        })
      );
    }

    if (type === "destacado") {
      sorted.sort((a, b) => {
        if (b.saved_count !== a.saved_count) {
          return b.saved_count - a.saved_count;
        }
        return normalizeTitle(a.title).localeCompare(
          normalizeTitle(b.title),
          "es",
          { sensitivity: "base" }
        );
      });
    }

    setEvents(sorted);
    setCurrentSort(type);   // 👈 guardamos qué tipo se usó
    setShowOptions(false);
  };

  // === FUNCIÓN PARA APLICAR FILTROS ===
  const handleFilterChange = (filterType, value) => {
    setPendingFilters((prev) => {
      if (filterType === "categories" || filterType === "sources") {
        const currentArray = prev[filterType];
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value];
        return { ...prev, [filterType]: newArray };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const handleFilterRemove = (filterType, value) => {
    setFilters((prev) => {
      let updated = { ...prev };
  
      if (filterType === "categories" || filterType === "sources") {
        updated[filterType] = prev[filterType].filter((item) => item !== value);
      } else if (filterType === "location" || filterType === "free_text") {
        updated[filterType] = "";
      } else if (filterType === "prefer_free") {
        updated.prefer_free = false;
      }
  
      // Mantener sincronizado el panel de filtros
      setPendingFilters(updated);
  
      return updated;
    });
  };
  

  // === FUNCIÓN PARA LIMPIAR FILTROS ===
  const clearFilters = () => {
    const empty = {
      categories: [],
      sources: [],
      location: "",
      free_text: "",
      prefer_free: false,
    };
  
    setPendingFilters(empty);
    setFilters(empty);   // opcional → solo si quieres que limpie al tiro
  };
  

    // === LISTA DE FILTROS ACTIVOS PARA MOSTRAR EN CHIPS ===
  const getActiveFilters = () => {
    const chips = [];

    // Categorías
    filters.categories.forEach((cat) => {
      chips.push({
        key: `cat-${cat}`,
        type: "categories",
        value: cat,
        label: cat,
      });
    });

    // Fuentes
    filters.sources.forEach((src) => {
      chips.push({
        key: `src-${src}`,
        type: "sources",
        value: src,
        label: src,
      });
    });

    // Ubicación
    if (filters.location.trim()) {
      chips.push({
        key: "location",
        type: "location",
        value: "",
        label: `Ubicación: ${filters.location.trim()}`,
      });
    }

    // Texto libre
    if (filters.free_text.trim()) {
      chips.push({
        key: "free_text",
        type: "free_text",
        value: "",
        label: `Texto: "${filters.free_text.trim()}"`,
      });
    }

    // Preferir gratuitos
    if (filters.prefer_free) {
      chips.push({
        key: "prefer_free",
        type: "prefer_free",
        value: false,
        label: "Preferir eventos gratuitos",
      });
    }

    return chips;
  };

  const activeFilters = getActiveFilters();

  const removeFilter = (filter) => {
    setFilters((prev) => {
      if (filter.type === "categories" || filter.type === "sources") {
        return {
          ...prev,
          [filter.type]: prev[filter.type].filter((v) => v !== filter.value),
        };
      }

      if (filter.type === "location" || filter.type === "free_text") {
        return { ...prev, [filter.type]: "" };
      }

      if (filter.type === "prefer_free") {
        return { ...prev, prefer_free: false };
      }

      return prev;
    });
  };


    // === SINCRONIZAR ?search= DE LA URL CON filters.free_text ===
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const searchParam = params.get("search") || "";
  
      setFilters((prev) => {
        // evitamos bucle si ya está igual
        if ((prev.free_text || "") === searchParam) return prev;
        return { ...prev, free_text: searchParam };
      });
    }, [location.search]);
  



  // === FUNCIÓN PARA CARGAR EVENTOS CON FILTROS ===
  const loadEvents = async () => {
    const token = getToken();
    const base = "http://localhost:8000/api/events/";
    const params = new URLSearchParams();

    if (filters.categories.length) {
      filters.categories.forEach((c) => params.append("category_general", c));
    } else {
      params.append("category_general", "");
    }

    params.append("category_specific", "");

    if (filters.sources.length) {
      filters.sources.forEach((s) => params.append("source", s));
    } else {
      params.append("source", "");
    }

    if (filters.location) params.append("location", filters.location);
    else params.append("location", "");

    if (filters.free_text) {
      // Enviamos ambos nombres por si el backend usa uno u otro
      params.append("free_text", filters.free_text);
      params.append("search", filters.free_text);
    }
    if (filters.prefer_free) params.append("prefer_free", "true");

    const url = base + (params.toString() ? `?${params.toString()}` : "");

    try {
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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
          <div className="barra-filtros-izquierda">
          <h2 className="titulo-seccion">
  Panoramas para ti <span className="emoji-titulo">🎭</span>
</h2>
            {/* === FILTROS ACTIVOS (chips debajo del header) === */}
            {/* Título para filtros aplicados */}
            {/* === FILTROS ACTIVOS (chips debajo del header) === */}

{activeFilters.length > 0 && (
  <div className="filtros-aplicados-titulo">
    <span className="sort-info-label">Filtros aplicados:</span>
  </div>
)}

<div className="filtros-activos">
  {filters.free_text && (
    <div
      className="filtro-chip"
      onClick={() => handleFilterRemove("free_text")}
    >
      {filters.free_text}
      <span className="chip-x">✕</span>
    </div>
  )}


  {filters.location && (
    <div
      className="filtro-chip"
      onClick={() => handleFilterRemove("location")}
    >
      {filters.location}
      <span className="chip-x">✕</span>
    </div>
  )}


  {filters.prefer_free && (
    <div
      className="filtro-chip"
      onClick={() => handleFilterRemove("prefer_free")}
    >
      Gratuitos
      <span className="chip-x">✕</span>
    </div>
  )}


  {filters.sources.map((s) => (
    <div
      key={s}
      className="filtro-chip"
      onClick={() => handleFilterRemove("sources", s)}
    >
      {s}
      <span className="chip-x">✕</span>
    </div>
  ))}



  {filters.sources.map((s) => (
    <div key={s} className="filtro-chip" onClick={() => handleFilterChange("sources", s)}>
      {s}
      <span className="chip-x">✕</span>
    </div>
  ))}
</div>





            {/* Texto lindo de “ordenado por” */}
            <div className="sort-info">
              <span className="sort-info-label">
                Panoramas ordenados por: 
              </span>
              <span className="sort-info-chip">
                {sortLabels[currentSort] || "Destacados"}
              </span>
            </div>
          </div>

          <div className="filtros-derecha">
            <button
              className="btn-filtro"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtro{" "}
              {Object.values(filters).some(
                (f) =>
                  (Array.isArray(f) && f.length) ||
                  (typeof f === "string" && f) ||
                  (typeof f === "boolean" && f)
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
                  <li onClick={() => sortEvents("recientes")}>
                    Fecha: más cercanos primero
                  </li>
                  <li onClick={() => sortEvents("antiguos")}>
                    Fecha: más lejanos primero
                  </li>
                  <li onClick={() => sortEvents("nombre_asc")}>
                    Nombre ascendente
                  </li>
                  <li onClick={() => sortEvents("nombre_desc")}>
                    Nombre descendente
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* === PANEL DE FILTROS === */}
        {showFilters && (
  <div className="filtros-panel">
    <div className="filtros-content">

      {/* Categorías */}
      <div className="filtro-grupo">
        <label>📁 Categorías:</label>
        <div className="filtro-opciones">
          {filterOptions.categories.map((cat) => (
            <label key={cat} className="filtro-checkbox">
              <input
                type="checkbox"
                checked={pendingFilters.categories.includes(cat)}
                onChange={() =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    categories: prev.categories.includes(cat)
                      ? prev.categories.filter((c) => c !== cat)
                      : [...prev.categories, cat],
                  }))
                }
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
          {filterOptions.sources.map((src) => (
            <label key={src} className="filtro-checkbox">
              <input
                type="checkbox"
                checked={pendingFilters.sources.includes(src)}
                onChange={() =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    sources: prev.sources.includes(src)
                      ? prev.sources.filter((s) => s !== src)
                      : [...prev.sources, src],
                  }))
                }
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
          value={pendingFilters.location}
          onChange={(e) =>
            setPendingFilters((prev) => ({
              ...prev,
              location: e.target.value,
            }))
          }
          className="filtro-input"
        />
      </div>

      {/* Eventos gratuitos */}
      <div className="filtro-grupo">
        <label className="filtro-checkbox">
          <input
            type="checkbox"
            checked={pendingFilters.prefer_free}
            onChange={(e) =>
              setPendingFilters((prev) => ({
                ...prev,
                prefer_free: e.target.checked,
              }))
            }
          />
          💰 Preferir eventos gratuitos
        </label>
      </div>

      {/* Botones de acción */}
      <div className="filtros-acciones">
        <button onClick={clearFilters} className="btn-limpiar">
          Limpiar filtros
        </button>
        <button
          onClick={() => {
            setFilters(pendingFilters);   // 👈 aquí se aplican DE VERDAD
            setShowFilters(false);        // 👈 se cierra el panel
          }}
          className="btn-aplicar"
        >
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
                color: "#555",
              }}
            >
              {Object.values(filters).some(
                (f) =>
                  (Array.isArray(f) && f.length) ||
                  (typeof f === "string" && f) ||
                  (typeof f === "boolean" && f)
              )
                ? "No se encontraron eventos con estos filtros"
                : "Cargando panoramas..."}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
