/**
 * @file SurfaceCard.jsx
 * @description Provides shared CRM UI behavior in SurfaceCard for advisor and consumer flows.
 */
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";

/**
 * Renders the shared SurfaceCard component used across CRM screens.
 * @returns {JSX.Element}
 */
export default function SurfaceCard({ children, sx = {}, interactive = false, ...props }) {
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.primary.main, theme.custom?.card?.borderAlpha ?? 0.11),
                backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                ...(interactive && {
                    "&:hover": {
                        transform: (theme) => theme.custom?.card?.hoverLift ?? "translateY(-2px)",
                        boxShadow: (theme) => theme.custom?.card?.hoverShadow,
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.24),
                    },
                }),
                ...sx,
            }}
            {...props}
        >
            {children}
        </Paper>
    );
}
