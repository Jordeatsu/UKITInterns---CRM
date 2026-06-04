require("dotenv").config();

/**
 * Express application entrypoint.
 *
 * Configures middleware, mounts API routes, and starts the CRM API server.
 */

const express = require("express");
const cors = require("cors");

// Import route handlers
const authRoutes = require("./routes/auth");
const casesRoutes = require("./routes/cases");
const productsRoutes = require("./routes/products");
const commentCodesRoutes = require("./routes/commentCodes");
const dashboardRoutes = require("./routes/dashboard");
const complaintTypesRoutes = require("./routes/complaintTypes");
const contactsRoutes = require("./routes/contacts");

const app = express();
const PORT = process.env.PORT || 5008;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
// Public routes — no authentication required
app.use("/api/auth", authRoutes);

// Cases handles both public (submit, track) and protected (advisor) routes internally
app.use("/api/cases", casesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/comment-codes", commentCodesRoutes);
app.use("/api/complaint-types", complaintTypesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contacts", contactsRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "CRM API is running" });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────────────────────
// Express calls this when next(err) is used or an error is thrown in a handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong on the server" });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`CRM API running on http://localhost:${PORT}`);
});
