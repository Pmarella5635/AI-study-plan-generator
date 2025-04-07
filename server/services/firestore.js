// server/services/firestore.js
const { db } = require('../config/firebase-admin');

class FirestoreService {
  /**
   * Create a new study plan
   */
  async createPlan(userId, planData) {
    try {
      console.log(`Creating plan for user ${userId} with title: ${planData.title}`);
      
      // Add a timestamp
      const planWithTimestamp = {
        ...planData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        progress: 0,
        isStarred: false,
        isTracked: true,
        completedTopics: []
      };
      
      // Create a document reference
      const planRef = db.collection('users').doc(userId).collection('plans').doc();
      
      // Save the plan with the generated ID
      await planRef.set(planWithTimestamp);
      
      console.log(`Plan created with ID: ${planRef.id}`);
      return planRef.id;
    } catch (error) {
      console.error("Error creating plan:", error);
      throw error;
    }
  }
  
  /**
   * Get all plans for a user
   */
  async getUserPlans(userId) {
    try {
      console.log(`Fetching plans for user ${userId}`);
      const plansSnapshot = await db.collection('users').doc(userId).collection('plans')
        .orderBy('createdAt', 'desc')
        .get();
      
      if (plansSnapshot.empty) {
        console.log("No plans found for user");
        return [];
      }
      
      const plans = plansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Found ${plans.length} plans for user`);
      return plans;
    } catch (error) {
      console.error("Error getting user plans:", error);
      throw error;
    }
  }
  
  /**
   * Get a specific plan
   */
  async getPlan(userId, planId) {
    try {
      console.log(`Fetching plan ${planId} for user ${userId}`);
      const planDoc = await db.collection('users').doc(userId).collection('plans').doc(planId).get();
      
      if (!planDoc.exists) {
        console.log(`Plan ${planId} not found for user ${userId}`);
        throw new Error("Plan not found");
      }
      
      console.log(`Plan ${planId} found`);
      return {
        id: planDoc.id,
        ...planDoc.data()
      };
    } catch (error) {
      console.error("Error getting plan:", error);
      throw error;
    }
  }
  
  /**
   * Update a plan
   */
  async updatePlan(userId, planId, updates) {
    try {
      console.log(`Updating plan ${planId} for user ${userId}`);
      await db.collection('users').doc(userId).collection('plans').doc(planId).update({
        ...updates,
        updatedAt: new Date()
      });
      
      console.log(`Plan ${planId} updated successfully`);
      return true;
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error;
    }
  }
  
  /**
   * Delete a plan
   */
  async deletePlan(userId, planId) {
    try {
      console.log(`Deleting plan ${planId} for user ${userId}`);
      await db.collection('users').doc(userId).collection('plans').doc(planId).delete();
      
      console.log(`Plan ${planId} deleted successfully`);
      return true;
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw error;
    }
  }
  
  /**
   * Update progress for a plan
   */
  async updateProgress(userId, planId, progressData) {
    try {
      console.log(`Updating progress for plan ${planId}:`, progressData);
      
      // Ensure data is valid
      if (typeof progressData.progress !== 'number') {
        throw new Error("Progress must be a number");
      }
      
      if (!Array.isArray(progressData.completedTopics)) {
        throw new Error("Completed topics must be an array");
      }
      
      // First get the current plan data
      const planRef = db.collection('users').doc(userId).collection('plans').doc(planId);
      const planDoc = await planRef.get();
      
      if (!planDoc.exists) {
        throw new Error(`Plan ${planId} not found`);
      }
      
      // Update with new progress data
      await planRef.update({
        progress: progressData.progress,
        completedTopics: progressData.completedTopics,
        updatedAt: new Date()
      });
      
      console.log(`Progress updated for plan ${planId} to ${progressData.progress}%`);
      return true;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  }
  
  /**
   * Toggle starred status for a plan
   */
  async toggleStarPlan(userId, planId, isStarred) {
    try {
      console.log(`${isStarred ? 'Starring' : 'Unstarring'} plan ${planId}`);
      await db.collection('users').doc(userId).collection('plans').doc(planId).update({
        isStarred,
        updatedAt: new Date()
      });
      
      console.log(`Star status updated for plan ${planId}`);
      return true;
    } catch (error) {
      console.error("Error toggling star status:", error);
      throw error;
    }
  }
}

module.exports = new FirestoreService();