const BASE_URL = '/api';

// ── Consumer (public) ─────────────────────────────────────────────────────────

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}

export async function getComplaintTypes() {
  const res = await fetch(`${BASE_URL}/complaint-types`);
  if (!res.ok) throw new Error('Failed to load complaint types');
  return res.json();
}

export async function submitCase(payload) {
  const res = await fetch(`${BASE_URL}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit case');
  return data;
}

// ── Advisor (authenticated) ───────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getAllCases(token, { status, search, assignedTo, excludeClosed, page, limit } = {}) {
  const params = new URLSearchParams();
  if (status)        params.set('status', status);
  if (search)        params.set('search', search);
  if (assignedTo)    params.set('assigned_to', assignedTo);
  if (excludeClosed) params.set('exclude_closed', 'true');
  if (page)          params.set('page', page);
  if (limit)         params.set('limit', limit);
  const qs = params.toString() ? `?${params}` : '';
  const res = await fetch(`${BASE_URL}/cases${qs}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch cases');
  return res.json();
}

export async function getCaseById(token, id) {
  const res = await fetch(`${BASE_URL}/cases/${id}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch case');
  return res.json();
}

export async function updateCase(token, id, updates) {
  const res = await fetch(`${BASE_URL}/cases/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update case');
  return res.json();
}

export async function addNote(token, caseId, content) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/notes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to add note');
  return res.json();
}

export async function getCommentCodes(token) {
  const res = await fetch(`${BASE_URL}/comment-codes`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch comment codes');
  return res.json();
}

export async function getCommentCodesForProduct(token, productId) {
  const res = await fetch(`${BASE_URL}/comment-codes/product/${productId}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch comment codes');
  return res.json();
}

export async function addCaseProduct(token, caseId, productId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/products`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ product_id: productId }),
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
}

export async function removeCaseProduct(token, caseId, caseProductId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/products/${caseProductId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to remove product');
  return res.json();
}

export async function addCommentCode(token, caseId, productId, commentCodeId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/comment-codes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ product_id: productId, comment_code_id: commentCodeId }),
  });
  if (!res.ok) throw new Error('Failed to add comment code');
  return res.json();
}

export async function removeCommentCode(token, caseId, cccId) {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/comment-codes/${cccId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to remove comment code');
  return res.json();
}
