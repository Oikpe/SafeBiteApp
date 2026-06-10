

import { supabase } from "./supabaseClient";
import type { Session, User, AuthError, Subscription } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";
import {
    sanitizeEmail,
    sanitizeDisplayName,
    validatePassword,
} from "../utils/sanitize";



function sanitizeAuthError(error: AuthError): AuthError {
    const msg = error.message?.toLowerCase() ?? "";

    // Rate limiting
    if (error.status === 429 || msg.includes("rate limit")) {
        return {
            ...error,
            message: "Too many requests. Please wait a moment and try again.",
        } as AuthError;
    }

    // SMTP / email service failures
    if (
        error.status === 504 ||
        msg.includes("gateway timeout") ||
        msg.includes("timeout") ||
        msg.includes("smtp")
    ) {
        return {
            ...error,
            message:
                "Email service is temporarily unavailable. " +
                "Please try again later or contact support.",
        } as AuthError;
    }

    // Known safe user-facing messages (pass through)
    const safePatterns = [
        "invalid login credentials",
        "email not confirmed",
        "user already registered",
        "password should be at least",
        "unable to validate email",
        "signup requires a valid password",
    ];
    if (safePatterns.some((p) => msg.includes(p))) {
        return error;
    }

    // Default: replace with generic message to prevent info leakage
    return {
        ...error,
        message: "An error occurred. Please try again.",
    } as AuthError;
}



export interface AuthResult {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}



export const authService = {
    async signUp(
        email: string,
        password: string,
        displayName: string
    ): Promise<AuthResult> {
        try {
            const cleanEmail = sanitizeEmail(email);
            const cleanName = sanitizeDisplayName(displayName);
            const pwCheck = validatePassword(password);
            if (!pwCheck.valid) {
                return {
                    user: null,
                    session: null,
                    error: {
                        message: pwCheck.error!,
                        status: 400,
                        name: "AuthApiError",
                    } as AuthError,
                };
            }

            const redirectUrl = Capacitor.isNativePlatform()
                ? "safebite://login"
                : `${window.location.origin}/login`;

            const { data, error } = await supabase.auth.signUp({
                email: cleanEmail,
                password,
                options: {
                    data: { display_name: cleanName },
                    emailRedirectTo: redirectUrl,
                },
            });

            if (error) {
                return {
                    user: null,
                    session: null,
                    error: sanitizeAuthError(error),
                };
            }

            return { user: data.user, session: data.session, error };
        } catch (err) {
            const message =
                err instanceof Error && err.message === "Invalid email format"
                    ? "Please enter a valid email address."
                    : "An unexpected error occurred. Please check your connection and try again.";

            return {
                user: null,
                session: null,
                error: { message, status: 500, name: "AuthApiError" } as AuthError,
            };
        }
    },

    async signIn(email: string, password: string): Promise<AuthResult> {
        try {
            const cleanEmail = sanitizeEmail(email);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
            });
            return {
                user: data.user,
                session: data.session,
                error: error ? sanitizeAuthError(error) : null,
            };
        } catch {
            return {
                user: null,
                session: null,
                error: {
                    message: "Please enter a valid email address.",
                    status: 400,
                    name: "AuthApiError",
                } as AuthError,
            };
        }
    },

    async signOut(): Promise<{ error: AuthError | null }> {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    async getSession(): Promise<{
        session: Session | null;
        error: AuthError | null;
    }> {
        const { data, error } = await supabase.auth.getSession();
        return { session: data.session, error };
    },

    async getUser(): Promise<{ user: User | null; error: AuthError | null }> {
        const { data, error } = await supabase.auth.getUser();
        return { user: data.user, error };
    },

    onAuthStateChange(
        callback: (event: string, session: Session | null) => void
    ): Subscription {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
        return data.subscription;
    },

    async resetPassword(email: string): Promise<{ error: AuthError | null }> {
        try {
            const cleanEmail = sanitizeEmail(email);
            const redirectUrl = Capacitor.isNativePlatform()
                ? "safebite://reset-password"
                : `${window.location.origin}/reset-password`;
            const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
                redirectTo: redirectUrl,
            });
            return { error: error ? sanitizeAuthError(error) : null };
        } catch {
            return {
                error: {
                    message: "Please enter a valid email address.",
                    status: 400,
                    name: "AuthApiError",
                } as AuthError,
            };
        }
    },

    async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
        const pwCheck = validatePassword(newPassword);
        if (!pwCheck.valid) {
            return {
                error: {
                    message: pwCheck.error!,
                    status: 400,
                    name: "AuthApiError",
                } as AuthError,
            };
        }
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return { error: error ? sanitizeAuthError(error) : null };
    },

    async resendConfirmationEmail(email: string): Promise<{ error: AuthError | null }> {
        try {
            const cleanEmail = sanitizeEmail(email);
            const redirectUrl = Capacitor.isNativePlatform()
                ? "safebite://login"
                : `${window.location.origin}/login`;
            const { error } = await supabase.auth.resend({
                type: "signup",
                email: cleanEmail,
                options: {
                    emailRedirectTo: redirectUrl,
                },
            });
            return { error: error ? sanitizeAuthError(error) : null };
        } catch {
            return {
                error: {
                    message: "Please enter a valid email address.",
                    status: 400,
                    name: "AuthApiError",
                } as AuthError,
            };
        }
    },
};
