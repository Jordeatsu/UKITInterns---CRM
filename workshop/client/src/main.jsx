import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AppThemeProvider } from "./context/ThemeContext";

/**
 * Client application bootstrap entry point.
 *
 * Mounts the React app into the DOM and wraps it with global providers:
 * MUI theme, CSS baseline reset, and authentication context.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppThemeProvider>
            <CssBaseline />
            <AuthProvider>
                <App />
            </AuthProvider>
        </AppThemeProvider>
    </React.StrictMode>,
);
