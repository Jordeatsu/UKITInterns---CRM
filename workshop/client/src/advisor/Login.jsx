import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import { login as apiLogin } from "../services/api";
import { useAuth } from "../context/AuthContext";

const HIGHLIGHTS = [
    { icon: <VerifiedUserOutlinedIcon fontSize="small" />, label: "Secure advisor access" },
    { icon: <BoltOutlinedIcon fontSize="small" />, label: "Fast case triage tools" },
    { icon: <InsightsOutlinedIcon fontSize="small" />, label: "Live support insights" },
];

/**
 * Advisor authentication screen.
 *
 * Collects email/password, calls the login API, stores auth context,
 * and redirects successful logins to the advisor dashboard.
 */

/**
 * Renders the advisor authentication login view.
 * @returns {JSX.Element}
 */
export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    /** Form values and request status used for user feedback. */
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Generic input handler for both form fields.
     *
     * @param {import("react").ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e
     * @returns {void}
     */
    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    /**
     * Handles advisor sign-in flow.
     *
     * @param {import("react").FormEvent<HTMLFormElement>} e
     * @returns {Promise<void>}
     */
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { token, advisor } = await apiLogin(form.email, form.password);
            login(token, advisor);
            navigate("/advisor/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                py: { xs: 3, md: 6 },
                backgroundImage: (theme) =>
                    [
                        `radial-gradient(ellipse 90% 55% at 12% 20%, ${alpha(theme.palette.primary.main, 0.28)} 0%, transparent 68%)`,
                        `radial-gradient(ellipse 80% 50% at 88% 78%, ${alpha(theme.palette.secondary.main, 0.22)} 0%, transparent 62%)`,
                        `repeating-linear-gradient(-35deg, ${alpha(theme.palette.common.white, 0.04)} 0, ${alpha(theme.palette.common.white, 0.04)} 1px, transparent 1px, transparent 14px)`,
                        `linear-gradient(155deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 56%, ${theme.palette.secondary.main} 100%)`,
                    ].join(", "),
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 980,
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    boxShadow: "0 28px 70px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.08)",
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1.08fr 1fr" },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: { xs: 4, md: 5 },
                        color: "common.white",
                        backgroundImage: (theme) => [
                            `radial-gradient(circle at 18% 18%, ${alpha(theme.palette.common.white, 0.16)} 0, transparent 44%)`,
                            `radial-gradient(circle at 82% 82%, ${alpha(theme.palette.common.white, 0.11)} 0, transparent 46%)`,
                            `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        ].join(", "),
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            right: -34,
                            top: -34,
                            width: 140,
                            height: 140,
                            borderRadius: "50%",
                            border: "1px solid",
                            borderColor: (theme) => alpha(theme.palette.common.white, 0.2),
                        }}
                    />
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 66,
                            height: 66,
                            borderRadius: "18px",
                            bgcolor: (theme) => alpha(theme.palette.common.white, 0.2),
                            border: "1px solid",
                            borderColor: (theme) => alpha(theme.palette.common.white, 0.28),
                            backdropFilter: "blur(4px)",
                            mb: 2,
                        }}
                    >
                        <SupportAgentIcon sx={{ color: "#fff", fontSize: 36 }} />
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                        Advisor Portal
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 360, mb: 3.5 }}>
                        Handle customer cases quickly with a modern workspace built for triage, collaboration, and follow-ups.
                    </Typography>

                    <Box sx={{ display: "grid", gap: 1.25 }}>
                        {HIGHLIGHTS.map((item) => (
                            <Box
                                key={item.label}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1.5,
                                    bgcolor: (theme) => alpha(theme.palette.common.white, 0.12),
                                    border: "1px solid",
                                    borderColor: (theme) => alpha(theme.palette.common.white, 0.18),
                                }}
                            >
                                <Box sx={{ display: "flex", color: "inherit" }}>{item.icon}</Box>
                                <Typography variant="body2" sx={{ color: "inherit", opacity: 0.95 }}>
                                    {item.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ p: { xs: 3, md: 5 } }}>
                    <Box sx={{ mb: 3.5 }}>
                        <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 0.75 }}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to manage customer cases
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <TextField label="Email address" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth autoComplete="email" autoFocus sx={{ mb: 2 }} />
                        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth autoComplete="current-password" sx={{ mb: 3 }} />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            size="large"
                            sx={{
                                py: 1.45,
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: "1rem",
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign in"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
