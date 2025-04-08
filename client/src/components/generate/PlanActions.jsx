// client/src/components/generate/PlanActions.jsx
import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { usePlans } from '../../contexts/PlanContext';

const PlanActions = ({ planId, onSave, onTrack }) => {
  const { toggleStar, loading } = usePlans();
  const [isStarred, setIsStarred] = useState(false);
  
  const handleStarToggle = async () => {
    if (planId) {
      const success = await toggleStar(planId, !isStarred);
      if (success) {
        setIsStarred(!isStarred);
      }
    }
  };
  
  return (
    <div className="d-flex justify-content-between mt-4">
      <Button 
        variant="outline-warning"
        onClick={handleStarToggle}
        disabled={loading || !planId}
      >
        {isStarred ? '★ Unstar' : '☆ Star'} Plan
      </Button>
      
      <ButtonGroup>
        <Button 
          variant="outline-primary"
          onClick={onSave}
          disabled={loading || !planId}
        >
          Save Plan
        </Button>
        <Button 
          variant="primary"
          onClick={onTrack}
          disabled={loading || !planId}
        >
          Track Progress
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default PlanActions;