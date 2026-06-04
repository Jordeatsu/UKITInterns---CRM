# CRM Workshop

A full-stack Customer Relationship Management (CRM) application built as the foundation for an intern workshop. The scenario: **CleanWave** has just launched a new range of laundry detergent products and is receiving a high volume of customer complaints. Your team has been given a basic CRM to manage these cases — but it's missing a lot of features that would make advisors' lives easier.

Your job is to identify the gaps, decide what matters most, and build it.

---

## Quick links

- **[Setup Guide](docs/SETUP.md)** — Prerequisites, installation, running the app
- **[Learning Resources](docs/LEARNING_RESOURCES.md)** — React & Material UI quick reference for beginners
- **[Working as a Team](docs/TEAMWORK.md)** — Branching, commits, pull requests, merge conflicts
- **[Database Documentation](docs/DATABASE.md)** — Schema, seed data, relationships
- **[API Reference](docs/API.md)** — Endpoints, authentication, environment variables
- **[Technical Reference](docs/REFERENCE.md)** — Project structure, comment codes, case ordering
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** — Common issues and fixes

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

At any point, an advisor can see the full history of a case — what changed, when, and who changed it.

Right now the app only covers step 1 (submitting) and a basic read-only view. Steps 2–4 are what you're building plus any additional features you may think of.

---

## Your task

Your goal is to turn this skeleton into a CRM that advisors can genuinely use to manage complaints from start to finish. Think of it as a real product handoff — your job is to make it functional, and then to think like a product team about what would make it even better.

The day has two parts:

### Part 1 — Get the core working

The list below covers the minimum an advisor needs to actually do their job. Fix the four bugs first (see the next section), then work through this checklist. Divide the items between your team early — if two people edit the same file at the same time you will have merge conflicts.

- [ ] Fix the four known bugs (see below)
- [ ] An advisor can **update the status** of a case (open → in progress → closed)
- [ ] An advisor can **assign** a case to themselves or a colleague
- [ ] An advisor can **change the priority** of a case
- [ ] An advisor can **add the products** involved in a complaint to the case
- [ ] An advisor can **apply comment codes** to a product to categorise the fault
- [ ] An advisor can **write internal notes** on a case, visible only to advisors
- [ ] The **dashboard shows summary stats** — total cases, how many are open, in progress, closed, and so on

### Part 2 — Come up with your own ideas

Once Part 1 is working (or in parallel, if your team is big enough), think about what would make the product genuinely more useful. You know the scenario — what is still missing?

A few questions to get you thinking:

- How would a customer check the status of their own case after submitting it?
- How would an advisor see only the cases assigned to *them*, rather than the full queue?
- What if the customer wanted to send a follow-up message to the advisor on their case?
- How would a manager understand how the team is performing?

These are prompts to spark ideas, not a feature list to copy. You might build one of these, something else entirely, or a combination — that decision is yours.

---

## Known issues — fix these first

The app has four deliberate bugs. Before adding anything new, get the existing code working. Each one can be fixed with a single line change — use the hints below if you get stuck.

| # | Where | Symptom | Hint |
|---|---|---|---|
| 1 | Submit a Case | Email validation rejects every address, even valid ones | Look at `src/utils/validation.js` |
| 2 | Submit a Case | Clicking **Submit Case** reloads the page instead of submitting the form | Look at `handleSubmit` in `SubmitCase.jsx` — what does a browser do by default when a form is submitted? |
| 3 | Dashboard | The cases table is always empty, even though the database has cases in it | Look at how `Dashboard.jsx` handles the response from `getAllCases` — is the data actually being stored anywhere? |
| 4 | Case Detail | Opening any case shows "Failed to load case" immediately | Look at the `getCaseById` call in `CaseDetail.jsx` and compare it with how other protected API calls are made elsewhere in the codebase |

---

## Getting started

1. **[Install prerequisites](docs/SETUP.md#prerequisites)** — Node.js, VS Code, Git, GitHub Desktop (optional)
2. **[Fork and clone the repo](docs/SETUP.md#on-the-day)** — one person forks, everyone clones
3. **[Seed the database](docs/SETUP.md#1-seed-the-database-with-sample-data)** — creates sample cases and advisor accounts
4. **[Start the app](docs/SETUP.md#2-start-the-application-production)** — runs on `http://localhost:3008`

Login credentials: `alice@crm.com` / `bob@crm.com` / `carol@crm.com` — all use password `password123`.

Full setup instructions in **[SETUP.md](docs/SETUP.md)**.

---

## Documentation

- **[SETUP.md](docs/SETUP.md)** — Prerequisites, installation, running the app, resetting the database
- **[LEARNING_RESOURCES.md](docs/LEARNING_RESOURCES.md)** — React & Material UI quick reference, common patterns, helpful links
- **[TEAMWORK.md](docs/TEAMWORK.md)** — Working as a team, branches, commits, pull requests, merge conflicts, presentation
- **[DATABASE.md](docs/DATABASE.md)** — Complete database schema, seed data, entity relationships
- **[API.md](docs/API.md)** — API endpoints, authentication, environment variables
- **[REFERENCE.md](docs/REFERENCE.md)** — Project structure, what's safe to edit, comment codes, case ordering, implementation notes
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** — Common issues and how to fix them

---

## License

This project is intended for educational use as part of an intern workshop.
