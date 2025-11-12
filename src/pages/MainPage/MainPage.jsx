import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import EventCard from "../../components/EventCard/EventCard";
import { useEffect, useState } from "react";
import "./MainPage.css";

export default function MainPage() {
  const [events, setEvents] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    // URL del backend donde está alojada la API
    const apiURL = "http://localhost:8000/api/events/";

    // Realiza la solicitud a la API para obtener los eventos
    fetch(apiURL)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar eventos");
        return res.json();
      })
      .then((data) => setEvents(data.results)) // Asigna los eventos al estado
      .catch((err) => console.error("Error al cargar datos:", err));
  }, []); // El arreglo vacío [] asegura que esto se ejecute solo una vez al cargar la página

  return (
    <div className="mainpage-wrapper">
      <main style={{ backgroundColor: "#f4f4f4", minHeight: "80vh" }}>
        {/* === BARRA DE FILTRO Y ORDENAR === */}
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
                  <li>Destacado</li>
                  <li>Más recientes</li>
                  <li>Más antiguos</li>
                  <li>Nombre ascendente</li>
                  <li>Nombre descendente</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* === GRILLA DE EVENTOS === */}
        <div className="event-grid">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                image_url={event.image_url} // 👈 intacto
                link={event.link}
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
              Cargando panoramas...
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
