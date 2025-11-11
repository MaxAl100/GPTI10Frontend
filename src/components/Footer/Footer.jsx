import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* === SERVICIO AL CLIENTE === */}
          <div className="footer-section">
            <h3>Contacto</h3>
            <p>Horario de atención:</p>
            <p>Lunes a Jueves de 10:00 a 19:00 hrs.</p>
            <p>Viernes de 10:00 a 15:00 hrs.</p>
            <p>
              Correo:{" "}
              <a href="mailto:contacto@funfindr.cl" className="email-link">
                contacto@funfindr.cl
              </a>
            </p>
          </div>

          {/* === SOBRE FUNFINDR === */}
          <div className="footer-section">
            <h3>Sobre FunFindr</h3>
            <a href="#">Quiénes somos</a>
            <a href="#">Términos y condiciones</a>
            <a href="#">Política de privacidad</a>
            <a href="#">Contacto</a>
          </div>
        </div>
      </div>

      {/* === LÍNEA INFERIOR === */}
      <div className="footer-bottom">
        <p>© 2025 FunFindr. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
