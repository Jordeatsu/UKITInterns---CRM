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
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { StatusChip, PriorityChip, DueDateCell } from "./CaseChips";
import { formatDate } from "../utils/format";

export default function CasesTable({ cases, total, page, rowsPerPage, onPageChange, loading, onRowClick, showAssignedTo = true, emptyText = "No cases found" }) {
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (cases.length === 0) {
        return (
            <Box sx={{ py: 8, textAlign: "center" }}>
                <FolderOpenIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                <Typography color="text.secondary">{emptyText}</Typography>
            </Box>
        );
    }

    const headCols = ["Reference", "Contact", "Subject", "Status", "Priority"];
    if (showAssignedTo) headCols.push("Assigned To");
    headCols.push("Due", "Submitted");

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#FAFBFC" }}>
                            {headCols.map((h) => (
                                <TableCell key={h} sx={{ fontWeight: 600, fontSize: "0.8rem", color: "text.secondary", py: 1.5 }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cases.map((c) => (
                            <TableRow key={c.id} onClick={() => onRowClick(c.id)} sx={{ "&:hover": { bgcolor: "#F0F4FF" }, cursor: "pointer", transition: "background 0.1s" }}>
                                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#1565C0", fontWeight: 600 }}>{c.reference_number}</TableCell>
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
            <TablePagination component="div" count={total} page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={[rowsPerPage]} onPageChange={onPageChange} sx={{ borderTop: "1px solid rgba(0,0,0,0.07)" }} />
        </>
    );
}
