// server/middleware/auth.js
const { admin } = require('../config/firebase-admin');
const { error } = require('../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(error("Unauthorized: No token provided"));
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (verifyError) {
      return res.status(401).json(error("Unauthorized: Invalid token", verifyError.message));
    }
  } catch (middlewareError) {
    return res.status(500).json(error("Internal server error", middlewareError.message));
  }
};