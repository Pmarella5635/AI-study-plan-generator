// client/src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar as BootstrapNavbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleImageError = () => {
     setImageError(true);
   };
 
  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="navbar-main">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <i className="bi bi-book me-2"></i>
          Study Plan Generator
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />

        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/generate">Generate</Nav.Link>
                <Nav.Link as={Link} to="/history">History</Nav.Link>

                <NavDropdown
                  title={
                    <span>
                      {currentUser.photoURL && !imageError ? (
                        <Image
                          src={currentUser.photoURL}
                          alt="Profile"
                          roundedCircle
                          className="me-2"
                          width="24"
                          height="24"
                          onError={handleImageError}
                        />
                      ) : (
                         <span className="avatar-placeholder me-2">
                           <FaUser size={16} />
                         </span>
                    )}
                      {currentUser.displayName || currentUser.email}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
