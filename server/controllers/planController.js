// server/controllers/planController.js
const firestoreService = require('../services/firestore');
const huggingfaceService = require('../services/huggingfaceService');
const { success, error } = require('../utils/responseFormatter');

// Fixed user ID for simplicity
const FIXED_USER_ID = 'demo-user-123';

// server/controllers/planController.js - Update the generatePlan function

exports.generatePlan = async (req, res) => {
  try {
    const userId = FIXED_USER_ID;
    const planParams = req.body;
    const saveToDatabase = req.query.save !== 'false'; // Default to true unless explicitly set to false
    
    console.log(`API: Generating plan with parameters: ${JSON.stringify(planParams)}`);
    console.log(`Save to database: ${saveToDatabase}`);
    
    try {
      // Generate plan using Hugging Face API
      console.log("Calling AI service to generate plan...");
      const generatedPlan = await huggingfaceService.generateStudyPlan(planParams);
      console.log("AI plan generated successfully");
      
      // Save to Firestore only if saveToDatabase is true
      let planId = null;
      if (saveToDatabase) {
        console.log("Saving plan to Firestore...");
        planId = await firestoreService.createPlan(userId, {
          ...generatedPlan,
          params: planParams
        });
        console.log(`Plan saved with ID: ${planId}`);
      } else {
        console.log("Plan not saved to database (save=false)");
      }
      
      // Return response
      res.status(201).json(success({
        planId,
        plan: generatedPlan
      }, saveToDatabase ? "Plan generated and saved successfully" : "Plan generated successfully (not saved)"));
    } catch (aiError) {
      console.error("Error generating plan with AI:", aiError);
      throw aiError;
    }
  } catch (err) {
    console.error("Final error in generatePlan:", err);
    res.status(500).json(error("Failed to generate study plan", err.message));
  }
};
// Add this route handler:

exports.savePlan = async (req, res) => {
  try {
    const userId = FIXED_USER_ID;
    const { params, plan } = req.body;
    
    console.log("Saving pre-generated plan to database");
    
    // Just save the plan directly - it's already generated
    const planId = await firestoreService.createPlan(userId, {
      ...plan,
      params: params
    });
    
    console.log(`Plan saved with ID: ${planId}`);
    
    res.status(201).json(success({
      planId,
      plan: plan
    }, "Plan saved successfully"));
  } catch (err) {
    console.error("Error in savePlan:", err);
    res.status(500).json(error("Failed to save study plan", err.message));
  }
};
exports.getUserPlans = async (req, res) => {
  try {
    const userId = FIXED_USER_ID;
    const plans = await firestoreService.getUserPlans(userId);
    
    res.status(200).json(success(plans));
  } catch (err) {
    console.error("Error in getUserPlans:", err);
    res.status(500).json(error("Failed to retrieve user plans", err.message));
  }
};

// server/controllers/planController.js
exports.getPlan = async (req, res) => {
  try {
    const userId = FIXED_USER_ID;
    const planId = req.params.planId;
    
    console.log(`Request for plan ${planId} from user ${userId}`);
    
    // Add cache control headers to prevent browser caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    try {
      const plan = await firestoreService.getPlan(userId, planId);
      
      console.log(`Successfully retrieved plan ${planId}`);
      res.status(200).json(success(plan));
    } catch (err) {
      console.error(`Error retrieving plan ${planId}:`, err.message);
      
      if (err.message === "Plan not found") {
        return res.status(404).json(error("Plan not found"));
      }
      throw err;
    }
  } catch (err) {
    console.error("Error in getPlan:", err);
    res.status(500).json(error("Failed to retrieve the plan", err.message));
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const userId = FIXED_USER_ID;
    const planId = req.params.planId;
    const updates = req.body;
    
    await firestoreService.updatePlan(userId, planId, updates);
    
    res.status(200).json(success(null, "Plan updated successfully"));
  } catch (err) {
    console.error("Error in updatePlan:", err);
    res.status(500).json(error("Failed to update the plan", err.message));
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const userId = FIXED_USER_ID;
    const planId = req.params.planId;
    
    await firestoreService.deletePlan(userId, planId);
    
    res.status(200).json(success(null, "Plan deleted successfully"));
  } catch (err) {
    console.error("Error in deletePlan:", err);
    res.status(500).json(error("Failed to delete the plan", err.message));
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const userId = FIXED_USER_ID;
    const planId = req.params.planId;
    const progressData = req.body;
    
    console.log(`Received progress update for plan ${planId}:`, progressData);
    
    // Validate progress data
    if (typeof progressData.progress !== 'number') {
      return res.status(400).json(error("Invalid progress value"));
    }
    
    if (!Array.isArray(progressData.completedTopics)) {
      return res.status(400).json(error("Completed topics must be an array"));
    }
    
    await firestoreService.updateProgress(userId, planId, progressData);
    
    res.status(200).json(success({ 
      updated: true,
      planId,
      progress: progressData.progress,
      completedTopicsCount: progressData.completedTopics.length
    }, "Progress updated successfully"));
  } catch (err) {
    console.error("Error in updateProgress:", err);
    res.status(500).json(error("Failed to update progress", err.message));
  }
};

exports.toggleStarPlan = async (req, res) => {
  try {
    const userId = FIXED_USER_ID;
    const planId = req.params.planId;
    const { isStarred } = req.body;
    
    await firestoreService.toggleStarPlan(userId, planId, isStarred);
    
    res.status(200).json(success(null, isStarred ? "Plan starred successfully" : "Plan unstarred successfully"));
  } catch (err) {
    console.error("Error in toggleStarPlan:", err);
    res.status(500).json(error("Failed to update star status", err.message));
  }
};