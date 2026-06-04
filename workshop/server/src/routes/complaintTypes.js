const express = require("express");
const router = express.Router();
const { getAllComplaintTypes } = require("../controllers/complaintTypesController");

/**
 * Complaint type routes.
 *
 * Exposes public endpoints for complaint type dropdown data.
 */

// GET /api/complaint-types — public, used by the customer submit form
router.get("/", getAllComplaintTypes);

module.exports = router;
