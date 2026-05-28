const contactsService = require("../services/contactsService");

function getAllContacts(req, res) {
    try {
        res.json(contactsService.getAll());
    } catch (err) {
        console.error("Error fetching contacts:", err);
        res.status(500).json({ error: "Failed to fetch contacts." });
    }
}

function getContactById(req, res) {
    try {
        const contact = contactsService.getById(req.params.id);
        if (!contact) return res.status(404).json({ error: "Contact not found." });
        res.json(contact);
    } catch (err) {
        console.error("Error fetching contact:", err);
        res.status(500).json({ error: "Failed to fetch contact." });
    }
}

function updateContact(req, res) {
    try {
        const { name, email, phone } = req.body;
        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({ error: "Name and email are required." });
        }
        const updated = contactsService.updateContact(req.params.id, { name: name.trim(), email: email.trim(), phone: phone?.trim() || null });
        if (!updated) return res.status(404).json({ error: "Contact not found." });
        res.json(updated);
    } catch (err) {
        console.error("Error updating contact:", err);
        res.status(500).json({ error: "Failed to update contact." });
    }
}

function mergeContacts(req, res) {
    try {
        const { mergeIds } = req.body;
        if (!Array.isArray(mergeIds) || mergeIds.length < 1 || mergeIds.length > 2) {
            return res.status(400).json({ error: "mergeIds must be an array of 1–2 contact IDs." });
        }
        const primaryId = parseInt(req.params.id, 10);
        if (mergeIds.map(Number).includes(primaryId)) {
            return res.status(400).json({ error: "Cannot merge a contact with itself." });
        }
        const result = contactsService.mergeContacts(primaryId, mergeIds.map(Number));
        if (!result) return res.status(404).json({ error: "Primary contact not found." });
        res.json(result);
    } catch (err) {
        console.error("Error merging contacts:", err);
        res.status(500).json({ error: "Failed to merge contacts." });
    }
}

module.exports = { getAllContacts, getContactById, updateContact, mergeContacts };
