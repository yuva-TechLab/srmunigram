import React, { useState, useEffect } from 'react';
import './Post.css';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';  

const DEFAULT_PFP = 'https://i.postimg.cc/bYKxqBFF/pfp.jpg'; 

const Post = ({ post, id }) => { // added id prop
  const { 
    _id,
    imageUrl, 
    caption, 
    username, 
    profileImageUrl: initialProfileImageUrl, 
    userId,
    timestamp, 
    likes = [],
    comments: initialComments = [] 
  } = post;

  const token = localStorage.getItem('token');
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  const [profileImageUrl, setProfileImageUrl] = useState(initialProfileImageUrl || DEFAULT_PFP);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [liked, setLiked] = useState(likes.includes(currentUserId));
  const [comments, setComments] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const navigate = useNavigate(); 

  const formattedTime = timestamp
    ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    : '';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`https://srm-unigram-backend.onrender.com/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfileImageUrl(data.profileImageUrl || DEFAULT_PFP);
        }
      } catch (err) {
        console.error('Failed to fetch user profile for post:', err);
      }
    };

    if (!initialProfileImageUrl) fetchUserProfile();
  }, [userId, token, initialProfileImageUrl]);

  // ------------------ HANDLE LIKE ------------------
  const handleLike = async () => {
  try {
    const response = await fetch(`https://srm-unigram-backend.onrender.com/api/posts/${_id}/like`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to like/unlike post');

    const result = await response.json();
    setLikesCount(result.likesCount);
    setLiked(result.liked);

  } catch (err) {
    console.error(err);
    alert('Error updating like');
  }
};

  // ------------------ HANDLE COMMENT ------------------
  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const response = await fetch(`https://srm-unigram-backend.onrender.com/api/posts/${_id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const updatedComments = await response.json();
      setComments(updatedComments);
      setNewComment('');

    // Emit notification to post owner if commenter is not the owner
const postOwnerId = typeof userId === "string" ? userId : userId?._id;
if (postOwnerId && postOwnerId.toString() !== currentUserId) {
  await fetch(`https://srm-unigram-backend.onrender.com/api/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      userId: postOwnerId,           // recipient
      fromUser: currentUserId,  // actor
      type: 'comment',          // correct type
      postId: _id,
      commentId: null,          // top-level comment
    }),
  });
}

    } catch (err) {
      console.error(err);
      alert('Error adding comment');
    }
  };

  const toggleComments = () => setShowComments(!showComments);

  const handleShare = () => {
    const postLink = `${window.location.href}?post=${_id}`;
    navigator.clipboard.writeText(postLink);
    alert('Post link copied to clipboard!');
  };
return (
    <div className="post" id={id}> {/* added id prop here */}
      <div className="post-header">
        <div 
          className="user-info" 
          onClick={() => {
            const id = typeof userId === 'string' ? userId : userId?._id;
            if (!id) return alert("User ID not available");
            navigate(`/profile/${id}`);
          }}
          style={{ cursor: 'pointer' }}
        >
          <img className="profile-image" src={profileImageUrl} alt="Profile" />
          <span className="username">{username}</span>
        </div>
        <span className="timestamp">{formattedTime}</span>
      </div>

      <div className="post-image">
        <img src={imageUrl} alt="Post" />
      </div>

      <div className="post-caption">
        <p>{caption}</p>
      </div>

      <div className="post-actions">
        <button className="action-btn" onClick={handleLike}>
          {liked ? <FaHeart className="icon heart liked"/> : <FaRegHeart className="icon heart"/>} 
          <span>{likesCount}</span>
        </button>
        <button className="action-btn" onClick={toggleComments}>
          <FaComment className="icon comment"/>
          <span>{comments.length}</span>
        </button>
        <button className="action-btn" onClick={handleShare}>
          <FaShare className="icon share"/>
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          {comments.map((c, index) => (
            <div key={index} className="comment">
              <b>{c.username || 'User'}:</b> {c.text}
            </div>
          ))}

          {/* Add comment input */}
          <div className="comment-input">
            <input
              type="text"
              value={newComment}
              placeholder="Add a comment..."
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button onClick={handleAddComment}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;