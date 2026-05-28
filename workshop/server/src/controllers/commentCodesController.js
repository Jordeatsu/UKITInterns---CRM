const commentCodesService = require('../services/commentCodesService');

/**
 * GET /api/comment-codes
 */
function getAllCommentCodes(req, res) {
  try {
    res.json(commentCodesService.getAll());
  } catch (err) {
    console.error('Error fetching comment codes:', err);
    res.status(500).json({ error: 'Failed to fetch comment codes.' });
  }
}

/**
 * GET /api/comment-codes/product/:productId
 */
function getCommentCodesForProduct(req, res) {
  try {
    const codes = commentCodesService.getForProduct(req.params.productId);
    res.json(codes);
  } catch (err) {
    console.error('Error fetching product comment codes:', err);
    res.status(500).json({ error: 'Failed to fetch comment codes.' });
  }
}

module.exports = { getAllCommentCodes, getCommentCodesForProduct };
