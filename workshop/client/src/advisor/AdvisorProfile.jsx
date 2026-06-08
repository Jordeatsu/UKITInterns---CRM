import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import LockResetIcon from "@mui/icons-material/LockReset";
import PaletteIcon from "@mui/icons-material/Palette";
import BadgeIcon from "@mui/icons-material/Badge";
import SurfaceCard from "../shared/SurfaceCard";
import PageHeader from "../shared/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";
import { changePassword } from "../services/api";

function toPresetLabel(key) {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (char) => char.toUpperCase());
}

export default function AdvisorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, advisor } = useAuth();
    const { themePreset, setThemePreset, availablePresets } = useAppTheme();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const isOwnProfile = useMemo(() => String(advisor?.id) === String(id), [advisor?.id, id]);

    useEffect(() => {
        if (advisor?.id && !isOwnProfile) {
            navigate(`/advisor/profile/${advisor.id}`, { replace: true });
        }
    }, [advisor?.id, isOwnProfile, navigate]);

    if (!isOwnProfile && advisor?.id) {
        return null;
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Please complete all password fields.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New password and confirmation do not match.");
            return;
        }

        setSubmitting(true);
        try {
            await changePassword(token, { currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordSuccess("Password updated successfully.");
        } catch (err) {
            setPasswordError(err.message || "Failed to change password.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box sx={{ p: 4 }}>
            <PageHeader eyebrow="Advisor workspace" title="Profile" subtitle="Manage your account details, password, and application theme" />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <SurfaceCard sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <BadgeIcon color="primary" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={700}>
                                User Details
                            </Typography>
                        </Box>
                        <TextField label="Advisor ID" value={advisor?.id || ""} disabled sx={{ mb: 2 }} />
                        <TextField label="Name" value={advisor?.name || ""} disabled sx={{ mb: 2 }} />
                        <TextField label="Email" value={advisor?.email || ""} disabled />
                    </SurfaceCard>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <SurfaceCard component="form" onSubmit={handlePasswordSubmit} sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <LockResetIcon color="primary" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={700}>
                                Change Password
                            </Typography>
                        </Box>

                        {passwordError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {passwordError}
                            </Alert>
                        )}
                        {passwordSuccess && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {passwordSuccess}
                            </Alert>
                        )}

                        <TextField
                            label="Current password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">•</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="New password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ mb: 2 }}
                            helperText="Use at least 8 characters."
                            InputProps={{
                                startAdornment: <InputAdornment position="start">•</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Confirm new password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 2.5 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">•</InputAdornment>,
                            }}
                        />

                        <Button type="submit" variant="contained" disabled={submitting}>
                            {submitting ? "Updating..." : "Update Password"}
                        </Button>
                    </SurfaceCard>

                    <SurfaceCard sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <PaletteIcon color="primary" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={700}>
                                Theme Preference
                            </Typography>
                        </Box>

                        <TextField
                            select
                            label="Theme preset"
                            value={themePreset}
                            onChange={(e) => setThemePreset(e.target.value)}
                            helperText="Changes apply immediately across the application."
                        >
                            {availablePresets.map((preset) => (
                                <MenuItem key={preset} value={preset}>
                                    {toPresetLabel(preset)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </SurfaceCard>
                </Grid>
            </Grid>
        </Box>
    );
}
