import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { alpha } from "@mui/material/styles";
import { getCaseById } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatDateTime } from "../utils/format";

/**
 * Advisor case detail page.
 *
 * Reads the case ID from route params, loads the matching case from the API,
 * and renders grouped sections for details, contact info, and metadata.
 */

/**
 * Reusable heading for card sections in the case detail view.
 *
 * @param {{icon: import("react").ReactNode, children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
function SectionHeading({ icon, children }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Box sx={{ color: "primary.main", display: "flex", opacity: 0.7 }}>{icon}</Box>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5} fontSize="0.72rem">
                {children}
            </Typography>
        </Box>
    );
}

/**
 * Reusable two-column metadata row.
 *
 * @param {{label: string, children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
function MetaRow({ label, children }) {
    return (
        <Box sx={{ display: "flex", gap: 1, mb: 1.5, alignItems: "flex-start" }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, flexShrink: 0 }}>
                {label}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </Box>
    );
}

/**
 * Loads and displays a single case for advisor review.
 *
 * @returns {JSX.Element}
 */
export default function CaseDetail() {
    /** Route parameter containing the case ID (for /advisor/cases/:id). */
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    /** Local UI state for API lifecycle and loaded case payload. */
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /** Fetches case details whenever the route case ID changes. */
    useEffect(() => {
        getCaseById(null, id) // TODO: this call is missing something — check how other protected API calls are made
            .then(setCaseData)
            .catch(() => setError("Failed to load case."))
            .finally(() => setLoading(false));
    }, [id]);

    /** Loading state while the case-detail request is in progress. */
    if (loading) {
        return (
            <Box sx={{ p: 4, maxWidth: 1100, mx: "auto" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Skeleton variant="rounded" animation="wave" width={34} height={34} sx={{ borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18) }} />
                    <Box sx={{ width: "min(420px, 100%)" }}>
                        <Skeleton variant="text" animation="wave" width="72%" height={34} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2) }} />
                        <Skeleton variant="text" animation="wave" width="42%" height={24} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.13) }} />
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(21,101,192,0.10)", mb: 3, boxShadow: "0 4px 20px rgba(21,101,192,0.08)" }}>
                            <Skeleton variant="text" animation="wave" width={150} height={24} sx={{ mb: 2, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="text" animation="wave" width="65%" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="text" animation="wave" width="48%" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="text" animation="wave" width="58%" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Divider sx={{ my: 2 }} />
                            <Skeleton variant="text" animation="wave" width={110} height={26} sx={{ mb: 1, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="rounded" animation="wave" height={132} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.09) }} />
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(21,101,192,0.10)", mb: 3, boxShadow: "0 4px 20px rgba(21,101,192,0.08)" }}>
                            <Skeleton variant="text" animation="wave" width={110} height={24} sx={{ mb: 2, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="text" animation="wave" width="75%" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="text" animation="wave" width="82%" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="text" animation="wave" width="54%" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                        </Paper>

                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(21,101,192,0.10)", boxShadow: "0 4px 20px rgba(21,101,192,0.08)" }}>
                            <Skeleton variant="text" animation="wave" width={110} height={24} sx={{ mb: 2, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="text" animation="wave" width="70%" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="text" animation="wave" width="60%" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                            <Skeleton variant="text" animation="wave" width="64%" height={26} sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14) }} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    /** Error fallback when the request failed and no case data is available. */
    if (error && !caseData) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    /** Alias used to keep JSX bindings concise. */
    const c = caseData;

    return (
        <Box sx={{ p: 4, maxWidth: 1100, mx: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} size="small" sx={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 1.5 }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Box>
                    <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                        {c.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                        {c.reference_number}
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(21,101,192,0.10)", mb: 3, boxShadow: "0 4px 20px rgba(21,101,192,0.08)" }}>
                        <SectionHeading icon={<ArticleOutlinedIcon fontSize="small" />}>Case Details</SectionHeading>
                        <MetaRow label="Status">
                            <Typography variant="body2">{c.status}</Typography>
                        </MetaRow>
                        <MetaRow label="Priority">
                            <Typography variant="body2">{c.priority}</Typography>
                        </MetaRow>
                        <MetaRow label="Complaint type">
                            <Typography variant="body2">{c.complaint_type_label || "—"}</Typography>
                        </MetaRow>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" fontWeight={600} mb={1}>
                            Description
                        </Typography>
                        <Box sx={{ bgcolor: "#F8F9FA", borderRadius: 2, p: 2, border: "1px solid rgba(0,0,0,0.06)", whiteSpace: "pre-wrap" }}>
                            <Typography variant="body2" lineHeight={1.7}>
                                {c.description}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(21,101,192,0.10)", mb: 3, boxShadow: "0 4px 20px rgba(21,101,192,0.08)" }}>
                        <SectionHeading icon={<PersonOutlinedIcon fontSize="small" />}>Contact</SectionHeading>
                        <MetaRow label="Name">
                            <Typography variant="body2" fontWeight={600}>
                                {c.contact_name}
                            </Typography>
                        </MetaRow>
                        <MetaRow label="Email">
                            <Typography variant="body2">{c.contact_email}</Typography>
                        </MetaRow>
                        <MetaRow label="Phone">
                            <Typography variant="body2">{c.contact_phone || "—"}</Typography>
                        </MetaRow>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(21,101,192,0.10)", boxShadow: "0 4px 20px rgba(21,101,192,0.08)" }}>
                        <SectionHeading icon={<InfoOutlinedIcon fontSize="small" />}>Case Info</SectionHeading>
                        <MetaRow label="Assigned to">
                            <Typography variant="body2" color={c.assigned_to_name ? "text.primary" : "text.disabled"}>
                                {c.assigned_to_name || "Unassigned"}
                            </Typography>
                        </MetaRow>
                        <MetaRow label="Submitted">
                            <Typography variant="body2">{formatDateTime(c.created_at)}</Typography>
                        </MetaRow>
                        <MetaRow label="Last updated">
                            <Typography variant="body2">{formatDateTime(c.updated_at)}</Typography>
                        </MetaRow>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
