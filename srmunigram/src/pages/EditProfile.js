// src/pages/EditProfile.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";

export default function EditProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    bio: "",
    department: "",
    pronoun: "",
    linkedin: "",
    instagram: "",
    profileImageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // for save button & spinner
  const [error, setError] = useState("");

  const DEFAULT_PFP = "https://i.postimg.cc/bYKxqBFF/pfp.jpg";
  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_NAME || "dl79csna5";
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "unigram_unsigned";

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Login required");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`https://srm-unigram-backend.onrender.com/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({
          bio: res.data.bio || "",
          department: res.data.department || "",
          pronoun: res.data.pronoun || "",
          linkedin: res.data.linkedin || "",
          instagram: res.data.instagram || "",
          profileImageUrl: res.data.profileImageUrl || "",
        });
        setPreviewUrl(res.data.profileImageUrl || DEFAULT_PFP);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // instant preview
    }
  };

  const handleRemovePhoto = () => {
    setUserData({ ...userData, profileImageUrl: "" });
    setSelectedFile(null);
    setPreviewUrl(DEFAULT_PFP);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); // show spinner & disable button
    const token = localStorage.getItem("token");
    let updatedData = { ...userData };

    try {
      // Upload new profile picture if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );

        updatedData.profileImageUrl = uploadRes.data.secure_url;
        console.log("Cloudinary upload success:", uploadRes.data.secure_url);
      }

      // Send updated data to backend
      await axios.put(`https://srm-unigram-backend.onrender.com/api/users/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error("Failed to update profile:", err.response || err.message);
      alert("Failed to update profile. Try again.");
    } finally {
      setSaving(false); // re-enable butt
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>Profile Picture:</label>
        <div className="profile-picture-section">
          <img
            src={previewUrl || DEFAULT_PFP}
            alt="Profile"
            className="profile-picture-preview"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="button" onClick={handleRemovePhoto}>
            Remove Photo
          </button>
        </div>

        <label>Bio:</label>
        <textarea
          name="bio"
          value={userData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
        />

        <label>Department:</label>
        <input
          type="text"
          name="department"
          value={userData.department}
          onChange={handleChange}
          placeholder="Your department"
        />

        <label>Pronoun:</label>
        <input
          type="text"
          name="pronoun"
          value={userData.pronoun}
          onChange={handleChange}
          placeholder="He/She/They..."
        />

        <label>LinkedIn:</label>
        <input
          type="text"
          name="linkedin"
          value={userData.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn URL"
        />

        <label>Instagram:</label>
        <input
          type="text"
          name="instagram"
          value={userData.instagram}
          onChange={handleChange}
          placeholder="Instagram URL"
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}