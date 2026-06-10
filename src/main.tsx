
  import { createRoot } from "react-dom/client";
  import { SplashScreen } from "@capacitor/splash-screen";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);

  // Hide the native splash screen once React has mounted.
  // The splash stays visible until this call (launchAutoHide: false in config)
  // to prevent a white flash during hydration.
  SplashScreen.hide();