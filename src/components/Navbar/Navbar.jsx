import "./Navbar.css";
import { useState, useRef, useEffect } from "react";
import { FaUser, FaMapMarkerAlt, FaBars, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.png";

export default function Navbar() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [address, setAddress] = useState("Santiago");
  const addressRef = useRef(null);
  const tooltipRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDocClick = (e) => {
      if (
        showTooltip &&
        tooltipRef.current &&
        addressRef.current &&
        !tooltipRef.current.contains(e.target) &&
        !addressRef.current.contains(e.target)
      ) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showTooltip]);

  return (
    <>
      {/* === BARRA SUPERIOR === */}
      <div className="topbar">
        <div className="left-section">
          <Link to="/">
            <img src={logo} alt="Logo FunFindr" className="logo-img" />
          </Link>
        </div>

        <div className="right-section">
          <div
            className="address-display"
            ref={addressRef}
            onClick={() => setShowTooltip((v) => !v)}
          >
            <FaMapMarkerAlt className="icon-location" />
            <span>{address}</span>
          </div>

          <div className="actions">
            <button className="navbar-login" onClick={() => navigate("/login")}>
              <FaUser /> Iniciar sesión
            </button>
          </div>
        </div>
      </div>

      {/* === MENÚ SECUNDARIO === */}
      <nav className="menu-scroll">
        <div className="menu-container">
          <div className="menu-links">
            <Link to="/">
              <FaBars className="menu-icon" /> Panoramas
            </Link>
            <span className="separator">|</span>
            <a href="#">Populares</a>
            <span className="separator">|</span>
            <a href="#">Cercanos</a>
            <span className="separator">|</span>
            <a href="#">Próximos</a>
          </div>

          <div className="menu-search">
            <input type="text" placeholder="Buscar panoramas..." />
            <button>
              <FaSearch />
            </button>
          </div>
        </div>
      </nav>
      
      {/* === TOOLTIP DE UBICACIÓN === */}
      {showTooltip && (
        <div
          className="tooltip-box"
          ref={tooltipRef}
          style={{
            top:
              addressRef.current?.getBoundingClientRect().bottom +
              window.scrollY +
              10,
            left:
              addressRef.current?.getBoundingClientRect().left +
              addressRef.current?.offsetWidth / 2,
          }}
        >
          <div className="tooltip-content">
            <p>Cambia tu ubicación para ver panoramas cercanos:</p>

            <label htmlFor="direccion">Ubicación</label>
            <input
              id="direccion"
              type="text"
              placeholder="Ej: Providencia, Ñuñoa..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button className="confirm-btn" onClick={() => setShowTooltip(false)}>
              Confirmar
            </button>
          </div>
          <div className="tooltip-arrow" />
        </div>
      )}
    </>
  );
}
