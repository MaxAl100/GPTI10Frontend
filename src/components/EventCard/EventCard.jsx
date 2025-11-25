import "./EventCard.css";
import { useState } from "react";
import { getToken } from "../../api/auth";

export default function EventCard({
  id,
  title,
  date,
  location,
  image_url,
  link,
  initialSaved = false,
  initialSaves = 0,
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [saveCount, setSaveCount] = useState(initialSaves);

  const fallbackImage = "/placeholder.png";

  const toggleSave = async () => {
    const token = getToken();
    if (!token) {
      alert("Debes iniciar sesión para guardar eventos");
      return;
    }

    const res = await fetch(
      `http://localhost:8000/api/events/${id}/toggle-save/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.saved) {
      setSaved(true);
      setSaveCount((c) => c + 1);
    } else {
      setSaved(false);
      setSaveCount(c => Math.max(0, c - 1));
    }
  };

  const isDataImage = (url) => url?.startsWith("data:image/");
  const isRemoteImage = (url) => /^https?:\/\//i.test(url);
  const isTicketplus = (url) => /ticketplus\.global/i.test(url || "");

  const getImageSrc = (url) => {
    if (!url) return fallbackImage;
    if (isDataImage(url)) return url;
    if (isRemoteImage(url) && isTicketplus(url)) {
      try {
        const parsed = new URL(url);
        return url.replace(`${parsed.protocol}//${parsed.host}`, "/ticketimg");
      } catch {
        return fallbackImage;
      }
    }
    if (isRemoteImage(url)) return url;
    return fallbackImage;
  };

  const src = getImageSrc(image_url);

  return (
    <div className="event-card">

      <img
        src={src}
        alt={title}
        className="event-img"
        onError={(e) => (e.currentTarget.src = fallbackImage)}
      />

      <div className="event-info">
        {/* TÍTULO (2 líneas máximo, con ...) */}
        <h3 className="event-title fixed-title">{title}</h3>

        <p className="event-location">📍 {location}</p>
        <p className="event-date">📅 {date}</p>

        {/* BOTÓN VER MÁS */}
        <a href={link} target="_blank" rel="noreferrer">
          <button className="primary ver-mas-btn">Ver más</button>
        </a>

        <a href={`/event/${id}/comments`}>
          <button className="primary ver-mas-btn">Ver comentarios</button>
        </a>

        {/* BOTÓN GUARDAR */}
        <button
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={toggleSave}
        >
          {saved ? "★ Guardado" : "☆ Guardar"} ({saveCount})
        </button>
      </div>
    </div>
  );
}
