import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ConsumerLayout from "./consumer/ConsumerLayout";
import SubmitCase from "./consumer/SubmitCase";
import Confirmation from "./consumer/Confirmation";
import Login from "./advisor/Login";
import AdvisorLayout from "./advisor/AdvisorLayout";
import Dashboard from "./advisor/Dashboard";
import CaseDetail from "./advisor/CaseDetail";
import AdvisorProfile from "./advisor/AdvisorProfile";
import NotFound from "./shared/NotFound";
import { useAuth } from "./context/AuthContext";

/**
 * Route guard for advisor-only pages.
 *
 * Allows rendering child content when authenticated; otherwise redirects to
 * the advisor login page.
 *
 * @param {{children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/advisor/login" replace />;
}

/**
 * Root application router.
 *
 * Defines all consumer and advisor routes, including protected advisor paths,
 * default redirects, and catch-all 404 handling.
 *
 * @returns {JSX.Element}
 */
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/submit" replace />} />
                <Route element={<ConsumerLayout />}>
                    <Route path="/submit" element={<SubmitCase />} />
                    <Route path="/submit/confirmation" element={<Confirmation />} />
                </Route>
                <Route path="/advisor/login" element={<Login />} />
                <Route path="/advisor" element={<ProtectedRoute><AdvisorLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="cases/:id" element={<CaseDetail />} />
                    <Route path="profile/:id" element={<AdvisorProfile />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
