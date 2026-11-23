import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../../contexts/AuthContext';

const LikeDislike = ({ postId }) => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [dislikedPosts, setDislikedPosts] = useState([]);
  const { user } = useAuth();
  const username = user?.username;

  useEffect(() => {
    const fetchLikedDislikedPosts = async () => {
      try {
        const response = await axios.get(`/users/${username}/likes`);
        const { likedPosts: fetchedLikedPosts, dislikedPosts: fetchedDislikedPosts } = response.data;

        setLikedPosts(fetchedLikedPosts);
        setDislikedPosts(fetchedDislikedPosts);
      } catch (err) {
        console.error('Error fetching like/dislike data:', err);
      }
    };

    if (username) {
      fetchLikedDislikedPosts();
    }
  }, [username]);

  const handleLike = async () => {
    try {

      const liked = true;

      // Check if the post is already disliked
      if (dislikedPosts.includes(postId)) {
        // Remove the post from the dislikedPosts array
        setDislikedPosts(dislikedPosts.filter((id) => id !== postId));
      }

      // Add the post to the likedPosts array
      setLikedPosts([...likedPosts, postId]);

      // Send a POST request to the backend
      await axios.post(`/posts/${postId}/like`, { liked });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDislike = async () => {
    try {

      const liked = false;

      if (likedPosts.includes(postId)) {
        setLikedPosts(likedPosts.filter((id) => id !== postId));
      }

      setDislikedPosts([...dislikedPosts, postId]);

      await axios.post(`/posts/${postId}/like`, { liked });
    } catch (err) {
      console.error('Error disliking post:', err);
    }
  };

  return (
    <div>
      <IconButton onClick={handleLike} disabled={!username}>
        {likedPosts.includes(postId) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
      </IconButton>
      <IconButton onClick={handleDislike} disabled={!username}>
        {dislikedPosts.includes(postId) ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
      </IconButton>
    </div>
  );
};

export default LikeDislike;