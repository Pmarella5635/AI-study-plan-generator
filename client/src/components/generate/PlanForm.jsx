// client/src/components/generate/PlanForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, InputGroup, Card } from 'react-bootstrap';
import { FaCalendarAlt, FaBook, FaChartLine, FaClock, FaFlag } from 'react-icons/fa';

const PlanForm = ({ onSubmit, loading }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    subject: '',
    duration: 30,
    difficulty: 'medium',
    startDate: today,
    endDate: '',
    goals: 'Master the fundamentals of the subject'
  });
  
  const [durationInputValue, setDurationInputValue] = useState('30');
  const [validated, setValidated] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Calculate end date whenever duration or start date changes
  useEffect(() => {
    try {
      if (formData.startDate && formData.duration > 0) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + parseInt(formData.duration));
        
        setFormData(prev => ({
          ...prev,
          endDate: endDate.toISOString().split('T')[0]
        }));
      }
    } catch (error) {
      console.error("Error calculating end date:", error);
    }
  }, [formData.startDate, formData.duration]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear the specific error when field is modified
    setFormErrors({
      ...formErrors,
      [name]: null
    });
    
    if (name === 'duration') {
      // Update the input value directly
      setDurationInputValue(value);
      
      // If empty or non-numeric, don't update actual duration yet
      if (value === '' || isNaN(parseInt(value))) {
        return;
      }
      
      // Update actual duration for valid numbers
      const parsedValue = parseInt(value);
      if (parsedValue > 0 && parsedValue <= 365) {
        setFormData({
          ...formData,
          duration: parsedValue
        });
      }
    } else if (name === 'startDate') {
      setFormData({
        ...formData,
        startDate: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // When blurring the duration field, ensure we have a valid value
  const handleDurationBlur = () => {
    if (durationInputValue === '' || isNaN(parseInt(durationInputValue))) {
      // Reset to default
      setDurationInputValue('30');
      setFormData({
        ...formData,
        duration: 30
      });
    } else {
      const parsedValue = parseInt(durationInputValue);
      if (parsedValue <= 0) {
        setDurationInputValue('1');
        setFormData({
          ...formData,
          duration: 1
        });
      } else if (parsedValue > 365) {
        setDurationInputValue('365');
        setFormData({
          ...formData, 
          duration: 365
        });
      }
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Check subject
    if (!formData.subject.trim()) {
      errors.subject = 'Please enter a subject';
    }
    
    // Check duration
    if (!formData.duration || formData.duration <= 0) {
      errors.duration = 'Please enter a valid duration (1-365 days)';
    } else if (formData.duration > 365) {
      errors.duration = 'Duration cannot exceed 365 days';
    }
    
    // Check start date
    if (!formData.startDate) {
      errors.startDate = 'Please select a start date';
    }
    
    // Set errors and return validation result
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Force duration validation on submit
    handleDurationBlur();
    
    const form = e.currentTarget;
    const isValid = form.checkValidity() && validateForm();
    
    setValidated(true);
    
    if (!isValid) {
      e.stopPropagation();
      return;
    }
    
    // Send form data to parent component
    onSubmit(formData);
  };
  
  // Difficulty level descriptions
  const difficultyDescriptions = {
    beginner: "New to this subject, starting from scratch",
    easy: "Basic understanding, need fundamentals",
    medium: "Intermediate knowledge, building on existing skills",
    advanced: "Strong understanding, diving into complex topics",
    expert: "Looking for mastery, advanced concepts"
  };

  return (
    <Card className="shadow-sm border-0 rounded-3">
      <Card.Body className="p-4">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaBook className="me-2 text-primary" />
              Subject<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Python Programming, Calculus, Marketing"
              className="py-2"
              isInvalid={!!formErrors.subject}
              required
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.subject || "Please enter a subject."}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Enter a subject and we'll automatically generate appropriate topics
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaFlag className="me-2 text-primary" />
              Primary Goal
            </Form.Label>
            <Form.Select
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className="py-2"
            >
              <option value="Master the fundamentals of the subject">Master the fundamentals of the subject</option>
              <option value="Complete all assigned readings and exercises">Complete all assigned readings and exercises</option>
              <option value="Achieve a score of at least 80% on assessments">Achieve a score of at least 80% on assessments</option>
              <option value="Develop critical thinking skills related to the subject">Develop critical thinking skills related to the subject</option>
              <option value="Prepare for final exams with a comprehensive review">Prepare for final exams with a comprehensive review</option>
              <option value="Participate actively in class discussions and group work">Participate actively in class discussions and group work</option>
            </Form.Select>
            <Form.Text className="text-muted">
              Select your primary goal for this study plan
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaChartLine className="me-2 text-primary" />
              Difficulty Level
            </Form.Label>
            <Form.Select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="py-2"
              required
            >
              <option value="beginner">Beginner</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </Form.Select>
            <Form.Text className="text-muted">
              {difficultyDescriptions[formData.difficulty]}
            </Form.Text>
          </Form.Group>
          
          <Row className="mb-4">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold">
                  <FaCalendarAlt className="me-2 text-primary" />
                  Start Date<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={today}
                  className="py-2"
                  isInvalid={!!formErrors.startDate}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.startDate || "Please select a start date."}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold">
                  <FaClock className="me-2 text-primary" />
                  Duration (days)<span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={durationInputValue}
                    onChange={handleChange}
                    onBlur={handleDurationBlur}
                    className="py-2"
                    isInvalid={!!formErrors.duration}
                    required
                  />
                  <InputGroup.Text>days</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.duration || "Please enter a valid duration."}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaCalendarAlt className="me-2 text-primary" />
              End Date
            </Form.Label>
            <Form.Control
              type="date"
              value={formData.endDate}
              disabled
              className="bg-light py-2"
            />
            <Form.Text className="text-muted">
              End date is calculated based on start date and duration.
            </Form.Text>
          </Form.Group>
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-100 py-2 mt-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generating Plan...
              </>
            ) : 'Generate Study Plan'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PlanForm;