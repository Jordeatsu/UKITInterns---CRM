const db = require('../database');

function getAll() {
  return db.prepare('SELECT * FROM comment_codes ORDER BY code ASC').all();
}

function getForProduct(productId) {
  return db.prepare(`
    SELECT cc.id, cc.code, cc.description
    FROM comment_codes cc
    JOIN product_comment_codes pcc ON pcc.comment_code_id = cc.id
    WHERE pcc.product_id = ?
    ORDER BY cc.code ASC
  `).all(productId);
}

module.exports = { getAll, getForProduct };
