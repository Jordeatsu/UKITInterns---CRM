const express = require('express');
const router  = express.Router();
const { authenticate } = require('../middleware/auth');
const { getAllCannedResponses } = require('../controllers/cannedResponsesController');

router.use(authenticate);

router.get('/', getAllCannedResponses);

module.exports = router;
