/**
 * @file CasesTable.jsx
 * @description Provides shared CRM UI behavior in CasesTable for advisor and consumer flows.
 */
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Skeleton from "@mui/material/Skeleton";
import { alpha } from "@mui/material/styles";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { StatusChip, PriorityChip, DueDateCell } from "./CaseChips";
import { formatDate } from "../utils/format";

/**
 * Renders the shared CasesTable component used across CRM screens.
 * @returns {JSX.Element}
 */
export default function CasesTable({ cases, total, page, rowsPerPage, onPageChange, loading, onRowClick, showAssignedTo = true, emptyText = "No cases found" }) {
    if (loading) {
        return (
            <Box
                sx={(theme) => ({
                    py: 3,
                    px: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.025),
                    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.09)}`,
                })}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                        Loading cases...
                    </Typography>
                </Box>
                {[...Array(5)].map((_, idx) => (
                    <Box key={idx} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.6fr 0.8fr 0.8fr", gap: 2, py: 1.2 }}>
                        <Skeleton variant="rounded" animation="wave" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18) }} />
                        <Skeleton variant="rounded" animation="wave" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15) }} />
                        <Skeleton variant="rounded" animation="wave" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12) }} />
                        <Skeleton variant="rounded" animation="wave" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16) }} />
                        <Skeleton variant="rounded" animation="wave" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.13) }} />
                    </Box>
                ))}
            </Box>
        );
    }

    if (cases.length === 0) {
        return (
            <Box sx={{ py: 8, textAlign: "center", px: 3 }}>
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        mx: "auto",
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
                    }}
                >
                    <FolderOpenIcon sx={{ fontSize: 30, color: "primary.main" }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                    No matching cases
                </Typography>
                <Typography color="text.secondary">{emptyText}</Typography>
            </Box>
        );
    }

    const headCols = ["Reference", "Contact", "Subject", "Status", "Priority"];
    if (showAssignedTo) headCols.push("Assigned To");
    headCols.push("Due", "Submitted");

    return (
        <>
            <TableContainer sx={{ maxHeight: 680 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {headCols.map((h) => (
                                <TableCell
                                    key={h}
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: "0.76rem",
                                        color: "text.secondary",
                                        py: 1.35,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        bgcolor: "background.paper",
                                        borderBottom: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                                    }}
                                >
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cases.map((c, idx) => (
                            <TableRow
                                key={c.id}
                                onClick={() => onRowClick(c.id)}
                                sx={(theme) => ({
                                    cursor: "pointer",
                                    transition: "background 0.15s, transform 0.15s",
                                    bgcolor: idx % 2 === 0 ? "transparent" : alpha(theme.palette.primary.main, 0.028),
                                    "& td": { borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` },
                                    "&:hover": {
                                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                                        "& td": { borderBottomColor: alpha(theme.palette.primary.main, 0.18) },
                                    },
                                })}
                            >
                                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem", color: "primary.main", fontWeight: 700 }}>{c.reference_number}</TableCell>
                                <TableCell sx={{ maxWidth: 180 }}>
                                    <Typography variant="body2" fontWeight={600} noWrap>
                                        {c.contact_name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                                        {c.contact_email}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 220 }}>
                                    <Typography variant="body2" noWrap>
                                        {c.subject}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={c.status} />
                                </TableCell>
                                <TableCell>
                                    <PriorityChip priority={c.priority} />
                                </TableCell>
                                {showAssignedTo && (
                                    <TableCell>
                                        <Typography variant="body2" color={c.assigned_to ? "text.primary" : "text.disabled"}>
                                            {c.assigned_to || "Unassigned"}
                                        </Typography>
                                    </TableCell>
                                )}
                                <TableCell>
                                    <DueDateCell dueDate={c.due_date} status={c.status} />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(c.created_at)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={total}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[rowsPerPage]}
                onPageChange={onPageChange}
                sx={(theme) => ({
                    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                })}
            />
        </>
    );
}
