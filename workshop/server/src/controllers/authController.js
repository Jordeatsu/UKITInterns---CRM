const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

/**
 * Auth controller.
 *
 * Handles advisor login and returning the current advisor identity from JWT data.
 */

const JWT_SECRET = process.env.JWT_SECRET || "crm_workshop_secret";
const JWT_EXPIRY = "8h";

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

module.exports = { login, getMe };
