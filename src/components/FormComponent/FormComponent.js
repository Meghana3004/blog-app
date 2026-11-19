import React from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Form } from 'react-bootstrap';

function FormComponent({ 
  title, 
  setTitle, 
  image, 
  setImage, 
  editorState, 
  setEditorState, 
  handleSubmit, 
  submitButtonText 
}) {
  return (
    <div className="form-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="form-group mb-3" controlId="formBasicEmail">
          <Form.Label className="form-label">Title</Form.Label>
          <Form.Control
            className="form-control"
            type="text"
            placeholder="Enter post title..."
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

        <Form.Group className="form-group mb-3" controlId="formBasicEmail">
          <Form.Label className="form-label">Image</Form.Label>
          <Form.Control
            className="form-control"
            type="text"
            placeholder="Add image link..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" className="btn-post btn-green">
          {submitButtonText}
        </Button>
      </Form>
    </div>
  );
}

export default FormComponent;