import "./ProfilePage.css";

export default function ProfilePage() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const firstName = name ? name.split(" ")[0] : email?.split("@")[0];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Hola, {firstName} 👋</h2>

        <div className="profile-info">
          <p><strong>Correo:</strong> {email}</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>

        <hr className="profile-divider" />

        <div className="saved-section">
          <h3 className="saved-title">Mis guardados ⭐</h3>
          <p className="saved-subtitle">Aquí aparecerán tus panoramas guardados.</p>

          <div className="saved-empty-box">
            <p>Aún no tienes panoramas guardados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
