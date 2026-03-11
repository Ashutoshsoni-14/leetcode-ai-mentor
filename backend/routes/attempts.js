/**
 * Attempts Routes
 * POST /api/attempts/submit
 * GET  /api/attempts/user/:id
 * GET  /api/attempts/dashboard/:userId
 * GET  /api/attempts/:id
 */

const express = require('express');
const router = express.Router();
const {
  submitAttempt,
  getUserAttempts,
  getAttemptById,
  getDashboardStats
} = require('../controllers/attemptsController');
const { protect } = require('../middleware/auth');

// All attempt routes require authentication
router.use(protect);

router.post('/submit', submitAttempt);
router.get('/dashboard/:userId', getDashboardStats);
router.get('/user/:id', getUserAttempts);
router.get('/:id', getAttemptById);

module.exports = router;
