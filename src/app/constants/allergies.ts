// ─── Allergy Definitions ───────────────────────────────────────────────────────
// Static master list of supported allergens.
// Moved out of AppContext so it can be imported anywhere without
// pulling in React state machinery.

import type { AllergyItem } from "../types";
import {
    IconGluten,
    IconCrab,
    IconFish,
    IconEggs,
    IconMilk,
    IconSoy,
    IconSesame,
    IconPeanuts,
    IconSulfites,
    IconMustard
} from "../components/AllergenIcons";

export const ALLERGY_LIST: AllergyItem[] = [
    {
        id: "peanuts",
        name: "Peanuts",
        nameId: "Kacang",
        icon: IconPeanuts,
        description: "Nuts & peanut products",
        descriptionId: "Kacang tanah & produk turunannya",
        severity: "high",
    },
    {
        id: "shellfish",
        name: "Shellfish",
        nameId: "Seafood",
        icon: IconCrab,
        description: "Shrimp, crab, lobster",
        descriptionId: "Udang, kepiting, lobster",
        severity: "high",
    },
    {
        id: "fish",
        name: "Fish",
        nameId: "Ikan",
        icon: IconFish,
        description: "All types of fish",
        descriptionId: "Semua jenis ikan",
        severity: "high",
    },
    {
        id: "eggs",
        name: "Eggs",
        nameId: "Telur",
        icon: IconEggs,
        description: "Eggs & egg-based products",
        descriptionId: "Telur & produk berbasis telur",
        severity: "high",
    },
    {
        id: "dairy",
        name: "Dairy",
        nameId: "Susu",
        icon: IconMilk,
        description: "Milk, cheese, butter, cream",
        descriptionId: "Susu, keju, mentega, krim",
        severity: "moderate",
    },
    {
        id: "gluten",
        name: "Gluten",
        nameId: "Gluten",
        icon: IconGluten,
        description: "Wheat, barley, rye",
        descriptionId: "Gandum, barley, rye",
        severity: "moderate",
    },
    {
        id: "soy",
        name: "Soy",
        nameId: "Kedelai",
        icon: IconSoy,
        description: "Soybeans & soy derivatives",
        descriptionId: "Kedelai & turunannya",
        severity: "moderate",
    },
    {
        id: "sesame",
        name: "Sesame",
        nameId: "Wijen",
        icon: IconSesame,
        description: "Sesame seeds & oil",
        descriptionId: "Biji wijen & minyak wijen",
        severity: "low",
    },
    {
        id: "sulfites",
        name: "Sulfites",
        nameId: "Sulfit",
        icon: IconSulfites,
        description: "Wine, dried fruits, preservatives",
        descriptionId: "Anggur, buah kering, pengawet",
        severity: "low",
    },
    {
        id: "mustard",
        name: "Mustard",
        nameId: "Mustard",
        icon: IconMustard,
        description: "Mustard seeds & products",
        descriptionId: "Biji mustard & produk turunannya",
        severity: "low",
    },
];

/** Sorted high → moderate → low for consistent display order */
const SEVERITY_ORDER: Record<string, number> = { high: 0, moderate: 1, low: 2 };
export const SORTED_ALLERGY_LIST = [...ALLERGY_LIST].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
);
