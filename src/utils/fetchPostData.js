import axios from 'axios';

export const fetchPostData = async (postId) => {
  try {
    const response = await axios.get(`/posts/${postId}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching post data for post ID ${postId}:`, err);
    return null;
  }
};