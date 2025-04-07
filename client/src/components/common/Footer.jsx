// client/src/components/common/Footer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <p className="text-center mb-0">
          © {new Date().getFullYear()} Study Plan Generator | All Rights Reserved
        </p>
      </Container>
    </footer>
  );
};

export default Footer;