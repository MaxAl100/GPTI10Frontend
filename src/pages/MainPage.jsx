import EventCard from "../components/EventCard";
import "./MainPage.css";
import EventList from "../components/EventList";


export default function Home() {
  const eventos = [
    { nombre: "Festival de Música", fecha: "22 Nov", lugar: "Parque Bicentenario" },
    { nombre: "Feria Gastronómica", fecha: "30 Nov", lugar: "Barrio Italia" },
    { nombre: "Stand Up Night", fecha: "15 Dic", lugar: "Teatro Nescafé" },
  ];

  return (
    <main>
      <section className="hero">
        <h2>Descubre los mejores panoramas cerca de ti</h2>
        <p>Conecta con experiencias únicas y personas increíbles.</p>
        <button className="explorar-btn">Explorar</button>
      </section>

      <EventList />


      <section className="eventos">
        <h3>Eventos destacados</h3>
        <div className="cards-container">
          {eventos.map((e, i) => (
            <EventCard key={i} {...e} />
          ))}
        </div>
      </section>
    </main>
  );
}
