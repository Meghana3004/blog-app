// src/hooks/useProfileHooks.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUserData = (username) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      console.error('Not logged in');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${username}`);
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data');
      }
    };

    fetchUserData();
  }, [username]);

  return { userData, error };
};

export const usePosts = (username) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/posts/user?username=${username}`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error('Data is not an array', response.data);
          setPosts([]);
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts');
      });
  }, [username]);

  return { posts, setPosts, error };
};

const hooks = {useUserData, usePosts};
export default hooks;