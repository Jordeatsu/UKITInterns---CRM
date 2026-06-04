import { createContext, useContext, useState, useCallback } from "react";

/**
 * Authentication context for advisor session state.
 *
 * Stores token/advisor profile and exposes login/logout helpers.
 */
const AuthContext = createContext(null);

/**
 * Provides auth state and actions to all descendant components.
 *
 * Persists advisor auth values in localStorage to survive page reloads.
 *
 * @param {{children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("advisor_token"));
    const [advisor, setAdvisor] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("advisor_user"));
        } catch {
            return null;
        }
    });

    /**
     * Saves a successful login session in memory and localStorage.
     *
     * @param {string} newToken
     * @param {object} advisorData
     * @returns {void}
     */
    const login = useCallback((newToken, advisorData) => {
        localStorage.setItem("advisor_token", newToken);
        localStorage.setItem("advisor_user", JSON.stringify(advisorData));
        setToken(newToken);
        setAdvisor(advisorData);
    }, []);

    /**
     * Clears the current advisor session from memory and localStorage.
     *
     * @returns {void}
     */
    const logout = useCallback(() => {
        localStorage.removeItem("advisor_token");
        localStorage.removeItem("advisor_user");
        setToken(null);
        setAdvisor(null);
    }, []);

    return <AuthContext.Provider value={{ token, advisor, isAuthenticated: !!token, login, logout }}>{children}</AuthContext.Provider>;
}

/**
 * Hook for consuming advisor authentication context.
 *
 * @returns {{token: string | null, advisor: object | null, isAuthenticated: boolean, login: (newToken: string, advisorData: object) => void, logout: () => void}}
 */
export function useAuth() {
    return useContext(AuthContext);
}
