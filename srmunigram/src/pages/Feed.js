// src/pages/Feed
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "./Post";
import CreatePost from "./CreatePost";
import "./Feed.css";

// Icons
import { FaHeart } from "react-icons/fa";
import {
  MdOutlineHome,
  MdOutlineSearch,
  MdOutlineAddBox,
  MdOutlinePerson,
} from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

// Assets
import unigramLogo from "../assets/masterlogo.png";

export default function Feed() {
  const [feedData, setFeedData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  // UI states
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const DEFAULT_PFP = "https://i.postimg.cc/bYKxqBFF/pfp.jpg";
  const [showUniPostModal, setShowUniPostModal] = useState(false);
  // ------------------ Fetch posts and notifications ------------------
  useEffect(() => {
    const fetchFeed = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        // Fetch posts
        const postRes = await fetch("https://srm-unigram-backend.onrender.com/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const postResult = await postRes.json();
        if (postRes.ok) {
          const normalized = postResult.map((post) => ({
            ...post,
            username: post.username || post.userId?.name || "Unknown User",
            profileImageUrl:
              post.profileImageUrl || post.userId?.profileImageUrl || DEFAULT_PFP,
            likes: Array.isArray(post.likes)
              ? post.likes
              : typeof post.likes === "number"
              ? new Array(post.likes).fill(null)
              : [],
          }));
          setFeedData(normalized);
        } else {
          setError(postResult.error || "Failed to fetch feed data");
        }

        // Fetch notifications
        const notifRes = await fetch(
          `https://srm-unigram-backend.onrender.com/api/notifications/${currentUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const notifResult = await notifRes.json();
        if (notifRes.ok) {
          setNotifications(notifResult);
          setHasUnread(notifResult.some((n) => !n.read));
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Try again.");
      }
      setLoading(false);
    };
    fetchFeed();
  }, [currentUserId]);

  // ------------------ Create Post ------------------
  const handlePostCreated = (newPost) => {
    const normalized = {
      ...newPost,
      username: newPost.username || newPost.userId?.name || "Unknown User",
      profileImageUrl:
        newPost.profileImageUrl || newPost.userId?.profileImageUrl || DEFAULT_PFP,
      likes: Array.isArray(newPost.likes)
        ? newPost.likes
        : typeof newPost.likes === "number"
        ? new Array(newPost.likes).fill(null)
        : [],
    };
    setFeedData((prev) => [normalized, ...prev]);
    setShowCreatePost(false);
  };

  const sendNotification = async ({ recipient, type, postId, commentId }) => {
  if (!recipient || recipient === currentUserId) return; // do not notify self
  try {
    const token = localStorage.getItem("token");
    await fetch("https://srm-unigram-backend.onrender.com/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        userId: recipient,     // backend expects userId
        fromUser: currentUserId, // backend expects fromUser
        type,
        postId,
        commentId,
      }),
    });
    setHasUnread(true); // immediately light up the red dot
  } catch (err) {
    console.error("Error sending notification:", err);
  }
};
  // ------------------ Like a post ------------------
  const handlePostLike = async (postId, likesOrCount, liked, postUserId) => {
    setFeedData((prev) =>
      prev.map((post) => {
        if (post._id !== postId) return post;
        if (Array.isArray(likesOrCount)) return { ...post, likes: likesOrCount };
        if (typeof likesOrCount === "number") {
          return { ...post, likes: Array.isArray(post.likes) ? new Array(likesOrCount).fill(null) : likesOrCount };
        }
        if (typeof liked === "boolean") {
          if (Array.isArray(post.likes)) return liked ? { ...post, likes: [...post.likes, null] } : { ...post, likes: post.likes.slice(0, -1) };
          if (typeof post.likes === "number") return liked ? { ...post, likes: post.likes + 1 } : { ...post, likes: Math.max(0, post.likes - 1) };
          return { ...post, likes: liked ? [null] : [] };
        }
        return post;
      })
    );

    // Send notification if liked (not unliked) and not own post
    if (liked) sendNotification({ recipient: postUserId, type: "like", postId });
  };

  // ------------------ Comment a post ------------------
  const handlePostComments = (postId, updatedComments, postUserId) => {
    setFeedData((prev) =>
      prev.map((post) => (post._id === postId ? { ...post, comments: updatedComments } : post))
    );

    // Send notification for the last comment added
    if (updatedComments.length > 0) {
      const lastComment = updatedComments[updatedComments.length - 1];
      sendNotification({ recipient: postUserId, type: "comment", postId, commentId: lastComment._id });
    }
  };

  // ------------------ Mark notifications as read ------------------
  const toggleNotifications = async () => {
    navigate("/notifications");
  };

  return (
    <div className="feed">
      {/* ---------- HEADER ---------- */}
      <div className="feed-header">
        <img src={unigramLogo} alt="Unigram" className="feed-logo" />
        <div className="header-icons">
          <div className="notification-wrapper">
            <FaHeart
              className="icon"
              style={{ color: hasUnread ? "red" : "black", cursor: "pointer" }}
              onClick={toggleNotifications}
            />
            {hasUnread && <span className="notif-dot"></span>}
          </div>
        </div>
      </div>

      {/* ---------- CONDITIONAL FULL PAGE CREATE POST ---------- */}
      {showCreatePost && (
        <div className="create-post-fullpage">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* ---------- MESSAGES ---------- */}
      {error && <div>{error}</div>}
      {!loading && !error && !feedData.length && <div>No posts yet</div>}

      {/* ---------- POSTS ---------- */}
      <div className="posts">
        {feedData.map((p) => (
          <Post
            key={p._id || p.id}
            post={p}
            onLikeUpdated={(likesOrCount, liked) => handlePostLike(p._id, likesOrCount, liked, p.userId)}
            onCommentsUpdated={(updatedComments) => handlePostComments(p._id, updatedComments, p.userId)}
          />
        ))}
        <div className="cortex">© 2025 cortex²</div>
      </div>

      {/* ---------- FOOTER ---------- */}
      <div className="feed-footer">
        <MdOutlineHome className="footer-icon" onClick={() => navigate("/feed")} />
        <MdOutlineSearch className="footer-icon" />
        <MdOutlineAddBox className="footer-icon" onClick={() => setShowPostMenu(!showPostMenu)} />
        <IoChatbubbleEllipsesOutline className="footer-icon" />
        <MdOutlinePerson
          className="footer-icon"
          onClick={() => {
            const userId = localStorage.getItem("userId");
            if (!userId) return alert("Login required!");
            navigate(`/profile/${userId}`);
          }}
        />
      </div>

     {/* ---------- POST MENU OVERLAY (First Dialog) ---------- */}
{showPostMenu && (
  <div className="post-menu-overlay">
    <div className="post-menu">
      <button
        onClick={() => {
          setShowUniPostModal(true); // open second modal
          setShowPostMenu(false);    // close first menu
        }}
      >
        UniPost
      </button>

      <button
        className="close-btn"
        onClick={() => setShowPostMenu(false)}
      >
        ✕
      </button>
    </div>
  </div>
)}

{/* ---------- UniPost Modal (Second Dialog) ---------- */}
{showUniPostModal && (
  <div className="uni-post-modal">
    <div className="uni-post-content">
      {/* X mark to close */}
      <button
        className="close-btn"
        onClick={() => setShowUniPostModal(false)}
      >
        ✕
      </button>

      {/* Render CreatePost */}
      <CreatePost
        onPostCreated={(newPost) => {
          handlePostCreated(newPost); // add to feed
          setShowUniPostModal(false); // close modal
        }}
      />
    </div>
  </div>
)}
    </div>
  );
}