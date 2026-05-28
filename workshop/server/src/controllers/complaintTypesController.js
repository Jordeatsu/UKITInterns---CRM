const complaintTypesService = require("../services/complaintTypesService");

function getAllComplaintTypes(req, res) {
    try {
        res.json(complaintTypesService.getAll());
    } catch (err) {
        console.error("Error fetching complaint types:", err);
        res.status(500).json({ error: "Failed to fetch complaint types." });
    }
}

module.exports = { getAllComplaintTypes };
