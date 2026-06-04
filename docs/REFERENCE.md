# Technical Reference

## Project structure

```
UKITInterns - CRM/
├── README.md
├── docs/                       ← documentation files
│   ├── SETUP.md
│   ├── TEAMWORK.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── REFERENCE.md
│   └── TROUBLESHOOTING.md
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

### What's safe to edit

Most of your work will live in these areas — feel free to create new files here or modify existing ones:

| Area | What goes here |
|---|---|
| `client/src/advisor/` | Advisor portal pages |
| `client/src/consumer/` | Consumer portal pages |
| `client/src/services/api.js` | API call functions |
| `server/src/routes/` | New API routes |
| `server/src/controllers/` | Request/response handling |
| `server/src/services/` | Business logic and SQL queries |

**Be careful with these files** — they are shared infrastructure, and a mistake here can break things for the whole team:

| File | Why to be careful |
|---|---|
| `server/src/database.js` | Defines the database tables — changes here only take effect on a fresh database, not the existing one |
| `server/seed/seed.js` | Populates the database — changes only take effect after a full reset |
| `server/src/middleware/auth.js` | JWT authentication — breaking this locks everyone out of the advisor portal |
| `server/src/.env` | Environment config — the defaults work fine for the workshop, no changes needed |
| `client/src/context/AuthContext.jsx` | Stores the login token in memory — editing this usually breaks the login flow |

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

---

## Key implementation notes

- **Authentication** — Advisors log in via `POST /api/auth/login`. The server returns a JWT which the client stores in React context. All advisor routes require the token in the `Authorization: Bearer` header.
- **Contact deduplication** — When a customer submits a case, the server looks up their email case-insensitively. If a matching contact exists, it is reused; otherwise a new contact is created.
- **SLA / due dates** — Not stored in the database. Computed on the fly from `created_at` + `priority` each time a case is fetched.
- **Case history** — The server writes a `case_history` row inside the same database transaction as the case `UPDATE`, so the audit trail is always consistent.
- **Consumer messaging** — When a consumer sends a message, the case status is automatically set to `reopened_by_consumer` and `assigned_to` is cleared, returning the case to the unassigned queue.
- **Pagination** — `GET /api/cases` returns `{ cases, total, page, limit }`. The default page size is 25. The `total` count lets the frontend calculate how many pages exist.
