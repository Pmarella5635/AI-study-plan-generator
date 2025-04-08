// client/src/contexts/PlanContext.jsx
import React, { createContext, useContext, useState, useRef } from 'react';
import { 
  getUserPlans, 
  getPlan, 
  generateStudyPlan, 
  savePlan,
  updatePlan, 
  deletePlan,
  updateProgress,
  toggleStarPlan
} from '../services/planService';

const PlanContext = createContext();

export function usePlans() {
  return useContext(PlanContext);
}

export function PlanProvider({ children }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchInProgress = useRef(false);

  const fetchPlans = async (force = false) => {
    // Prevent concurrent fetches and unnecessary fetches
    if (fetchInProgress.current || (plans.length > 0 && !force)) {
      return plans;
    }
    
    try {
      fetchInProgress.current = true;
      setLoading(true);
      setError(null);
      
      const response = await getUserPlans();
      const fetchedPlans = response.data || [];
      setPlans(fetchedPlans);
      
      return fetchedPlans;
    } catch (error) {
      setError('Failed to fetch plans. Please try again.');
      console.error('Error fetching plans:', error);
      return plans;
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  // Generate a new study plan
  const generatePlan = async (planParams, saveToDatabase = true, preGeneratedPlan = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // If we have a pre-generated plan and want to save it
      if (preGeneratedPlan && saveToDatabase) {
        console.log("Saving pre-generated plan to database");
        const response = await savePlan(planParams, preGeneratedPlan);
        await fetchPlans(true); // Refresh plans with force=true
        return response.data;
      }
      
      // If we need to generate a new plan
      const response = await generateStudyPlan(planParams, saveToDatabase);
      
      // If we saved to database, refresh plans
      if (saveToDatabase) {
        await fetchPlans(true);
      }
      
      return response.data;
    } catch (error) {
      setError('Failed to generate plan. Please try again.');
      console.error('Error generating plan:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };


// Get a specific plan
const fetchPlan = async (planId) => {
  if (!planId) {
    return null;
  }
  
  setLoading(true);
  setError(null);
  
  try {
    // Check if we already have this plan in our state
    const existingPlan = plans.find(plan => plan.id === planId);
    if (existingPlan) {
      console.log("Using cached plan data", planId);
      return existingPlan;
    }
    
    console.log("Fetching plan from server", planId);
    const response = await getPlan(planId);
    return response.data;
  } catch (error) {
    setError('Failed to fetch plan. Please try again.');
    console.error('Error fetching plan:', error);
    return null;
  } finally {
    setLoading(false);
  }
};
  // Update a plan
  const updateStudyPlan = async (planId, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      await updatePlan(planId, updates);
      await fetchPlans(true); // Force refresh
      return true;
    } catch (error) {
      setError('Failed to update plan. Please try again.');
      console.error('Error updating plan:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a plan
  const removeStudyPlan = async (planId) => {
    setLoading(true);
    setError(null);
    
    try {
      await deletePlan(planId);
      await fetchPlans(true); // Force refresh
      return true;
    } catch (error) {
      setError('Failed to delete plan. Please try again.');
      console.error('Error deleting plan:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update progress for a plan
  const trackProgress = async (planId, progressData) => {
    if (!planId || !progressData) {
      console.error("Missing required parameters for progress tracking");
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Updating progress for plan", planId, ":", progressData);
      await updateProgress(planId, progressData);
      
      // Update local plans data with new progress without refetching
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === planId 
            ? { 
                ...plan, 
                progress: progressData.progress,
                completedTopics: progressData.completedTopics
              } 
            : plan
        )
      );
      
      return true;
    } catch (error) {
      setError('Failed to update progress. Please try again.');
      console.error('Error updating progress:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Star or unstar a plan
  const toggleStar = async (planId, isStarred) => {
    setLoading(true);
    setError(null);
    
    try {
      await toggleStarPlan(planId, isStarred);
      
      // Update local plans data with new star status
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === planId 
            ? { ...plan, isStarred } 
            : plan
        )
      );
      
      return true;
    } catch (error) {
      setError('Failed to update star status. Please try again.');
      console.error('Error updating star status:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Filter starred plans
  const getStarredPlans = () => {
    return plans.filter(plan => plan.isStarred);
  };

  // Filter tracked plans
  const getTrackedPlans = () => {
    return plans.filter(plan => plan.isTracked);
  };

  // Filter in-progress plans
  const getInProgressPlans = () => {
    return plans.filter(plan => plan.status === 'active' && plan.progress < 100);
  };

  // Filter completed plans
  const getCompletedPlans = () => {
    return plans.filter(plan => plan.status === 'active' && plan.progress === 100);
  };

  const value = {
    plans,
    loading,
    error,
    fetchPlans,
    generatePlan,
    fetchPlan,
    updateStudyPlan,
    removeStudyPlan,
    trackProgress,
    toggleStar,
    getStarredPlans,
    getTrackedPlans,
    getInProgressPlans,
    getCompletedPlans
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
}