const db = require("../database");

/**
 * Complaint types service.
 *
 * Provides read-only complaint type data used by submission forms.
 */

/**
 * Returns all complaint types in display order.
 */
function getAll() {
    return db.prepare("SELECT * FROM complaint_types ORDER BY id").all();
}

module.exports = { getAll };
