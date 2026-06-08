/**
 * Frontend API client for both public consumer flows and authenticated advisor flows.
 *
 * All functions return parsed JSON and throw Errors for non-2xx responses.
 */
const BASE_URL = "/api";

// ── Consumer (public) ─────────────────────────────────────────────────────────

/**
 * Fetches the list of products available in the submit-case form.
 *
 * @returns {Promise<any>}
 */
export async function getProducts() {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error("Failed to load products");
    return res.json();
}

/**
 * Fetches complaint type options for the submit-case form.
 *
 * @returns {Promise<any>}
 */
export async function getComplaintTypes() {
    const res = await fetch(`${BASE_URL}/complaint-types`);
    if (!res.ok) throw new Error("Failed to load complaint types");
    return res.json();
}

/**
 * Submits a new consumer case.
 *
 * @param {object} payload
 * @returns {Promise<any>}
 */
export async function submitCase(payload) {
    const res = await fetch(`${BASE_URL}/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to submit case");
    return data;
}

// ── Advisor (authenticated) ───────────────────────────────────────────────────

/**
 * Authenticates an advisor account.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 */
export async function login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
}

/**
 * Builds standard authenticated headers for advisor endpoints.
 *
 * @param {string} token
 * @returns {{"Content-Type": string, Authorization: string}}
 */
function authHeaders(token) {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

/**
 * Changes the current advisor password.
 *
 * @param {string} token
 * @param {{currentPassword: string, newPassword: string}} payload
 * @returns {Promise<any>}
 */
export async function changePassword(token, payload) {
    const res = await fetch(`${BASE_URL}/auth/password`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to change password");
    return data;
}

/**
 * Fetches advisor-visible cases with optional filtering and pagination.
 *
 * @param {string} token
 * @param {{status?: string, search?: string, assignedTo?: string, excludeClosed?: boolean, page?: number, limit?: number}} [options]
 * @returns {Promise<any>}
 */
export async function getAllCases(token, { status, search, assignedTo, excludeClosed, page, limit } = {}) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    if (assignedTo) params.set("assigned_to", assignedTo);
    if (excludeClosed) params.set("exclude_closed", "true");
    if (page) params.set("page", page);
    if (limit) params.set("limit", limit);
    const qs = params.toString() ? `?${params}` : "";
    const res = await fetch(`${BASE_URL}/cases${qs}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch cases");
    return res.json();
}

/**
 * Fetches a single case by ID.
 *
 * @param {string} token
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function getCaseById(token, id) {
    const res = await fetch(`${BASE_URL}/cases/${id}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch case");
    return res.json();
}

/**
 * Updates editable fields on an existing case.
 *
 * @param {string} token
 * @param {string} id
 * @param {object} updates
 * @returns {Promise<any>}
 */
export async function updateCase(token, id, updates) {
    const res = await fetch(`${BASE_URL}/cases/${id}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update case");
    return res.json();
}

/**
 * Adds an internal advisor note to a case.
 *
 * @param {string} token
 * @param {string} caseId
 * @param {string} content
 * @returns {Promise<any>}
 */
export async function addNote(token, caseId, content) {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/notes`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to add note");
    return res.json();
}

/**
 * Retrieves the dashboard summary metrics used on the advisor homepage.
 *
 * @param {string} token
 * @returns {Promise<any>}
 */
export async function getDashboardSummary(token) {
    const res = await fetch(`${BASE_URL}/dashboard`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch dashboard summary");
    return res.json();
}

/**
 * Fetches all comment codes available to advisors.
 *
 * @param {string} token
 * @returns {Promise<any>}
 */
export async function getCommentCodes(token) {
    const res = await fetch(`${BASE_URL}/comment-codes`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch comment codes");
    return res.json();
}

/**
 * Fetches comment codes that apply to a given product.
 *
 * @param {string} token
 * @param {string} productId
 * @returns {Promise<any>}
 */
export async function getCommentCodesForProduct(token, productId) {
    const res = await fetch(`${BASE_URL}/comment-codes/product/${productId}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch comment codes");
    return res.json();
}

/**
 * Attaches a product to an existing case.
 *
 * @param {string} token
 * @param {string} caseId
 * @param {string} productId
 * @returns {Promise<any>}
 */
export async function addCaseProduct(token, caseId, productId) {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/products`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ product_id: productId }),
    });
    if (!res.ok) throw new Error("Failed to add product");
    return res.json();
}

/**
 * Removes a product link from a case.
 *
 * @param {string} token
 * @param {string} caseId
 * @param {string} caseProductId
 * @returns {Promise<any>}
 */
export async function removeCaseProduct(token, caseId, caseProductId) {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/products/${caseProductId}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to remove product");
    return res.json();
}

/**
 * Adds a comment code to a case/product combination.
 *
 * @param {string} token
 * @param {string} caseId
 * @param {string} productId
 * @param {string} commentCodeId
 * @returns {Promise<any>}
 */
export async function addCommentCode(token, caseId, productId, commentCodeId) {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/comment-codes`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ product_id: productId, comment_code_id: commentCodeId }),
    });
    if (!res.ok) throw new Error("Failed to add comment code");
    return res.json();
}

/**
 * Removes an existing case-comment-code association.
 *
 * @param {string} token
 * @param {string} caseId
 * @param {string} cccId
 * @returns {Promise<any>}
 */
export async function removeCommentCode(token, caseId, cccId) {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/comment-codes/${cccId}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to remove comment code");
    return res.json();
}
