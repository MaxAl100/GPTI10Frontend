import "./MessageModal.css";

export default function MessageModal({ type = "success", title, message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">

        {/* Icono */}
        <div className={`modal-icon ${type}`}>
          {type === "success" ? "✔" : "✖"}
        </div>

        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        <button className={`modal-button ${type}`} onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
}
