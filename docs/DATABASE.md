# Database Documentation

## Overview

The database is SQLite and lives at `workshop/server/crm.db`. It is created automatically when the server starts for the first time. You can browse it visually in VS Code using the **SQLite Viewer** extension — click the `.db` file in the explorer.

---

## Seed data

After running `npm run seed`, the following test data is available.

### Advisor login credentials

All advisors share the password `password123`.

| Name | Email |
|---|---|
| Alice Johnson | alice@crm.com |
| Bob Smith | bob@crm.com |
| Carol White | carol@crm.com |

### Sample cases

40 cases are seeded across all statuses. A few useful ones:

| Reference | Status | Priority | Description |
|---|---|---|---|
| `CRM-20260103-L1K9M` | Open | High | Liquid 1L bottle leaking on arrival |
| `CRM-20260108-L4T6P` | Open | High | Severe skin rash after using laundry liquid |
| `CRM-20260105-P2R8N` | In Progress | Medium | Pods not dissolving during wash cycle |
| `CRM-20260301-P8B2X` | Reopened | High | Pods staining dark garments — issue recurring |

### Products

The CleanWave range covers three product lines, each in multiple sizes:

| Line | Sizes |
|---|---|
| Liquid | 500ml, 1L, 2L, 3L |
| Pods | 12-Pack, 24-Pack, 40-Pack, 60-Pack |
| Powder | 500g, 1kg, 2.5kg, 5kg |

### Complaint types

| Value | Label | Default Priority |
|---|---|---|
| `faulty_product` | Faulty Product | High |
| `allergic_reaction` | Allergic Reaction / Health Concern | High |
| `delivery_issue` | Delivery Issue | Medium |
| `wrong_item` | Wrong Item Received | Medium |
| `damaged_packaging` | Damaged Packaging | Medium |
| `billing_dispute` | Billing Dispute | Medium |
| `other` | Other | Low |

---

## Database schema

### What the database tracks

Before diving into tables, here is the plain-English picture:

- A **contact** is a customer. They are identified by their email address.
- A **case** is one complaint raised by a contact. Every case has a status, a priority, and a description written by the customer.
- A case is linked to one or more **products** (the items the complaint is about).
- Each product in a case can have one or more **comment codes** applied by the advisor — short tags like `LEAK` or `SKIN` that categorise the fault.
- **Comment codes** are not free-form; each product has a fixed list of valid codes defined in advance.
- **Advisors** are the internal staff who log in to manage cases.
- A **complaint type** is the category the customer picks when submitting (e.g. Faulty Product, Allergic Reaction).

### Entity relationship overview

The arrows below show which tables reference (point to) which other tables:

```
complaint_types ──┐
contacts        ──┴──► cases ──────────► case_notes
                          │
                          └──► case_products ──────────► case_comment_codes
                                    │                           │
                              (product_id)              (case_product_id)
                                    │                           │
                                    ▼                           ▼
                                products              comment_codes
                                    │                      ▲
                                    └──► product_comment_codes
                                         (controls which codes
                                          are valid per product)

advisors         (standalone — used for login only)
```

---

### `contacts`

A customer who has submitted at least one case. If a customer submits again using the same email address, their existing contact record is reused — no duplicate is created.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `name` | TEXT | Full name |
| `email` | TEXT | Unique — used to identify returning customers |
| `phone` | TEXT | Optional |
| `created_at` | DATETIME | Set automatically on insert |

---

### `advisors`

Internal staff accounts. Passwords are never stored in plain text — only a bcrypt hash.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `name` | TEXT | Display name shown in the portal |
| `email` | TEXT | Unique — used as the login username |
| `password_hash` | TEXT | bcrypt hash of the password |
| `created_at` | DATETIME | Set automatically on insert |

---

### `complaint_types`

The categories a customer can choose when submitting a complaint. Each type carries a default priority so the severity is set automatically on submission.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `value` | TEXT | Unique machine-readable key, e.g. `faulty_product` |
| `label` | TEXT | Human-readable label shown in the form, e.g. `Faulty Product` |
| `priority` | TEXT | Default priority assigned to a case: `low`, `medium`, or `high` |

---

### `cases`

The central table — one row per complaint.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `reference_number` | TEXT | Unique — format `CRM-YYYYMMDD-XXXXX` — given to the customer |
| `contact_id` | INTEGER | **Foreign key** → `contacts.id` — who raised this case |
| `complaint_type_id` | INTEGER | **Foreign key** → `complaint_types.id` — the category selected |
| `status` | TEXT | `open` · `in_progress` · `reopened_by_consumer` · `closed` |
| `priority` | TEXT | `low` · `medium` · `high` — inherited from the complaint type on submit |
| `subject` | TEXT | One-line summary auto-generated from the product and complaint type |
| `description` | TEXT | The full complaint written by the customer |
| `assigned_to` | TEXT | Name of the advisor handling the case — `null` if unassigned |
| `created_at` | DATETIME | Set automatically on insert |
| `updated_at` | DATETIME | Updated automatically whenever the case is modified |

> **What is a foreign key?** A foreign key is a column that links one table to another. `contact_id` in `cases` holds a number that matches the `id` of a row in the `contacts` table — this is how the database knows which customer the case belongs to. If you look up a case and want the customer's name, you join to `contacts` using this value.

> **SLA / due dates** are computed dynamically each time a case is fetched and are never stored in the database. The rules are: High priority = 24 hours, Medium = 72 hours, Low = 168 hours (7 days) — measured from `created_at`.

---

### `case_notes`

Free-text notes added by advisors over the life of a case. These are internal — customers never see them.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `case_id` | INTEGER | **Foreign key** → `cases.id` |
| `author` | TEXT | Name of the advisor who wrote the note |
| `content` | TEXT | The note text |
| `created_at` | DATETIME | Set automatically on insert |

---

### `case_messages`

A two-way conversation thread between the advisor and the customer on a case. Each message records who sent it.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `case_id` | INTEGER | **Foreign key** → `cases.id` |
| `sender_type` | TEXT | Either `'advisor'` or `'consumer'` |
| `sender_name` | TEXT | Display name of the sender |
| `content` | TEXT | Message body |
| `created_at` | DATETIME | Set automatically on insert |

---

### `case_history`

Audit trail. A row is inserted automatically whenever an advisor changes the `status`, `priority`, or `assigned_to` field on a case. This gives a full timeline of what changed and who changed it.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `case_id` | INTEGER | **Foreign key** → `cases.id` |
| `changed_by` | TEXT | Name of the advisor who made the change |
| `field` | TEXT | Which field changed: `status`, `priority`, or `assigned_to` |
| `old_value` | TEXT | The value before the change |
| `new_value` | TEXT | The value after the change |
| `changed_at` | DATETIME | Set automatically on insert |

---

### Products and comment codes

This is the most complex part of the schema. It involves four tables working together. Here is the concept before the table definitions:

**The problem being solved:** When an advisor looks at a complaint about a leaking CleanWave Liquid bottle, they want to tag it with a short code like `LEAK` to categorise the fault. But a `LEAK` code does not make sense for a powder product — and `CLMP` (clumping) does not make sense for a liquid. So the system needs to know which codes are valid for which product.

There are three layers:

1. **`products`** — the product catalogue (e.g. "CleanWave Liquid 1L")
2. **`comment_codes`** — the full list of fault tags (e.g. LEAK, SKIN, CLMP)
3. **`product_comment_codes`** — the join table that defines which codes are valid for which product

Then, separately:

4. **`case_products`** — links a specific case to the product(s) involved
5. **`case_comment_codes`** — records which codes an advisor has actually applied to a product on a case

A worked example:

> Case #4 is a complaint about CleanWave Liquid 2L causing a skin rash.
>
> - `case_products` has a row: `case_id = 4`, `product_id = 3` (Liquid 2L). This row gets its own `id`, say `id = 4`.
> - The advisor applies the `SKIN` code. A row is inserted into `case_comment_codes`: `case_id = 4`, `case_product_id = 4`, `comment_code_id = 3`.
> - The reason `case_product_id` is stored (not just `product_id`) is that a case could involve the same product twice in different contexts — referencing the join row uniquely identifies the exact product instance on that case.

---

### `products`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `name` | TEXT | Product name, e.g. `CleanWave Liquid 1L` |
| `description` | TEXT | Short description |
| `created_at` | DATETIME | Set automatically on insert |

---

### `comment_codes`

Short fault tags that advisors apply to categorise a complaint.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `code` | TEXT | Unique short code, e.g. `LEAK` |
| `description` | TEXT | Human-readable explanation, e.g. `Product leaking — container seal broken or lid defective` |
| `created_at` | DATETIME | Set automatically on insert |

Seeded codes:

| Code | Meaning |
|---|---|
| `LEAK` | Product leaking — container seal broken or lid defective |
| `STAN` | Product causing staining or marks on clothing |
| `SKIN` | Skin irritation or allergic reaction reported |
| `SCNT` | Unexpected, missing, or off-putting scent |
| `DISS` | Pods not dissolving fully during the wash cycle |
| `MEAS` | Incorrect or unclear measurement markings on dosing cap |
| `CLMP` | Powder clumping or hardening |
| `SPLY` | Product quantity less than stated on packaging |
| `DLVR` | Delivery issue — damaged, late, or wrong item received |
| `SEAL` | Packaging seal broken or tampered with on arrival |

---

### `product_comment_codes`

Defines which comment codes are valid for a given product. Only codes listed here for a product are offered to the advisor when that product is on a case.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `product_id` | INTEGER | **Foreign key** → `products.id` |
| `comment_code_id` | INTEGER | **Foreign key** → `comment_codes.id` |

For example: the Liquid products are linked to `LEAK`, `STAN`, `SKIN`, `SCNT`, `MEAS`, `DLVR`, `SEAL` — but not `DISS` (pods only) or `CLMP` (powder only).

---

### `case_products`

Links a case to the product(s) it involves. Most cases have one product, but the schema supports multiple.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `case_id` | INTEGER | **Foreign key** → `cases.id` |
| `product_id` | INTEGER | **Foreign key** → `products.id` |

---

### `case_comment_codes`

Records which comment codes an advisor has applied to a specific product on a case.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `case_id` | INTEGER | **Foreign key** → `cases.id` |
| `case_product_id` | INTEGER | **Foreign key** → `case_products.id` — identifies which product on the case the code belongs to |
| `comment_code_id` | INTEGER | **Foreign key** → `comment_codes.id` |

---

## Viewing the database visually

After installing the **SQLite Viewer** extension in VS Code, click `workshop/server/crm.db` in the file explorer. A table browser opens — click any table on the left to view its rows.

This is a read-only view, which is all you need for checking seed data and verifying that your queries are working correctly.
