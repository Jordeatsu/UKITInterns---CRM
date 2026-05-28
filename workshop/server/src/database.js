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

`);

console.log(`Database ready: ${DB_PATH}`);

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
