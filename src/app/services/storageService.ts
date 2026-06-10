

import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";


const IS_NATIVE = Capacitor.isNativePlatform();

export const storageService = {

    getSync<T>(key: string, fallback: T): T {
        if (IS_NATIVE) return fallback;
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            return JSON.parse(raw) as T;
        } catch {
            return fallback;
        }
    },


    async getItem(key: string): Promise<string | null> {
        if (IS_NATIVE) {
            const { value } = await Preferences.get({ key });
            return value;
        }
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },


    async setItem(key: string, value: string): Promise<void> {
        if (IS_NATIVE) {
            await Preferences.set({ key, value });
            return;
        }
        try {
            localStorage.setItem(key, value);
        } catch {
            // no-op
        }
    },


    set<T>(key: string, value: T): void {
        const serialized = JSON.stringify(value);
        if (IS_NATIVE) {
            Preferences.set({ key, value: serialized });
            return;
        }
        try {
            localStorage.setItem(key, serialized);
        } catch {
            // no-op
        }
    },

    async removeItem(key: string): Promise<void> {
        if (IS_NATIVE) {
            await Preferences.remove({ key });
            return;
        }
        try {
            localStorage.removeItem(key);
        } catch {
            // no-op
        }
    },

    clearAll(): void {
        Object.values(STORAGE_KEYS).forEach((k) => {
            if (IS_NATIVE) {
                Preferences.remove({ key: k });
            } else {
                try {
                    localStorage.removeItem(k);
                } catch {
                    // no-op
                }
            }
        });
    },
};

export const STORAGE_KEYS = {
    THEME: "safebite_theme",
    LANGUAGE: "safebite_language",
    MODE: "safebite_mode",
    CURRENT_USER: "safebite_current_user",
    ALLERGIES: "safebite_allergies",
    FAMILY_MEMBERS: "safebite_family_members",
    HAS_ONBOARDED: "safebite_has_onboarded",
    HISTORY: "safebite_history",
} as const;
