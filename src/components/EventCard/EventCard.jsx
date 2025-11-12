import "./EventCard.css";

export default function EventCard({ title, date, location, image_url, link }) {
  const fallbackImage = "/placeholder.png";

  const isDataImage = (url) => url?.startsWith("data:image/");
  const isRemoteImage = (url) => /^https?:\/\//i.test(url);
  const isTicketplus = (url) =>
    /ticketplus\.global/i.test(url || "");

  const getImageSrc = (url) => {
    if (!url) return fallbackImage;

    // Caso 1: SVG o imagen embebida (data:image/svg+xml;base64,...)
    if (isDataImage(url)) return url;

    // Caso 2: Imagen remota de Ticketplus (pasa por proxy para evitar CORS)
    if (isRemoteImage(url) && isTicketplus(url)) {
      try {
        const parsed = new URL(url);
        return url.replace(`${parsed.protocol}//${parsed.host}`, "/ticketimg");
      } catch {
        return fallbackImage;
      }
    }

    // Caso 3: Imagen remota normal
    if (isRemoteImage(url)) return url;

    // Caso 4: Fallback
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
        <h3 className="event-title">{title}</h3>
        <p className="event-location">📍 {location}</p>
        <p className="event-date">📅 {date}</p>
      </div>

      <a href={link} target="_blank" rel="noreferrer">
        <button className="primary">Ver más</button>
      </a>
    </div>
  );
}
