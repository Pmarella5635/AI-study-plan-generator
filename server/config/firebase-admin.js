// server/config/firebase-admin.js
const admin = require('firebase-admin');
require('dotenv').config();

let firebaseApp;

// Check if app is already initialized
try {
  firebaseApp = admin.app();
} catch (e) {
  // Initialize app if not already done
  try {
    // First try using service account file
    try {
      const serviceAccount = require('../study-plan-okcu-firebase-adminsdk.json');
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized with service account file");
    } catch (fileError) {
      // If file not found, try using environment variables
      console.log("Service account file not found, trying environment variables");
      
      const privateKey = process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined;
        
      if (!process.env.FIREBASE_PROJECT_ID || !privateKey) {
        throw new Error("Firebase credentials not found in environment variables");
      }
      
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID
      };
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized with environment variables");
    }
  } catch (initError) {
    console.error("Failed to initialize Firebase Admin:", initError);
    
    if (process.env.NODE_ENV !== 'production') {
      // For development only - provide a mock implementation
      console.log("⚠️ Using mock Firebase implementation for development");
      firebaseApp = admin.initializeApp({
        projectId: 'mock-project-id'
      }, 'mock-app');
    } else {
      throw initError;
    }
  }
}

const db = admin.firestore();

module.exports = { admin, db };