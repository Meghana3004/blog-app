import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import axios from 'axios';

export const useEditPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state || {};

  const [title, setTitle] = useState(post?.title || '');
  const [image, setImage] = useState(post?.image || '');
  const [editorState, setEditorState] = useState(
    post?.content
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(post.content)))
      : EditorState.createEmpty()
  );

  const id = post.post_id;

  useEffect(() => {
    if (!post) {
      navigate('/Profile');
    }
  }, [post, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const contentState = editorState.getCurrentContent();
    const content = JSON.stringify(convertToRaw(contentState));

    try {
      const response = await axios.put(
        `/posts/${id}`,
        { title, content, image },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log('Blog post updated successfully.');
        window.alert('Blog post updated successfully.');
        navigate('/Profile');
      }
    } catch (error) {
      console.error('Error updating blog post:', error.response.data);
    }
  };

  return {
    title,
    setTitle,
    image,
    setImage,
    editorState,
    setEditorState,
    handleSubmit,
  };
};