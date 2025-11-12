import { useState } from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registro enviado:", formData);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre completo</label>
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Ingresa tu correo"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Crea una contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirmar contraseña</label>
          <input
            type="password"
            name="confirm"
            placeholder="Repite tu contraseña"
            value={formData.confirm}
            onChange={handleChange}
            required
          />

          <button type="submit">Registrarme</button>
        </form>

        <p className="registro-link">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
