import "./EventCard.css";

export default function EventCard({ title, date, location, image_url, link }) {
  const validImage =
    image_url && image_url.startsWith("http")
      ? image_url
      : "/placeholder.png";

  return (
    <div className="event-card">
      <img src={validImage} alt={title} className="event-img" />

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
