import { lazy, Suspense, type ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { OnboardingGuard, ProtectedRoute, AuthGuard, PublicRoute } from "./components/RouteGuards";

const Onboarding = lazy(() => import("./pages/Onboarding"));
const SetupMode = lazy(() => import("./pages/SetupMode"));
const AllergySetup = lazy(() => import("./pages/AllergySetup"));
const Home = lazy(() => import("./pages/Home"));
const Scan = lazy(() => import("./pages/Scan"));
const Results = lazy(() => import("./pages/Results"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const FamilyMemberDetail = lazy(() => import("./pages/FamilyMemberDetail"));
const History = lazy(() => import("./pages/History"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));


function PageLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div
        className="w-8 h-8 rounded-full border-[3px] border-t-transparent animate-spin"
        style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
      />
    </div>
  );
}

function withSuspense(LazyComponent: ComponentType) {
  return function SuspenseWrapper() {
    return (
      <Suspense fallback={<PageLoader />}>
        <LazyComponent />
      </Suspense>
    );
  };
}

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      // Public auth pages
      {
        Component: PublicRoute,
        children: [
          { path: "/login", Component: withSuspense(Login) },
          { path: "/signup", Component: withSuspense(Signup) },
          { path: "/forgot-password", Component: withSuspense(ForgotPassword) },
        ],
      },

      { path: "/reset-password", Component: withSuspense(ResetPassword) },

      {
        Component: AuthGuard,
        children: [

          {
            Component: OnboardingGuard,
            children: [
              { path: "/", Component: withSuspense(Onboarding) },
              { path: "/setup-mode", Component: withSuspense(SetupMode) },
              { path: "/allergy-setup", Component: withSuspense(AllergySetup) },
            ],
          },

          {
            Component: ProtectedRoute,
            children: [
              { path: "/home", Component: withSuspense(Home) },
              { path: "/scan", Component: withSuspense(Scan) },
              { path: "/results", Component: withSuspense(Results) },
              { path: "/profile", Component: withSuspense(Profile) },
              { path: "/profile/edit", Component: withSuspense(ProfileEdit) },
              { path: "/profile/family/:id", Component: withSuspense(FamilyMemberDetail) },
              { path: "/history", Component: withSuspense(History) },
            ],
          },
        ],
      },
    ],
  },
]);
