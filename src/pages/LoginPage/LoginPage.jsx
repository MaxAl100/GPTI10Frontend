import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import MessageModal from "../../components/MessageModal/MessageModal";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [modal, setModal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await loginUser({
      username: email,
      password: password,
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);

      // NO GUARDAMOS EL NOMBRE AQUÍ (solo en register)
      setModal({
        type: "success",
        title: "Inicio de sesión exitoso",
        message: "Bienvenido nuevamente 🎉",
      });
    } else {
      setModal({
        type: "error",
        title: "Credenciales incorrectas",
        message: "El correo o la contraseña no coinciden.",
      });
    }
  };

  const handleCloseModal = () => {
    if (modal?.type === "success") {
      navigate("/"); // redirige al inicio
    }
    setModal(null);
  };

  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
    };
  }, []);

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} autoComplete="off">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-login">
              Ingresar
            </button>
          </form>

          <div className="login-footer">
            <p>
              ¿No tienes cuenta?{" "}
              <Link to="/register">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>

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
