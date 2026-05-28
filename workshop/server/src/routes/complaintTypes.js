const express = require('express');
const router  = express.Router();
const { getAllComplaintTypes } = require('../controllers/complaintTypesController');

// GET /api/complaint-types — public, used by the customer submit form
router.get('/', getAllComplaintTypes);

module.exports = router;
