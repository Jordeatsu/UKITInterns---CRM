/**
 * Display metadata for case statuses.
 *
 * Used by chips and tables to keep labels/colors consistent across the UI.
 *
 * @type {Record<string, {label: string, color: string, bg: string, border: string}>}
 */
export const STATUS_CONFIG = {
    open: {
        label: "Open",
        color: "#1565C0",
        bg: "rgba(21,101,192,0.10)",
        border: "rgba(21,101,192,0.25)",
    },
    in_progress: {
        label: "In Progress",
        color: "#E65100",
        bg: "rgba(230,81,0,0.10)",
        border: "rgba(230,81,0,0.25)",
    },
    closed: {
        label: "Closed",
        color: "#546E7A",
        bg: "rgba(84,110,122,0.10)",
        border: "rgba(84,110,122,0.25)",
    },
    reopened_by_consumer: {
        label: "Reopened",
        color: "#7B1FA2",
        bg: "rgba(123,31,162,0.10)",
        border: "rgba(123,31,162,0.25)",
    },
};

/**
 * Display metadata for case priority values.
 *
 * @type {Record<string, {label: string, verboseLabel: string, color: string, bg: string, border: string}>}
 */
export const PRIORITY_CONFIG = {
    high: { label: "High", verboseLabel: "High Priority", color: "#C62828", bg: "rgba(198,40,40,0.10)", border: "rgba(198,40,40,0.25)" },
    medium: { label: "Medium", verboseLabel: "Medium Priority", color: "#E65100", bg: "rgba(230,81,0,0.10)", border: "rgba(230,81,0,0.25)" },
    low: { label: "Low", verboseLabel: "Low Priority", color: "#2E7D32", bg: "rgba(46,125,50,0.10)", border: "rgba(46,125,50,0.25)" },
};
