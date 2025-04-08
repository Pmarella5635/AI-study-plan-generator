// client/src/components/tracking/CheckboxList.jsx
import React from 'react';
import { Form } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

const CheckboxList = ({ items, completedItems, onToggle, idPrefix = 'item' }) => {
  // Handle checkbox change
  const handleCheckboxChange = (e, itemId) => {
    onToggle(itemId, e.target.checked);
  };

  return (
    <div className="checkbox-list">
      {items.map((item, index) => {
        // For items that might be strings or objects
        const itemName = typeof item === 'string' ? item : (item.title || item.name || item);
        const itemId = `${idPrefix}-${index}`;
        const isCompleted = completedItems.includes(itemId);
        
        return (
          <div key={itemId} className="topic-item p-3 mb-3 border rounded">
            <div className="d-flex align-items-center">
              <input
                className="form-check-input me-3"
                type="checkbox"
                id={itemId}
                checked={isCompleted}
                onChange={(e) => handleCheckboxChange(e, itemId)}
                style={{ width: "20px", height: "20px" }}
              />
              <label 
                className={`form-check-label ${isCompleted ? 'text-decoration-line-through text-muted' : 'fw-medium'}`} 
                htmlFor={itemId}
              >
                {itemName}
              </label>
              {isCompleted && (
                <FaCheckCircle className="ms-auto text-success" />
              )}
            </div>
            {item.description && (
              <p className={`ms-4 ps-2 mb-0 small ${isCompleted ? 'text-muted' : ''}`}>
                {item.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckboxList;