

import { supabase } from "./supabaseClient";
import type { Database } from "../types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export const profileService = {
    async getProfile(userId: string): Promise<Profile | null> {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("[profileService] getProfile error:", error.message);
            return null;
        }
        return data;
    },

    async updateProfile(
        userId: string,
        updates: ProfileUpdate
    ): Promise<{ success: boolean; error: string | null }> {
        const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", userId);

        if (error) {
            console.error("[profileService] updateProfile error:", error.message);
            return { success: false, error: error.message };
        }
        return { success: true, error: null };
    },

    async completeOnboarding(
        userId: string
    ): Promise<{ success: boolean; error: string | null }> {
        return profileService.updateProfile(userId, {
            has_completed_onboarding: true,
        });
    },
};
