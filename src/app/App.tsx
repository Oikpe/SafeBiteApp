import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "sonner";

function ViewportFix() {
  useEffect(() => {
    // Ensure viewport-fit=cover for iOS safe area support (Dynamic Island, home indicator)
    let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (meta) {
      if (!meta.content.includes("viewport-fit=cover")) {
        meta.content = meta.content.replace(/,?\s*viewport-fit=\w+/, "") + ", viewport-fit=cover";
      }
    } else {
      meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1.0, viewport-fit=cover";
      document.head.appendChild(meta);
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ViewportFix />
        <Toaster position="top-center" richColors theme="system" />
        <RouterProvider router={router} />
      </AppProvider>
    </AuthProvider>
  );
}