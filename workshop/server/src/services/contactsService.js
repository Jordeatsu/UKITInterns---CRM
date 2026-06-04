const db = require("../database");

/**
 * Contacts service.
 *
 * Handles contact retrieval, updates, and merge operations with related cases.
 */

/**
 * Returns all contacts with aggregate case metrics.
 */
function getAll() {
    return db
        .prepare(
            `
    SELECT
      co.id,
      co.name,
      co.email,
      co.phone,
      co.created_at,
      COUNT(c.id)                          AS case_count,
      SUM(CASE WHEN c.status != 'closed' THEN 1 ELSE 0 END) AS open_count,
      MAX(c.created_at)                    AS last_case_at
    FROM contacts co
    LEFT JOIN cases c ON c.contact_id = co.id
    GROUP BY co.id
    ORDER BY last_case_at DESC
  `,
        )
        .all();
}

/**
 * Returns one contact plus their case list.
 */
function getById(id) {
    const contact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
    if (!contact) return null;

    const cases = db
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
      ct.label AS complaint_type_label,
      GROUP_CONCAT(p.name, ', ') AS product_names
    FROM cases c
    LEFT JOIN complaint_types  ct ON ct.id = c.complaint_type_id
    LEFT JOIN case_products    cp ON cp.case_id = c.id
    LEFT JOIN products          p ON p.id = cp.product_id
    WHERE c.contact_id = ?
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `,
        )
        .all(id);

    return { ...contact, cases };
}

/**
 * Updates the core fields of a contact record.
 */
function updateContact(id, { name, email, phone }) {
    const stmt = db.prepare(`
    UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?
  `);
    const result = stmt.run(name, email, phone ?? null, id);
    if (result.changes === 0) return null;
    return db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
}

/**
 * Merges one or more contacts into a primary contact.
 */
function mergeContacts(primaryId, mergeIds) {
    const merge = db.transaction(() => {
        for (const srcId of mergeIds) {
            db.prepare("UPDATE cases SET contact_id = ? WHERE contact_id = ?").run(primaryId, srcId);
            db.prepare("DELETE FROM contacts WHERE id = ?").run(srcId);
        }
    });
    merge();
    return getById(primaryId);
}

module.exports = { getAll, getById, updateContact, mergeContacts };
