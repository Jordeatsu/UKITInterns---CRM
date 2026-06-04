const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getAllCommentCodes, getCommentCodesForProduct } = require("../controllers/commentCodesController");

/**
 * Comment code routes.
 *
 * Provides authenticated lookup endpoints for comment code catalogs.
 */

router.use(authenticate);

// GET /api/comment-codes  — list all comment codes
router.get("/", getAllCommentCodes);

// GET /api/comment-codes/product/:productId  — list comment codes available for a product
router.get("/product/:productId", getCommentCodesForProduct);

module.exports = router;
