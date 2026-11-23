import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

function FormComponent({ 
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
  submitButtonText 
}) {
  const [imageFile, setImageFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const submitPost = async (event) => {
    event.preventDefault();
    setUploadError('');
    let imageUrl = image;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await axios.post('/uploads', formData);
        imageUrl = response.data.imageUrl;
        setImage(imageUrl);
      }
      await handleSubmit(event, imageUrl, category, tags);
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Image upload failed. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <Form onSubmit={submitPost}>
        <Form.Group className="form-group mb-3" controlId="formBasicEmail">
          <Form.Label className="form-label">Title</Form.Label>
          <Form.Control
            className="form-control"
            type="text"
            placeholder="Enter post title..."
            maxLength={45}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="form-group mb-3" controlId="formBasicPassword">
          <Form.Label className="form-label">Content</Form.Label>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="rich-text-editor"
            editorClassName="editor"
            toolbarClassName="toolbar"
          />
        </Form.Group>

        <Form.Group className="form-group mb-3">
          <Form.Label className="form-label">Category</Form.Label>
          <Form.Control
            type="text"
            maxLength={60}
            placeholder="e.g. Travel"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="form-group mb-3">
          <Form.Label className="form-label">Tags</Form.Label>
          <Form.Control
            type="text"
            maxLength={300}
            placeholder="Separate tags with commas"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="form-group mb-3" controlId="formBasicEmail">
          <Form.Label className="form-label">Post image</Form.Label>
          <Form.Control
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required={!image}
          />
          {image && <img className="mt-2" src={image} alt="Current post" style={{ maxWidth: '240px' }} />}
          {uploadError && <p className="text-danger" role="alert">{uploadError}</p>}
        </Form.Group>

        <Button type="submit" className="btn-post btn-green">
          {submitButtonText}
        </Button>
      </Form>
    </div>
  );
}

export default FormComponent;