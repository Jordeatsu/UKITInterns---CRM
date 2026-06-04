const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getSummary, getAnalytics } = require("../controllers/dashboardController");

/**
 * Dashboard routes.
 *
 * Defines authenticated endpoints for summary cards and analytics datasets.
 */

router.use(authenticate);

router.get("/", getSummary);
router.get("/analytics", getAnalytics);

module.exports = router;
