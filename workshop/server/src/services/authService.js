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

/**
 * Change an advisor password after validating their current password.
 *
 * @param {number|string} advisorId
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {{ok: boolean, status?: number, error?: string}}
 */
function changePassword(advisorId, currentPassword, newPassword) {
    const advisor = db.prepare("SELECT id, password_hash FROM advisors WHERE id = ?").get(advisorId);
    if (!advisor) return { ok: false, status: 404, error: "Advisor not found." };

    const currentMatches = bcrypt.compareSync(currentPassword, advisor.password_hash);
    if (!currentMatches) return { ok: false, status: 401, error: "Current password is incorrect." };

    const sameAsCurrent = bcrypt.compareSync(newPassword, advisor.password_hash);
    if (sameAsCurrent) return { ok: false, status: 400, error: "New password must be different from current password." };

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare("UPDATE advisors SET password_hash = ? WHERE id = ?").run(newHash, advisorId);
    return { ok: true };
}

module.exports = { verifyCredentials, changePassword };
