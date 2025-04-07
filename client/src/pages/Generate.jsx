// client/src/pages/Generate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Alert, Button, Modal } from 'react-bootstrap';
import PlanForm from '../components/generate/PlanForm';
import PlanPreview from '../components/generate/PlanPreview';
import { Loader } from '../components/common';
import { FaSave, FaTimes, FaChartLine, FaLightbulb, FaBookOpen } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Generate = () => {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [planParams, setPlanParams] = useState(null);

  // Clear generated plan on component mount
  useEffect(() => {
    setGeneratedPlan(null);
    setPlanId(null);
  }, []);

  // Handle form submission to generate a plan
  const handleSubmit = async (formParams) => {
    console.log("Generating plan with params:", formParams);
    setPlanParams(formParams);
    setLoading(true);
    setError(null);

    try {
      // Generate the plan but don't save to database yet
      const response = await axios.post(`${API_URL}/plans/generate?save=false`, formParams);

      if (response.data && response.data.data && response.data.data.plan) {
        console.log("Plan generated:", response.data.data.plan);
        setGeneratedPlan(response.data.data.plan);
        setPlanId(null); // Clear plan ID since we haven't saved it yet
      } else {
        console.error("Failed to generate plan");
        setError("Failed to generate plan. Please try again.");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      setError("An error occurred while generating your plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save the plan to database
  const handleSavePlan = async () => {
    if (!generatedPlan || !planParams) return;

    setIsSaving(true);

    try {
      // Now save the plan to database
      const response = await axios.post(`${API_URL}/plans/save`, {
        params: planParams,
        plan: generatedPlan
      });

      if (response.data && response.data.data && response.data.data.planId) {
        setPlanId(response.data.data.planId);
        setShowSuccessModal(true);
      } else {
        setError("Failed to save plan. Please try again.");
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      setError("An error occurred while saving your plan. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to the tracking page for the generated plan
  const handleViewPlan = () => {
    if (planId) {
      navigate(`/tracking/${planId}`);
    }
  };

  // Discard the generated plan
  const handleDiscardPlan = () => {
    setGeneratedPlan(null);
    setPlanId(null);
    setPlanParams(null);
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">
            <FaLightbulb className="text-warning me-2" />
            Create Study Plan
          </h2>
          <p className="text-muted">Generate an AI-powered study plan tailored to your learning needs</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {!generatedPlan ? (
        <Row>
          <Col lg={5}>
            <PlanForm onSubmit={handleSubmit} loading={loading} />

            <Card className="shadow-sm mt-4 border-0 rounded-3 bg-light">
              <Card.Body className="p-4">
                <h5 className="mb-3 fw-bold">Tips for Better Study Plans</h5>
                <ul className="mb-0">
                  <li className="mb-2">Be specific with your subject area</li>
                  <li className="mb-2">Choose an appropriate difficulty level</li>
                  <li className="mb-2">Set a realistic duration for your goals</li>
                  <li>Start with smaller topics if you're a beginner</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7}>
            {loading ? (
              <Card className="shadow-sm text-center py-5 border-0 rounded-3">
                <Card.Body className="p-5">
                  <Loader size="lg" />
                  <h4 className="mt-4 mb-2">Generating your study plan...</h4>
                  <p className="text-muted">
                    We're creating a personalized plan based on your parameters.
                    This may take a moment.
                  </p>
                </Card.Body>
              </Card>
            ) : (
              <Card className="shadow-sm text-center py-5 bg-light border-0 rounded-3">
                <Card.Body className="p-5">
                  <FaBookOpen className="display-1 text-muted mb-4" />
                  <h4>Your study plan will appear here</h4>
                  <p className="text-muted mb-4">
                    Fill out the form and click 'Generate Plan' to create your personalized study schedule.
                  </p>
                  <div className="d-flex flex-column gap-3 mt-4">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white me-3" style={{ width: '28px', height: '28px', minWidth: '28px' }}>1</div>
                      <span>Define your subject</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white me-3" style={{ width: '28px', height: '28px', minWidth: '28px' }}>2</div>
                      <span>Choose difficulty level</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white me-3" style={{ width: '28px', height: '28px', minWidth: '28px' }}>3</div>
                      <span>Set duration</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white me-3" style={{ width: '28px', height: '28px', minWidth: '28px' }}>4</div>
                      <span>Generate your optimized plan</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      ) : (
        <div className="generated-plan">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Your Generated Study Plan</h3>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={handleDiscardPlan}
                disabled={isSaving}
              >
                <FaTimes className="me-2" /> Discard
              </Button>
              <Button
                variant="primary"
                onClick={handleSavePlan}
                disabled={isSaving || planId}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" /> Save Plan
                  </>
                )}
              </Button>
              {planId && (
                <Button
                  variant="success"
                  onClick={handleViewPlan}
                >
                  <FaChartLine className="me-2" /> Track Progress
                </Button>
              )}
            </div>
          </div>

          <Card className="shadow-sm mb-4 border-0 rounded-3">
            <Card.Body className="p-4">
              <PlanPreview plan={generatedPlan} fullPreview={true} />
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Plan Saved Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="display-1 text-success mb-3">
            <i className="bi bi-check-circle"></i>
          </div>
          <h4>Your study plan has been saved!</h4>
          <p className="text-muted">
            You can now track your progress or view it in your history.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSuccessModal(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleViewPlan}
          >
            Track Progress
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Generate;