import { createTheme, alpha } from "@mui/material/styles";

/**
 * Named colour palette presets for the application theme.
 *
 * Switch the active theme by changing ACTIVE_THEME_PRESET to one of:
 * "canyonSage" | "forestSand" | "charcoalAmber" | "coralOlive" | "monochromeSlate"
 * "midnightPurple" | "oceanTeal" | "rosewoodGold" | "slateIndigo" | "mintChocolate" | "blushBerry"
 * "midwestHarvest" | "alpineMist" | "sunsetMesa" | "metroSlate"
 */
const THEME_PRESETS = {
    canyonSage: {
        primary: { main: "#8C3A2B", light: "#A84B39", dark: "#6E2D22", contrastText: "#fff" },
        secondary: { main: "#2F6F62", contrastText: "#fff" },
        success: { main: "#4E7A3E", light: "#6E9658" },
        background: { default: "#F6F1EB", paper: "#FFFCF8" },
        text: { primary: "#2D221C", secondary: "#6A5B50" },
        divider: "#E9DED3",
    },
    forestSand: {
        primary: { main: "#2E5F4F", light: "#3A7562", dark: "#21463A", contrastText: "#fff" },
        secondary: { main: "#BA7A36", contrastText: "#fff" },
        success: { main: "#3F7A43", light: "#5C9A63" },
        background: { default: "#F2EFE7", paper: "#FCFAF5" },
        text: { primary: "#1F2924", secondary: "#5E655F" },
        divider: "#D8D2C4",
    },
    charcoalAmber: {
        primary: { main: "#3A3A3A", light: "#505050", dark: "#262626", contrastText: "#fff" },
        secondary: { main: "#C06A2C", contrastText: "#fff" },
        success: { main: "#4B7A45", light: "#679D63" },
        background: { default: "#EEEAE4", paper: "#FBF8F3" },
        text: { primary: "#1E1B18", secondary: "#61574F" },
        divider: "#D9D1C7",
    },
    coralOlive: {
        primary: { main: "#B44B3A", light: "#CB614D", dark: "#8E3A2E", contrastText: "#fff" },
        secondary: { main: "#5E6D3C", contrastText: "#fff" },
        success: { main: "#4E7D4A", light: "#6B9B65" },
        background: { default: "#F7EFE8", paper: "#FFFCF7" },
        text: { primary: "#31221D", secondary: "#6E5D53" },
        divider: "#E8D9CD",
    },
    monochromeSlate: {
        primary: { main: "#2F2F2F", light: "#4A4A4A", dark: "#121212", contrastText: "#FFFFFF" },
        secondary: { main: "#6E6E6E", contrastText: "#FFFFFF" },
        success: { main: "#5D5D5D", light: "#7C7C7C" },
        background: { default: "#EDEDED", paper: "#FFFFFF" },
        text: { primary: "#121212", secondary: "#4F4F4F" },
        divider: "#D0D0D0",
    },
    midnightPurple: {
        primary: { main: "#4A1A6B", light: "#6B2E99", dark: "#2E0F44", contrastText: "#FFFFFF" },
        secondary: { main: "#B8860B", contrastText: "#FFFFFF" },
        success: { main: "#3A7A4A", light: "#56A066" },
        background: { default: "#F2EDF7", paper: "#FBF8FE" },
        text: { primary: "#1A0A2E", secondary: "#5E4A72" },
        divider: "#DDD0EA",
    },
    oceanTeal: {
        primary: { main: "#1A6B6B", light: "#2A8A8A", dark: "#0D4444", contrastText: "#FFFFFF" },
        secondary: { main: "#D4694A", contrastText: "#FFFFFF" },
        success: { main: "#3A7A55", light: "#569970" },
        background: { default: "#E8F4F4", paper: "#F5FAFA" },
        text: { primary: "#0D2E2E", secondary: "#4A6A6A" },
        divider: "#C4DEDE",
    },
    rosewoodGold: {
        primary: { main: "#7B2D3E", light: "#9A3A4F", dark: "#5C2030", contrastText: "#FFFFFF" },
        secondary: { main: "#C4943A", contrastText: "#FFFFFF" },
        success: { main: "#4A7A44", light: "#679960" },
        background: { default: "#F7EEEE", paper: "#FFF8F8" },
        text: { primary: "#2E1018", secondary: "#6A4A50" },
        divider: "#EAD5D8",
    },
    slateIndigo: {
        primary: { main: "#3D4A7A", light: "#5260A0", dark: "#2A3460", contrastText: "#FFFFFF" },
        secondary: { main: "#C07830", contrastText: "#FFFFFF" },
        success: { main: "#447A50", light: "#609968" },
        background: { default: "#ECEEF5", paper: "#F8F9FD" },
        text: { primary: "#1A1E30", secondary: "#505A7A" },
        divider: "#D0D4E8",
    },
    mintChocolate: {
        primary: { main: "#4A2E20", light: "#6A4030", dark: "#2E1A10", contrastText: "#FFFFFF" },
        secondary: { main: "#2E8A6A", contrastText: "#FFFFFF" },
        success: { main: "#3A7A5A", light: "#569978" },
        background: { default: "#F0EDE8", paper: "#FBF9F7" },
        text: { primary: "#1E100A", secondary: "#5E4A3A" },
        divider: "#DDD5CC",
    },
    blushBerry: {
        primary: { main: "#C43D7A", light: "#DB5C95", dark: "#9B2E61", contrastText: "#FFFFFF" },
        secondary: { main: "#7A3EC4", contrastText: "#FFFFFF" },
        success: { main: "#3E8A6E", light: "#5AA98A" },
        background: { default: "#FBEFF5", paper: "#FFF8FC" },
        text: { primary: "#3A1A2B", secondary: "#7A5A6B" },
        divider: "#EBCFDE",
    },
    midwestHarvest: {
        primary: { main: "#8B5A2B", light: "#A8733A", dark: "#6A4320", contrastText: "#FFFFFF" },
        secondary: { main: "#5E7A2F", contrastText: "#FFFFFF" },
        success: { main: "#4A7F44", light: "#66A45F" },
        background: { default: "#F7F2E8", paper: "#FFFDF8" },
        text: { primary: "#2F2418", secondary: "#6B5C4A" },
        divider: "#E3D7C4",
    },
    alpineMist: {
        primary: { main: "#3D6E7A", light: "#5290A0", dark: "#2B4F59", contrastText: "#FFFFFF" },
        secondary: { main: "#7A5C3D", contrastText: "#FFFFFF" },
        success: { main: "#3F7A5C", light: "#5A9A78" },
        background: { default: "#ECF3F5", paper: "#F8FCFD" },
        text: { primary: "#162A30", secondary: "#4E6770" },
        divider: "#CCDBDF",
    },
    sunsetMesa: {
        primary: { main: "#C45A3D", light: "#DB7454", dark: "#9B442D", contrastText: "#FFFFFF" },
        secondary: { main: "#7A3F5E", contrastText: "#FFFFFF" },
        success: { main: "#4D7A46", light: "#6B9D63" },
        background: { default: "#FAEFEA", paper: "#FFF8F4" },
        text: { primary: "#341D16", secondary: "#73554A" },
        divider: "#EDD4C9",
    },
    metroSlate: {
        primary: { main: "#44515C", light: "#5E6D7A", dark: "#2F3840", contrastText: "#FFFFFF" },
        secondary: { main: "#8A6A3D", contrastText: "#FFFFFF" },
        success: { main: "#4A7A62", light: "#67A083" },
        background: { default: "#EEF1F3", paper: "#FAFBFC" },
        text: { primary: "#1A2127", secondary: "#56616B" },
        divider: "#D3DAE0",
    },
};

/** Change this value to switch the active colour theme across the whole app. */
const ACTIVE_THEME_PRESET = "monochromeSlate";
const palette = THEME_PRESETS[ACTIVE_THEME_PRESET] || THEME_PRESETS.canyonSage;

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
