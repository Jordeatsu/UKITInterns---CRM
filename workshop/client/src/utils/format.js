/**
 * Formats an ISO date into a short UK date string.
 *
 * @param {string | null | undefined} iso
 * @returns {string}
 */
export function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Formats an ISO timestamp into a short UK date+time string.
 *
 * @param {string | null | undefined} iso
 * @returns {string}
 */
export function formatDateTime(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Formats an ISO date into a long, human-readable UK date.
 *
 * @param {string | null | undefined} iso
 * @returns {string}
 */
export function fmtDateLong(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Converts a camelCase key into a human-readable Title Case label.
 *
 * @param {string} key
 * @returns {string}
 */
export function toPresetLabel(key) {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (char) => char.toUpperCase());
}
