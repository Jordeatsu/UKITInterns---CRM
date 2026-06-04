const db = require("../database");

/**
 * Products service.
 *
 * Provides product catalog lookup methods for routes and controllers.
 */

/**
 * Returns all products sorted alphabetically.
 */
function getAll() {
    return db.prepare("SELECT * FROM products ORDER BY name ASC").all();
}

/**
 * Returns a single product by ID, or null if not found.
 */
function getById(id) {
    return db.prepare("SELECT * FROM products WHERE id = ?").get(id) || null;
}

module.exports = { getAll, getById };
