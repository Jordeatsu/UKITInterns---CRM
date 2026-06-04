const casesService = require("../services/casesService");

/**
 * Cases controller.
 *
 * Exposes public consumer endpoints and protected advisor endpoints for
 * creating, tracking, and managing CRM cases.
 */

// ── Public handlers ───────────────────────────────────────────────────────────

/**
 * POST /api/cases
 * Public — customer submits a new complaint.
 * Body: { name, email, phone, subject, description, product_ids }
 * Returns a reference number so the customer can track their case.
 */
function submitCase(req, res) {
    try {
        const { name, email, phone, subject, description, complaint_type_id, product_ids } = req.body;

        if (!name || !email || !subject || !description) {
            return res.status(400).json({
                error: "name, email, subject, and description are required.",
            });
        }

        const result = casesService.submit({
            name,
            email,
            phone,
            subject,
            description,
            complaint_type_id: complaint_type_id || null,
            product_ids: product_ids || [],
        });

        res.status(201).json(result);
    } catch (err) {
        console.error("Error submitting case:", err);
        res.status(500).json({ error: "Failed to submit case." });
    }
}

/**
 * GET /api/cases/track/:referenceNumber
 * Public — customer checks their case status using their reference number.
 * Returns limited fields only (no advisor notes or internal details).
 */
function trackCase(req, res) {
    try {
        const caseData = casesService.getByReference(req.params.referenceNumber);
        if (!caseData) {
            return res.status(404).json({
                error: "Case not found. Please check your reference number.",
            });
        }
        res.json(caseData);
    } catch (err) {
        console.error("Error tracking case:", err);
        res.status(500).json({ error: "Failed to fetch case." });
    }
}

/**
 * GET /api/cases/track/by-contact?email=...&name=...
 * Public — customer retrieves all their cases using their name and email.
 * Both values must match the stored contact record (case-insensitive).
 */
function trackByContact(req, res) {
    try {
        const { email, name } = req.query;

        if (!email || !name) {
            return res.status(400).json({ error: "name and email are required." });
        }

        const cases = casesService.getByContact(email.trim(), name.trim());

        if (cases === null) {
            return res.status(404).json({
                error: "No account found with those details. Please check your name and email address.",
            });
        }

        res.json(cases);
    } catch (err) {
        console.error("Error tracking cases by contact:", err);
        res.status(500).json({ error: "Failed to fetch cases." });
    }
}

/**
 * GET /api/cases
 * Optional query params: ?status=open  ?search=john
 */
function getAllCases(req, res) {
    try {
        const { status, search, assigned_to, exclude_closed, page, limit } = req.query;
        const result = casesService.getAll({
            status,
            search,
            assignedTo: assigned_to || undefined,
            excludeClosed: exclude_closed === "true",
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 25,
        });
        res.json(result);
    } catch (err) {
        console.error("Error fetching cases:", err);
        res.status(500).json({ error: "Failed to fetch cases." });
    }
}

/**
 * GET /api/cases/:id
 * Returns the case with its contact, products, comment codes, and notes.
 */
function getCaseById(req, res) {
    try {
        const caseData = casesService.getById(req.params.id);
        if (!caseData) {
            return res.status(404).json({ error: "Case not found." });
        }
        res.json(caseData);
    } catch (err) {
        console.error("Error fetching case:", err);
        res.status(500).json({ error: "Failed to fetch case." });
    }
}

/**
 * PATCH /api/cases/:id
 * Body (all optional): { status, assigned_to, priority }
 */
function updateCase(req, res) {
    try {
        const { status, assigned_to, priority } = req.body;
        const updated = casesService.update(req.params.id, {
            status,
            assigned_to,
            priority,
            changedBy: req.advisor.name,
        });
        if (!updated) {
            return res.status(404).json({ error: "Case not found." });
        }
        res.json(updated);
    } catch (err) {
        console.error("Error updating case:", err);
        res.status(500).json({ error: "Failed to update case." });
    }
}

/**
 * GET /api/cases/:id/notes
 */
function getNotes(req, res) {
    try {
        const notes = casesService.getNotes(req.params.id);
        res.json(notes);
    } catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({ error: "Failed to fetch notes." });
    }
}

/**
 * GET /api/cases/:id/history
 */
function getCaseHistory(req, res) {
    try {
        const history = casesService.getHistory(req.params.id);
        res.json(history);
    } catch (err) {
        console.error("Error fetching case history:", err);
        res.status(500).json({ error: "Failed to fetch case history." });
    }
}

/**
 * POST /api/cases/:id/notes
 * Body: { content }
 * Author is taken from the authenticated advisor's JWT payload.
 */
function addNote(req, res) {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Note content is required." });
        }
        const note = casesService.addNote(req.params.id, req.advisor.name, content);
        res.status(201).json(note);
    } catch (err) {
        console.error("Error adding note:", err);
        res.status(500).json({ error: "Failed to add note." });
    }
}

/**
 * POST /api/cases/:id/products
 * Body: { product_id }
 */
function addProduct(req, res) {
    try {
        const { product_id } = req.body;
        if (!product_id) {
            return res.status(400).json({ error: "product_id is required." });
        }
        const cp = casesService.addProduct(req.params.id, product_id);
        res.status(201).json(cp);
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: "Failed to add product." });
    }
}

/**
 * DELETE /api/cases/:id/products/:caseProductId
 */
function removeProduct(req, res) {
    try {
        casesService.removeProduct(req.params.caseProductId);
        res.json({ message: "Product removed." });
    } catch (err) {
        console.error("Error removing product:", err);
        res.status(500).json({ error: "Failed to remove product." });
    }
}

/**
 * POST /api/cases/:id/comment-codes
 * Body: { product_id, comment_code_id }
 */
function addCommentCode(req, res) {
    try {
        const { product_id, comment_code_id } = req.body;
        if (!product_id || !comment_code_id) {
            return res.status(400).json({ error: "product_id and comment_code_id are required." });
        }
        const entry = casesService.addCommentCode(req.params.id, product_id, comment_code_id);
        res.status(201).json(entry);
    } catch (err) {
        console.error("Error adding comment code:", err);
        res.status(500).json({ error: "Failed to add comment code." });
    }
}

/**
 * DELETE /api/cases/:id/comment-codes/:cccId
 */
function removeCommentCode(req, res) {
    try {
        casesService.removeCommentCode(req.params.cccId);
        res.json({ message: "Comment code removed." });
    } catch (err) {
        console.error("Error removing comment code:", err);
        res.status(500).json({ error: "Failed to remove comment code." });
    }
}

/**
 * POST /api/cases/:id/consumer-messages
 * Public — consumer sends a message on their case.
 * Body: { content, senderName }
 */
function addConsumerMessage(req, res) {
    try {
        const { content, senderName } = req.body;
        if (!content || !senderName) {
            return res.status(400).json({ error: "content and senderName are required." });
        }
        const message = casesService.addMessage(req.params.id, "consumer", senderName, content);
        casesService.update(req.params.id, { status: "reopened_by_consumer", assigned_to: null });
        res.status(201).json(message);
    } catch (err) {
        console.error("Error adding consumer message:", err);
        res.status(500).json({ error: "Failed to send message." });
    }
}

/**
 * GET /api/cases/:id/messages
 * Fetch all messages for a case.
 */
function getMessages(req, res) {
    try {
        const messages = casesService.getMessages(req.params.id);
        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "Failed to fetch messages." });
    }
}

/**
 * POST /api/cases/:id/messages
 * Add a message to a case.
 * Body: { content, senderType, senderName }
 */
function addMessage(req, res) {
    try {
        const { content, senderType, senderName } = req.body;
        if (!content || !senderType || !senderName) {
            return res.status(400).json({ error: "content, senderType, and senderName are required." });
        }
        const message = casesService.addMessage(req.params.id, senderType, senderName, content);
        res.status(201).json(message);
    } catch (err) {
        console.error("Error adding message:", err);
        res.status(500).json({ error: "Failed to add message." });
    }
}

module.exports = {
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
};
