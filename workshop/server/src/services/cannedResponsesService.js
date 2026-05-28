const db = require('../database');

function getAll() {
  return db.prepare('SELECT * FROM canned_responses ORDER BY title ASC').all();
}

module.exports = { getAll };
