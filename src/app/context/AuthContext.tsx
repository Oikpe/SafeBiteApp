

import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { authService } from "../services/authService";
import { supabase } from "../services/supabaseClient";
import { router } from "../routes";

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (
        email: string,
        password: string
    ) => Promise<{ error: string | null }>;
    signUp: (
        email: string,
        password: string,
        displayName?: string
    ) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: string | null }>;
    updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
    resendConfirmation: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function initAuth() {
            const { session: existingSession } = await authService.getSession();
            if (isMounted) {
                setSession(existingSession);
                setUser(existingSession?.user ?? null);
                setLoading(false);
            }
        }

        initAuth();

        const subscription = authService.onAuthStateChange((event, newSession) => {
            if (!isMounted) return;

            if (event === "SIGNED_OUT" || event === "USER_DELETED") {
                setSession(null);
                setUser(null);
                setLoading(false);
                return;
            }

            if (event === "TOKEN_REFRESHED" && !newSession) {
                setSession(null);
                setUser(null);
                setLoading(false);
                return;
            }

            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
        });

        function handleVisibilityChange() {
            if (document.visibilityState === "visible" && isMounted) {
                authService.getSession().then(({ session: refreshed }) => {
                    if (isMounted) {
                        setSession(refreshed);
                        setUser(refreshed?.user ?? null);
                    }
                });
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        let deepLinkCleanup: (() => void) | undefined;
        if (Capacitor.isNativePlatform()) {
            const listener = CapApp.addListener("appUrlOpen", async (event) => {
                try {
                    const url = new URL(event.url);
                    const code = url.searchParams.get("code");
                    if (code && isMounted) {
                        await supabase.auth.exchangeCodeForSession(code);
                        if (url.hostname === "reset-password" || url.pathname.includes("reset-password")) {
                            router.navigate("/reset-password");
                        }
                    }
                } catch (err) {
                    console.error("Deep link error:", err);
                }
            });
            deepLinkCleanup = () => { listener.then(h => h.remove()); };
        }

        return () => {
            isMounted = false;
            subscription.unsubscribe();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            deepLinkCleanup?.();
        };
    }, []);

    const signIn = async (
        email: string,
        password: string
    ): Promise<{ error: string | null }> => {
        const { error } = await authService.signIn(email, password);
        if (error) return { error: error.message };
        return { error: null };
    };

    const signUp = async (
        email: string,
        password: string,
        displayName?: string
    ): Promise<{ error: string | null }> => {
        const { error } = await authService.signUp(email, password, displayName ?? "");
        if (error) return { error: error.message };
        return { error: null };
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
        setSession(null);
    };

    const resetPassword = async (
        email: string
    ): Promise<{ error: string | null }> => {
        const { error } = await authService.resetPassword(email);
        if (error) return { error: error.message };
        return { error: null };
    };

    const updatePassword = async (
        newPassword: string
    ): Promise<{ error: string | null }> => {
        const { error } = await authService.updatePassword(newPassword);
        if (error) return { error: error.message };
        return { error: null };
    };

    const resendConfirmation = async (
        email: string
    ): Promise<{ error: string | null }> => {
        const { error } = await authService.resendConfirmationEmail(email);
        if (error) return { error: error.message };
        return { error: null };
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword, updatePassword, resendConfirmation }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
