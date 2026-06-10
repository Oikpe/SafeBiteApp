import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export function AuthGuard() {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}

export function OnboardingGuard() {
    const { hasCompletedOnboarding, hydrating } = useApp();

    if (hydrating) return null;

    if (hasCompletedOnboarding) return <Navigate to="/home" replace />;
    return <Outlet />;
}

export function ProtectedRoute() {
    const { hasCompletedOnboarding, hydrating } = useApp();

    if (hydrating) return null;

    if (!hasCompletedOnboarding) return <Navigate to="/" replace />;
    return <Outlet />;
}

export function PublicRoute() {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
