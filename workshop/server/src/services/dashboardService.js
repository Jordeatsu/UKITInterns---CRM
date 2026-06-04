const db = require("../database");

/**
 * Dashboard service.
 *
 * Computes aggregate KPI and chart datasets for advisor dashboard screens.
 */

/**
 * Return summary counts for the advisor dashboard.
 */
function getSummary() {
    const total = db.prepare("SELECT COUNT(*) AS count FROM cases").get().count;
    const open = db.prepare("SELECT COUNT(*) AS count FROM cases WHERE status = 'open'").get().count;
    const inProgress = db.prepare("SELECT COUNT(*) AS count FROM cases WHERE status = 'in_progress'").get().count;
    const reopenedByConsumer = db.prepare("SELECT COUNT(*) AS count FROM cases WHERE status = 'reopened_by_consumer'").get().count;
    const closed = db.prepare("SELECT COUNT(*) AS count FROM cases WHERE status = 'closed'").get().count;

    // Cases opened in the last 7 days
    const recentCases = db
        .prepare(
            `
    SELECT COUNT(*) AS count FROM cases
    WHERE created_at >= datetime('now', '-7 days')
  `,
        )
        .get().count;

    return { total, open, inProgress, reopenedByConsumer, closed, recentCases };
}

/**
 * Returns analytics datasets for charts.
 */
function getAnalytics() {
    const byComplaintType = db
        .prepare(
            `
    SELECT ct.label, COUNT(*) AS count
    FROM cases c
    LEFT JOIN complaint_types ct ON ct.id = c.complaint_type_id
    GROUP BY ct.id
    ORDER BY count DESC
  `,
        )
        .all();

    const dailySubmissions = db
        .prepare(
            `
    SELECT date(created_at) AS day, COUNT(*) AS count
    FROM cases
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY date(created_at)
    ORDER BY day ASC
  `,
        )
        .all();

    return { byComplaintType, dailySubmissions };
}

module.exports = { getSummary, getAnalytics };
