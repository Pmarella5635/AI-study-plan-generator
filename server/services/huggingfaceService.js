// server/services/huggingfaceService.js
const axios = require('axios');
require('dotenv').config();

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN || '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';
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';

class HuggingFaceService {
  constructor() {
    // Create the API client for Hugging Face
    this.client = axios.create({
      baseURL: 'https://api-inference.huggingface.co/models',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Generate a study plan using Mistral model
   */
  async generateStudyPlan(params) {
    try {
      console.log("Starting AI plan generation with params:", params);
      const { subject, duration, difficulty, startDate, endDate, goals } = params;
      
      // Craft the prompt for Mistral
      const prompt = `
        You are an expert educational planner.
        Create a detailed study plan for ${subject} with these parameters:
        - Duration: ${duration} days (from ${startDate} to ${endDate})
        - Difficulty: ${difficulty}
        - Primary Goal: ${goals || "Master the fundamentals of the subject"}
        
        Respond with a valid JSON object only, structured like this:
        {
          "title": "${subject} Study Plan",
          "description": "A comprehensive study plan for ${subject} tailored to ${difficulty} level with a focus on ${goals || "mastering fundamentals"}",
          "topics": ["Main Topic 1", "Main Topic 2", "Main Topic 3", ...],
          "schedule": [
            {"date": "YYYY-MM-DD", "topics": "What to study", "hours": 2},
            ...
          ],
          "resources": [
            {"name": "Resource Name", "description": "Brief description"},
            ...
          ],
          "milestones": [
            {"name": "Milestone Name", "description": "Description"},
            ...
          ]
        }
        
        Keep topics between 5-7, include no more than 14 days in schedule, and limit resources and milestones to 3-5 items each.
        Return ONLY the JSON with no extra text, no code blocks, no markdown.
      `;

      // Prepare the request payload
      const payload = {
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
          return_full_text: false
        }
      };

      console.log("Sending request to Hugging Face API...");
      
      // Make the API call
      const response = await this.client.post(`/${HF_MODEL}`, payload);
      
      console.log("Received response from Hugging Face API");
      
      // Parse the response
      if (response.data && response.data[0] && response.data[0].generated_text) {
        const generatedText = response.data[0].generated_text;
        console.log("Raw generated text:", generatedText);
        
        // Try to parse as JSON
        try {
          // Find JSON object in the response if there's any surrounding text
          const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : generatedText;
          
          const plan = JSON.parse(jsonStr);
          console.log("Successfully parsed plan JSON");
          return plan;
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          throw new Error("Failed to parse AI response as JSON");
        }
      } else {
        console.error("Unexpected response format from Hugging Face API:", response.data);
        throw new Error("Invalid response from AI service");
      }
    } catch (error) {
      console.error("Error in AI plan generation:", error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new HuggingFaceService();