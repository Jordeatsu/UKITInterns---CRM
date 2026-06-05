import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

/**
 * Confirmation screen metadata shown under "What happens next?".
 *
 * @type {{icon: import("react").ReactNode, text: string}[]}
 */
const STEPS = [
    { icon: <EmailIcon fontSize="small" />, text: "You will receive an email confirmation shortly." },
    { icon: <AssignmentIndIcon fontSize="small" />, text: "An advisor will be assigned to review your case." },
    { icon: <AccessTimeIcon fontSize="small" />, text: "We aim to respond within 2 business days." },
];

/**
 * Consumer confirmation page displayed after a successful case submission.
 *
 * Reads submission data from router state, shows the generated reference number,
 * and provides the next-step guidance for the customer.
 *
 * @returns {JSX.Element}
 */
export default function Confirmation() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    if (!state?.referenceNumber) {
        return (
            <Box textAlign="center" py={8}>
                <Typography variant="h6" gutterBottom>
                    No case found.
                </Typography>
                <Button variant="contained" component={Link} to="/submit">
                    Submit a Case
                </Button>
            </Box>
        );
    }

    const { referenceNumber, subject, productName } = state;

    /**
     * Copies the case reference number to clipboard and shows temporary feedback.
     *
     * @returns {void}
     */
    function handleCopy() {
        navigator.clipboard.writeText(referenceNumber).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <Box>
            <Paper elevation={3} sx={{ overflow: "hidden" }}>
                {/* Green success header */}
                <Box
                    sx={{
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.secondary.main} 52%, ${theme.palette.primary.main} 100%)`,
                        color: "white",
                        textAlign: "center",
                        py: 5,
                        px: 3,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: -30,
                            left: -30,
                            width: 140,
                            height: 140,
                            borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.06)",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: -40,
                            right: -20,
                            width: 180,
                            height: 180,
                            borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.06)",
                        }}
                    />
                    <CheckCircleIcon sx={{ fontSize: 72, mb: 1.5, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }} />
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Case Submitted Successfully
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 460, mx: "auto" }}>
                        Thank you for getting in touch. Your case has been logged and a member of our support team will review it shortly.
                    </Typography>
                </Box>

                <Box sx={{ px: { xs: 3, sm: 6 }, py: 4 }}>
                    {/* Reference number */}
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Typography variant="body2" color="text.secondary" mb={1.5}>
                            Your reference number — keep this safe to track your case
                        </Typography>
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1.5,
                                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.10)} 0%, ${alpha(theme.palette.secondary.main, 0.12)} 100%)`,
                                border: "2px dashed",
                                borderColor: "primary.main",
                                borderRadius: 3,
                                px: 4,
                                py: 2,
                            }}
                        >
                            <Typography variant="h5" fontWeight={700} color="primary.dark" letterSpacing={2} fontFamily="monospace">
                                {referenceNumber}
                            </Typography>
                            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                                <IconButton
                                    size="small"
                                    onClick={handleCopy}
                                    sx={{
                                        bgcolor: copied ? "success.light" : "primary.main",
                                        color: "white",
                                        width: 30,
                                        height: 30,
                                        "&:hover": { bgcolor: copied ? "success.main" : "primary.dark" },
                                    }}
                                >
                                    {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Case summary */}
                    {(subject || productName) && (
                        <Box
                            sx={{
                                bgcolor: (theme) => alpha(theme.palette.background.default, 0.75),
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                px: 3,
                                py: 2,
                                mb: 4,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" fontWeight={600} mb={0.5}>
                                Case Summary
                            </Typography>
                            {productName && (
                                <Typography variant="body2">
                                    Product: <strong>{productName}</strong>
                                </Typography>
                            )}
                            {subject && (
                                <Typography variant="body2" mt={0.5}>
                                    Subject: <strong>{subject}</strong>
                                </Typography>
                            )}
                        </Box>
                    )}

                    <Divider sx={{ mb: 3 }} />

                    {/* What happens next */}
                    <Typography variant="h6" gutterBottom>
                        What happens next?
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
                        {STEPS.map(({ icon, text }, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    bgcolor: (theme) => alpha(theme.palette.background.default, 0.75),
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    px: 2.5,
                                    py: 1.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        color: "primary.main",
                                        display: "flex",
                                        bgcolor: "primary.main",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: 32,
                                        height: 32,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    {icon}
                                </Box>
                                <Typography variant="body2">{text}</Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Button variant="outlined" startIcon={<AddCircleOutlinedIcon />} onClick={() => navigate("/submit")} sx={{ flexGrow: { xs: 1, sm: 0 } }}>
                            Submit Another Case
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
