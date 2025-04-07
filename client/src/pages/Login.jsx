// client/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaLock, FaBook, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const Login = () => {
  const { loginWithGoogle, error, loading, currentUser } = useAuth();
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to home
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await loginWithGoogle();
      // Navigation happens automatically through the useEffect
    } catch (err) {
      setAuthError('Failed to sign in with Google. Please try again.');
      console.error('Google sign-in error:', err);
    }
  };

  return (
    <Container className="py-5 min-vh-100 d-flex align-items-center">
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={8} className="mb-4 mb-md-0">
          <Card className="border-0 shadow overflow-hidden">
            <Row className="g-0">
              <Col md={6} className="bg-primary text-white d-none d-md-flex flex-column justify-content-center p-5">
                <div className="py-5">
                  <h1 className="display-5 fw-bold mb-4">Study Plan Generator</h1>
                  <p className="fs-5 mb-4">Create personalized study plans with AI to optimize your learning journey</p>
                  
                  <div className="feature-list mt-5">
                    <div className="d-flex align-items-center mb-4">
                      <div className="feature-icon me-3 rounded-circle bg-white text-primary p-2">
                        <FaBook />
                      </div>
                      <p className="mb-0">Personalized learning paths</p>
                    </div>
                    
                    <div className="d-flex align-items-center mb-4">
                      <div className="feature-icon me-3 rounded-circle bg-white text-primary p-2">
                        <FaChartLine />
                      </div>
                      <p className="mb-0">Track your study progress</p>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <div className="feature-icon me-3 rounded-circle bg-white text-primary p-2">
                        <FaCalendarAlt />
                      </div>
                      <p className="mb-0">Optimized study schedules</p>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <Card.Body className="p-md-5 p-4 d-flex flex-column justify-content-center min-vh-50">
                  <div className="text-center mb-4">
                    <FaLock className="text-primary mb-3" size={40} />
                    <h2 className="fw-bold mb-1">Welcome Back</h2>
                    <p className="text-muted">Sign in to access your study plans</p>
                  </div>
                  
                  {(error || authError) && (
                    <Alert variant="danger" className="mb-4">
                      {error || authError}
                    </Alert>
                  )}
                  
                  <div className="d-grid gap-3">
                    <Button 
                      variant="outline-secondary" 
                      className="d-flex align-items-center justify-content-center py-3"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    >
                      <FcGoogle size={24} className="me-3" />
                      <span className="fs-5">Continue with Google</span>
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-muted mb-0">
                        By signing in, you agree to our <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;