import { useEffect, useState } from "react";
import { getEvents } from "../services/api";
import "./EventList.css";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getEvents(page)
      .then(data => setEvents(data.results))
      .catch(err => console.error(err));
  }, [page]);

  return (
    <section className="events">
      <h2>Panoramas cercanos</h2>
      <div className="event-grid">
        {events.map(event => (
          <div className="event-card" key={event.id}>
            <img src={event.image_url} alt={event.title} />
            <h3>{event.title}</h3>
            <p>{event.location}</p>
            <p>{event.date}</p>
            <a href={event.link} target="_blank" rel="noreferrer">
              Ver más
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
