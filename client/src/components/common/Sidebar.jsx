// client/src/components/common/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaPlus, FaHistory, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Check if the path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="sidebar d-none d-lg-block">
      <div className="sidebar-sticky">
        <div className="sidebar-header p-3 mb-3 text-center">
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              className="rounded-circle mb-2" 
              width="60" 
              height="60" 
            />
          ) : (
            <div className="user-avatar mb-2">
              <FaUser size={30} />
            </div>
          )}
          <div className="user-name">
            <h6 className="mb-0">{currentUser.displayName || 'User'}</h6>
            <small className="text-muted">{currentUser.email}</small>
          </div>
        </div>
        
        <Nav className="flex-column">
          <Nav.Link 
            as={Link} 
            to="/" 
            className={`sidebar-link d-flex align-items-center py-3 px-4 ${isActive('/') ? 'active' : ''}`}
          >
            <FaHome className="me-3" />
            <span>Dashboard</span>
          </Nav.Link>
          
          <Nav.Link 
            as={Link} 
            to="/generate" 
            className={`sidebar-link d-flex align-items-center py-3 px-4 ${isActive('/generate') ? 'active' : ''}`}
          >
            <FaPlus className="me-3" />
            <span>Generate Plan</span>
          </Nav.Link>
          
          <Nav.Link 
            as={Link} 
            to="/history" 
            className={`sidebar-link d-flex align-items-center py-3 px-4 ${isActive('/history') ? 'active' : ''}`}
          >
            <FaHistory className="me-3" />
            <span>History</span>
          </Nav.Link>
        </Nav>
        
       
      </div>
    </div>
  );
};

export default Sidebar;