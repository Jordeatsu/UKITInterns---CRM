import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../context/AuthContext";

const SIDEBAR_W = 256;

const NAV_ITEMS = [{ label: "Dashboard", icon: <DashboardIcon fontSize="small" />, to: "/advisor/dashboard" }];

export default function AdvisorLayout() {
    const { advisor, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/advisor/login", { replace: true });
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Box
                component="nav"
                sx={{
                    width: SIDEBAR_W,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    backgroundImage: "linear-gradient(180deg, #060D1F 0%, #0A1628 60%, #0C1D30 100%)",
                    borderRight: "1px solid rgba(255,255,255,0.07)",
                }}
            >
                {/* Brand */}
                <Box sx={{ px: 3, pt: 3, pb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            backgroundImage: "linear-gradient(135deg, #1565C0 0%, #00897B 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <SupportAgentIcon sx={{ color: "#fff", fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ color: "#fff", lineHeight: 1.2 }}>
                            CRM Portal
                        </Typography>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)", lineHeight: 1 }}>
                            Advisor
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mx: 2 }} />

                {/* Nav items */}
                <Box sx={{ px: 1.5, pt: 2, flexGrow: 1 }}>
                    {NAV_ITEMS.map(({ label, icon, to }) => (
                        <NavLink key={to} to={to} style={{ textDecoration: "none" }}>
                            {({ isActive }) => (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        px: 2,
                                        py: 1.25,
                                        borderRadius: 2,
                                        mb: 0.5,
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                        backgroundColor: isActive ? "rgba(21,101,192,0.22)" : "transparent",
                                        border: isActive ? "1px solid rgba(21,101,192,0.35)" : "1px solid transparent",
                                        color: isActive ? "#90CAF9" : "rgba(255,255,255,0.55)",
                                        "&:hover": {
                                            backgroundColor: isActive ? "rgba(21,101,192,0.22)" : "rgba(255,255,255,0.06)",
                                            color: isActive ? "#90CAF9" : "rgba(255,255,255,0.85)",
                                        },
                                    }}
                                >
                                    <Box sx={{ display: "flex", color: "inherit" }}>{icon}</Box>
                                    <Typography variant="body2" fontWeight={isActive ? 600 : 400} sx={{ color: "inherit" }}>
                                        {label}
                                    </Typography>
                                </Box>
                            )}
                        </NavLink>
                    ))}
                </Box>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mx: 2 }} />

                {/* Advisor info + logout */}
                <Box sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.10)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <PersonIcon sx={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }} />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.3 }}>
                            {advisor?.name || "Advisor"}
                        </Typography>
                        <Typography variant="caption" noWrap sx={{ color: "rgba(255,255,255,0.38)", lineHeight: 1 }}>
                            {advisor?.email || ""}
                        </Typography>
                    </Box>
                    <Tooltip title="Sign out">
                        <IconButton onClick={handleLogout} size="small" sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#ef5350" } }}>
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, bgcolor: "#F4F6F9", minHeight: "100vh", overflow: "auto" }}>
                <Outlet />
            </Box>
        </Box>
    );
}
