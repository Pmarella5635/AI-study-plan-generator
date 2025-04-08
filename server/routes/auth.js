// server/routes/auth.js
const express = require('express');
const router = express.Router();

// Just a placeholder for now
router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login endpoint' });
});

router.post('/register', (req, res) => {
  res.status(200).json({ message: 'Register endpoint' });
});

module.exports = router;