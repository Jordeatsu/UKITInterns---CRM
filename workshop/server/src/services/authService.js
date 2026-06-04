const bcrypt = require("bcryptjs");
const db = require("../database");

/**
 * Auth service.
 *
 * Contains credential validation logic for advisor authentication.
 */

/**
 * Verify an advisor's email and password against the database.
 * Returns the advisor object (without the password hash) if valid, or null.
 */
function verifyCredentials(email, password) {
    const advisor = db.prepare("SELECT * FROM advisors WHERE email = ?").get(email);

    if (!advisor) return null;

    const passwordMatches = bcrypt.compareSync(password, advisor.password_hash);
    if (!passwordMatches) return null;

    // Strip the hash — never send it to the client
    const { password_hash, ...safeAdvisor } = advisor;
    return safeAdvisor;
}

module.exports = { verifyCredentials };
