// client/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { usePlans } from '../contexts/PlanContext';
import { Loader } from '../components/common';
import { FaStar, FaChartLine, FaPlus, FaCalendarAlt, FaBookOpen, FaSync } from 'react-icons/fa';
import { auth } from '../services/firebase';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const { fetchPlans, plans, loading, getInProgressPlans, getStarredPlans, getCompletedPlans } = usePlans();
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    starred: 0
  });
  const [recentPlans, setRecentPlans] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch user plans
  const fetchUserPlans = async () => {
    try {
      setDashboardLoading(true);
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(`${API_URL}/plans`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.data) {
        const userPlans = response.data.data;

        // Calculate stats
        const inProgressPlans = userPlans.filter(plan => plan.status === 'active' && plan.progress < 100);
        const completedPlans = userPlans.filter(plan => plan.status === 'active' && plan.progress === 100);
        const starredPlans = userPlans.filter(plan => plan.isStarred);

        setStats({
          total: userPlans.length,
          inProgress: inProgressPlans.length,
          completed: completedPlans.length,
          starred: starredPlans.length
        });

        // Get recent in-progress plans
        setRecentPlans(inProgressPlans.slice(0, 3));
      } else {
        setStats({
          total: 0,
          inProgress: 0,
          completed: 0,
          starred: 0
        });
        setRecentPlans([]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setDashboardLoading(false);
      setRefreshing(false);
      setInitialized(true);
    }
  };

  // Fetch plans on component mount
  useEffect(() => {
    if (auth.currentUser) {
      fetchUserPlans();
    }
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserPlans();
  };

  if (dashboardLoading && !initialized) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <Loader size="lg" />
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Your Study Dashboard</h2>
          <p className="text-muted">Track your progress and manage your study plans</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2 align-items-center">
          <Button
            variant="outline-primary"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh dashboard"
            className="d-flex align-items-center justify-content-center"
            style={{ width: '38px', height: '38px', padding: '0' }}
          >
            {refreshing ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <FaSync />
            )}
          </Button>
          <Link to="/generate">
            <Button variant="primary">
              <FaPlus className="me-2" /> Create New Plan
            </Button>
          </Link>
        </Col>
      </Row>

      {stats.total === 0 ? (
        <Card className="shadow-sm text-center py-5 border-0 rounded-3">
          <Card.Body>
            <div className="mb-4">
              <FaBookOpen size={50} className="text-muted" />
            </div>
            <h4>Welcome to Study Plan Generator!</h4>
            <p className="text-muted mb-4">
              You don't have any study plans yet. Get started by creating your first plan.
            </p>
            <Link to="/generate">
              <Button variant="primary" size="lg">
                <FaPlus className="me-2" /> Create Your First Plan
              </Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="shadow-sm h-100 border-0 rounded-3">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                  {refreshing ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <div className="display-4 fw-bold text-primary mb-2">{stats.total}</div>
                  )}
                  <div className="text-muted">Total Plans</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm h-100 border-0 rounded-3">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                  {refreshing ? (
                    <Spinner animation="border" variant="warning" />
                  ) : (
                    <div className="display-4 fw-bold text-warning mb-2">{stats.inProgress}</div>
                  )}
                  <div className="text-muted">In Progress</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm h-100 border-0 rounded-3">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                  {refreshing ? (
                    <Spinner animation="border" variant="success" />
                  ) : (
                    <div className="display-4 fw-bold text-success mb-2">{stats.completed}</div>
                  )}
                  <div className="text-muted">Completed</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm h-100 border-0 rounded-3">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                  {refreshing ? (
                    <Spinner animation="border" variant="warning" />
                  ) : (
                    <div className="display-4 fw-bold text-warning mb-2">{stats.starred}</div>
                  )}
                  <div className="text-muted">Starred Plans</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm mb-4 border-0 rounded-3">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  <FaChartLine className="me-2 text-primary" />
                  Recent Progress
                </h5>
                <Link to="/history" className="text-decoration-none">
                  View All Plans
                </Link>
              </div>

              {refreshing ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Refreshing plans...</p>
                </div>
              ) : recentPlans.length > 0 ? (
                <div>
                  {recentPlans.map(plan => (
                    <div key={plan.id} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <Link to={`/tracking/${plan.id}`} className="text-decoration-none">
                            <h6 className="mb-1">{plan.title}</h6>
                          </Link>
                          <p className="text-muted small mb-0">
                            {plan.params && plan.params.subject}
                            {plan.isStarred && (
                              <span className="ms-2 text-warning">
                                <FaStar size={14} />
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-primary mb-1">{plan.progress || 0}%</div>
                          <small className="text-muted">
                            {plan.params && (
                              <span>
                                <FaCalendarAlt className="me-1" size={12} />
                                {new Date(plan.params.endDate).toLocaleDateString()}
                              </span>
                            )}
                          </small>
                        </div>
                      </div>
                      <ProgressBar
                        now={plan.progress || 0}
                        variant={
                          (plan.progress || 0) < 30 ? 'danger' :
                            (plan.progress || 0) < 70 ? 'warning' :
                              'success'
                        }
                        style={{ height: '10px' }}
                        className="mb-1"
                      />
                    </div>
                  ))}

                  {recentPlans.length > 0 && (
                    <div className="text-center mt-4">
                      <Link to={`/tracking/${recentPlans[0]?.id}`} className="btn btn-outline-primary">
                        Continue Studying
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No in-progress plans found.</p>
                  <Link to="/generate" className="btn btn-primary">
                    Create a New Plan
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Quick Actions</h5>
              <Row>
                <Col md={4} className="mb-3 mb-md-0">
                  <Link to="/generate" className="text-decoration-none">
                    <Card className="h-100 bg-light border-0">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
                        <FaPlus size={30} className="text-primary mb-3" />
                        <h6>Create New Plan</h6>
                        <p className="text-muted mb-0 small">Generate a personalized study plan</p>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <Link to="/history" className="text-decoration-none">
                    <Card className="h-100 bg-light border-0">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
                        <FaBookOpen size={30} className="text-warning mb-3" />
                        <h6>View All Plans</h6>
                        <p className="text-muted mb-0 small">Browse your study plan history</p>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col md={4}>
                  <Link to={`/tracking/${recentPlans[0]?.id || ''}`} className="text-decoration-none">
                    <Card className="h-100 bg-light border-0">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
                        <FaChartLine size={30} className="text-success mb-3" />
                        <h6>Track Progress</h6>
                        <p className="text-muted mb-0 small">Update your learning journey</p>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Home;