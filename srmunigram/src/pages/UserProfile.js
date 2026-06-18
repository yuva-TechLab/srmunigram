// src/pages/UserProfile.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Post from "./Post";
import CreatePost from "./CreatePost";
import "./UserProfile.css";

import { MdOutlineHome, MdOutlineSearch, MdOutlineAddBox, MdOutlinePerson } from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import verifiedTick from "../assets/verified-tick.png";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const postIdToScroll = location.state?.postId || null;

  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState("");

  // Modal states
  
  const [showUniPostModal, setShowUniPostModal] = useState(false);
const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");
  const isOwnProfile = userId === currentUserId;
  const verifiedUsers = ["ks6867", "yb0902"]
  const DEFAULT_PFP = "https://i.postimg.cc/bYKxqBFF/pfp.jpg";

  // Fetch user info and posts
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Login required");
        setLoading(false);
        return;
      }

      if (!userId) {
        setError("No userId in URL");
        setLoading(false);
        return;
      }

      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`https://srm-unigram-backend.onrender.com/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://srm-unigram-backend.onrender.com/api/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserData(userRes.data);
        setUserPosts(postsRes.data || []);
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
        setError(err.response?.data?.error || err.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Scroll to post if coming from notification
  useEffect(() => {
    if (postIdToScroll && userPosts.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`post-${postIdToScroll}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.style.border = "2px solid #00f";
          setTimeout(() => {
            element.style.border = "none";
          }, 3000);
        }
      }, 300);
    }
  }, [postIdToScroll, userPosts]);

  const handlePostCreated = (newPost) => {
    setUserPosts((prev) => [newPost, ...prev]);
    setShowUniPostModal(false);
  };

  return (
    <div className="user-profile">
      {/* ---------- UniPost Modal ---------- */}
      {showUniPostModal && (
        <div className="uni-post-modal">
          <div className="uni-post-content">
            <button
              className="close-btn"
              onClick={() => setShowUniPostModal(false)}
            >
              ✕
            </button>
            <CreatePost onPostCreated={handlePostCreated} />
          </div>
        </div>
      )}

      {/* Profile Header */}
{userData && (
  <div className="profile-header">
    <img
      src={userData.profileImageUrl || DEFAULT_PFP}
      alt={userData.name || "User"}
      className="profile-picture"
    />
    <h3>
      {userData.name || "Unknown User"}{" "}
      {verifiedUsers.includes(userData.userhandle) && (
        <img src={verifiedTick} alt="Verified" className="verified-badge" />
      )}
    </h3>

    {userData.userhandle && (
      <p className="user-handle">@{userData.userhandle}</p>
    )}

    {isOwnProfile && (
      <button
        className="edit-profile-button"
        onClick={() => navigate(`/edit-profile/${userId}`)}
      >
        Edit Profile
      </button>
    )}

    {userData.bio && <div className="profile-field">{userData.bio}</div>}
    {userData.department && (
      <div className="profile-field">
        <strong>Department:</strong> {userData.department}
      </div>
    )}
    {userData.pronoun && (
      <div className="profile-field">
        <strong>Pronoun:</strong> {userData.pronoun}
      </div>
    )}
    {userData.linkedin && (
      <div className="profile-field">
        <strong>LinkedIn:</strong> {userData.linkedin}
      </div>
    )}
    {userData.instagram && (
      <div className="profile-field">
        <strong>Instagram:</strong> {userData.instagram}
      </div>
    )}
  </div>
)}

      {/* Error message */}
      {error && (
        <div>
          <p>{error}</p>
          {!localStorage.getItem("token") && (
            <button onClick={() => navigate("/login")}>Go to Login</button>
          )}
        </div>
      )}

      {/* User Posts */}
      {userData && (
        <div className="profile-posts">
          {userPosts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            userPosts.map((post) => (
              <Post key={post._id} id={`post-${post._id}`} post={post} currentUserId={currentUserId} />
            ))
          )}
        </div>
      )}

      {/* ---------- Footer ---------- */}
      <div className="feed-footer">
        <MdOutlineHome
          className="footer-icon"
          onClick={() => navigate("/feed")}
        />
        <MdOutlineSearch className="footer-icon" />
        <MdOutlineAddBox
          className="footer-icon"
          onClick={() => setShowUniPostModal(true)}
        />
        <IoChatbubbleEllipsesOutline className="footer-icon" />
        <MdOutlinePerson
          className="footer-icon"
          onClick={() => {
            const currentUserId = localStorage.getItem("userId");
            if (!currentUserId) return alert("Login required!");
            navigate(`/profile/${currentUserId}`);
          }}
        />
      </div>
    </div>
  );
}