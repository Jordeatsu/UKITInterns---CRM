import { Outlet, Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { alpha } from "@mui/material/styles";

/**
 * Public-facing shell for consumer pages.
 *
 * Provides shared navigation, page background styling, and an Outlet where
 * consumer routes (submit form, confirmation, etc.) are rendered.
 *
 * @returns {JSX.Element}
 */
export default function ConsumerLayout() {
    const { pathname } = useLocation();

    /**
     * Builds a single top-navigation button and highlights it when active.
     *
     * @param {string} to - Route destination.
     * @param {string} label - Text shown on the button.
     * @returns {JSX.Element}
     */
    const navBtn = (to, label) => {
        const active = to === "/submit" ? pathname.startsWith("/submit") : pathname === to;
        return (
            <Button
                component={Link}
                to={to}
                sx={{
                    color: "common.white",
                    fontWeight: active ? 700 : 400,
                    opacity: active ? 1 : 0.75,
                    borderBottom: active ? (theme) => `2px solid ${alpha(theme.palette.common.white, 0.9)}` : "2px solid transparent",
                    borderRadius: 0,
                    px: 2,
                    py: 2.5,
                    "&:hover": { opacity: 1, backgroundColor: (theme) => alpha(theme.palette.common.white, 0.08) },
                }}
            >
                {label}
            </Button>
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundImage: (theme) =>
                    [
                        `radial-gradient(ellipse 90% 55% at 12% 20%, ${alpha(theme.palette.primary.main, 0.22)} 0%, transparent 65%)`,
                        `radial-gradient(ellipse 70% 50% at 88% 78%, ${alpha(theme.palette.secondary.main, 0.17)} 0%, transparent 60%)`,
                        `radial-gradient(ellipse 55% 65% at 62% 2%, ${alpha(theme.palette.primary.light, 0.15)} 0%, transparent 55%)`,
                        `radial-gradient(ellipse 40% 35% at 40% 95%, ${alpha(theme.palette.secondary.main, 0.10)} 0%, transparent 50%)`,
                        `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.secondary.main} 100%)`,
                    ].join(", "),
            }}
        >
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: (theme) => alpha(theme.palette.primary.dark, 0.66),
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    borderBottom: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.07)}`,
                    boxShadow: (theme) => `0 1px 0 ${alpha(theme.palette.common.white, 0.04)}`,
                }}
            >
                <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}></Box>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        {navBtn("/submit", "Submit a Case")}
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, py: 5 }}>
                <Container maxWidth="md">
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}
