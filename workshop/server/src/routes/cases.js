const express = require('express');
const router  = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  submitCase,
  trackCase,
  trackByContact,
  getAllCases,
  getCaseById,
  updateCase,
  getNotes,
  addNote,
  getCaseHistory,
  addProduct,
  removeProduct,
  addCommentCode,
  removeCommentCode,
  getMessages,
  addMessage,
  addConsumerMessage,
} = require('../controllers/casesController');

// ── Public routes (no authentication required) ────────────────────────────────

// POST /api/cases                              — customer submits a new complaint
router.post('/', submitCase);

// GET  /api/cases/track/by-contact             — customer looks up all their cases by name + email
// Must be defined before /track/:referenceNumber so Express matches it as a static path
router.get('/track/by-contact', trackByContact);

// GET  /api/cases/track/:referenceNumber       — customer checks a single case by reference
router.get('/track/:referenceNumber', trackCase);

// GET  /api/cases/:id/messages                 — public: consumer reads messages on their case
router.get('/:id/messages', getMessages);

// POST /api/cases/:id/consumer-messages         — public: consumer sends a message
router.post('/:id/consumer-messages', addConsumerMessage);

// ── Protected routes (valid JWT required) ─────────────────────────────────────
// router.use applies authenticate to every route defined after this line
router.use(authenticate);

// GET    /api/cases               — list all cases (?status=open&search=john)
router.get('/',    getAllCases);

// GET    /api/cases/:id           — full details for a single case
router.get('/:id', getCaseById);

// PATCH  /api/cases/:id           — update status, assigned_to, or priority
router.patch('/:id', updateCase);

// GET    /api/cases/:id/notes     — get all notes for a case
router.get('/:id/notes', getNotes);

// POST   /api/cases/:id/notes     — add a new note
router.post('/:id/notes', addNote);

// GET    /api/cases/:id/history   — audit trail of changes
router.get('/:id/history', getCaseHistory);

// POST   /api/cases/:id/products            — add a product to a case
router.post('/:id/products', addProduct);

// DELETE /api/cases/:id/products/:caseProductId — remove a product from a case
router.delete('/:id/products/:caseProductId', removeProduct);

// POST   /api/cases/:id/comment-codes         — link a comment code to a case product
router.post('/:id/comment-codes', addCommentCode);

// DELETE /api/cases/:id/comment-codes/:cccId  — remove a linked comment code
router.delete('/:id/comment-codes/:cccId', removeCommentCode);

// POST   /api/cases/:id/messages         — add a message to a case (advisor)
router.post('/:id/messages', addMessage);

module.exports = router;
