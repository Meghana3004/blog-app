import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import './FullPostPage.css'; 
import LikeDislike from '../../components/LikeDislike/LikeDislike.js';
import { usePrevNextPosts, useFormattedPostData } from '../../hooks/useFullPostHooks';
import { fetchPostData } from '../../utils/fetchPostData.js';

const Comments = lazy(() => import('../../components/Comments/Comments.js'));

const FullPostPage = () => {
  const { index } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { prevPostId, nextPostId, disableButtons } = usePrevNextPosts(post?.post_id);
  const { formattedDate, formattedText, postTime } = useFormattedPostData(post);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    axios.get(`/posts/${index}`)
      .then((response) => {
        if (active) setPost(response.data);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || 'Unable to load this post.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [index]);

  const back = () => {
    navigate('/AllPosts');
  };

  const handleNext = async () => {
    if (nextPostId) {
      const postData = await fetchPostData(nextPostId);
      if (postData) {
        navigate(`/${nextPostId}`, { state: postData });
      }
    }
  };

  const handlePrevious = async () => {
    if (prevPostId) {
      const postData = await fetchPostData(prevPostId);
      if (postData) {
        navigate(`/${prevPostId}`, { state: postData });
      }
    }
  };

  if (loading) {
    return <p role="status">Loading post...</p>;
  }
  if (error || !post) {
    return <p role="alert">{error || 'Post not found.'}</p>;
  }

  return (
    <>
      <Container className="post-content-container">
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="post-title">{post.title}</h1>
              <p className="post-subtitle">{formattedDate}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card className="post-content-card">
              <Card.Body>
                <div dangerouslySetInnerHTML={{ __html: formattedText }} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="rating-container mt-3">
              <div className="post-info">
                <p>Posted by {post.username} at {postTime}</p>
              </div>
              <div>
                <LikeDislike postId={post.post_id} />
              </div>
            </div>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={12}>
            <h3>Comments</h3>
            <Suspense fallback={<div>Loading comments...</div>}>
              <Comments postId={post.post_id} />
            </Suspense>
          </Col>
        </Row>
      </Container>
      
      <div className="buttons">
        <Button className="rounded-pill" variant="outline-dark" onClick={handlePrevious} disabled={disableButtons.prevDisabled}>
          Previous
        </Button>
        <Button className="rounded-pill" variant="outline-dark" onClick={back}>
          Back to All Posts
        </Button>
        <Button className="rounded-pill" variant="outline-dark" onClick={handleNext} disabled={disableButtons.nextDisabled}>
          Next
        </Button>
      </div>
    </>
  );
};

export default FullPostPage;



