import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";
import MessageModal from "../../components/MessageModal/MessageModal";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  // modal puede ser null o { type, title, message }
  const [modal, setModal] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm) {
      setModal({
        type: "error",
        title: "Contraseñas no coinciden",
        message: "Por favor revisa que ambas contraseñas sean iguales.",
      });
      return;
    }

    const data = await registerUser({
      username: formData.email,
      email: formData.email,
      password: formData.password,
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", formData.name);
      localStorage.setItem("email", formData.email);


      setModal({
        type: "success",
        title: "Cuenta creada con éxito",
        message: "Tu cuenta ha sido creada correctamente 🎉",
      });
    } else {
      setModal({
        type: "error",
        title: "Error al registrar",
        message: data.error || "Hubo un problema al crear tu cuenta.",
      });
    }
  };

  const handleCloseModal = () => {
    // si es éxito, redirigimos
    if (modal?.type === "success") {
      navigate("/");
    }
    setModal(null);
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2>Crear cuenta</h2>

          <form onSubmit={handleSubmit} autoComplete="off">
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

            <button type="submit" className="btn-login">
              Registrarme
            </button>
          </form>

          <div className="login-footer">
            <p>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>

      {/* MODAL BONITO */}
      {modal && (
        <MessageModal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}