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
import { login as apiLogin } from "../services/api";
import { useAuth } from "../context/AuthContext";

/**
 * Advisor authentication screen.
 *
 * Collects email/password, calls the login API, stores auth context,
 * and redirects successful logins to the advisor dashboard.
 */

/**
 * Advisor login component.
 *
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
                backgroundImage: (theme) =>
                    [
                        `radial-gradient(ellipse 80% 50% at 20% 30%, ${alpha(theme.palette.primary.main, 0.18)} 0%, transparent 60%)`,
                        `radial-gradient(ellipse 60% 45% at 80% 70%, ${alpha(theme.palette.secondary.main, 0.14)} 0%, transparent 55%)`,
                        `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.secondary.main} 100%)`,
                    ].join(", "),
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    maxWidth: 420,
                    width: "100%",
                    mx: 2,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
            >
                {/* Logo */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 64,
                            height: 64,
                            borderRadius: "18px",
                            backgroundImage: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                            mb: 2,
                        }}
                    >
                        <SupportAgentIcon sx={{ color: "#fff", fontSize: 34 }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        Advisor Portal
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                        Sign in to manage customer cases
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField label="Email address" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth autoComplete="email" autoFocus sx={{ mb: 2 }} />
                    <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth autoComplete="current-password" sx={{ mb: 3 }} />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        size="large"
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: "1rem",
                            backgroundImage: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                            boxShadow: (theme) => `0 4px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
                            "&:hover": { boxShadow: (theme) => `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}` },
                        }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign in"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
