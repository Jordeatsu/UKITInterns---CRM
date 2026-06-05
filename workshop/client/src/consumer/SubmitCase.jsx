import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import DescriptionIcon from "@mui/icons-material/Description";
import { alpha } from "@mui/material/styles";
import { getProducts, getComplaintTypes, submitCase } from "../services/api";
import { EMAIL_RE } from "../utils/validation";

const EMPTY_FORM = {
    name: "",
    email: "",
    product_id: "",
    complaint_type_id: "",
    description: "",
};

function StepSection({ number, icon, title, children }) {
    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2.5, gap: 1.5 }}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0,
                        boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.35)}`,
                    }}
                >
                    {number}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                        {title}
                    </Typography>
                </Box>
            </Box>
            {children}
        </Box>
    );
}

export default function SubmitCase() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [complaintTypes, setComplaintTypes] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const formReady = products.length > 0 && complaintTypes.length > 0;

    useEffect(() => {
        Promise.all([getProducts(), getComplaintTypes()])
            .then(([prods, types]) => {
                setProducts(prods);
                setComplaintTypes(types);
            })
            .catch(() => setApiError("Could not load form data. Please refresh the page."));
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    function handleEmailBlur() {
        if (!form.email.trim()) return;
        if (!EMAIL_RE.test(form.email.trim())) {
            setErrors((prev) => ({ ...prev, email: "Enter a valid email address." }));
        }
    }

    function validate() {
        const next = {};
        if (!form.name.trim()) next.name = "Full name is required.";
        if (!form.email.trim()) next.email = "Email address is required.";
        else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
        if (!form.product_id) next.product_id = "Please select a product.";
        if (!form.complaint_type_id) next.complaint_type_id = "Please select a complaint type.";
        if (!form.description.trim()) next.description = "Please describe your issue.";
        return next;
    }

    async function handleSubmit(e) {
        // TODO: prevent the default browser form submission behaviour
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setSubmitting(true);
        setApiError("");
        try {
            const selectedProduct = products.find((p) => p.id === form.product_id);
            const selectedType = complaintTypes.find((t) => t.id === form.complaint_type_id);
            const subject = `${selectedProduct?.name ?? "Product"} — ${selectedType?.label ?? "Complaint"}`;
            const result = await submitCase({
                name: form.name.trim(),
                email: form.email.trim(),
                subject,
                description: form.description.trim(),
                complaint_type_id: form.complaint_type_id,
                product_ids: [form.product_id],
            });
            navigate("/submit/confirmation", {
                state: {
                    referenceNumber: result.reference_number,
                    subject,
                    productName: selectedProduct?.name ?? "",
                },
                replace: true,
            });
        } catch (err) {
            setApiError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box>
            {/* Hero */}
            <Box
                sx={{
                    backgroundImage: (theme) =>
                        [`radial-gradient(ellipse 120% 80% at 80% 50%, ${alpha(theme.palette.secondary.main, 0.38)} 0%, transparent 70%)`, `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.secondary.main} 100%)`].join(", "),
                    borderRadius: 3,
                    px: { xs: 3, sm: 5 },
                    py: { xs: 4, sm: 5 },
                    mb: 4,
                    position: "relative",
                    overflow: "hidden",
                    color: "white",
                    border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                    boxShadow: "0 20px 50px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)",
                }}
            >
                {/* Decorative circles */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -40,
                        right: -40,
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.05)",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: -60,
                        right: 80,
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.05)",
                    }}
                />
                <Box sx={{ position: "relative", display: "flex", alignItems: "center", gap: 3 }}>
                    <Box
                        sx={{
                            bgcolor: "rgba(255,255,255,0.15)",
                            borderRadius: "16px",
                            p: 2,
                            display: "flex",
                            backdropFilter: "blur(4px)",
                        }}
                    >
                        <HeadsetMicIcon sx={{ fontSize: 44 }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" gutterBottom sx={{ mb: 0.5 }}>
                            Submit a Support Case
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 480 }}>
                            Fill in the form below and one of our advisors will be in touch shortly. You will receive a reference number for your records.
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {apiError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setApiError("")}>
                    {apiError}
                </Alert>
            )}

            <Paper
                elevation={0}
                sx={(theme) => ({
                    overflow: "hidden",
                    bgcolor: alpha(theme.palette.background.paper, theme.custom?.glass?.surfaceAlpha ?? 0.82),
                    backdropFilter: `blur(${theme.custom?.glass?.blur ?? 18}px)`,
                    border: `1px solid ${alpha(theme.palette.common.white, theme.custom?.glass?.borderAlpha ?? 0.14)}`,
                    boxShadow: theme.custom?.glass?.shadow,
                })}
            >
                {/* Progress bar decoration */}
                <Box sx={{ height: 4, background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }} />

                {!formReady ? (
                    <Box sx={{ p: { xs: 3, sm: 5 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 3 }}>
                            <CircularProgress size={18} />
                            <Typography variant="body2" color="text.secondary">
                                Preparing your form...
                            </Typography>
                        </Box>
                        <Skeleton variant="rounded" height={36} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={36} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={36} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" height={42} width={180} sx={{ ml: "auto" }} />
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: { xs: 3, sm: 5 } }}>
                        {/* Step 1: Your Details */}
                        <StepSection number="1" icon={<PersonIcon />} title="Your Details">
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} required />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleEmailBlur} error={!!errors.email} helperText={errors.email} required />
                                </Grid>
                            </Grid>
                        </StepSection>

                        {/* Step 2: Complaint Details */}
                        <StepSection number="2" icon={<InventoryIcon />} title="Complaint Details">
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label="Product" name="product_id" value={form.product_id} onChange={handleChange} error={!!errors.product_id} helperText={errors.product_id || "Which product is this about?"} required>
                                        {products.map((p) => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label="Complaint Type" name="complaint_type_id" value={form.complaint_type_id} onChange={handleChange} error={!!errors.complaint_type_id} helperText={errors.complaint_type_id} required>
                                        {complaintTypes.map((t) => (
                                            <MenuItem key={t.id} value={t.id}>
                                                {t.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </StepSection>

                        {/* Step 3: Description */}
                        <StepSection number="3" icon={<DescriptionIcon />} title="Describe Your Issue">
                            <TextField
                                label="Tell us what happened"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                error={!!errors.description}
                                helperText={errors.description || "Include model number, when it happened, steps to reproduce, etc."}
                                multiline
                                minRows={5}
                                required
                            />
                        </StepSection>

                        {/* Submit */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                pt: 1,
                                borderTop: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <Button type="submit" variant="contained" size="large" disabled={submitting} startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null} sx={{ px: 6, py: 1.5, fontSize: "1rem" }}>
                                {submitting ? "Submitting…" : "Submit Case"}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
