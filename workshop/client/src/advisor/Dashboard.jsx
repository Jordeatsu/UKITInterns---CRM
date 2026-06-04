import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InboxIcon from "@mui/icons-material/Inbox";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ArchiveIcon from "@mui/icons-material/Archive";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getDashboardSummary, getAllCases } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CasesTable from "../shared/CasesTable";

function StatCard({ icon, label, value, accent }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(0,0,0,0.07)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "#fff",
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: accent + "18",
                    flexShrink: 0,
                }}
            >
                <Box sx={{ color: accent, display: "flex" }}>{icon}</Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h5" fontWeight={700} lineHeight={1.1} noWrap>
                    {value ?? "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.25} noWrap>
                    {label}
                </Typography>
            </Box>
        </Paper>
    );
}

export default function Dashboard() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [summary, setSummary] = useState(null);
    const [cases, setCases] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loadingS, setLoadingS] = useState(true);
    const [loadingC, setLoadingC] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        getDashboardSummary(token)
            .then(setSummary)
            .catch(() => setError("Failed to load dashboard summary."))
            .finally(() => setLoadingS(false));
    }, [token]);

    useEffect(() => {
        setLoadingC(true);
        getAllCases(token, { status: statusFilter || undefined, search: search || undefined, excludeClosed: true, page: page + 1 })
            .then(({ cases: rows, total: t }) => {
                // TODO Display The Cases
                // TODO Display Total Cases Count
            })
            .catch(() => setError("Failed to load cases."))
            .finally(() => setLoadingC(false));
    }, [token, statusFilter, search, page]);

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

            {loadingS ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <StatCard icon={<FolderOpenIcon />} label="Total cases" value={summary?.total} accent="#1565C0" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <StatCard icon={<InboxIcon />} label="Open" value={summary?.open} accent="#1976D2" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <StatCard icon={<HourglassTopIcon />} label="In progress" value={summary?.inProgress} accent="#E65100" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <StatCard icon={<NewReleasesIcon />} label="Reopened" value={summary?.reopenedByConsumer} accent="#7B1FA2" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <StatCard icon={<ArchiveIcon />} label="Closed" value={summary?.closed} accent="#546E7A" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <StatCard icon={<TaskAltIcon />} label="Last 7 days" value={summary?.recentCases} accent="#2E7D32" />
                    </Grid>
                </Grid>
            )}

            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
                <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                    <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
                        All Cases
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="Search name or email…"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        sx={{ width: 220 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        select
                        size="small"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(0);
                        }}
                        sx={{ width: 150 }}
                        label="Status"
                    >
                        <MenuItem value="">All statuses</MenuItem>
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="reopened_by_consumer">Reopened</MenuItem>
                    </TextField>
                </Box>

                <CasesTable cases={cases} total={total} page={page} rowsPerPage={25} onPageChange={(_, newPage) => setPage(newPage)} loading={loadingC} onRowClick={(id) => navigate(`/advisor/cases/${id}`)} />
            </Paper>
        </Box>
    );
}
