/**
 * @file theme.js
 * @description Builds the Material UI theme from the active local theme preset.
 */
import { createTheme, alpha } from "@mui/material/styles";
import { THEME_PRESETS, ACTIVE_THEME_PRESET } from "./themePresets.local";

const palette = THEME_PRESETS[ACTIVE_THEME_PRESET] || THEME_PRESETS.monochromeSlate;

const theme = createTheme({
    palette: {
        primary: palette.primary,
        secondary: palette.secondary,
        success: palette.success,
        background: palette.background,
        text: palette.text,
        divider: palette.divider,
        info: {
            main: palette.secondary.main,
            contrastText: "#fff",
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h3: { fontWeight: 700, letterSpacing: "-0.6px" },
        h4: { fontWeight: 700, letterSpacing: "-0.5px" },
        h5: { fontWeight: 700, letterSpacing: "-0.3px" },
        h6: { fontWeight: 600 },
        body1: { lineHeight: 1.65 },
        body2: { lineHeight: 1.6 },
        caption: { letterSpacing: "0.02em" },
        overline: { letterSpacing: "0.08em", fontWeight: 700, fontSize: "0.68rem" },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600, letterSpacing: "0.01em" },
        button: { fontWeight: 600, textTransform: "none" },
    },
    custom: {
        glass: {
            blur: 18,
            borderAlpha: 0.14,
            surfaceAlpha: 0.82,
            shadow: "0 26px 60px rgba(0,0,0,0.42), 0 8px 22px rgba(0,0,0,0.24), 0 1px 0 rgba(255,255,255,0.08) inset",
        },
        card: {
            borderAlpha: 0.11,
            hoverLift: "translateY(-2px)",
            hoverShadow: "0 14px 28px rgba(0,0,0,0.12), 0 5px 10px rgba(0,0,0,0.08)",
        },
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
                    background: `linear-gradient(135deg, ${palette.primary.light} 0%, ${palette.primary.main} 100%)`,
                    boxShadow: `0 4px 14px ${alpha(palette.primary.main, 0.35)}`,
                    "&:hover": {
                        background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
                        boxShadow: `0 6px 20px ${alpha(palette.primary.main, 0.45)}`,
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
                        backgroundColor: alpha(palette.background.paper, 0.92),
                        transition: "background 0.2s",
                        "&:hover": { backgroundColor: palette.background.paper },
                        "&.Mui-focused": { backgroundColor: palette.background.paper },
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
                    borderColor: palette.divider,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: palette.divider,
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
