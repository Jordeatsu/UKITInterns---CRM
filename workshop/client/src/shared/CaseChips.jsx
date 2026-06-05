/**
 * @file CaseChips.jsx
 * @description Provides shared CRM UI behavior in CaseChips for advisor and consumer flows.
 */
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "./caseConfig";
import { formatDate } from "../utils/format";

/**
 * Resolves a palette tone into chip color tokens.
 * @param {import('@mui/material/styles').Theme} theme Active MUI theme.
 * @param {string} tone Palette key to resolve.
 * @returns {{main: string, bg: string, border: string}}
 */
function resolveTone(theme, tone = "primary") {
    const group = theme.palette[tone] || theme.palette.primary;
    return {
        main: group.main,
        bg: alpha(group.main, 0.12),
        border: alpha(group.main, 0.3),
    };
}

/**
 * Renders a status chip for a case status.
 * @param {{status: string}} props Component props.
 * @returns {JSX.Element}
 */
export function StatusChip({ status }) {
    const cfg = STATUS_CONFIG[status] || { label: status, tone: "primary" };
    return (
        <Chip
            size="small"
            label={cfg.label}
            sx={(theme) => {
                const tone = resolveTone(theme, cfg.tone);
                return {
                    color: tone.main,
                    bgcolor: tone.bg,
                    border: `1px solid ${tone.border}`,
                    fontWeight: 600,
                    fontSize: "0.72rem",
                };
            }}
        />
    );
}

/**
 * Renders a priority chip for a case priority.
 * @param {{priority: string}} props Component props.
 * @returns {JSX.Element}
 */
export function PriorityChip({ priority }) {
    const cfg = PRIORITY_CONFIG[priority] || { label: priority, tone: "primary" };
    return (
        <Chip
            size="small"
            label={cfg.label}
            sx={(theme) => {
                const tone = resolveTone(theme, cfg.tone);
                return {
                    color: tone.main,
                    bgcolor: tone.bg,
                    border: `1px solid ${tone.border}`,
                    fontWeight: 600,
                    fontSize: "0.72rem",
                };
            }}
        />
    );
}

/**
 * Renders a formatted due date cell with overdue/soon emphasis.
 * @param {{dueDate: string | null | undefined, status: string}} props Component props.
 * @returns {JSX.Element}
 */
export function DueDateCell({ dueDate, status }) {
    if (!dueDate)
        return (
            <Typography variant="body2" color="text.disabled">
                —
            </Typography>
        );
    const now = new Date();
    const due = new Date(dueDate);
    const overdue = due < now && status !== "closed";
    const soon = !overdue && due - now < 24 * 3600 * 1000 && status !== "closed";
    const color = overdue ? "error.main" : soon ? "warning.main" : "text.secondary";
    return (
        <Typography variant="body2" fontWeight={overdue || soon ? 600 : 400} sx={{ color }}>
            {formatDate(dueDate)}
        </Typography>
    );
}
