# API Reference

The base URL for all API routes is `/api`. Routes marked **Public** require no authentication. Routes marked **Protected** require a valid `Authorization: Bearer <token>` header (obtained from the login endpoint).

## Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Log in as an advisor — returns `{ token, advisor }` |

---

## Cases

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/cases` | Public | Submit a new case |
| `GET` | `/api/cases` | Protected | List cases — supports `?status=`, `?search=`, `?assigned_to=<advisor_id>`, `?excludeClosed=true`, `?page=`, `?limit=` |
| `GET` | `/api/cases/:id` | Protected | Full case details including products, comment codes, notes |
| `PATCH` | `/api/cases/:id` | Protected | Update status, priority, or assigned\_to |
| `GET` | `/api/cases/:id/notes` | Protected | Get advisor notes |
| `POST` | `/api/cases/:id/notes` | Protected | Add an advisor note |
| `POST` | `/api/cases/:id/products` | Protected | Link a product to a case |
| `DELETE` | `/api/cases/:id/products/:caseProductId` | Protected | Remove a product from a case |
| `POST` | `/api/cases/:id/comment-codes` | Protected | Apply a comment code to a case product |
| `DELETE` | `/api/cases/:id/comment-codes/:cccId` | Protected | Remove an applied comment code |

---

## Products & comment codes

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/comment-codes/product/:productId` | Protected | Comment codes valid for a given product |

---

## Complaint types

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/complaint-types` | Public | List all complaint types |

---

## Environment variables

Server configuration lives in `workshop/server/.env`.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5008` | Port the Express API listens on |
| `JWT_SECRET` | `crm_workshop_secret_change_in_production` | Secret used to sign JWTs |
| `NODE_ENV` | `development` | Set to `production` when running via `start.sh` |
| `DB_PATH` | `./crm.db` | Path to the SQLite database file |

You do not need to change any of these for local or workshop use.
