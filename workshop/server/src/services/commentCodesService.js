const db = require("../database");

/**
 * Comment codes service.
 *
 * Provides comment code catalogs and product-specific code mappings.
 */

/**
 * Returns all comment codes sorted by code.
 */
function getAll() {
    return db.prepare("SELECT * FROM comment_codes ORDER BY code ASC").all();
}

/**
 * Returns comment codes available for a given product.
 */
function getForProduct(productId) {
    return db
        .prepare(
            `
    SELECT cc.id, cc.code, cc.description
    FROM comment_codes cc
    JOIN product_comment_codes pcc ON pcc.comment_code_id = cc.id
    WHERE pcc.product_id = ?
    ORDER BY cc.code ASC
  `,
        )
        .all(productId);
}

module.exports = { getAll, getForProduct };
