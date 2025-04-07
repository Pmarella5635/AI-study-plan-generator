// client/src/components/generate/PlanPreview.jsx
import React from 'react';
import { Card, Badge, Row, Col, Table } from 'react-bootstrap';
import { FaBook, FaLink, FaCode, FaVideo, FaLaptopCode, FaCalendarAlt, FaListUl, FaRegLightbulb } from 'react-icons/fa';

const PlanPreview = ({ plan, fullPreview = false }) => {
  if (!plan) return null;

  // Function to get resource icon
  const getResourceIcon = (resource) => {
    const resourceName = (resource.name || '').toLowerCase();
    
    if (resourceName.includes('book') || resourceName.includes('course')) {
      return <FaBook />;
    } else if (resourceName.includes('documentation') || resourceName.includes('library')) {
      return <FaCode />;
    } else if (resourceName.includes('video') || resourceName.includes('youtube')) {
      return <FaVideo />;
    } else if (resourceName.includes('coding') || resourceName.includes('practice')) {
      return <FaLaptopCode />;
    } else {
      return <FaLink />;
    }
  };

  return (
    <div className="plan-preview">
      <div className="mb-4">
        <h3 className="mb-2">{plan.title}</h3>
        <p className="text-muted">{plan.description}</p>
        
        <Row className="mt-4">
          <Col md={6} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <FaListUl className="text-primary me-2" size={20} />
              <h5 className="mb-0">Topics</h5>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {plan.topics && plan.topics.map((topic, index) => {
                const topicName = typeof topic === 'string' ? topic : (topic.name || topic.title);
                return (
                  <Badge key={index} bg="light" text="dark" className="py-2 px-3 border">
                    {topicName}
                  </Badge>
                );
              })}
            </div>
          </Col>
          
          <Col md={6} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <FaRegLightbulb className="text-warning me-2" size={20} />
              <h5 className="mb-0">Milestones</h5>
            </div>
            <ul className="list-group">
              {plan.milestones && plan.milestones.slice(0, fullPreview ? undefined : 3).map((milestone, index) => (
                <li key={index} className="list-group-item border-0 px-0 py-1">
                  <strong>{milestone.name || milestone.title}</strong>
                  {milestone.description && (
                    <p className="mb-0 small text-muted">{milestone.description}</p>
                  )}
                </li>
              ))}
              {!fullPreview && plan.milestones && plan.milestones.length > 3 && (
                <li className="list-group-item border-0 px-0 py-1 text-muted">
                  <em>...and {plan.milestones.length - 3} more</em>
                </li>
              )}
            </ul>
          </Col>
        </Row>
        
        {plan.schedule && plan.schedule.length > 0 && (
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <FaCalendarAlt className="text-success me-2" size={20} />
              <h5 className="mb-0">Schedule</h5>
            </div>
            <div className="table-responsive">
              <Table bordered hover size="sm">
                <thead className="table-light">
                  <tr>
                    <th width="20%">Date</th>
                    <th>Topics</th>
                    <th width="15%" className="text-center">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.schedule.slice(0, fullPreview ? undefined : 7).map((day, index) => (
                    <tr key={index}>
                      <td>{day.date}</td>
                      <td>{Array.isArray(day.topics) ? day.topics.join(', ') : day.topics}</td>
                      <td className="text-center">{day.hours || day.estimatedHours || '-'}</td>
                    </tr>
                  ))}
                  {!fullPreview && plan.schedule.length > 7 && (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        <em>...and {plan.schedule.length - 7} more days</em>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}
        
        {plan.resources && plan.resources.length > 0 && (
          <div>
            <div className="d-flex align-items-center mb-3">
              <FaBook className="text-primary me-2" size={20} />
              <h5 className="mb-0">Resources</h5>
            </div>
            <Row>
              {plan.resources.slice(0, fullPreview ? undefined : 3).map((resource, index) => (
                <Col md={fullPreview ? 4 : 12} key={index} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2 text-primary">{getResourceIcon(resource)}</span>
                        <h6 className="mb-0">{resource.name || resource.title}</h6>
                      </div>
                      {resource.description && (
                        <p className="mb-0 small text-muted">{resource.description}</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {!fullPreview && plan.resources.length > 3 && (
                <Col className="text-center text-muted mt-2">
                  <em>...and {plan.resources.length - 3} more resources</em>
                </Col>
              )}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanPreview;