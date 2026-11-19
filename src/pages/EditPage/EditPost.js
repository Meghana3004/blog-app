import React from 'react';
import './New.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import { useEditPost } from '../../hooks/useEditPost';

function EditPost() {
  const {
    title,
    setTitle,
    image,
    setImage,
    editorState,
    setEditorState,
    handleSubmit,
  } = useEditPost();

  return (
    <main>
      <div className="newcontainer">
        <hr style={{ margin: "2rem 0" }} />
        <h2>Edit Your Post</h2>
        <hr style={{ margin: "2rem 0" }} />
        <FormComponent
          title={title}
          setTitle={setTitle}
          image={image}
          setImage={setImage}
          editorState={editorState}
          setEditorState={setEditorState}
          handleSubmit={handleSubmit}
          submitButtonText="Save Changes"
        />
      </div>
    </main>
  );
}

export default EditPost;

