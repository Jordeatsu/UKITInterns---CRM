import { createTheme, alpha } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1565C0",
            light: "#1976D2",
            dark: "#0D47A1",
            contrastText: "#fff",
        },
        secondary: {
            main: "#00897B",
            contrastText: "#fff",
        },
        success: {
            main: "#2E7D32",
            light: "#4CAF50",
        },
        background: {
            default: "#F0F4F8",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#1A2027",
            secondary: "#546E7A",
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h4: { fontWeight: 700, letterSpacing: "-0.5px" },
        h5: { fontWeight: 700, letterSpacing: "-0.3px" },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 600 },
        button: { fontWeight: 600, textTransform: "none" },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        "none",
        "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "0 3px 6px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)",
        "0 6px 16px rgba(0,0,0,0.10), 0 3px 6px rgba(0,0,0,0.06)",
        "0 10px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
        "0 14px 32px rgba(0,0,0,0.14), 0 5px 10px rgba(0,0,0,0.07)",
        ...Array(19).fill("0 20px 40px rgba(0,0,0,0.16)"),
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "10px 24px",
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "all 0.2s ease",
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                    boxShadow: "0 4px 14px rgba(21,101,192,0.35)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
                        boxShadow: "0 6px 20px rgba(21,101,192,0.45)",
                        transform: "translateY(-1px)",
                    },
                },
                outlinedPrimary: {
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                fullWidth: true,
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        backgroundColor: "#FAFBFC",
                        transition: "background 0.2s",
                        "&:hover": { backgroundColor: "#F5F7FA" },
                        "&.Mui-focused": { backgroundColor: "#fff" },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
                outlined: {
                    borderColor: "#E2E8F0",
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: "#E2E8F0",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;
