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
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setSavedEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Hola, {firstName} 👋</h2>

        <div className="profile-info">
          <p><strong>Correo:</strong> {email}</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>

        <hr className="profile-divider" />

        <div className="saved-section">
          <h3 className="saved-title">Mis guardados ⭐</h3>
          <p className="saved-subtitle">Aquí aparecerán tus panoramas guardados.</p>

          {loading ? (
            <p style={{ textAlign: "center" }}>Cargando...</p>
          ) : savedEvents.length === 0 ? (
            <div className="saved-empty-box">
              <p>Aún no tienes panoramas guardados</p>
            </div>
          ) : (
            <div className="saved-list">
              {savedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  image_url={event.image_url}
                  link={event.link}
                  initialSaved={true}           // siempre guardados
                  initialSaves={event.saved_count}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
