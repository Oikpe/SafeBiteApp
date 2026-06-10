// ─── Mock History Data ─────────────────────────────────────────────────────────
// Development/demo seed data.
// In production (native or web), this will be replaced by real API calls
// through scanService.ts or a persistence layer.

import type { HistoryEntry } from "../types";

export const MOCK_HISTORY: HistoryEntry[] = [
    {
        id: "h1",
        date: "2026-02-18",
        restaurant: "Sakura Japanese",
        itemsScanned: 8,
        results: [
            {
                id: "r1",
                name: "Miso Soup",
                status: "safe",
                allergens: [],
                description: "Traditional miso broth with tofu and wakame",
                confidence: 95,
            },
            {
                id: "r2",
                name: "Tempura Shrimp",
                status: "danger",
                allergens: ["shellfish", "gluten"],
                description: "Battered and deep-fried shrimp",
                confidence: 98,
            },
            {
                id: "r3",
                name: "Teriyaki Chicken",
                status: "caution",
                allergens: ["soy"],
                description: "Grilled chicken with teriyaki glaze containing soy",
                confidence: 88,
            },
        ],
    },
    {
        id: "h2",
        date: "2026-02-16",
        restaurant: "Bella Italia",
        itemsScanned: 12,
        results: [
            {
                id: "r4",
                name: "Margherita Pizza",
                status: "danger",
                allergens: ["gluten", "dairy"],
                description: "Classic pizza with mozzarella and tomato",
                confidence: 97,
            },
            {
                id: "r5",
                name: "Caesar Salad",
                status: "caution",
                allergens: ["eggs", "dairy"],
                description: "Contains parmesan and egg-based dressing",
                confidence: 85,
            },
            {
                id: "r6",
                name: "Grilled Vegetables",
                status: "safe",
                allergens: [],
                description: "Seasonal grilled vegetables with olive oil",
                confidence: 92,
            },
        ],
    },
    {
        id: "h3",
        date: "2026-02-14",
        restaurant: "Thai Garden",
        itemsScanned: 6,
        results: [
            {
                id: "r7",
                name: "Pad Thai",
                status: "danger",
                allergens: ["peanuts", "shellfish", "eggs"],
                description: "Rice noodles with shrimp and peanut sauce",
                confidence: 96,
            },
            {
                id: "r8",
                name: "Green Curry",
                status: "caution",
                allergens: ["fish"],
                description: "Contains fish sauce as base ingredient",
                confidence: 90,
            },
            {
                id: "r9",
                name: "Mango Sticky Rice",
                status: "safe",
                allergens: [],
                description: "Sweet sticky rice with fresh mango",
                confidence: 94,
            },
        ],
    },
];
