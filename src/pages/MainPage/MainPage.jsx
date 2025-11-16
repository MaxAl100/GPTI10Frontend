import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import EventCard from "../../components/EventCard/EventCard";
import { useEffect, useState } from "react";
import "./MainPage.css";
import { getToken } from "../../api/auth";


export default function MainPage() {
  const [events, setEvents] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

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

      // Caso simple: "11 Marzo"
      if (!dateStr.includes("-")) {
        const [dayStr, monthStr] = dateStr.trim().split(" ");
        return {
          start: new Date(year, monthMap[monthStr], parseInt(dayStr)),
          end: new Date(year, monthMap[monthStr], parseInt(dayStr))
        };
      }

      // Caso con guion:
      // "27 - 29 Noviembre"
      // "05 Noviembre - 20 Diciembre"
      const parts = dateStr.split("-").map(p => p.trim());

      const startDay = parseInt(parts[0]);
      const endParts = parts[1].split(" ");

      // Caso: "27 - 29 Noviembre"
      if (endParts.length === 1) {
        const endDay = parseInt(endParts[0]);
        const monthStr = parts[1].split(" ")[1] || endParts[1];
        const month = monthMap[monthStr];

        return {
          start: new Date(year, month, startDay),
          end: new Date(year, month, endDay)
        };
      }

      // Caso: "05 Noviembre - 20 Diciembre"
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
        return da.start - db.start; // más reciente = fecha final mayor
      });
    }

    if (type === "antiguos") {
      sorted.sort((a, b) => {
        const da = parseDateRange(a.date);
        const db = parseDateRange(b.date);
        return db.end - da.end; // más antiguo = inicio menor
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
        // Primero: más guardados
        if (b.saved_count !== a.saved_count) {
          return b.saved_count - a.saved_count;
        }
        // Desempate: orden alfabético
        return a.title.localeCompare(b.title);
      });
    }


    setEvents(sorted);
    setShowOptions(false);
  };

  // === CARGA DE EVENTOS DESDE EL BACKEND ===
  useEffect(() => {
    const token = getToken();

    fetch("http://localhost:8000/api/events/", {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar eventos");
        return res.json();
      })
      .then((data) => setEvents(data.results))
      .catch((err) => console.error("Error al cargar datos:", err));
  }, []);


  return (
    <div className="mainpage-wrapper">
      <main style={{ backgroundColor: "#f4f4f4", minHeight: "80vh" }}>
        
        {/* === BARRA DE FILTROS === */}
        <div className="barra-filtros">
          <h2 className="titulo-seccion">🎭 Panoramas destacados</h2>

          <div className="filtros-derecha">
            <button className="btn-filtro">Filtro</button>

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
                  <li onClick={() => sortEvents("antiguos")}>Fecha: más lejanos primero </li>
                  <li onClick={() => sortEvents("nombre_asc")}>Nombre ascendente</li>
                  <li onClick={() => sortEvents("nombre_desc")}>Nombre descendente</li>
                </ul>
              )}
            </div>
          </div>
        </div>

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
              Cargando panoramas...
            </p>
          )}
        </div>

      </main>
    </div>
  );
}
