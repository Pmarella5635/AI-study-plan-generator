// client/src/pages/Tracking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, Modal, ProgressBar } from 'react-bootstrap';
import { FaStar, FaRegStar, FaTrash, FaLink, FaBook, FaCode, FaVideo, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { Loader } from '../components/common';

// Direct API endpoint
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Tracking = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [plan, setPlan] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load plan data directly from API
  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return;

      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/plans/${planId}`);
        const fetchedPlan = response.data.data;

        setPlan(fetchedPlan);
        setCompletedTopics(fetchedPlan.completedTopics || []);
        setProgress(fetchedPlan.progress || 0);
      } catch (err) {
        console.error('Error loading plan:', err);
        setError('Could not load plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  // Toggle topic completion
  const handleTopicToggle = async (topicId, isComplete) => {
    if (!plan) return;

    // Update local state immediately for responsive UI
    let updatedTopics;
    if (isComplete) {
      updatedTopics = [...completedTopics, topicId];
    } else {
      updatedTopics = completedTopics.filter(id => id !== topicId);
    }

    setCompletedTopics(updatedTopics);

    // Calculate new progress
    const totalTopics = getTotalTopicsCount();
    const newProgress = totalTopics ? Math.round((updatedTopics.length / totalTopics) * 100) : 0;
    setProgress(newProgress);

    // Send update to server
    try {
      await axios.patch(`${API_URL}/plans/${planId}/progress`, {
        completedTopics: updatedTopics,
        progress: newProgress
      });
    } catch (err) {
      console.error('Failed to update progress:', err);
      // Revert state if update fails
      setCompletedTopics(completedTopics);
      setProgress(progress);
    }
  };

  // Count total topics
  const getTotalTopicsCount = () => {
    if (!plan) return 0;

    let count = 0;
    if (Array.isArray(plan.topics)) count += plan.topics.length;
    if (Array.isArray(plan.milestones)) count += plan.milestones.length;

    return count;
  };

  // Toggle star status
  const handleToggleStar = async () => {
    if (!plan) return;

    const newStarredStatus = !plan.isStarred;

    try {
      await axios.patch(`${API_URL}/plans/${planId}/star`, { isStarred: newStarredStatus });
      setPlan({ ...plan, isStarred: newStarredStatus });
    } catch (err) {
      console.error('Failed to update star status:', err);
    }
  };

  // Delete plan
  const handleDeletePlan = async () => {
    try {
      await axios.delete(`${API_URL}/plans/${planId}`);
      setShowDeleteModal(false);
      navigate('/history');
    } catch (err) {
      console.error('Failed to delete plan:', err);
      setError('Could not delete plan. Please try again.');
    }
  };

  // Resource link generator
  const getResourceLink = (resource) => {
    if (resource.url) return resource.url;

    const resourceName = (resource.name || resource.title || '').toLowerCase();

    if (resourceName.includes('python') && resourceName.includes('documentation')) {
      return 'https://docs.python.org/3/';
    } else if (resourceName.includes('book')) {
      return `https://www.amazon.com/s?k=${encodeURIComponent(resourceName)}`;
    } else if (resourceName.includes('course')) {
      return `https://www.udemy.com/courses/search/?q=${encodeURIComponent(resourceName)}`;
    } else {
      return `https://www.google.com/search?q=${encodeURIComponent(resourceName)}`;
    }
  };

  // Resource icon generator
  const getResourceIcon = (resource) => {
    const resourceName = (resource.name || resource.title || '').toLowerCase();

    if (resourceName.includes('book')) {
      return <FaBook className="text-primary" />;
    } else if (resourceName.includes('documentation')) {
      return <FaCode className="text-info" />;
    } else if (resourceName.includes('video')) {
      return <FaVideo className="text-danger" />;
    } else {
      return <FaLink className="text-secondary" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <Loader size="lg" />
          <p className="mt-3">Loading your study plan...</p>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <div className="mt-3">
          <Button variant="primary" onClick={() => navigate('/history')}>
            Back to History
          </Button>
        </div>
      </Container>
    );
  }

  // Not found state
  if (!plan) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Plan not found. The plan may have been deleted or you might not have access to it.
        </Alert>
        <div className="mt-3">
          <Button variant="primary" onClick={() => navigate('/generate')}>
            Create New Plan
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow mb-4 border-0 rounded-3">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col>
              <h2 className="mb-0 fw-bold">{plan.title}</h2>
              <p className="text-muted mt-2 mb-0">{plan.description}</p>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-3">
                <Button
                  variant="outline-warning"
                  onClick={handleToggleStar}
                  title={plan.isStarred ? "Unstar plan" : "Star plan"}
                  className="rounded-circle p-2"
                >
                  {plan.isStarred ? <FaStar size={18} /> : <FaRegStar size={18} />}
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                  title="Delete plan"
                  className="rounded-circle p-2"
                >
                  <FaTrash size={18} />
                </Button>
                <Badge
                  bg={progress === 100 ? 'success' : 'primary'}
                  className="px-3 py-2 d-flex align-items-center"
                >
                  {progress === 100 ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm mb-4 border-0 rounded-3">
            <Card.Body className="p-4">
              <h5 className="mb-4 fw-bold">Progress</h5>

              <div className="text-center my-4">
                <h1 className="display-4">{progress}%</h1>
                <ProgressBar
                  now={progress}
                  variant={
                    progress < 30 ? 'danger' :
                      progress < 70 ? 'warning' :
                        'success'
                  }
                  animated={progress < 100}
                  striped={progress < 100}
                  style={{ height: '12px' }}
                />
              </div>

              <div className="mt-4">
                {plan.params && (
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Subject:</span>
                      <span className="fw-medium">{plan.params.subject}</span>
                    </div>
                    {plan.params && plan.params.goals && (
                      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <span className="text-muted">Goal:</span>
                        <Badge bg="info" className="py-2 px-3">
                          {plan.params.goals}
                        </Badge>
                      </div>
                    )}


                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Start Date:</span>
                      <span className="fw-medium">{plan.params.startDate}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">End Date:</span>
                      <span className="fw-medium">{plan.params.endDate}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Difficulty:</span>
                      <Badge
                        bg={
                          plan.params.difficulty === 'beginner' ? 'success' :
                            plan.params.difficulty === 'easy' ? 'info' :
                              plan.params.difficulty === 'medium' ? 'warning' :
                                plan.params.difficulty === 'advanced' ? 'danger' :
                                  'dark'
                        }
                      >
                        {plan.params.difficulty}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {plan.resources && plan.resources.length > 0 && (
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body className="p-4">
                <h5 className="mb-4 fw-bold">Recommended Resources</h5>
                <div className="resource-list">
                  {plan.resources.map((resource, index) => (
                    <div key={index} className="resource-item mb-4 p-3 border rounded bg-light">
                      <h6 className="mb-2 d-flex align-items-center">
                        <span className="me-2">{getResourceIcon(resource)}</span>
                        {resource.name || resource.title}
                      </h6>
                      {resource.description && (
                        <p className="mb-3 small text-muted">{resource.description}</p>
                      )}
                      <a
                        href={getResourceLink(resource)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                      >
                        <FaLink className="me-1" /> View Resource
                      </a>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm mb-4 border-0 rounded-3">
            <Card.Body className="p-4">
              <h5 className="mb-4 fw-bold">Topics</h5>

              {plan.topics && plan.topics.length > 0 ? (
                <div className="topic-list">
                  {plan.topics.map((topic, index) => {
                    const topicName = typeof topic === 'string' ? topic : (topic.title || topic.name || topic);
                    const topicId = `topic-${index}`;
                    const isCompleted = completedTopics.includes(topicId);

                    return (
                      <div key={topicId} className="topic-item p-3 mb-3 border rounded">
                        <div className="form-check d-flex align-items-center">
                          <input
                            className="form-check-input me-3"
                            type="checkbox"
                            id={topicId}
                            checked={isCompleted}
                            onChange={(e) => handleTopicToggle(topicId, e.target.checked)}
                            style={{ width: "20px", height: "20px" }}
                          />
                          <label
                            className={`form-check-label ${isCompleted ? 'text-decoration-line-through text-muted' : 'fw-medium'}`}
                            htmlFor={topicId}
                          >
                            {topicName}
                          </label>
                          {isCompleted && (
                            <FaCheckCircle className="ms-auto text-success" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted">No topics defined for this plan.</p>
              )}
            </Card.Body>
          </Card>

          {plan.milestones && plan.milestones.length > 0 && (
            <Card className="shadow-sm mb-4 border-0 rounded-3">
              <Card.Body className="p-4">
                <h5 className="mb-4 fw-bold">Milestones</h5>
                <div className="milestone-list">
                  {plan.milestones.map((milestone, index) => {
                    const milestoneName = milestone.name || milestone.title;
                    const milestoneDesc = milestone.description;
                    const milestoneId = `milestone-${index}`;
                    const isCompleted = completedTopics.includes(milestoneId);

                    return (
                      <div key={milestoneId} className="milestone-item p-3 mb-3 border rounded">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="form-check d-flex align-items-center flex-grow-1">
                            <input
                              className="form-check-input me-3"
                              type="checkbox"
                              id={milestoneId}
                              checked={isCompleted}
                              onChange={(e) => handleTopicToggle(milestoneId, e.target.checked)}
                              style={{ width: "20px", height: "20px" }}
                            />
                            <div>
                              <label
                                className={`form-check-label d-block fw-medium mb-1 ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`}
                                htmlFor={milestoneId}
                              >
                                {milestoneName}
                              </label>
                              {milestoneDesc && (
                                <p className={`mb-0 small ${isCompleted ? 'text-muted' : 'text-dark'}`}>{milestoneDesc}</p>
                              )}
                            </div>
                          </div>

                          <div className="d-flex align-items-center">
                            {milestone.date && (
                              <Badge bg="secondary" className="me-2">{milestone.date}</Badge>
                            )}
                            {isCompleted && (
                              <FaCheckCircle className="text-success" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          )}

          {plan.schedule && plan.schedule.length > 0 && (
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body className="p-4">
                <h5 className="d-flex align-items-center mb-4 fw-bold">
                  <FaCalendarAlt className="text-primary me-2" />
                  Study Schedule
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Topics</th>
                        <th>Est. Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.schedule.map((day, index) => (
                        <tr key={index}>
                          <td className="fw-medium">{day.date}</td>
                          <td>{Array.isArray(day.topics) ? day.topics.join(', ') : day.topics}</td>
                          <td className="text-center">{day.hours || day.estimatedHours || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Study Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Are you sure you want to delete "<strong>{plan.title}</strong>"?</p>
          <p className="text-danger mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePlan}>
            Delete Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Tracking;