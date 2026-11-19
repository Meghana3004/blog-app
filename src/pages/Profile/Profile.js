// src/pages/Profile/Profile.js
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Container, Card, Button, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { useUserData, usePosts } from '../../hooks/useProfileHooks';
import { convertCommentFromJSONToHTML } from '../../utils/convertCommentFromJSONToHTML';

const Profile = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const username = sessionStorage.getItem('username'); 
  const navigate = useNavigate();

  const { userData } = useUserData(username);
  const { posts, setPosts, error } = usePosts(username);

  const handleDelete = () => {
    axios.delete(`/posts/${postToDelete}`)
      .then(() => {
        setPosts(posts.filter(post => post.id !== postToDelete));
        setPostToDelete(null);
        setShowDeleteModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          // Refresh posts
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
            });
        }, 1000); 
      })
      .catch(error => {
        console.error('Error deleting post:', error);
        setShowDeleteModal(false);
      });
  };

  const handleEdit = (post) => {
    navigate('/EditPost', { state: post});
  };

  const showDeleteConfirmation = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
        {userData ? (
          <div className="profile-header text-center">
            <div className="profile-picture">
              {userData[0].username ? userData[0].username.charAt(0).toUpperCase() : ''}
            </div>
            <h2>{userData[0].name || ''}</h2>
            <p className="username">@{userData[0].username || ''}</p>
          
          </div>
        ):(
          <div>Loading user data...</div>
        )}
        </Col>
      </Row>

      <Row>
        <Col>
        <hr class="divider divider-light" />
      <h5 className="text-center mb-4 my-posts">My Posts</h5>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {posts.map(post => {
          const parsedDate = parseISO(post.date);
          const formattedDate = format(parsedDate, "EEEE dd MMMM yyyy 'at' HH:mm");
    return(
        <Card key={post.post_id} className="mb-3">
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <p className="text-muted">{formattedDate}</p>
            <div dangerouslySetInnerHTML={{ __html: convertCommentFromJSONToHTML(post.content).substring(0, 200) + '...' }} />
            <Button variant="primary" className="me-2" onClick={()  => handleEdit(post)}>Edit</Button>
            <Button variant="danger" onClick={() => showDeleteConfirmation(post.post_id)}>Delete</Button>
          </Card.Body>
        </Card>
        );
    })}
    </Col>
  </Row>
        
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>No</Button>
          <Button variant="danger" onClick={handleDelete}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Post successfully deleted</Modal.Body>
      </Modal>
    </Container>

  );
};


export default Profile;






