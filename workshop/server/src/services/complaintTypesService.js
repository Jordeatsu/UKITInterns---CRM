const db = require("../database");

function getAll() {
    return db.prepare("SELECT * FROM complaint_types ORDER BY id").all();
}

module.exports = { getAll };
