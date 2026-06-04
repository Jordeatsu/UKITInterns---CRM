const complaintTypesService = require("../services/complaintTypesService");

/**
 * Complaint types controller.
 *
 * Provides read-only complaint type options for form dropdowns.
 */

/**
 * GET /api/complaint-types
 */
function getAllComplaintTypes(req, res) {
    try {
        res.json(complaintTypesService.getAll());
    } catch (err) {
        console.error("Error fetching complaint types:", err);
        res.status(500).json({ error: "Failed to fetch complaint types." });
    }
}

module.exports = { getAllComplaintTypes };
