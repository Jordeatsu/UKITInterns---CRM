const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { submitCase, getAllCases, getCaseById, updateCase, getNotes, addNote, getCaseHistory, addProduct, removeProduct, addCommentCode, removeCommentCode } = require("../controllers/casesController");

/**
 * Cases routes.
 *
 * Hosts both public customer case endpoints and protected advisor management endpoints.
 */

// ── Public routes (no authentication required) ────────────────────────────────

// POST /api/cases                              — customer submits a new complaint
router.post("/", submitCase);

// ── Protected routes (valid JWT required) ─────────────────────────────────────
// router.use applies authenticate to every route defined after this line
router.use(authenticate);

// GET    /api/cases               — list all cases (?status=open&search=john)
router.get("/", getAllCases);

// GET    /api/cases/:id           — full details for a single case
router.get("/:id", getCaseById);

// PATCH  /api/cases/:id           — update status, assigned_to, or priority
router.patch("/:id", updateCase);

// GET    /api/cases/:id/notes     — get all notes for a case
router.get("/:id/notes", getNotes);

// POST   /api/cases/:id/notes     — add a new note
router.post("/:id/notes", addNote);

// GET    /api/cases/:id/history   — audit trail of changes
router.get("/:id/history", getCaseHistory);

// POST   /api/cases/:id/products            — add a product to a case
router.post("/:id/products", addProduct);

// DELETE /api/cases/:id/products/:caseProductId — remove a product from a case
router.delete("/:id/products/:caseProductId", removeProduct);

// POST   /api/cases/:id/comment-codes         — link a comment code to a case product
router.post("/:id/comment-codes", addCommentCode);

// DELETE /api/cases/:id/comment-codes/:cccId  — remove a linked comment code
router.delete("/:id/comment-codes/:cccId", removeCommentCode);

module.exports = router;
