const db = require("../database");
const { VALID_STATUSES, VALID_PRIORITIES } = require("../constants");

/**
 * Cases service.
 *
 * Encapsulates all database operations related to case creation, tracking,
 * assignment, messaging, notes, and history.
 */

const SLA_HOURS = { high: 24, medium: 72, low: 168 };

function createValidationError(message) {
    const err = new Error(message);
    err.name = "ValidationError";
    err.statusCode = 400;
    return err;
}

function computeDueDate(createdAt, priority) {
    const hours = SLA_HOURS[priority] ?? 72;
    return new Date(new Date(createdAt).getTime() + hours * 3600 * 1000).toISOString();
}

// ── Public (customer-facing) ──────────────────────────────────────────────────

/**
 * Generate a human-readable reference number in the format CRM-YYYYMMDD-XXXXX.
 */
function generateReferenceNumber() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `CRM-${y}${m}${d}-${suffix}`;
}

/**
 * Submit a new case from a customer.
 * Finds or creates a contact by email, creates the case, and links any products.
 * Everything runs inside a transaction so it all succeeds or all fails.
 */
function submit({ name, email, phone, subject, description, complaint_type_id, product_ids = [] }) {
    // Derive priority from the complaint type; fall back to medium if not found
    const complaintType = complaint_type_id ? db.prepare("SELECT priority FROM complaint_types WHERE id = ?").get(complaint_type_id) : null;
    const priority = complaintType?.priority ?? "medium";

    const transaction = db.transaction(() => {
        // Reuse an existing contact if this email has submitted before (case-insensitive)
        const normalizedEmail = email.toLowerCase().trim();
        let contact = db.prepare("SELECT * FROM contacts WHERE LOWER(email) = ?").get(normalizedEmail);

        if (!contact) {
            const result = db.prepare("INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)").run(name, normalizedEmail, phone || null);
            contact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(result.lastInsertRowid);
        }

        const referenceNumber = generateReferenceNumber();
        const caseResult = db
            .prepare(
                `
      INSERT INTO cases (reference_number, contact_id, subject, description, priority, complaint_type_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
            )
            .run(referenceNumber, contact.id, subject, description, priority, complaint_type_id || null);

        const caseId = caseResult.lastInsertRowid;

        const insertCaseProduct = db.prepare("INSERT INTO case_products (case_id, product_id) VALUES (?, ?)");
        for (const productId of product_ids) {
            insertCaseProduct.run(caseId, productId);
        }

        return {
            reference_number: referenceNumber,
            case_id: caseId,
            message: "Your case has been submitted. Please keep your reference number.",
        };
    });

    return transaction();
}

/**
 * Fetch limited case info by reference number for the public tracking page.
 * Does not expose advisor notes or internal fields.
 */
function getByReference(referenceNumber) {
    return (
        db
            .prepare(
                `
    SELECT
      c.id,
      c.reference_number,
      c.status,
      c.subject,
      c.description,
      c.priority,
      c.assigned_to,
      c.created_at,
      c.updated_at,
      co.name  AS contact_name,
      ct.label AS complaint_type_label,
      a.name   AS assigned_to_name,
      GROUP_CONCAT(p.name, ', ') AS product_names
    FROM cases c
    JOIN contacts co ON co.id = c.contact_id
    LEFT JOIN complaint_types  ct ON ct.id = c.complaint_type_id
    LEFT JOIN case_products    cp ON cp.case_id = c.id
    LEFT JOIN products          p ON p.id = cp.product_id
    LEFT JOIN advisors          a ON a.id = c.assigned_to
    WHERE c.reference_number = ?
    GROUP BY c.id
  `,
            )
            .get(referenceNumber) || null
    );
}

/**
 * Return all cases for a contact identified by email + name.
 * Both values are compared case-insensitively. Returns null when no
 * matching contact exists (so the caller can 404 vs returning an empty array).
 */
function getByContact(email, name) {
    const contact = db.prepare("SELECT * FROM contacts WHERE LOWER(email) = LOWER(?)").get(email);

    if (!contact) return null;

    if (name && contact.name.toLowerCase().trim() !== name.toLowerCase().trim()) {
        return null;
    }

    return db
        .prepare(
            `
    SELECT
      c.id,
      c.reference_number,
      c.status,
      c.subject,
      c.description,
      c.priority,
      c.assigned_to,
      c.created_at,
      c.updated_at,
      co.name  AS contact_name,
      ct.label AS complaint_type_label,
      a.name   AS assigned_to_name,
      GROUP_CONCAT(p.name, ', ') AS product_names
    FROM cases c
    JOIN contacts co ON co.id = c.contact_id
    LEFT JOIN complaint_types  ct ON ct.id = c.complaint_type_id
    LEFT JOIN case_products    cp ON cp.case_id = c.id
    LEFT JOIN products          p ON p.id = cp.product_id
    LEFT JOIN advisors          a ON a.id = c.assigned_to
    WHERE c.contact_id = ?
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `,
        )
        .all(contact.id);
}

// ── Protected (advisor-facing) ────────────────────────────────────────────────

/**
 * Return all cases, optionally filtered by status and/or a search term.
 * The search term matches against the contact's name or email.
 * Includes basic contact info joined from the contacts table.
 */
function getAll({ status, search, assignedTo, excludeClosed, page = 1, limit = 25 } = {}) {
    let where = "WHERE 1=1";
    const params = [];

    if (excludeClosed) {
        where += " AND c.status != 'closed'";
    }

    if (status) {
        where += " AND c.status = ?";
        params.push(status);
    }

    if (search) {
        where += " AND (co.name LIKE ? OR co.email LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    if (assignedTo) {
        where += " AND c.assigned_to = ?";
        params.push(assignedTo);
    }

    const orderBy = `ORDER BY CASE c.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END, c.created_at ASC`;

    const total = db
        .prepare(
            `
    SELECT COUNT(*) AS count
    FROM cases c
    JOIN contacts co ON co.id = c.contact_id
    ${where}
  `,
        )
        .get(...params).count;

    const offset = (page - 1) * limit;
    const cases = db
        .prepare(
            `
    SELECT
      c.*,
      co.name  AS contact_name,
      co.email AS contact_email,
      co.phone AS contact_phone,
      a.name   AS assigned_to_name
    FROM cases c
    JOIN contacts co ON co.id = c.contact_id
    LEFT JOIN advisors a ON a.id = c.assigned_to
    ${where}
    ${orderBy}
    LIMIT ? OFFSET ?
  `,
        )
        .all(...params, limit, offset);

    const casesWithSla = cases.map((c) => ({ ...c, due_date: computeDueDate(c.created_at, c.priority) }));
    return { cases: casesWithSla, total, page, limit };
}

/**
 * Return a single case with its full details:
 * contact info, linked products, applied comment codes, and notes.
 */
function getById(id) {
    const caseRow = db
        .prepare(
            `
    SELECT
      c.*,
      co.name  AS contact_name,
      co.email AS contact_email,
      co.phone AS contact_phone,
      ct.label AS complaint_type_label,
      a.name   AS assigned_to_name
    FROM cases c
    JOIN contacts co ON co.id = c.contact_id
    LEFT JOIN complaint_types ct ON ct.id = c.complaint_type_id
    LEFT JOIN advisors a ON a.id = c.assigned_to
    WHERE c.id = ?
  `,
        )
        .get(id);

    if (!caseRow) return null;

    // Products linked to this case
    const products = db
        .prepare(
            `
    SELECT
      cp.id   AS case_product_id,
      p.id    AS product_id,
      p.name,
      p.description
    FROM case_products cp
    JOIN products p ON p.id = cp.product_id
    WHERE cp.case_id = ?
  `,
        )
        .all(id);

    // Comment codes applied to this case (grouped by case_product)
    const commentCodes = db
        .prepare(
            `
    SELECT
      ccc.id,
      ccc.case_product_id,
      cc.id          AS comment_code_id,
      cc.code,
      cc.description
    FROM case_comment_codes ccc
    JOIN comment_codes cc ON cc.id = ccc.comment_code_id
    WHERE ccc.case_id = ?
  `,
        )
        .all(id);

    // Notes added by advisors
    const notes = db
        .prepare(
            `
    SELECT * FROM case_notes WHERE case_id = ? ORDER BY created_at ASC
  `,
        )
        .all(id);

    return { ...caseRow, due_date: computeDueDate(caseRow.created_at, caseRow.priority), products, commentCodes, notes };
}

/**
 * Update one or more fields on a case.
 * Only the fields that are explicitly passed (not undefined) are changed.
 */
function update(id, { status, assigned_to, priority, changedBy = "system" }) {
    const existing = db.prepare("SELECT * FROM cases WHERE id = ?").get(id);
    if (!existing) return null;

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
        throw createValidationError(`Invalid status: ${status}`);
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
        throw createValidationError(`Invalid priority: ${priority}`);
    }

    const newStatus = status !== undefined ? status : existing.status;
    const newAssignedTo = assigned_to !== undefined ? assigned_to : existing.assigned_to;
    const newPriority = priority !== undefined ? priority : existing.priority;

    const insertHistory = db.prepare("INSERT INTO case_history (case_id, changed_by, field, old_value, new_value) VALUES (?, ?, ?, ?, ?)");
    const recordChanges = db.transaction(() => {
        if (newStatus !== existing.status) insertHistory.run(id, changedBy, "status", existing.status, newStatus);
        if (newAssignedTo !== existing.assigned_to) insertHistory.run(id, changedBy, "assigned_to", existing.assigned_to, newAssignedTo);
        if (newPriority !== existing.priority) insertHistory.run(id, changedBy, "priority", existing.priority, newPriority);

        db.prepare(
            `
      UPDATE cases
      SET status = ?, assigned_to = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
        ).run(newStatus, newAssignedTo, newPriority, id);
    });
    recordChanges();

    return getById(id);
}

/**
 * Return all notes for a case, oldest first.
 */
function getNotes(caseId) {
    return db.prepare("SELECT * FROM case_notes WHERE case_id = ? ORDER BY created_at ASC").all(caseId);
}

/**
 * Add a new free-text note to a case.
 */
function addNote(caseId, author, content) {
    const result = db.prepare("INSERT INTO case_notes (case_id, author, content) VALUES (?, ?, ?)").run(caseId, author, content);

    return db.prepare("SELECT * FROM case_notes WHERE id = ?").get(result.lastInsertRowid);
}

/**
 * Link a comment code to a product on a case.
 * Auto-creates the case_product link if the product isn't yet on the case.
 */
function addCommentCode(caseId, productId, commentCodeId) {
    let caseProduct = db.prepare("SELECT * FROM case_products WHERE case_id = ? AND product_id = ?").get(caseId, productId);

    if (!caseProduct) {
        const ins = db.prepare("INSERT INTO case_products (case_id, product_id) VALUES (?, ?)").run(caseId, productId);
        caseProduct = { id: ins.lastInsertRowid };
    }

    const result = db
        .prepare(
            `
    INSERT INTO case_comment_codes (case_id, case_product_id, comment_code_id)
    VALUES (?, ?, ?)
  `,
        )
        .run(caseId, caseProduct.id, commentCodeId);

    return db
        .prepare(
            `
    SELECT
      ccc.*,
      cc.code,
      cc.description
    FROM case_comment_codes ccc
    JOIN comment_codes cc ON cc.id = ccc.comment_code_id
    WHERE ccc.id = ?
  `,
        )
        .get(result.lastInsertRowid);
}

/**
 * Remove a comment code entry from a case.
 */
function removeCommentCode(caseCommentCodeId) {
    db.prepare("DELETE FROM case_comment_codes WHERE id = ?").run(caseCommentCodeId);
}

/**
 * Add a product to an existing case (creates a case_products row).
 * Returns the new row with product name joined.
 */
function addProduct(caseId, productId) {
    const existing = db.prepare("SELECT * FROM case_products WHERE case_id = ? AND product_id = ?").get(caseId, productId);

    if (existing) {
        return db
            .prepare(
                `
      SELECT cp.id AS case_product_id, p.id AS product_id, p.name
      FROM case_products cp JOIN products p ON p.id = cp.product_id
      WHERE cp.id = ?
    `,
            )
            .get(existing.id);
    }

    const result = db.prepare("INSERT INTO case_products (case_id, product_id) VALUES (?, ?)").run(caseId, productId);

    return db
        .prepare(
            `
    SELECT cp.id AS case_product_id, p.id AS product_id, p.name
    FROM case_products cp JOIN products p ON p.id = cp.product_id
    WHERE cp.id = ?
  `,
        )
        .get(result.lastInsertRowid);
}

/**
 * Remove a product from a case (cascades to case_comment_codes).
 */
function removeProduct(caseProductId) {
    db.prepare("DELETE FROM case_products WHERE id = ?").run(caseProductId);
}

/**
 * Get all messages for a case, oldest first.
 */
function getMessages(caseId) {
    return db.prepare("SELECT * FROM case_messages WHERE case_id = ? ORDER BY created_at ASC").all(caseId);
}

/**
 * Add a message to a case.
 */
function addMessage(caseId, senderType, senderName, content) {
    const result = db.prepare("INSERT INTO case_messages (case_id, sender_type, sender_name, content) VALUES (?, ?, ?, ?)").run(caseId, senderType, senderName, content);

    return db.prepare("SELECT * FROM case_messages WHERE id = ?").get(result.lastInsertRowid);
}

/**
 * Get full audit history for a case, newest changes first.
 */
function getHistory(caseId) {
    return db.prepare("SELECT * FROM case_history WHERE case_id = ? ORDER BY changed_at DESC").all(caseId);
}

module.exports = {
    submit,
    getByReference,
    getByContact,
    getAll,
    getById,
    update,
    getNotes,
    addNote,
    addCommentCode,
    removeCommentCode,
    addProduct,
    removeProduct,
    getMessages,
    addMessage,
    getHistory,
};
