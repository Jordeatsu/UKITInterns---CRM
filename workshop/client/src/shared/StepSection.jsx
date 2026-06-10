import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

/**
 * Reusable numbered step section for multi-step forms.
 *
 * @param {{number: number, icon: import("react").ReactNode, title: string, children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
export default function StepSection({ number, icon, title, children }) {
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
