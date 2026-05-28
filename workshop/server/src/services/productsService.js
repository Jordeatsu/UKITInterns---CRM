const db = require("../database");

function getAll() {
    return db.prepare("SELECT * FROM products ORDER BY name ASC").all();
}

function getById(id) {
    return db.prepare("SELECT * FROM products WHERE id = ?").get(id) || null;
}

module.exports = { getAll, getById };
