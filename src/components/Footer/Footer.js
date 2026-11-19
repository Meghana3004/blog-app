import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer py-5" id="contact">
      <Container>
        <Row className="justify-content-between">
          <Col md={4}>
            <h4 className="mb-4 text-white">About Us</h4>
            <p>
              Our mission is to inspire,
              guide, and connect fellow wanderers to the wonders of our planet.
            </p>
          </Col>
          <Col md={4}>
            <h4 className="mb-4 text-white">Contact Us</h4>
            <p>
              Have a question, suggestion, or collaboration idea? Reach out to us at{' '}
              <a href="mailto:infinite.horizons@gmail.com">
                infinite.horizons@gmail.com
              </a>
            </p>
          </Col>
          <Col md={4}>
            <h4 className="mb-4 text-white">Location</h4>
            <p>
              <strong>Address:</strong> 123 Main Street, City, State, ZIP
            </p>
            <p>
              <strong>Phone:</strong> (123) 456-7890
            </p>
          </Col>
        </Row>
        <Row className="mt-4">
          <p className="mb-0">
            © 2024 Infinite Horizons. All rights reserved.
          </p>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
