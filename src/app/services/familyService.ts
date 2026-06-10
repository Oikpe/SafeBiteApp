

import { supabase } from "./supabaseClient";
import type { FamilyMember } from "../types";

export const familyService = {
    async getFamilyMembers(profileId: string): Promise<FamilyMember[]> {
        const { data: members, error: membersError } = await supabase
            .from("family_members")
            .select("*")
            .eq("profile_id", profileId)
            .order("created_at", { ascending: true });

        if (membersError) {
            console.error("[familyService] getFamilyMembers error:", membersError.message);
            return [];
        }
        if (!members || members.length === 0) return [];

        const memberIds = members.map((m) => m.id);
        const { data: allergies, error: allergiesError } = await supabase
            .from("member_allergies")
            .select("member_id, allergy_id")
            .in("member_id", memberIds);

        if (allergiesError) {
            console.error("[familyService] getMemberAllergies error:", allergiesError.message);
        }

        const allergyMap = new Map<string, string[]>();
        if (allergies) {
            for (const a of allergies) {
                const list = allergyMap.get(a.member_id) ?? [];
                list.push(a.allergy_id);
                allergyMap.set(a.member_id, list);
            }
        }

        return members.map((m) => ({
            id: m.id,
            name: m.name,
            avatar: m.avatar,
            colorIndex: m.color_index,
            allergies: allergyMap.get(m.id) ?? [],
        }));
    },

    async addFamilyMember(
        profileId: string,
        member: Omit<FamilyMember, "colorIndex">,
        colorIndex: number
    ): Promise<FamilyMember | null> {

        const { data, error } = await supabase
            .from("family_members")
            .insert({
                id: member.id,
                profile_id: profileId,
                name: member.name,
                avatar: member.avatar,
                color_index: colorIndex,
            })
            .select()
            .single();

        if (error) {
            console.error("[familyService] addFamilyMember error:", error.message);
            return null;
        }


        if (member.allergies.length > 0) {
            await familyService.setMemberAllergies(data.id, member.allergies);
        }

        return {
            id: data.id,
            name: data.name,
            avatar: data.avatar,
            colorIndex: data.color_index,
            allergies: member.allergies,
        };
    },

    async updateFamilyMember(
        memberId: string,
        updates: Partial<Pick<FamilyMember, "name" | "allergies">>
    ): Promise<{ success: boolean; error: string | null }> {

        if (updates.name !== undefined) {
            const { error } = await supabase
                .from("family_members")
                .update({ name: updates.name })
                .eq("id", memberId);

            if (error) {
                console.error("[familyService] updateFamilyMember error:", error.message);
                return { success: false, error: error.message };
            }
        }


        if (updates.allergies !== undefined) {
            await familyService.setMemberAllergies(memberId, updates.allergies);
        }

        return { success: true, error: null };
    },

    async removeFamilyMember(
        memberId: string
    ): Promise<{ success: boolean; error: string | null }> {
        const { error } = await supabase
            .from("family_members")
            .delete()
            .eq("id", memberId);

        if (error) {
            console.error("[familyService] removeFamilyMember error:", error.message);
            return { success: false, error: error.message };
        }
        return { success: true, error: null };
    },

    async setMemberAllergies(
        memberId: string,
        allergyIds: string[]
    ): Promise<void> {

        await supabase
            .from("member_allergies")
            .delete()
            .eq("member_id", memberId);


        if (allergyIds.length > 0) {
            const rows = allergyIds.map((allergyId) => ({
                member_id: memberId,
                allergy_id: allergyId,
            }));
            const { error } = await supabase
                .from("member_allergies")
                .insert(rows);

            if (error) {
                console.error("[familyService] setMemberAllergies error:", error.message);
            }
        }
    },
};
