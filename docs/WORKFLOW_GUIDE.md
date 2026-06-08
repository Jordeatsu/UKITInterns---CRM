# System Workflow Guide

This guide walks through the major workflows in the CRM, showing exactly which files are involved and how data flows from the UI through the API to the database.

## Table of Contents

1. [Case Creation (Consumer Portal)](#1-case-creation-consumer-portal)
2. [Advisor Login](#2-advisor-login)
3. [Viewing the Dashboard](#3-viewing-the-dashboard)
4. [Viewing Case Details](#4-viewing-case-details)
5. [Updating Case Status](#5-updating-case-status)
6. [Changing Password](#6-changing-password)
7. [Theme Selection & Persistence](#7-theme-selection--persistence)
8. [Adding an Internal Note to a Case](#8-adding-an-internal-note-to-a-case)
9. [Applying a Comment Code to a Product](#9-applying-a-comment-code-to-a-product)
10. [Key Principles to Remember](#key-principles-to-remember)
11. [File Directory Quick Reference](#file-directory-quick-reference)

---

## 1. Case Creation (Consumer Portal)

A customer submits a complaint and receives a reference number.

### Step-by-step flow:

**1. Consumer fills out the form**
- **File:** `client/src/consumer/SubmitCase.jsx`
- **What happens:** User selects product, complaint type, fills email, and complaint description
- **State:** Form inputs stored in React state (`product`, `complaintType`, `email`, `description`)

**2. Consumer clicks "Submit Case"**
- **File:** `client/src/consumer/SubmitCase.jsx` → `handleSubmit()` function
- **What happens:** Form validation runs (email format, required fields)
- **Validation file:** `client/src/utils/validation.js` → `validateEmail()`

**3. Frontend sends POST request to API**
- **File:** `client/src/services/api.js` → `submitCase()` function
- **Endpoint:** `POST /api/cases`
- **Payload:** `{ email, product_line, complaint_type, description }`
- **Note:** This is a **public endpoint** (no authentication required)

**4. Backend receives the request**
- **File:** `server/src/routes/cases.js`
- **Handler:** Routes POST `/api/cases` to the controller

**5. Controller processes the submission**
- **File:** `server/src/controllers/casesController.js` → `createCase()` function
- **What happens:** Calls the service layer to handle business logic

**6. Service layer handles the logic**
- **File:** `server/src/services/casesService.js` → `createCase()` function
- **What happens:**
  - Looks up the contact by email (case-insensitive)
  - If no match → creates a new contact in the database
  - If match found → reuses existing contact
  - Creates a new case in the database
  - Sets initial status to `open`
  - Sets priority based on complaint type (defaults to `medium`)
  - Returns the case with a reference number

**7. Database updates**
- **File:** `server/src/database.js` (defines table structure)
- **Tables modified:**
  - `contacts` table (if new contact) → adds email, created_at
  - `cases` table → adds new row with status, priority, complaint_type, product_line, created_at
  - `case_history` table → logs the creation event

**8. Response sent back to frontend**
- **Endpoint response:** `{ case_id, reference, created_at }`

**9. Frontend displays confirmation**
- **File:** `client/src/consumer/Confirmation.jsx`
- **What happens:** Shows the case reference number and thanks the customer

---

## 2. Advisor Login

An advisor logs in to access the protected advisor portal.

### Step-by-step flow:

**1. Advisor enters email and password**
- **File:** `client/src/advisor/Login.jsx`
- **State:** Email and password stored in React state

**2. Advisor clicks "Login"**
- **File:** `client/src/advisor/Login.jsx` → `handleSubmit()` function

**3. Frontend sends POST request to API**
- **File:** `client/src/services/api.js` → `login()` function
- **Endpoint:** `POST /api/auth/login`
- **Payload:** `{ email, password }`
- **Note:** This is a **public endpoint** (no token needed yet)

**4. Backend verifies credentials**
- **File:** `server/src/routes/auth.js`
- **Handler:** Routes POST `/api/auth/login` to controller

**5. Controller validates password**
- **File:** `server/src/controllers/authController.js` → `login()` function
- **What happens:** Calls auth service to verify credentials

**6. Service layer checks password**
- **File:** `server/src/services/authService.js` → `verifyCredentials()` function
- **What happens:**
  - Looks up advisor by email in database
  - Uses bcrypt to compare provided password with stored hash
  - Returns advisor object (without password hash) if match, null otherwise

**7. JWT token is generated**
- **File:** `server/src/controllers/authController.js`
- **What happens:** If credentials valid, JWT token is signed using `JWT_SECRET` (from `.env`)
- **Token contents:** `{ id, email, name }`

**8. Response sent back to frontend**
- **Endpoint response:** `{ token, advisor: { id, name, email } }`

**9. Frontend stores credentials**
- **File:** `client/src/context/AuthContext.jsx`
- **What happens:**
  - Token saved to localStorage as `advisor_token`
  - Advisor object saved to localStorage as `advisor_user`
  - Both values set in React context state
  - User redirected to dashboard

**10. Token is included in future requests**
- **File:** `client/src/services/api.js`
- **How:** Every protected API call includes `Authorization: Bearer <token>` header
- **Verified by:** `server/src/middleware/auth.js` on each protected route

---

## 3. Viewing the Dashboard

An advisor opens the dashboard to see all open cases.

### Step-by-step flow:

**1. Advisor navigates to `/advisor/dashboard`**
- **File:** `client/src/App.jsx`
- **What happens:** Router loads Dashboard component

**2. Dashboard component mounts**
- **File:** `client/src/advisor/Dashboard.jsx` → `useEffect()` hook
- **What happens:** On component load, two parallel requests fire:
  - Fetch summary stats (open/pending/closed counts)
  - Fetch cases list

**3. Frontend requests case list**
- **File:** `client/src/services/api.js` → `getAllCases()` function
- **Endpoint:** `GET /api/cases`
- **Headers:** `Authorization: Bearer <token>` (required)
- **Query parameters:** 
  - `?page=0` (default first page)
  - `?limit=25` (default page size)
  - `?excludeClosed=true` (exclude closed cases)
- **Note:** This is a **protected endpoint** (token required)

**4. Backend verifies token**
- **File:** `server/src/middleware/auth.js`
- **What happens:** Middleware checks token validity before route handler runs

**5. Backend fetches cases from database**
- **File:** `server/src/routes/cases.js`
- **Handler:** Routes GET `/api/cases` to controller

**6. Controller processes the request**
- **File:** `server/src/controllers/casesController.js` → `getAllCases()` function
- **What happens:** Calls service layer with filters

**7. Service layer queries database**
- **File:** `server/src/services/casesService.js` → `getAllCases()` function
- **What happens:**
  - Queries `cases` table with SQL WHERE conditions (status, search, assigned_to)
  - **Sorts by:** Priority (high→medium→low), then by created_at (oldest first)
  - **Calculates SLA:** Due date = created_at + priority hours (24h/72h/168h)
  - **Paginates:** Skips and limits based on page/limit parameters
  - Returns cases array and total count

**8. Response sent back to frontend**
- **Endpoint response:** `{ cases: [...], total: 47, page: 0, limit: 25 }`

**9. Frontend displays cases in table**
- **File:** `client/src/shared/CasesTable.jsx`
- **What happens:**
  - Renders table rows from cases array
  - Displays: Reference, status, priority, product, customer email, due date
  - Shows skeleton loaders while data is fetching
  - Each row is clickable → links to `/advisor/cases/:id`

---

## 4. Viewing Case Details

An advisor clicks on a case to see full details, notes, and comment codes.

### Step-by-step flow:

**1. Advisor clicks on a case row**
- **File:** `client/src/shared/CasesTable.jsx`
- **What happens:** React Router navigates to `/advisor/cases/:id`

**2. Case Detail component mounts**
- **File:** `client/src/advisor/CaseDetail.jsx` → `useEffect()` hook
- **What happens:** Component loads with case ID from URL params

**3. Frontend requests case details**
- **File:** `client/src/services/api.js` → `getCaseById()` function
- **Endpoint:** `GET /api/cases/:id`
- **Headers:** `Authorization: Bearer <token>` (required)

**4. Backend fetches full case data**
- **File:** `server/src/routes/cases.js`
- **Handler:** Routes GET `/api/cases/:id` to controller

**5. Controller processes the request**
- **File:** `server/src/controllers/casesController.js` → `getCaseById()` function

**6. Service layer queries database with joins**
- **File:** `server/src/services/casesService.js` → `getCaseById()` function
- **What happens:**
  - Queries `cases` table by ID
  - Joins with `contacts` table to get customer email/name
  - Joins with `case_products` table to list products
  - Joins with `case_comment_codes` table to list comment codes
  - Joins with `case_history` table to show audit trail
  - Calculates SLA and due date

**7. Response includes nested data**
- **Endpoint response:**
  ```json
  {
    "id": 1,
    "reference": "CRM-001",
    "status": "open",
    "priority": "high",
    "created_at": "2024-01-15T10:30:00Z",
    "contact": { "id": 5, "email": "customer@example.com", "name": "John" },
    "products": [
      { "id": 10, "name": "Liquid Detergent", "product_id": 1 }
    ],
    "comment_codes": [
      { "id": 3, "code": "LEAK", "meaning": "Leaking container" }
    ],
    "notes": [
      { "id": 8, "content": "Advised customer of replacement", "created_by": "alice", "created_at": "..." }
    ],
    "history": [...]
  }
  ```

**8. Frontend displays case details**
- **File:** `client/src/advisor/CaseDetail.jsx`
- **What happens:**
  - Displays case header (reference, status, priority, due date)
  - Shows customer contact details
  - Displays linked products
  - Shows applied comment codes with delete buttons
  - Lists internal advisor notes
  - Shows audit trail

---

## 5. Updating Case Status

An advisor changes a case from "open" to "in progress" or "closed".

### Step-by-step flow:

**1. Advisor selects new status from dropdown**
- **File:** `client/src/advisor/CaseDetail.jsx`
- **State:** Status state updates locally

**2. Advisor submits the update**
- **File:** `client/src/advisor/CaseDetail.jsx` → `handleStatusChange()` function
- **What happens:** Calls the API to persist the change

**3. Frontend sends PATCH request**
- **File:** `client/src/services/api.js` → `updateCase()` function
- **Endpoint:** `PATCH /api/cases/:id`
- **Headers:** `Authorization: Bearer <token>` (required)
- **Payload:** `{ status: "in_progress" }` (or closed, or open)

**4. Backend validates and updates**
- **File:** `server/src/routes/cases.js`
- **Handler:** Routes PATCH `/api/cases/:id` to controller

**5. Controller processes the update**
- **File:** `server/src/controllers/casesController.js` → `updateCase()` function

**6. Service layer updates database**
- **File:** `server/src/services/casesService.js` → `updateCase()` function
- **What happens:**
  - Updates `cases` table with new status
  - Updates `updated_at` timestamp
  - **Atomic transaction:** Inside same DB transaction:
    - Inserts audit record into `case_history` table
    - Records: what field changed, old value, new value, who, when
  - Returns updated case

**7. Response sent back**
- **Endpoint response:** Updated case object with new status

**8. Frontend updates display**
- **File:** `client/src/advisor/CaseDetail.jsx`
- **What happens:** Case detail re-renders with new status badge

---

## 6. Changing Password

An advisor changes their password from the profile page.

### Step-by-step flow:

**1. Advisor navigates to `/advisor/profile/:id`**
- **File:** `client/src/advisor/AdvisorProfile.jsx`
- **What happens:** Profile page loads, displays user details and password form

**2. Advisor enters current and new password**
- **File:** `client/src/advisor/AdvisorProfile.jsx`
- **State:** `currentPassword`, `newPassword`, `confirmPassword` stored in React state
- **Validation:**
  - New password must be ≥8 characters
  - New password must match confirm password
  - New password must differ from current password

**3. Advisor clicks "Update Password"**
- **File:** `client/src/advisor/AdvisorProfile.jsx` → `handlePasswordSubmit()` function

**4. Frontend sends POST request**
- **File:** `client/src/services/api.js` → `changePassword()` function
- **Endpoint:** `POST /api/auth/change-password`
- **Headers:** `Authorization: Bearer <token>` (required)
- **Payload:** `{ currentPassword, newPassword }`

**5. Backend validates current password**
- **File:** `server/src/routes/auth.js`
- **Handler:** Routes POST `/api/auth/change-password` to controller

**6. Controller verifies credentials**
- **File:** `server/src/controllers/authController.js` → `changePassword()` function

**7. Service layer updates password hash**
- **File:** `server/src/services/authService.js` → `changePassword()` function
- **What happens:**
  - Looks up advisor in `advisors` table by ID
  - Verifies current password matches hash using bcrypt
  - Validates new password differs from current
  - Hashes new password using bcrypt (10 rounds)
  - Updates `password_hash` in database
  - Returns success

**8. Response sent back**
- **Endpoint response:** `{ ok: true }`

**9. Frontend shows success notification**
- **File:** `client/src/advisor/AdvisorProfile.jsx`
- **What happens:**
  - Clears form inputs
  - Shows Snackbar notification: "Password updated successfully"
  - Notification auto-dismisses after 4 seconds

---

## 7. Theme Selection & Persistence

An advisor selects a theme, and it persists across sessions.

### Step-by-step flow:

**1. Advisor selects theme from dropdown**
- **File:** `client/src/advisor/AdvisorProfile.jsx`
- **State:** Selected theme updates in ThemeContext

**2. ThemeContext detects change**
- **File:** `client/src/context/ThemeContext.jsx`
- **Hook:** `useEffect()` watches `themePreset` state
- **What happens:** When theme changes, new value is saved to localStorage

**3. Theme is saved to browser storage**
- **File:** `client/src/context/ThemeContext.jsx`
- **Storage:** `localStorage.setItem("crm_theme_preset", themePreset)`
- **Key:** `crm_theme_preset`
- **Value:** e.g., `"monochromeSlate"` or `"oceanBlue"`

**4. Theme object is created from preset**
- **File:** `client/src/context/ThemeContext.jsx`
- **What happens:** Calls `createAppTheme(themePreset)`

**5. Material-UI theme is built**
- **File:** `client/src/theme.js`
- **What happens:**
  - Looks up color palette from `themePresets.local.js`
  - Creates MUI theme object with colors, typography, spacing, shadows
  - Applies theme globally via `<ThemeProvider>`

**6. All components respond to new theme**
- **File:** Every component using `sx` prop or MUI components
- **What happens:** MUI automatically applies theme colors and styles

**7. On page reload, theme persists**
- **File:** `client/src/context/ThemeContext.jsx`
- **Function:** `resolveInitialPreset()`
- **What happens:** On app startup, reads `localStorage.getItem("crm_theme_preset")`
- **Fallback:** If no stored theme, uses `ACTIVE_THEME_PRESET`

---

## 8. Adding an Internal Note to a Case

An advisor writes a note visible only to advisors.

### Step-by-step flow:

**1. Advisor types in notes textarea**
- **File:** `client/src/advisor/CaseDetail.jsx`
- **State:** Note content stored in React state

**2. Advisor clicks "Add Note"**
- **File:** `client/src/advisor/CaseDetail.jsx` → `handleAddNote()` function

**3. Frontend sends POST request**
- **File:** `client/src/services/api.js` → `addNote()` function
- **Endpoint:** `POST /api/cases/:id/notes`
- **Headers:** `Authorization: Bearer <token>` (required)
- **Payload:** `{ content: "..." }`

**4. Backend creates note record**
- **File:** `server/src/routes/cases.js`
- **Handler:** Routes POST `/api/cases/:id/notes` to controller

**5. Controller processes the request**
- **File:** `server/src/controllers/casesController.js` → `addNote()` function

**6. Service layer saves to database**
- **File:** `server/src/services/casesService.js` → `addNote()` function
- **What happens:**
  - Inserts row into `case_notes` table
  - Records: content, case_id, created_by (advisor ID from token), created_at
  - Returns created note with metadata

**7. Response sent back**
- **Endpoint response:** `{ id: 99, content: "...", created_by: "alice", created_at: "..." }`

**8. Frontend displays new note**
- **File:** `client/src/advisor/CaseDetail.jsx`
- **What happens:**
  - New note appears in notes list immediately
  - Shows advisor name and timestamp
  - Older notes stay below

---

## 9. Applying a Comment Code to a Product

An advisor categorizes a product issue with a comment code.

### Step-by-step flow:

**1. Advisor selects a comment code from dropdown**
- **File:** `client/src/advisor/CaseDetail.jsx`
- **Dropdown:** Shows codes valid for that product only
- **Example:** For "Liquid Detergent", shows STAN, SKIN, SCNT, DLVR, SEAL, LEAK, MEAS

**2. Advisor clicks "Apply Code"**
- **File:** `client/src/advisor/CaseDetail.jsx` → `handleApplyCode()` function

**3. Frontend sends POST request**
- **File:** `client/src/services/api.js` → `applyCommentCode()` function
- **Endpoint:** `POST /api/cases/:id/comment-codes`
- **Headers:** `Authorization: Bearer <token>` (required)
- **Payload:** `{ code: "LEAK", product_id: 10, case_product_id: 45 }`

**4. Backend validates code**
- **File:** `server/src/routes/cases.js`
- **Handler:** Routes POST to controller

**5. Controller verifies validity**
- **File:** `server/src/controllers/casesController.js` → `applyCommentCode()` function
- **What happens:** Calls service to check if code is valid for product

**6. Service layer saves relationship**
- **File:** `server/src/services/casesService.js` → `applyCommentCode()` function
- **What happens:**
  - Queries `product_comment_codes` table to verify code exists for product
  - If valid, inserts row into `case_comment_codes` table
  - Records: case_id, comment_code, applied_by, applied_at
  - If invalid, returns error

**7. Response sent back**
- **Endpoint response:** `{ id: 156, code: "LEAK", applied_at: "..." }`

**8. Frontend displays applied code**
- **File:** `client/src/advisor/CaseDetail.jsx`
- **What happens:**
  - New code badge appears in the comment codes section
  - Shows code and meaning (e.g., "LEAK - Leaking container")
  - Shows X button to remove if needed

---

## Key Principles to Remember

### 1. **Data flows client → API → database**
   - React components manage UI state
   - API calls pass data to backend
   - Backend validates and persists to database

### 2. **Authentication is token-based**
   - Login returns JWT token
   - Token stored in localStorage and context
   - Token included in `Authorization` header on protected requests
   - Backend middleware verifies token on each protected route

### 3. **Database transactions keep audit trail**
   - Case updates happen inside a transaction
   - `case_history` record is written in same transaction
   - This ensures audit trail never gets out of sync

### 4. **UI state is separate from persisted state**
   - Form inputs live in React state
   - Only sent to backend when form is submitted
   - Backend response updates context/component state
   - Theme is special — it saves to localStorage for persistence

### 5. **Query parameters control API behavior**
   - `?page=`, `?limit=` control pagination
   - `?status=`, `?search=` filter results
   - `?excludeClosed=true` switches between views
   - Frontend constructs these based on user selections

### 6. **Validation happens on both sides**
   - Frontend validates user input before sending (UX)
   - Backend re-validates on receipt (security)
   - Never trust frontend validation alone

---

## File Directory Quick Reference

| Purpose | File |
|---------|------|
| Consumer UI | `client/src/consumer/` |
| Advisor UI | `client/src/advisor/` |
| Shared UI components | `client/src/shared/` |
| API calls | `client/src/services/api.js` |
| Auth state | `client/src/context/AuthContext.jsx` |
| Theme state | `client/src/context/ThemeContext.jsx` |
| Form validation | `client/src/utils/validation.js` |
| Express app | `server/src/index.js` |
| Auth routes/controller | `server/src/routes/auth.js`, `server/src/controllers/authController.js` |
| Case routes/controller | `server/src/routes/cases.js`, `server/src/controllers/casesController.js` |
| Auth service | `server/src/services/authService.js` |
| Case service | `server/src/services/casesService.js` |
| Database schema | `server/src/database.js` |
| Auth middleware | `server/src/middleware/auth.js` |

