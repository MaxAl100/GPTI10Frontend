import "./ProfilePage.css";
import { useEffect, useState } from "react";
import EventCard from "../../components/EventCard/EventCard";
import { getToken } from "../../api/auth";

export default function ProfilePage() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const firstName = name ? name.split(" ")[0] : email?.split("@")[0];

  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/events/saved/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSavedEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="profile-wrapper">
      {/* ENCABEZADO */}
      <div className="profile-header">
        <div className="profile-info-left">
          <h2 className="profile-name">Hola, {firstName} 👋</h2>
          <p className="profile-email"><strong>Correo:</strong> {email}</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <hr className="header-divider" />

      {/* TITULO */}
      <h3 className="saved-title">Mis guardados ⭐</h3>

      {/* GRID DE EVENTOS */}
      {loading ? (
        <p className="loading-text">Cargando...</p>
      ) : savedEvents.length === 0 ? (
        <p className="empty-text">Aún no tienes panoramas guardados</p>
      ) : (
        <div className="saved-grid">
          {savedEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              image_url={event.image_url}
              link={event.link}
              initialSaved={true}
              initialSaves={event.saved_count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
