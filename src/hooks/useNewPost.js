import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import axios from 'axios';

export const useNewPost = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const navigate = useNavigate();

  const handleSubmit = async (event, imageUrl = image, categoryValue = category, tagsValue = tags) => {
    event.preventDefault();

    const contentState = editorState.getCurrentContent();
    const content = JSON.stringify(convertToRaw(contentState));

    if (!title.trim() || !content || !imageUrl) {
      window.alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('/posts/newpost',
        { title, content, image: imageUrl, category: categoryValue, tags: tagsValue },
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
      console.error('Error creating blog post:', error.response?.data || error.message);
      window.alert(error.response?.data?.message || 'Unable to create the post.');
    }
  };

  return {
    title,
    setTitle,
    image,
    setImage,
    category,
    setCategory,
    tags,
    setTags,
    editorState,
    setEditorState,
    handleSubmit,
  };
};