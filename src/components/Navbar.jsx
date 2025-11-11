import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">🎉 FunFindr</h1>
      <div className="navbar-links">
        <a href="#">Inicio</a>
        <a href="#">Eventos</a>
        <a href="#">Contacto</a>
      </div>
    </nav>
  );
}
