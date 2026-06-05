/**
 * @file caseConfig.js
 * @description Provides shared CRM UI behavior in caseConfig for advisor and consumer flows.
 */
export const STATUS_CONFIG = {
    open: {
        label: "Open",
        tone: "primary",
        icon: "dot",
    },
    in_progress: {
        label: "In Progress",
        tone: "warning",
        icon: "clock",
    },
    closed: {
        label: "Closed",
        tone: "success",
        icon: "check",
    },
    reopened_by_consumer: {
        label: "Reopened",
        tone: "secondary",
        icon: "refresh",
    },
};

export const PRIORITY_CONFIG = {
    high: {
        label: "High",
        verboseLabel: "High Priority",
        tone: "error",
        icon: "priority_high",
    },
    medium: {
        label: "Medium",
        verboseLabel: "Medium Priority",
        tone: "warning",
        icon: "priority_medium",
    },
    low: {
        label: "Low",
        verboseLabel: "Low Priority",
        tone: "success",
        icon: "priority_low",
    },
};
