// ─── useAllergyFilter ─────────────────────────────────────────────────────────
// Derives the effective allergen list for the currently active profile.
//
// In personal mode  → returns the user's own allergy list
// In family mode    → returns the active family member's allergy list
//
// Centralising this logic as a hook means pages never duplicate it.

import { useApp } from "../context/AppContext";

export function useAllergyFilter(): string[] {
    const { activeMemberId, familyMembers, allergies } = useApp();

    if (activeMemberId) {
        const member = familyMembers.find((m) => m.id === activeMemberId);
        return member?.allergies ?? [];
    }

    return allergies;
}
