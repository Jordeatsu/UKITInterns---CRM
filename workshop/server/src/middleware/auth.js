const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "crm_workshop_secret";

/**
 * Authentication middleware module.
 *
 * Verifies bearer JWTs and attaches advisor identity to the request object.
 */

/**
 * Authentication middleware.
 *
 * Reads the JWT from the Authorization header, verifies it, and attaches the
 * decoded advisor payload to req.advisor so downstream handlers can use it.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 *
 * Usage:
 *   router.get('/protected-route', authenticate, myController)
 */
function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"];

    // Header must be present and start with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.advisor = decoded; // e.g. { id, name, email, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
}

module.exports = { authenticate };
