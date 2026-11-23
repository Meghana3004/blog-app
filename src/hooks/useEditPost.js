import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import axios from 'axios';

export const useEditPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state;
  const id = post?.post_id;

  const [title, setTitle] = useState(post?.title || '');
  const [image, setImage] = useState(post?.image || '');
  const [category, setCategory] = useState(post?.category || '');
  const [tags, setTags] = useState(Array.isArray(post?.tags) ? post.tags.join(', ') : '');
  const [editorState, setEditorState] = useState(
    post?.content
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(post.content)))
      : EditorState.createEmpty()
  );

  useEffect(() => {
    if (!id) {
      navigate('/Profile');
    }
  }, [id, navigate]);

  const handleSubmit = async (event, imageUrl = image, categoryValue = category, tagsValue = tags) => {
    event.preventDefault();
    const contentState = editorState.getCurrentContent();
    const content = JSON.stringify(convertToRaw(contentState));

    try {
      const response = await axios.put(
        `/posts/${id}`,
        { title, content, image: imageUrl, category: categoryValue, tags: tagsValue },
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
    category,
    setCategory,
    tags,
    setTags,
    editorState,
    setEditorState,
    handleSubmit,
  };
};