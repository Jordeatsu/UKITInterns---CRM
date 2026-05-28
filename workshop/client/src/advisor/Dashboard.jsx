import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { getAllCases } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";

export default function Dashboard() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getAllCases(token, { excludeClosed: true })
            // TODO: handle the response and update state so cases appear in the table
            .catch(() => setError("Failed to load cases."))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={700}>
                    Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Overview of all customer cases
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                    <Typography variant="h6" fontWeight={600}>
                        All Cases
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : cases.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: "center" }}>
                        <FolderOpenIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                        <Typography color="text.secondary">No cases found</Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#FAFBFC" }}>
                                    {["Reference", "Contact", "Subject", "Status", "Submitted"].map((h) => (
                                        <TableCell key={h} sx={{ fontWeight: 600, fontSize: "0.8rem", color: "text.secondary", py: 1.5 }}>
                                            {h}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cases.map((c) => (
                                    <TableRow key={c.id} onClick={() => navigate(`/advisor/cases/${c.id}`)} sx={{ "&:hover": { bgcolor: "#F0F4FF" }, cursor: "pointer", transition: "background 0.1s" }}>
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
                                            <Typography variant="body2">{c.status}</Typography>
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
                )}
            </Paper>
        </Box>
    );
}
