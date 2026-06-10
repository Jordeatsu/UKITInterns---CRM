import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * Reusable heading for card sections in a case detail view.
 *
 * @param {{icon: import("react").ReactNode, children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
export function SectionHeading({ icon, children }) {
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
 * Reusable two-column metadata row for case detail views.
 *
 * @param {{label: string, children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
export function MetaRow({ label, children }) {
    return (
        <Box sx={{ display: "flex", gap: 1, mb: 1.5, alignItems: "flex-start" }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, flexShrink: 0 }}>
                {label}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </Box>
    );
}
