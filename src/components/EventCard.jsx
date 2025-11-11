import "./EventCard.css";

export default function EventCard({ nombre, fecha, lugar }) {
  return (
    <div className="event-card">
      <h3>{nombre}</h3>
      <p>📅 {fecha}</p>
      <p>📍 {lugar}</p>
    </div>
  );
}
