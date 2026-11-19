import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import axios from 'axios';

export const useNewPost = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = sessionStorage.getItem('username');
    const contentState = editorState.getCurrentContent();
    const content = JSON.stringify(convertToRaw(contentState));

    if (!title || !content || !image) {
      window.alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('/posts/newpost',
        {title, content, username, image},
        {
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log('Blog post created successfully.');
        window.alert('Blog post created successfully.');
        navigate('/AllPosts');
      }
    } catch (error) {
      console.error('Error creating blog post:', error.response.data);
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