// src/pages/Notifications.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false); // Start with false to avoid flash
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUserId || !token) {
        setError("Login required");
        return;
      }

      setLoading(true); // Set loading only when fetch starts
      try {
        const res = await fetch(`https://srm-unigram-backend.onrender.com/api/notifications/${currentUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setNotifications(data);
          const hasUnread = data.some((n) => !n.read);
          if (hasUnread) await markAllAsRead();
        } else {
          setError(data.error || "Failed to fetch notifications");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Try again.");
      } finally {
        setLoading(false);
      }
    };

    const markAllAsRead = async () => {
      try {
        await fetch(`https://srm-unigram-backend.onrender.com/api/notifications/mark-seen/${currentUserId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error("Error marking notifications as read:", err);
      }
    };

    fetchNotifications();
  }, [currentUserId, token]);

  if (loading) return null; // Nothing rendered while loading
  if (error) return <div>{error}</div>;

  return (
    <div className="notifications-page">
      {/* X Close Button */}
      <button className="close-btn" onClick={() => navigate("/feed")}>✕</button>

      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => {
            const username = n.fromUser?.name || "User";
            const userId = n.fromUser?._id || n.fromUser;
            const postId = n.postId;

            return (
              <div
                key={n._id}
                className={`notification-item ${!n.read ? "unread" : ""}`}
                onClick={() =>
                  navigate(`/profile/${userId}`, { state: { highlightPost: postId } })
                }
              >
                <span
                  style={{ fontWeight: "bold", color: "#3897f0", cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${userId}`);
                  }}
                >
                  {username}
                </span>{" "}
                {n.message.replace(username, "")}
                <small className="timestamp">
                  {new Date(n.timestamp).toLocaleString()}
                </small>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}