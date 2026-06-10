import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { STORAGE_KEYS } from "../utils/storage";
import { ThemeProvider } from "@mui/material/styles";
import { ACTIVE_THEME_PRESET, THEME_PRESETS } from "../themePresets.local";
import { createAppTheme } from "../theme";

const ThemeContext = createContext(null);

function resolveInitialPreset() {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME_PRESET);
    if (stored && THEME_PRESETS[stored]) return stored;
    return ACTIVE_THEME_PRESET;
}

export function AppThemeProvider({ children }) {
    const [themePreset, setThemePreset] = useState(resolveInitialPreset);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.THEME_PRESET, themePreset);
    }, [themePreset]);

    const theme = useMemo(() => createAppTheme(themePreset), [themePreset]);

    const value = useMemo(
        () => ({
            themePreset,
            setThemePreset,
            availablePresets: Object.keys(THEME_PRESETS),
        }),
        [themePreset],
    );

    return (
        <ThemeContext.Provider value={value}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useAppTheme() {
    return useContext(ThemeContext);
}
