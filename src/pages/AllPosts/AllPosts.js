import React from 'react';
import { Button, Col, Container, Form, Row, Pagination } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import './AllPosts.css';
import ArchiveComponent from '../../components/Archive/ArchiveComponent.js';
import Footer from '../../components/Footer/Footer.js';
import PostCard from '../../components/PostCard/PostCard.js';
import { useAllPosts } from '../../hooks/useAllPostsHooks';

const AllPosts = () => {
  const { state, setState, searchPosts, clearFilters, setFilter } = useAllPosts();
  const navigate = useNavigate();

  const handleYearClick = (year) => {
    const yearPosts = Object.values(state.archiveData[year]).flat();
    setState(prevState => ({ ...prevState, searchResults: yearPosts }));
  };

  const handleMonthClick = (year, month) => {
    setState(prevState => ({ ...prevState, searchResults: state.archiveData[year][month] }));
  };

  const handlePostClick = (post) => {
    navigate(`/${post.post_id}`, { state: post });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    searchPosts(); 
  };

  const handleNewPostClick = () => {
    navigate('/New');
  };

  const handleShowAllPosts = () => {
    clearFilters();
  };

  const toggleContent = (post) => {
    navigate(`/${post.post_id}`, { state: post});
  };

  const handlePageChange = (event, page) => {
    window.scrollTo(0, 0);
    setState(prevState => ({
      ...prevState,
      currentPage: page,
    }));
  };

  return (
    <Container fluid className="main-container mt-5">
      <Row>
        <Col md={3}>
          <ArchiveComponent
            originalData={state.originalData}
            handleYearClick={handleYearClick}
            handleMonthClick={handleMonthClick}
            handlePostClick={handlePostClick}
          />
        </Col>
        
        <Col md={6} className="main-content">
          <Form className="d-flex mb-4" onSubmit={handleFormSubmit}>
            <Form.Control
              type="search"
              placeholder="Search by title..."
              className="me-2 rounded-pill"
              aria-label="Search"
              value={state.searchTerm}
              onChange={(e) => setState(prevState => ({ ...prevState, searchTerm: e.target.value }))}
            />
            <Button type="submit" className="rounded-pill btn-green" variant="secondary">
              Search
            </Button>
          </Form>
          <Row className="g-2 mb-4">
            <Col sm={6}>
              <Form.Select
                aria-label="Filter by category"
                value={state.categoryFilter}
                onChange={(e) => setFilter('categoryFilter', e.target.value)}
              >
                <option value="">All categories</option>
                {state.categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            <Col sm={6}>
              <Form.Select
                aria-label="Filter by tag"
                value={state.tagFilter}
                onChange={(e) => setFilter('tagFilter', e.target.value)}
              >
                <option value="">All tags</option>
                {state.tags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <div className="content-container">
            {state.searchResults.length > 0 ? (
              state.searchResults.map((post, index) => (
                <PostCard key={index} post={post} toggleContent={toggleContent} />
              ))
            ) : (
              <p>{state.error || 'No results found.'}</p>
            )}
          </div>

          <Pagination className='Pagination'>
            <Pagination.First onClick={() => handlePageChange(null, 1)} />
            <Pagination.Prev onClick={() => handlePageChange(null, Math.max(state.currentPage - 1, 1))} />
            {[...Array(state.totalPages)].map((_, page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === state.currentPage}
                onClick={() => handlePageChange(null, page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(null, Math.min(state.currentPage + 1, state.totalPages))} />
            <Pagination.Last onClick={() => handlePageChange(null, state.totalPages)} />
          </Pagination>

          {(state.appliedSearchTerm || state.categoryFilter || state.tagFilter) && (
            <Button className="mt-3 button-spacing rounded-pill" variant="outline-dark" onClick={handleShowAllPosts}>
              Clear filters
            </Button>
          )}

          <Button className="mt-3 rounded-pill" variant="outline-dark" onClick={handleNewPostClick}>
            Create New Post
          </Button>
        </Col>
      </Row>

      <Footer />
    </Container>
  );
};

export default AllPosts;

