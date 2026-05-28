const Database = require('better-sqlite3');
const path     = require('path');

// Resolve the database file path — stored in the server root, not inside src/
const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '..', 'crm.db');

// Open (or create) the SQLite database file
const db = new Database(DB_PATH);

// Enable foreign key enforcement — SQLite ignores FK constraints by default
db.pragma('foreign_keys = ON');

// ── Create tables ─────────────────────────────────────────────────────────────
// Using IF NOT EXISTS means this is safe to run on every server start.
db.exec(`

  -- Contacts: the customers who submit complaints
  CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    phone      TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Products: items that complaints can be raised against
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    description TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Comment codes: predefined tags used to categorise complaint details
  CREATE TABLE IF NOT EXISTS comment_codes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Advisors: internal staff who log in to manage complaints
  CREATE TABLE IF NOT EXISTS advisors (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Complaint types: categories a customer can raise a case under, each with a default priority
  CREATE TABLE IF NOT EXISTS complaint_types (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    value      TEXT NOT NULL UNIQUE,   -- machine-readable key (e.g. faulty_product)
    label      TEXT NOT NULL,          -- human-readable label shown in the form
    priority   TEXT NOT NULL           -- default priority: low | medium | high
  );

  -- Cases: the central complaints table
  CREATE TABLE IF NOT EXISTS cases (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_number   TEXT    NOT NULL UNIQUE,
    contact_id         INTEGER NOT NULL,
    complaint_type_id  INTEGER,
    status             TEXT    NOT NULL DEFAULT 'open',     -- open | in_progress | reopened_by_consumer | closed
    priority           TEXT    NOT NULL DEFAULT 'medium',   -- low | medium | high
    subject            TEXT    NOT NULL,
    description        TEXT    NOT NULL,
    assigned_to        TEXT,
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id)        REFERENCES contacts(id),
    FOREIGN KEY (complaint_type_id) REFERENCES complaint_types(id)
  );

  -- Case products: which products are involved in a case (case <-> product)
  CREATE TABLE IF NOT EXISTS case_products (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id    INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (case_id)    REFERENCES cases(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  -- Case comment codes: a comment code applied to a specific product on a case
  -- Links: case -> case_product -> comment_code
  CREATE TABLE IF NOT EXISTS case_comment_codes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id         INTEGER NOT NULL,
    case_product_id INTEGER NOT NULL,
    comment_code_id INTEGER NOT NULL,
    FOREIGN KEY (case_id)         REFERENCES cases(id)         ON DELETE CASCADE,
    FOREIGN KEY (case_product_id) REFERENCES case_products(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_code_id) REFERENCES comment_codes(id)
  );

  -- Product comment codes: which comment codes are valid for a given product
  CREATE TABLE IF NOT EXISTS product_comment_codes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id      INTEGER NOT NULL,
    comment_code_id INTEGER NOT NULL,
    FOREIGN KEY (product_id)      REFERENCES products(id)      ON DELETE CASCADE,
    FOREIGN KEY (comment_code_id) REFERENCES comment_codes(id) ON DELETE CASCADE
  );

  -- Case notes: free-text notes added by advisors over the life of a case
  CREATE TABLE IF NOT EXISTS case_notes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id    INTEGER NOT NULL,
    author     TEXT    NOT NULL,
    content    TEXT    NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
  );

  -- Case messages: bidirectional conversation between advisors and consumers
  CREATE TABLE IF NOT EXISTS case_messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id     INTEGER NOT NULL,
    sender_type TEXT    NOT NULL,  -- 'advisor' or 'consumer'
    sender_name TEXT    NOT NULL,
    content     TEXT    NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
  );

  -- Case history: audit trail of status, priority, and assignment changes
  CREATE TABLE IF NOT EXISTS case_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id     INTEGER NOT NULL,
    changed_by  TEXT    NOT NULL,
    field       TEXT    NOT NULL,
    old_value   TEXT,
    new_value   TEXT,
    changed_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
  );

  -- Canned responses: pre-written message templates for advisors
  CREATE TABLE IF NOT EXISTS canned_responses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    content    TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

`);

console.log(`Database ready: ${DB_PATH}`);

// Seed canned responses if the table is empty
const cannedCount = db.prepare('SELECT COUNT(*) AS count FROM canned_responses').get().count;
if (cannedCount === 0) {
  const insertCanned = db.prepare('INSERT INTO canned_responses (title, content) VALUES (?, ?)');
  const seedCanned = db.transaction(() => {
    insertCanned.run('Acknowledge receipt', 'Thank you for getting in touch. We have received your case and will be in contact with you shortly.');
    insertCanned.run('Request more information', 'Thank you for your patience. To help us resolve your case, could you please provide further details about the issue you have experienced?');
    insertCanned.run('Escalation notice', 'We understand the importance of your case and have escalated it to our specialist team. We aim to update you within 2 business days.');
    insertCanned.run('Resolution confirmation', 'We are pleased to confirm that your case has been resolved. Please do not hesitate to contact us again if you require any further assistance.');
    insertCanned.run('Awaiting callback', 'We attempted to contact you regarding your case but were unable to reach you. Please reply to this message with a convenient time for us to call you back.');
    insertCanned.run('Case update', 'We wanted to provide you with an update on your case. Our team is actively reviewing your complaint and we will be in touch with a full response very soon.');
    insertCanned.run('Request for evidence', 'To progress your case, it would be helpful if you could provide any supporting documentation, photographs, or evidence relating to your complaint.');
    insertCanned.run('Apology', 'We sincerely apologise for the inconvenience you have experienced. Your feedback is important to us and we are committed to resolving this matter as quickly as possible.');
  });
  seedCanned();
}

// Add complaint_type_id to cases if this is an existing database that pre-dates the column
try {
  db.prepare('ALTER TABLE cases ADD COLUMN complaint_type_id INTEGER REFERENCES complaint_types(id)').run();
} catch (_) {
  // Column already exists — safe to ignore
}

// Add case_product_id to case_comment_codes to correctly link a comment code to its product on a case
try {
  db.prepare('ALTER TABLE case_comment_codes ADD COLUMN case_product_id INTEGER REFERENCES case_products(id) ON DELETE CASCADE').run();
} catch (_) {
  // Column already exists — safe to ignore
}

module.exports = db;
