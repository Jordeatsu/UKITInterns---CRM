import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ConsumerLayout from "./consumer/ConsumerLayout";
import SubmitCase from "./consumer/SubmitCase";
import Confirmation from "./consumer/Confirmation";
import Login from "./advisor/Login";
import AdvisorLayout from "./advisor/AdvisorLayout";
import Dashboard from "./advisor/Dashboard";
import CaseDetail from "./advisor/CaseDetail";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/advisor/login" replace />;
}

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
                <Route
                    path="/advisor"
                    element={
                        <ProtectedRoute>
                            <AdvisorLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="cases/:id" element={<CaseDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
