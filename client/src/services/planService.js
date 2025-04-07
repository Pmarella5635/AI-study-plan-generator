// client/src/services/planService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance without auth
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const generateStudyPlan = async (planParams, saveToDatabase = true) => {
  try {
    // If saveToDatabase is false, add a query parameter to tell the server not to save
    const url = saveToDatabase ? '/plans/generate' : '/plans/generate?save=false';
    const response = await api.post(url, planParams);
    return response.data;
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw error;
  }
};

export const getUserPlans = async () => {
  try {
    const response = await api.get('/plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching user plans:', error);
    throw error;
  }
};

export const getPlan = async (planId) => {
  try {
    const response = await api.get(`/plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
};

export const updatePlan = async (planId, updates) => {
  try {
    const response = await api.put(`/plans/${planId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating plan:', error);
    throw error;
  }
};

export const deletePlan = async (planId) => {
  try {
    const response = await api.delete(`/plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting plan:', error);
    throw error;
  }
};

export const updateProgress = async (planId, progressData) => {
  try {
    console.log('Updating progress via API for plan:', planId, 'with data:', progressData);
    
    // Validate data before sending
    if (typeof progressData.progress !== 'number') {
      throw new Error('Progress must be a number');
    }
    
    if (!Array.isArray(progressData.completedTopics)) {
      throw new Error('Completed topics must be an array');
    }
    
    const response = await api.patch(`/plans/${planId}/progress`, progressData);
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

export const toggleStarPlan = async (planId, isStarred) => {
  try {
    const response = await api.patch(`/plans/${planId}/star`, { isStarred });
    return response.data;
  } catch (error) {
    console.error('Error toggling star status:', error);
    throw error;
  }
};

export const savePlan = async (planParams, generatedPlan) => {
  try {
    const response = await api.post('/plans/save', {
      params: planParams,
      plan: generatedPlan
    });
    return response.data;
  } catch (error) {
    console.error('Error saving study plan:', error);
    throw error;
  }
};