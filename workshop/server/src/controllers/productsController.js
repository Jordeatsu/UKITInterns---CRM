const productsService = require("../services/productsService");

/**
 * Products controller.
 *
 * Provides product lookup endpoints used by consumer and advisor flows.
 */

/**
 * GET /api/products
 */
function getAllProducts(req, res) {
    try {
        res.json(productsService.getAll());
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Failed to fetch products." });
    }
}

/**
 * GET /api/products/:id
 */
function getProductById(req, res) {
    try {
        const product = productsService.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }
        res.json(product);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ error: "Failed to fetch product." });
    }
}

module.exports = { getAllProducts, getProductById };
