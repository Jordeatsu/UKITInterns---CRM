/**
 * Centralised server configuration.
 *
 * All environment-driven values live here so no other file needs to reference
 * process.env directly.  Import from this module rather than repeating the
 * fallback logic across multiple files.
 */

const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET || "crm_workshop_secret";
const JWT_EXPIRY = "8h";

const DB_PATH = process.env.DB_PATH
    ? path.resolve(process.env.DB_PATH)
    : path.join(__dirname, "..", "crm.db");

const PORT = process.env.PORT || 5008;

const TRUST_PROXY = process.env.TRUST_PROXY;

module.exports = { JWT_SECRET, JWT_EXPIRY, DB_PATH, PORT, TRUST_PROXY };
