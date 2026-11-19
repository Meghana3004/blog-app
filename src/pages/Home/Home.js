import React from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import HikingIcon from '@mui/icons-material/Hiking';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PeopleIcon from '@mui/icons-material/People';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  return (
    <>
      <section className="page-section">
        <div className="container px-4 px-lg-5">
          <h2 className="text-center mt-0">What You'll Find Here!</h2>
          <hr className="divider divider-green" />
          <Row className="gx-4 gx-lg-7">
            <Col lg={3} md={6} className="text-center">
              <div className="mt-5">
                <div className="mb-2">
                  <TravelExploreIcon className="icon" />
                </div>
                <h3 className="h2 mb-4">Travel Guides</h3>
                <p className="text-muted mb-0">
                  Discover comprehensive guides to various destinations, packed with insider tips and recommendations.
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="text-center">
              <div className="mt-5">
                <div className="mb-2">
                  <HikingIcon className="icon" />
                </div>
                <h3 className="h2 mb-4">Adventure Stories</h3>
                <p className="text-muted mb-0">
                  Immerse yourself in our exciting travel narratives, filled with personal anecdotes and thrilling
                  experiences.
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="text-center">
              <div className="mt-5">
                <div className="mb-2">
                  <TipsAndUpdatesIcon className="icon" />
                </div>
                <h3 className="h2 mb-4">Tips and Hacks</h3>
                <p className="text-muted mb-0">
                  Learn practical travel tips, packing hacks, and ways to make the most of your adventures.
                </p>
              </div>
            </Col>
            <Col lg={3} md={6} className="text-center">
              <div className="mt-5">
                <div className="mb-2">
                  <PeopleIcon className="icon" />
                </div>
                <h3 className="h2 mb-4">Community</h3>
                <p className="text-muted mb-0">
                  We strive to foster a global community, where shared stories and adventures transcend borders.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <Card className="text-white mission d-flex align-items-center">
      <div class="container px-4 px-lg-5">
          <div class="row gx-4 gx-lg-5 justify-content-center">
              <div class="col-lg-8 text-center">
                  <h1 class="text-white mt-0">Our Mission</h1>
                  <hr class="divider divider-light" />
                  <p class="text-white-75 mb-4">At Infinite Horizons, we are passionate about exploring the world and
                    sharing our travel experiences with you. Our mission is to inspire, guide,
                    and connect fellow wanderers to the wonders of our planet.</p>
                  <a class="btn btn-light btn-xl" href="#featured">Explore Now!</a>
              </div>
          </div>
      </div>
    </Card>

      <Container className="py-5" id="featured">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center mt-0">Featured Posts</h2>
            <hr className="divider divider-green" />
            <Row xs={1} md={3} className="g-4">
              <Col>
                <Link to="/AllPosts" style={{ textDecoration: 'none' }}>
                  <Card className="h-100">
                    <Card.Img
                      variant="top"
                      src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEJhbGl8ZW58MHx8MHx8fDA%3D"
                    />
                    <Card.Body>
                      <Card.Title>A Serene Retreat in Bali</Card.Title>
                      <Card.Text>
                        Bali, often hailed as the Island of the Gods, greeted me with its lush green landscapes and a
                        vibrant tapestry of cultural richness.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col>
                <Link to="/AllPosts" style={{ textDecoration: 'none' }}>
                  <Card className="h-100 hover-effect">
                    <Card.Img
                      variant="top"
                      src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1773&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                    <Card.Body>
                      <Card.Title>Exploring the Charming Streets of Paris</Card.Title>
                      <Card.Text>
                        Paris, often referred to as the City of Light, is a timeless destination that never fails to
                        captivate visitors with its iconic landmarks and charming streets.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col>
                <Link to="/Allposts" style={{ textDecoration: 'none' }}>
                  <Card className="h-100 hover-effect">
                    <Card.Img
                      variant="top"
                      src="https://images.unsplash.com/photo-1607836046730-3317bd58a31b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                    <Card.Body>
                      <Card.Title>Adventures in the Himalayas</Card.Title>
                      <Card.Text>
                        Embarking on a trek in the majestic Himalayas was a transformative adventure that surpassed all
                        expectations.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <div className="newsletter-section">
  <Container>
    <Row className="justify-content-center">
      <Col md={8}>
        <div className="text-center mb-5">
          <h2 className="mb-3">Subscribe to Our Newsletter</h2>
          <p className="lead">
            Stay updated with the latest travel stories, tips, and exclusive
            offers by subscribing to our newsletter. Be the first to know about
            exciting destinations and upcoming adventures!
          </p>
        </div>
      </Col>
    </Row>
    <Row className="justify-content-center">
      <Col md={6}>
        <div className="newsletter-form-container bg-light p-5 rounded-3">
          <Form className="newsletter-form text-center">
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Label className="h4 mb-3">Join the Journey</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="newsletter-input mx-auto mb-3"
              />
              <Form.Text className="text-muted mb-4">
                Whether you're an avid traveler or someone dreaming of your next
                adventure, join our community. Share your experiences, ask
                questions, and connect with like-minded individuals who share
                the passion for exploration.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-green btn-xl">
              Subscribe
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  </Container>
</div>

<Footer />
</>
  )
}

export default Home;



