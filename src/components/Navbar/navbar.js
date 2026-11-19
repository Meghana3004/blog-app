import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

function NavbarExample() {
  
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username'); 

  const handleLogout = () => {
    navigate('/Login?logout=true');
  }

  const handleContactClick = () => {
    const currentPath = window.location.pathname;

    if (currentPath !== '/Home') {
      navigate('/Home');
    }

    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {['md'].map((expand) => (
        <Navbar sticky="top" key={expand} expand={expand} data-bs-theme="dark" style={{backgroundColor: '#3DCD58'}}>
          <Container fluid>
            <Navbar.Brand href="Home">Infinite Horizons</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="Home">Home</Nav.Link>
                  <Nav.Link href="AllPosts">Read</Nav.Link>
                  <Nav.Link href="New">Create</Nav.Link>
                  <Nav.Link href="#" onClick={handleContactClick}>Contact</Nav.Link>
                  
                  {/* <NavDropdown title="More" id={`offcanvasNavbarDropdown-expand-${expand}`}>
                    <NavDropdown.Item href="Archive">AGgrid</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="Documentation">Docs</NavDropdown.Item>
                  </NavDropdown> */}
                  
                </Nav>

                <NavDropdown title={username ? username.charAt(0).toUpperCase() : ''} id="profile-dropdown"  className="profile-icon" align="end">
                  <NavDropdown.Item href="Profile">My Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              

              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default NavbarExample;

