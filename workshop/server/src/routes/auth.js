const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { authenticate } = require("../middleware/auth");
const { login, getMe, changePassword } = require("../controllers/authController");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many login attempts. Please try again later." },
});

/**
 * Auth routes.
 *
 * Defines authentication endpoints for advisor login and identity lookup.
 */

// POST /api/auth/login  — exchange credentials for a JWT
router.post("/login", loginLimiter, login);

// GET  /api/auth/me     — return the currently authenticated advisor
router.get("/me", authenticate, getMe);

// PATCH /api/auth/password — update current advisor password
router.patch("/password", authenticate, changePassword);

module.exports = router;
