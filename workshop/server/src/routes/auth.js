const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { login, getMe, changePassword } = require("../controllers/authController");

/**
 * Auth routes.
 *
 * Defines authentication endpoints for advisor login and identity lookup.
 */

// POST /api/auth/login  — exchange credentials for a JWT
router.post("/login", login);

// GET  /api/auth/me     — return the currently authenticated advisor
router.get("/me", authenticate, getMe);

// PATCH /api/auth/password — update current advisor password
router.patch("/password", authenticate, changePassword);

module.exports = router;
