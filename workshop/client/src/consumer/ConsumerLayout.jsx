import { Outlet, Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function ConsumerLayout() {
    const { pathname } = useLocation();

    const navBtn = (to, label) => {
        const active = to === "/submit" ? pathname.startsWith("/submit") : pathname === to;
        return (
            <Button
                component={Link}
                to={to}
                sx={{
                    color: "white",
                    fontWeight: active ? 700 : 400,
                    opacity: active ? 1 : 0.75,
                    borderBottom: active ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent",
                    borderRadius: 0,
                    px: 2,
                    py: 2.5,
                    "&:hover": { opacity: 1, backgroundColor: "rgba(255,255,255,0.08)" },
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
                backgroundImage: [
                    "radial-gradient(ellipse 90% 55% at 12% 20%, rgba(29,78,216,0.22) 0%, transparent 65%)",
                    "radial-gradient(ellipse 70% 50% at 88% 78%, rgba(0,137,123,0.17) 0%, transparent 60%)",
                    "radial-gradient(ellipse 55% 65% at 62% 2%, rgba(99,102,241,0.13) 0%, transparent 55%)",
                    "radial-gradient(ellipse 40% 35% at 40% 95%, rgba(21,101,192,0.10) 0%, transparent 50%)",
                    "linear-gradient(160deg, #060D1F 0%, #0A1628 55%, #0C1D30 100%)",
                ].join(", "),
            }}
        >
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: "rgba(6,13,31,0.70)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
                }}
            >
                <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}></Box>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        {navBtn("/submit", "Submit a Case")}
                        {/* <Button
              component={Link}
              to="/advisor/login"
              variant="outlined"
              size="small"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                borderColor: 'rgba(255,255,255,0.2)',
                ml: 1.5,
                alignSelf: 'center',
                borderRadius: 2,
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.6)',
                  bgcolor: 'rgba(255,255,255,0.06)',
                  color: 'white',
                },
              }}
            >
              Advisor Login
            </Button> */}
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
