import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

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
                backgroundImage: ["radial-gradient(ellipse 80% 50% at 20% 30%, rgba(29,78,216,0.18) 0%, transparent 60%)", "radial-gradient(ellipse 60% 45% at 80% 70%, rgba(0,137,123,0.14) 0%, transparent 55%)", "linear-gradient(160deg, #060D1F 0%, #0A1628 55%, #0C1D30 100%)"].join(", "),
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
                    background: "rgba(255,255,255,0.97)",
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
                            backgroundImage: "linear-gradient(135deg, #1565C0 0%, #00897B 100%)",
                            boxShadow: "0 8px 24px rgba(21,101,192,0.35)",
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
                            backgroundImage: "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
                            boxShadow: "0 4px 16px rgba(21,101,192,0.35)",
                            "&:hover": { boxShadow: "0 6px 20px rgba(21,101,192,0.45)" },
                        }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign in"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
