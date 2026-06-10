/**
 * Domain constants for the CRM server.
 *
 * Use these instead of inlining string literals so a rename only requires a
 * single change and typos are caught immediately.
 */

const CASE_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    CLOSED: "closed",
    REOPENED_BY_CONSUMER: "reopened_by_consumer",
};

const PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
};

const SENDER_TYPE = {
    ADVISOR: "advisor",
    CONSUMER: "consumer",
};

const VALID_STATUSES = Object.values(CASE_STATUS);
const VALID_PRIORITIES = Object.values(PRIORITY);
const VALID_SENDER_TYPES = Object.values(SENDER_TYPE);

module.exports = { CASE_STATUS, PRIORITY, SENDER_TYPE, VALID_STATUSES, VALID_PRIORITIES, VALID_SENDER_TYPES };
