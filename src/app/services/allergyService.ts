

import { supabase } from "./supabaseClient";

export const allergyService = {
    async getUserAllergies(profileId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from("user_allergies")
            .select("allergy_id")
            .eq("profile_id", profileId);

        if (error) {
            console.error("[allergyService] getUserAllergies error:", error.message);
            return [];
        }
        return (data ?? []).map((row) => row.allergy_id);
    },

    async setUserAllergies(
        profileId: string,
        allergyIds: string[]
    ): Promise<{ success: boolean; error: string | null }> {
        const { error: deleteError } = await supabase
            .from("user_allergies")
            .delete()
            .eq("profile_id", profileId);

        if (deleteError) {
            console.error("[allergyService] delete error:", deleteError.message);
            return { success: false, error: deleteError.message };
        }


        if (allergyIds.length > 0) {
            const rows = allergyIds.map((allergyId) => ({
                profile_id: profileId,
                allergy_id: allergyId,
            }));
            const { error: insertError } = await supabase
                .from("user_allergies")
                .insert(rows);

            if (insertError) {
                console.error("[allergyService] insert error:", insertError.message);
                return { success: false, error: insertError.message };
            }
        }

        return { success: true, error: null };
    },

    async toggleUserAllergy(
        profileId: string,
        allergyId: string
    ): Promise<{ allergies: string[]; error: string | null }> {

        const { data: existing } = await supabase
            .from("user_allergies")
            .select("id")
            .eq("profile_id", profileId)
            .eq("allergy_id", allergyId)
            .maybeSingle();

        if (existing) {
            // Remove it
            await supabase
                .from("user_allergies")
                .delete()
                .eq("profile_id", profileId)
                .eq("allergy_id", allergyId);
        } else {
            // Add it
            await supabase
                .from("user_allergies")
                .insert({ profile_id: profileId, allergy_id: allergyId });
        }

        // Return updated list
        const updated = await allergyService.getUserAllergies(profileId);
        return { allergies: updated, error: null };
    },
};
