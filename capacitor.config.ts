import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.safebite.app',
  appName: 'SafeBite',
  webDir: 'dist',
  server: {
    // Use HTTPS scheme — required for Supabase auth and modern APIs.
    // This makes Capacitor serve from https://localhost instead of
    // capacitor://localhost, improving compatibility with OAuth redirects.
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      // Keep splash visible until the app manually hides it
      // (prevents flash of white screen during React hydration)
      launchAutoHide: false,
      backgroundColor: '#0f172a',
    },
    StatusBar: {
      // Match the app's dark header
      style: 'DARK',
      backgroundColor: '#0f172a',
    },
  },
};

export default config;
