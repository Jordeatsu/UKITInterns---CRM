# CRM Workshop

A full-stack Customer Relationship Management (CRM) application built as the foundation for an intern workshop. The scenario: **CleanWave** has just launched a new range of laundry detergent products and is receiving a high volume of customer complaints. Your team has been given a basic CRM to manage these cases — but it's missing a lot of features that would make advisors' lives easier.

Your job is to identify the gaps, decide what matters most, and build it.

---

## What the app does (right now)

The application has two sides:

- **Consumer portal** (`/submit`) — customers submit a complaint and receive a reference number
- **Advisor portal** (`/advisor`) — internal staff log in and view a list of open complaints, and can click into any case to see the details

That's it. There is deliberately a lot missing.

**Technology stack:**

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Material UI (MUI) |
| Backend | Node.js, Express |
| Database | SQLite (via `better-sqlite3`) |
| Auth | JSON Web Tokens (JWT) + bcrypt |

---

## The advisor's workflow

Understanding what an advisor actually *does* will help you decide which features matter most.

A typical complaint is handled in roughly this sequence:

1. **Case comes in** — a customer submits a complaint online. It appears in the dashboard as `open`.
2. **Advisor picks it up** — they read the details: what product, what went wrong, what the customer said.
3. **Investigation** — they may update the priority, assign it to themselves, add internal notes, or link additional products.
4. **Resolution** — they contact the customer, action the complaint, and eventually close the case.
5. **Customer replies** — if the customer sends a follow-up message, the case automatically reopens and returns to the queue.

At any point, an advisor can see the full history of a case — what changed, when, and who changed it.

Right now the app only covers step 1 (submitting) and a basic read-only view. Steps 2–5 are what you're building.

---

## Known issues — fix these first

The app has four deliberate bugs. Before adding anything new, get the existing code working. Each one can be fixed with a single line change — use the hints below if you get stuck.

| # | Where | Symptom | Hint |
|---|---|---|---|
| 1 | Dashboard | The cases table is always empty, even though the database has cases in it | Look at how `Dashboard.jsx` handles the response from `getAllCases` — is the data actually being stored anywhere? |
| 2 | Submit a Case | Clicking **Submit Case** reloads the page instead of submitting the form | Look at `handleSubmit` in `SubmitCase.jsx` — what does a browser do by default when a form is submitted? |
| 3 | Case Detail | Opening any case shows "Failed to load case" immediately | Look at the `getCaseById` call in `CaseDetail.jsx` and compare it with how other protected API calls are made elsewhere in the codebase |
| 4 | Submit a Case | Email validation rejects every address, even valid ones | Look at `src/utils/validation.js` |

---

## On the day

### Working as a team

Four people on one codebase can get messy fast. A few things that help:

- **Divide by feature, not by file.** Agree on who is building what before anyone starts coding. If two people are both editing `Dashboard.jsx` at the same time, you will have conflicts.
- **Use branches.** Create a branch for each feature (`git checkout -b feature/my-feature`) and merge back to `main` when it's working.
- **Fix the known issues together first.** Do this as a group before splitting off — it's the fastest way to get everyone familiar with the codebase at the same time.

### Presentation

At the end of the session you will give a short demo of your application. You should cover:

- **What you built** — walk through the features you added, live in the browser.
- **Why you chose them** — out of everything you could have built, why did these feel most important for CleanWave advisors?
- **What you'd add next** — if you had another hour, what would it be and why?

The emphasis is on the decisions you made, not just what works. A thoughtful explanation of a half-finished feature is worth more than a finished one nobody can explain.

---

## Prerequisites

Install all of the following before running the project.

### 1. Node.js (v18 or later)

Download the **LTS** installer from:

> https://nodejs.org/en/download

Run the installer and accept all defaults. Verify:

```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

### 2. Visual Studio Code

> https://code.visualstudio.com/download

### 3. Git

> https://git-scm.com/downloads

### 4. Git Bash (Windows only)

Mac and Linux users already have a compatible terminal. On **Windows**, the shell scripts (`.sh` files) that start and stop the app require Git Bash, which is bundled with Git for Windows.

**Setting Git Bash as your default terminal in VS Code:**

1. Open VS Code
2. Press `Ctrl + Shift + P` → type `Terminal: Select Default Profile` → press Enter
3. Select **Git Bash**
4. Close any open terminals and open a new one with `` Ctrl + ` ``

Verify:

```bash
bash --version
# GNU bash, version 5.x.x
```

### 5. Recommended VS Code Extensions

| Extension | Publisher | Purpose |
|---|---|---|
| **SQLite Viewer** | Florian Klampfer | Browse the database file visually |
| **ESLint** | Microsoft | JavaScript linting |
| **Prettier** | Prettier | Code formatting |

Install via `Ctrl+Shift+X` → search the name → Install.

---

## Project structure

```
UKITInterns - CRM/
├── README.md
├── solution/                   ← complete reference implementation (don't peek too early!)
└── workshop/                   ← your starting point — work in here
    ├── FEATURES.md             ← list of features to consider building
    ├── start.sh                ← install, build, and start everything
    ├── stop.sh                 ← stop all running processes
    ├── restart.sh              ← stop then start
    ├── build.sh                ← rebuild the client only
    ├── logs/                   ← runtime logs (server.log, client.log)
    ├── server/
    │   ├── .env                ← environment variables (port, JWT secret, DB path)
    │   ├── crm.db              ← SQLite database file (auto-created on first run)
    │   ├── package.json
    │   └── src/
    │       ├── index.js        ← Express app entry point
    │       ├── database.js     ← table definitions
    │       ├── middleware/
    │       │   └── auth.js     ← JWT authentication middleware
    │       ├── routes/         ← one file per resource (auth, cases, contacts, …)
    │       ├── controllers/    ← request/response handling
    │       ├── services/       ← business logic and SQL queries
    │       └── seed/
    │           └── seed.js     ← populate the database with sample data
    └── client/
        ├── vite.config.js
        ├── package.json
        └── src/
            ├── App.jsx         ← routing
            ├── main.jsx
            ├── theme.js
            ├── advisor/        ← advisor portal pages (Dashboard, CaseDetail, Login)
            ├── consumer/       ← consumer portal pages (SubmitCase, Confirmation)
            ├── context/
            │   └── AuthContext.jsx  ← stores the JWT after login
            ├── shared/         ← reusable components
            └── services/
                └── api.js      ← all fetch calls to the backend API
```

---

## Setup and running the app

### 1. Clone the repository

```bash
git clone <repository-url>
cd "UKITInterns - CRM"
```

### 2. Seed the database with sample data

Before starting for the first time, populate the database with CleanWave complaints:

```bash
cd workshop/server
npm install
npm run seed
```

This creates 40 sample cases, 24 contacts, the full product catalogue, and the advisor accounts. See [Seed data](#seed-data) for login credentials.

### 3. Start the application

From the `workshop/` directory:

```bash
bash start.sh
```

This will:
1. Install/update dependencies in both `server/` and `client/`
2. Build the React client
3. Start the API server on port **5002**
4. Serve the built client on port **3002**
5. Print the URL others on the same network can use to access the app

| URL | Description |
|---|---|
| `http://localhost:3002/submit` | Consumer portal — submit a complaint |
| `http://localhost:3002/advisor/login` | Advisor login |

> **LAN access:** When `start.sh` runs it will also print a `LAN:` URL (e.g. `http://192.168.1.x:3002`). Anyone on the same Wi-Fi network can use that URL to access the app from their own device.

### 4. Stop the application

```bash
bash stop.sh
```

### Development mode (hot reload)

For active development, use `dev-start.sh` from the `workshop/` directory — it starts everything with hot reload so you don't need to rebuild after every change:

```bash
bash dev-start.sh
```

The server restarts automatically when you save a backend file. The browser updates instantly when you save a frontend file. Use this while you're actively writing code.

Switch to `start.sh` (production build) when you want to do a final demo or check that everything works in its built form — it's slower to start but reflects exactly what users would see.

Alternatively, you can run server and client manually in separate terminals:

```bash
# Terminal 1 — API server with auto-reload
cd workshop/server
npm run dev

# Terminal 2 — Vite dev server
cd workshop/client
npm run dev
```

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

## Comment codes by product line

Each case can have one or more **comment codes** attached — short codes that categorise what type of issue was reported. Valid codes differ by product line and are enforced in the database via the `product_comment_codes` join table.

### Which codes apply to each product

| Code | Meaning | Liquid | Pods | Powder |
|---|---|:---:|:---:|:---:|
| `STAN` | Staining / discolouration | ✓ | ✓ | ✓ |
| `SKIN` | Skin irritation / allergic reaction | ✓ | ✓ | ✓ |
| `SCNT` | Unexpected smell / scent issue | ✓ | ✓ | ✓ |
| `DLVR` | Delivery problem | ✓ | ✓ | ✓ |
| `SEAL` | Damaged or broken seal / packaging | ✓ | ✓ | ✓ |
| `LEAK` | Leaking container | ✓ | — | — |
| `MEAS` | Dosing cap markings unclear or missing | ✓ | — | — |
| `DISS` | Pod not dissolving properly | — | ✓ | — |
| `CLMP` | Powder clumping | — | — | ✓ |
| `SPLY` | Quantity short of stated weight / count | — | ✓ | ✓ |

`STAN`, `SKIN`, `SCNT`, `DLVR`, and `SEAL` are shared across all three product lines. The remaining codes are product-specific and will be rejected by the API if applied to the wrong product.

### Relationship to complaint types

Comment codes and complaint types are **not directly linked in the database** — there is no foreign key between the two. They serve different purposes: the complaint type is chosen by the consumer when they submit a case; comment codes are added by the advisor during investigation.

That said, there is a natural logical mapping you can follow as a guide:

| Complaint type | Typical comment code(s) |
|---|---|
| `allergic_reaction` | `SKIN` |
| `faulty_product` | `LEAK` (Liquid), `DISS` (Pods), `CLMP` (Powder) |
| `damaged_packaging` | `SEAL` |
| `delivery_issue` | `DLVR` |
| `wrong_item` | `SPLY` |
| `billing_dispute` | *(no direct code — advisor judgement)* |
| `other` | *(advisor judgement)* |

These are guidelines, not rules — an advisor can apply any valid code for the product regardless of the original complaint type.

> See the **Database schema → comment_codes** section above for the full list of code descriptions stored in the database.

---

## API reference

The base URL for all API routes is `/api`. Routes marked **Public** require no authentication. Routes marked **Protected** require a valid `Authorization: Bearer <token>` header (obtained from the login endpoint).

### Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Log in as an advisor — returns `{ token, advisor }` |

### Cases

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/cases` | Public | Submit a new case |
| `GET` | `/api/cases/track/:referenceNumber` | Public | Look up a single case by reference number |
| `GET` | `/api/cases/track/by-contact` | Public | Look up all cases for a contact by name + email |
| `GET` | `/api/cases/:id/messages` | Public | Get messages on a case (consumer view) |
| `POST` | `/api/cases/:id/consumer-messages` | Public | Consumer sends a message |
| `GET` | `/api/cases` | Protected | List cases — supports `?status=`, `?search=`, `?assigned_to=`, `?excludeClosed=true`, `?page=`, `?limit=` |
| `GET` | `/api/cases/:id` | Protected | Full case details including products, comment codes, notes |
| `PATCH` | `/api/cases/:id` | Protected | Update status, priority, or assigned\_to |
| `GET` | `/api/cases/:id/notes` | Protected | Get advisor notes |
| `POST` | `/api/cases/:id/notes` | Protected | Add an advisor note |
| `GET` | `/api/cases/:id/history` | Protected | Audit trail of field changes |
| `POST` | `/api/cases/:id/products` | Protected | Link a product to a case |
| `DELETE` | `/api/cases/:id/products/:caseProductId` | Protected | Remove a product from a case |
| `POST` | `/api/cases/:id/comment-codes` | Protected | Apply a comment code to a case product |
| `DELETE` | `/api/cases/:id/comment-codes/:cccId` | Protected | Remove an applied comment code |
| `POST` | `/api/cases/:id/messages` | Protected | Advisor sends a message |

### Contacts

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/contacts` | Protected | List all contacts with case counts |
| `GET` | `/api/contacts/:id` | Protected | Contact detail with all their cases |
| `PATCH` | `/api/contacts/:id` | Protected | Update contact name, email, or phone |

### Products & comment codes

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/comment-codes/product/:productId` | Protected | Comment codes valid for a given product |

### Complaint types

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/complaint-types` | Public | List all complaint types |

### Dashboard

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | Protected | Summary counts: total, open, in progress, closed, reopened, recent |
| `GET` | `/api/dashboard/analytics` | Protected | Cases by complaint type + daily submissions (last 30 days) |

### Canned responses

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/canned-responses` | Protected | List all pre-written message templates |

---

## Database schema

The database is SQLite and lives at `workshop/server/crm.db`. It is created automatically when the server starts for the first time. You can browse it visually in VS Code using the **SQLite Viewer** extension — click the `.db` file in the explorer.

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
contacts        ──┴──► cases ──────────────────────────► case_history
                          │
                          ├──► case_notes
                          ├──► case_messages
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
canned_responses (standalone — pre-written message templates)
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

### `canned_responses`

Pre-written message templates that advisors can insert into the message composer with one click. These are managed directly in the database — there is no UI for adding or editing them.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `title` | TEXT | Short title shown in the picker, e.g. `Acknowledge receipt` |
| `content` | TEXT | Full message text |
| `created_at` | DATETIME | Set automatically on insert |

Eight templates are seeded automatically: *Acknowledge receipt*, *Request more information*, *Escalation notice*, *Resolution confirmation*, *Awaiting callback*, *Case update*, *Request for evidence*, and *Apology*.

---

## Viewing the database visually

After installing the **SQLite Viewer** extension in VS Code, click `workshop/server/crm.db` in the file explorer. A table browser opens — click any table on the left to view its rows.

This is a read-only view, which is all you need for checking seed data and verifying that your queries are working correctly.

---

## Environment variables

Server configuration lives in `workshop/server/.env`.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5002` | Port the Express API listens on |
| `JWT_SECRET` | `crm_workshop_secret_change_in_production` | Secret used to sign JWTs |
| `NODE_ENV` | `development` | Set to `production` when running via `start.sh` |
| `DB_PATH` | `./crm.db` | Path to the SQLite database file |

You do not need to change any of these for local or workshop use.

---

## Key implementation notes

- **Authentication** — Advisors log in via `POST /api/auth/login`. The server returns a JWT which the client stores in React context. All advisor routes require the token in the `Authorization: Bearer` header.
- **Contact deduplication** — When a customer submits a case, the server looks up their email case-insensitively. If a matching contact exists, it is reused; otherwise a new contact is created.
- **SLA / due dates** — Not stored in the database. Computed on the fly from `created_at` + `priority` each time a case is fetched.
- **Case history** — The server writes a `case_history` row inside the same database transaction as the case `UPDATE`, so the audit trail is always consistent.
- **Consumer messaging** — When a consumer sends a message, the case status is automatically set to `reopened_by_consumer` and `assigned_to` is cleared, returning the case to the unassigned queue.
- **Pagination** — `GET /api/cases` returns `{ cases, total, page, limit }`. The default page size is 25. The `total` count lets the frontend calculate how many pages exist.

---

## Case ordering

Understanding how cases are ordered is important — it is the mechanism that ensures the most urgent complaints are seen first.

### How it works

The `GET /api/cases` endpoint always returns cases sorted by two criteria, applied in this order:

1. **Priority** — `high` cases come first, then `medium`, then `low`
2. **Submitted date (oldest first)** — within the same priority level, the case that has been waiting longest appears at the top

This means an advisor opening the dashboard will always see the most overdue high-priority cases at the very top.

**Example:** given these five cases —

| Reference | Priority | Submitted |
|---|---|---|
| CRM-001 | medium | 3 days ago |
| CRM-002 | high | 1 day ago |
| CRM-003 | high | 5 days ago |
| CRM-004 | low | 2 days ago |
| CRM-005 | medium | 1 day ago |

The sort order would be:

| Position | Reference | Priority | Submitted | Reason |
|---|---|---|---|---|
| 1 | CRM-003 | high | 5 days ago | High priority, oldest |
| 2 | CRM-002 | high | 1 day ago | High priority, newer |
| 3 | CRM-001 | medium | 3 days ago | Medium priority, oldest |
| 4 | CRM-005 | medium | 1 day ago | Medium priority, newer |
| 5 | CRM-004 | low | 2 days ago | Low priority last |

### Where this lives in the code

The sort is applied in `server/src/services/casesService.js` using a SQL `ORDER BY` clause:

```sql
ORDER BY
  CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END,
  created_at ASC
```

The `due_date` field (computed from `created_at` + SLA hours) is returned on each case for display purposes but is **not** used for sorting — the sort is driven by raw priority and submission time.

### SLA hours by priority

| Priority | SLA |
|---|---|
| High | 24 hours |
| Medium | 72 hours (3 days) |
| Low | 168 hours (7 days) |

These are the windows within which an advisor should aim to respond. A case past its due date should be treated as urgent regardless of its priority label.
