import { useState } from "react";
import { getToken } from "../../api/auth";
import "./CommentBox.css";

export default function CommentBox({ eventId, onCommentCreated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);

    const token = getToken();

    const res = await fetch("http://localhost:8000/api/comments/create/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
        event: eventId,
        text: text,
    }),
    });

    const bodyText = await res.text(); // <-- read raw text
    console.log("STATUS:", res.status);
    console.log("RAW RESPONSE:", bodyText);

    let data;
    try {
    data = JSON.parse(bodyText);
    } catch {
    data = null;
    }

    setLoading(false);

    if (res.ok) {
      setText("");
      if (onCommentCreated) onCommentCreated(data);
    } else {
      alert("Error posting comment");
    }
  };

  return (
    <div className="comment-box">
      <textarea
        className="comment-input"
        placeholder="Escribe un comentario..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="comment-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Enviando..." : "Comentar"}
      </button>
    </div>
  );
}
