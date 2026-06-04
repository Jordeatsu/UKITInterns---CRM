import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "./caseConfig";
import { formatDate } from "../utils/format";

/**
 * Renders a status chip using the shared status color/label configuration.
 *
 * @param {{status: string}} props
 * @returns {JSX.Element}
 */
export function StatusChip({ status }) {
    const cfg = STATUS_CONFIG[status] || { label: status, color: "#546E7A", bg: "rgba(84,110,122,0.10)", border: "rgba(84,110,122,0.25)" };
    return <Chip size="small" label={cfg.label} sx={{ color: cfg.color, bgcolor: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 600, fontSize: "0.72rem" }} />;
}

/**
 * Renders a priority chip using the shared priority configuration.
 *
 * @param {{priority: string}} props
 * @returns {JSX.Element}
 */
export function PriorityChip({ priority }) {
    const cfg = PRIORITY_CONFIG[priority] || { label: priority, color: "#546E7A", bg: "rgba(84,110,122,0.10)", border: "rgba(84,110,122,0.25)" };
    return <Chip size="small" label={cfg.label} sx={{ color: cfg.color, bgcolor: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 600, fontSize: "0.72rem" }} />;
}

/**
 * Displays a formatted due date and applies urgency coloring for near/overdue items.
 *
 * @param {{dueDate: string | null | undefined, status: string}} props
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
    const color = overdue ? "#C62828" : soon ? "#E65100" : "text.secondary";
    return (
        <Typography variant="body2" fontWeight={overdue || soon ? 600 : 400} sx={{ color }}>
            {formatDate(dueDate)}
        </Typography>
    );
}
