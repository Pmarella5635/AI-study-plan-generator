// server/routes/plans.js
const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middleware/auth');

router.post('/generate', auth, planController.generatePlan);
router.get('/', auth, planController.getUserPlans);
router.get('/:planId', auth, planController.getPlan);
router.put('/:planId', auth, planController.updatePlan);
router.delete('/:planId', auth, planController.deletePlan);
router.patch('/:planId/progress', auth, planController.updateProgress);
router.patch('/:planId/star', auth, planController.toggleStarPlan);
router.post('/save', auth, planController.savePlan);

module.exports = router;