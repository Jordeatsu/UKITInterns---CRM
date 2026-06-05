/**
 * @file PageHeader.jsx
 * @description Provides shared CRM UI behavior in PageHeader for advisor and consumer flows.
 */
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

/**
 * Renders the shared PageHeader component used across CRM screens.
 * @returns {JSX.Element}
 */
export default function PageHeader({ title, subtitle, eyebrow, actions = null, compact = false }) {
    return (
        <Box
            sx={{
                mb: compact ? 2.5 : 3.5,
                p: compact ? 2 : 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.14),
                backgroundImage: (theme) => [`radial-gradient(500px 220px at 95% -25%, ${alpha(theme.palette.secondary.main, 0.18)} 0%, transparent 62%)`, `linear-gradient(140deg, ${alpha(theme.palette.common.white, 0.52)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`].join(", "),
            }}
        >
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ minWidth: 0 }}>
                    {eyebrow && (
                        <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.25 }}>
                            {eyebrow}
                        </Typography>
                    )}
                    <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {actions}
            </Box>
        </Box>
    );
}
