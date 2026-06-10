const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

const { JWT_SECRET, JWT_EXPIRY } = require("../config");

/**
 * Auth controller.
 *
 * Handles advisor login and returning the current advisor identity from JWT data.
 */

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns a JWT and basic advisor info on success.
 */
function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const advisor = authService.verifyCredentials(email, password);

        if (!advisor) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Sign a token containing non-sensitive advisor info
        const token = jwt.sign({ id: advisor.id, name: advisor.name, email: advisor.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

        res.json({
            token,
            advisor: { id: advisor.id, name: advisor.name, email: advisor.email },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed." });
    }
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated advisor from the JWT payload.
 */
function getMe(req, res) {
    res.json({ advisor: req.advisor });
}

/**
 * PATCH /api/auth/password
 * Body: { currentPassword, newPassword }
 * Updates the authenticated advisor password.
 */
function changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current password and new password are required." });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters." });
    }

    try {
        const result = authService.changePassword(req.advisor.id, currentPassword, newPassword);
        if (!result.ok) {
            return res.status(result.status).json({ error: result.error });
        }

        res.json({ message: "Password updated successfully." });
    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({ error: "Failed to update password." });
    }
}

module.exports = { login, getMe, changePassword };
