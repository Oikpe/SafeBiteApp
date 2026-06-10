

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import type { Database } from "../types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;


if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
    console.warn(
        "[SafeBite] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
        "Backend features will not work. Set them in your .env file."
    );
}

// On native platforms, use Capacitor Preferences for reliable session storage
const NativeStorage = {
    getItem: async (key: string): Promise<string | null> => {
        const { value } = await Preferences.get({ key });
        return value;
    },
    setItem: async (key: string, value: string): Promise<void> => {
        await Preferences.set({ key, value });
    },
    removeItem: async (key: string): Promise<void> => {
        await Preferences.remove({ key });
    },
};

const storageAdapter = Capacitor.isNativePlatform()
    ? NativeStorage
    : undefined;


export const supabase: SupabaseClient<Database> = createClient<Database>(
    supabaseUrl ?? "",
    supabaseAnonKey ?? "",
    {
        auth: {
            // Use native storage on mobile
            ...(storageAdapter ? { storage: storageAdapter } : {}),
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,

            flowType: "pkce",

            storageKey: "safebite-auth",
        },

        global: {
            headers: {
                "x-client-info": "safebite-app",
            },
        },
    }
);
