import { useState } from "react";
import "./CreatePost.css";

export default function CreatePost({ onPostCreated }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!imageFile) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to post.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);

      const response = await fetch("https://srm-unigram-backend.onrender.com/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const newPost = await response.json();

      if (response.ok) {
        if (onPostCreated) onPostCreated(newPost);
        setImageFile(null);
        setImagePreview(null);
        setCaption("");
      } else {
        setError(newPost.error || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="create-post">
      <h2>Create Unipost</h2>

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleImageChange} />

      <textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <button onClick={handlePost} disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}