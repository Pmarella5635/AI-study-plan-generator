// client/src/components/tracking/ProgressTracker.jsx
import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { FaTrophy, FaRunning, FaWalking, FaChild } from 'react-icons/fa';

const ProgressTracker = ({ progress }) => {
  const getVariant = () => {
    if (progress < 30) return 'danger';
    if (progress < 70) return 'warning';
    return 'success';
  };

  const getProgressMessage = () => {
    if (progress < 25) {
      return { message: "Just getting started", icon: <FaChild className="text-danger" /> };
    } else if (progress < 50) {
      return { message: "Making good progress", icon: <FaWalking className="text-warning" /> };
    } else if (progress < 75) {
      return { message: "More than halfway there", icon: <FaRunning className="text-info" /> };
    } else if (progress < 100) {
      return { message: "Almost there!", icon: <FaRunning className="text-primary" /> };
    } else {
      return { message: "Completed!", icon: <FaTrophy className="text-success" /> };
    }
  };

  const { message, icon } = getProgressMessage();

  return (
    <div className="progress-tracker">
      <div className="text-center mb-4">
        <h1 className="display-3 fw-bold">{progress}%</h1>
      </div>
      
      <ProgressBar 
        now={progress} 
        variant={getVariant()}
        className="mb-3"
        animated={progress < 100}
        striped={progress < 100}
        style={{ height: "12px" }}
      />
      
      <div className="text-center mt-3 d-flex align-items-center justify-content-center">
        {icon}
        <p className="text-muted mb-0 ms-2">{message}</p>
      </div>
    </div>
  );
};

export default ProgressTracker;