// client/src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Form, 
  InputGroup,
  Alert,
  ProgressBar
} from 'react-bootstrap';
import { FaSearch, FaTimes, FaPlus, FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';
import { Loader } from '../components/common';
import { auth } from '../services/firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const History = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
useEffect(() => {
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(`${API_URL}/plans`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.data) {
        setPlans(response.data.data);
      } else {
        setPlans([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load your study plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  fetchPlans();
}, []);

// And handleToggleStar function
const handleToggleStar = async (e, planId, isStarred) => {
  e.preventDefault();
  e.stopPropagation();
  
  try {
    const token = await auth.currentUser.getIdToken();
    await axios.patch(`${API_URL}/plans/${planId}/star`, 
      { isStarred: !isStarred },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    setPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === planId 
          ? { ...plan, isStarred: !isStarred } 
          : plan
      )
    );
  } catch (err) {
    console.error('Error toggling star status:', err);
  }
};
  
  // Filter plans based on search term and active filter
  const getFilteredPlans = () => {
    let filtered = [...plans];
    
    // Apply category filter
    if (activeFilter === 'starred') {
      filtered = filtered.filter(plan => plan.isStarred);
    } else if (activeFilter === 'tracked') {
      filtered = filtered.filter(plan => plan.isTracked);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(plan => 
        (plan.title && plan.title.toLowerCase().includes(term)) || 
        (plan.description && plan.description.toLowerCase().includes(term)) ||
        (plan.params && plan.params.subject && plan.params.subject.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  const filteredPlans = getFilteredPlans();
  const starredCount = plans.filter(plan => plan.isStarred).length;
  const trackedCount = plans.filter(plan => plan.isTracked).length;
  
  // Show loading state
  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Study Plan History</h2>
          <Link to="/generate" className="btn btn-primary">
            <FaPlus className="me-2" /> Create New Plan
          </Link>
        </div>
        
        <div className="text-center py-5">
          <Loader size="lg" />
          <p className="mt-3">Loading your study plans...</p>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Study Plan History</h2>
          <Link to="/generate" className="btn btn-primary">
            <FaPlus className="me-2" /> Create New Plan
          </Link>
        </div>
        
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }

  // Show empty state
  if (plans.length === 0) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Study Plan History</h2>
          <Link to="/generate" className="btn btn-primary">
            <FaPlus className="me-2" /> Create New Plan
          </Link>
        </div>
        
        <div className="text-center py-5 bg-light rounded">
          <i className="bi bi-journal-text display-1 text-muted mb-3"></i>
          <h4>You don't have any study plans yet</h4>
          <p className="text-muted mb-4">Create your first study plan to get started</p>
          <Link to="/generate">
            <Button variant="primary">
              <FaPlus className="me-2" /> Create Study Plan
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  // Main content with plans
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Study Plan History</h2>
        <Link to="/generate" className="btn btn-primary">
          <FaPlus className="me-2" /> Create New Plan
        </Link>
      </div>
      
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search plans by title, description or subject..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <Button 
                variant="outline-secondary" 
                onClick={clearSearch}
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={4}>
          <div className="btn-group w-100">
            <Button 
              variant={activeFilter === 'all' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveFilter('all')}
            >
              All Plans ({plans.length})
            </Button>
            <Button 
              variant={activeFilter === 'starred' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveFilter('starred')}
            >
              Starred ({starredCount})
            </Button>
            <Button 
              variant={activeFilter === 'tracked' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveFilter('tracked')}
            >
              Tracked ({trackedCount})
            </Button>
          </div>
        </Col>
      </Row>
      
      {filteredPlans.length === 0 ? (
        <Alert variant="info">No plans found matching your search criteria.</Alert>
      ) : (
        <div className="plans-list">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="mb-3 shadow-sm border-0 rounded-3">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <Link 
                      to={`/tracking/${plan.id}`} 
                      className="text-decoration-none"
                    >
                      <h5 className="mb-1 fw-bold">{plan.title}</h5>
                    </Link>
                    <p className="text-muted small mb-2">{plan.description}</p>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-warning p-0 border-0"
                    onClick={(e) => handleToggleStar(e, plan.id, plan.isStarred)}
                    title={plan.isStarred ? "Unstar plan" : "Star plan"}
                  >
                    {plan.isStarred ? <FaStar size={20} /> : <FaRegStar size={20} />}
                  </Button>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {plan.params && (
                    <>
                      <Badge bg="primary" className="py-2 px-3">{plan.params.subject}</Badge>
                      <Badge bg="secondary" className="py-2 px-3 text-capitalize">{plan.params.difficulty}</Badge>
                      <Badge bg="info" className="py-2 px-3">
                        {plan.params.duration} days
                      </Badge>
                    </>
                  )}
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center small mb-1">
                    <span>Progress</span>
                    <span className="fw-bold">{plan.progress || 0}%</span>
                  </div>
                  <ProgressBar 
                    now={plan.progress || 0} 
                    variant={
                      (plan.progress || 0) < 30 ? 'danger' : 
                      (plan.progress || 0) < 70 ? 'warning' : 
                      'success'
                    } 
                    style={{ height: '8px' }}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="small text-muted">
                    {plan.params && (
                      <>
                        <span>Start: {plan.params.startDate}</span>
                        <span className="mx-2">|</span>
                        <span>End: {plan.params.endDate}</span>
                      </>
                    )}
                  </div>
                  <Link to={`/tracking/${plan.id}`} className="btn btn-sm btn-primary">
                    View Details
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default History;