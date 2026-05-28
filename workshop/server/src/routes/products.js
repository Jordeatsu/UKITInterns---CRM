const express = require('express');
const router  = express.Router();
const { authenticate } = require('../middleware/auth');
const { getAllProducts, getProductById } = require('../controllers/productsController');

// GET /api/products      — public: consumer form needs this to populate dropdown
router.get('/', getAllProducts);

// GET /api/products/:id  — protected
router.get('/:id', authenticate, getProductById);

module.exports = router;
