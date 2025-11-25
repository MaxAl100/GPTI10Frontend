import "./EventComments.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComments } from "../../services/api";
import CommentBox from "../../components/CommentBox/CommentBox";


export default function EventComments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Load event title + comments
  useEffect(() => {
    async function load() {
      try {
        // Fetch event (to show title)
        const resEvent = await fetch(`http://localhost:8000/api/events/${id}/`);
        const dataEvent = await resEvent.json();
        setEventTitle(dataEvent.title);

        const dataComments = await getComments(id);
        console.log("Fetched comments:", dataComments);
        setComments(dataComments);
      } catch (err) {
        console.error("Error loading comments:", err);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  return (
    <div className="comments-wrapper">

      {/* HEADER */}
      <h2 className="comments-title">
        Comentarios sobre:{" "}
        <span className="comments-event-title">{eventTitle}</span>
      </h2>

      <hr className="comments-divider" />

      <CommentBox
        eventId={id}
        onCommentCreated={(newComment) =>
          setComments((prev) => [newComment, ...prev])
        }
      />

      {/* LISTA DE COMENTARIOS */}
      {loading ? (
        <p className="comments-loading">Cargando comentarios...</p>
      ) : comments.length === 0 ? (
        <p className="comments-empty">Aún no hay comentarios para este evento</p>
      ) : (
        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-card">
              <div className="comment-header">
                <strong className="comment-user">Usuario {c.user}</strong>
                <span className="comment-date">
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </div>

              <p className="comment-text">{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
