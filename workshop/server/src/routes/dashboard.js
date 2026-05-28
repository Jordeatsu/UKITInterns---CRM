const express = require('express');
const router  = express.Router();
const { authenticate } = require('../middleware/auth');
const { getSummary, getAnalytics } = require('../controllers/dashboardController');

router.use(authenticate);

router.get('/', getSummary);
router.get('/analytics', getAnalytics);

module.exports = router;
