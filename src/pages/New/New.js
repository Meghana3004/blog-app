import React from 'react';
import './New.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import Footer from '../../components/Footer/Footer';
import { useNewPost } from '../../hooks/useNewPost';

function New() {
  const {
    title,
    setTitle,
    image,
    setImage,
    editorState,
    setEditorState,
    handleSubmit,
  } = useNewPost();

  return (
    <main>
      <div className="newcontainer">
        <hr style={{ margin: "2rem 0" }} />
        <h2>Share Your Thoughts!</h2>
        <hr style={{ margin: "2rem 0" }} />
        <FormComponent
          title={title}
          setTitle={setTitle}
          image={image}
          setImage={setImage}
          editorState={editorState}
          setEditorState={setEditorState}
          handleSubmit={handleSubmit}
          submitButtonText="Post"
        />
      </div>
      <Footer />
    </main>
  );
}

export default New;