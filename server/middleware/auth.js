// server/middleware/auth.js
const { admin } = require('../config/firebase-admin');
const { error } = require('../utils/responseFormatter');

module.exports = async (req, res, next) => {
  // For development only - comment out or remove in production
  const BYPASS_AUTH = process.env.NODE_ENV !== 'production' && process.env.BYPASS_AUTH === 'true';
  if (BYPASS_AUTH) {
    console.log("⚠️ Development mode: Bypassing authentication");
    req.user = { uid: 'dev-user-123', email: 'dev@example.com' };
    return next();
  }
  
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("No token provided in authorization header");
      return res.status(401).json(error("Unauthorized: No token provided"));
    }
    
    const token = authHeader.split(' ')[1];
    console.log("Token received, attempting verification");
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log("Token verified for user:", decodedToken.uid);
      req.user = decodedToken;
      next();
    } catch (verifyError) {
      console.error("Token verification error:", verifyError);
      return res.status(401).json(error("Unauthorized: Invalid token", verifyError.message));
    }
  } catch (middlewareError) {
    console.error("Auth middleware error:", middlewareError);
    return res.status(500).json(error("Internal server error", middlewareError.message));
  }
};