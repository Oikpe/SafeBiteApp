// --- Database Types ---
// Manual type definitions matching Supabase schema.
// Replace with auto-generated types when project stabilizes.

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    display_name: string;
                    avatar_url: string | null;
                    app_mode: "personal" | "family";
                    language: "en" | "id";
                    theme: "light" | "dark";
                    has_completed_onboarding: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    display_name?: string;
                    avatar_url?: string | null;
                    app_mode?: "personal" | "family";
                    language?: "en" | "id";
                    theme?: "light" | "dark";
                    has_completed_onboarding?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    display_name?: string;
                    avatar_url?: string | null;
                    app_mode?: "personal" | "family";
                    language?: "en" | "id";
                    theme?: "light" | "dark";
                    has_completed_onboarding?: boolean;
                };
            };
            family_members: {
                Row: {
                    id: string;
                    profile_id: string;
                    name: string;
                    avatar: string;
                    color_index: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    profile_id: string;
                    name: string;
                    avatar?: string;
                    color_index?: number;
                    created_at?: string;
                };
                Update: {
                    name?: string;
                    avatar?: string;
                    color_index?: number;
                };
            };
            user_allergies: {
                Row: {
                    id: string;
                    profile_id: string;
                    allergy_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    profile_id: string;
                    allergy_id: string;
                    created_at?: string;
                };
                Update: {
                    allergy_id?: string;
                };
            };
            member_allergies: {
                Row: {
                    id: string;
                    member_id: string;
                    allergy_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    member_id: string;
                    allergy_id: string;
                    created_at?: string;
                };
                Update: {
                    allergy_id?: string;
                };
            };
            scan_sessions: {
                Row: {
                    id: string;
                    profile_id: string;
                    source: string;
                    query: string | null;
                    image_url: string | null;
                    items_scanned: number;
                    scanned_at: string;
                };
                Insert: {
                    id?: string;
                    profile_id: string;
                    source?: string;
                    query?: string | null;
                    image_url?: string | null;
                    items_scanned?: number;
                    scanned_at?: string;
                };
                Update: {
                    source?: string;
                    query?: string | null;
                    image_url?: string | null;
                    items_scanned?: number;
                };
            };
            scan_results: {
                Row: {
                    id: string;
                    session_id: string;
                    food_name: string;
                    status: "danger" | "caution" | "safe";
                    detected_allergens: string[];
                    description: string;
                    confidence: number;
                    raw_ai_response: Record<string, unknown> | null;
                };
                Insert: {
                    id?: string;
                    session_id: string;
                    food_name: string;
                    status?: "danger" | "caution" | "safe";
                    detected_allergens?: string[];
                    description?: string;
                    confidence?: number;
                    raw_ai_response?: Record<string, unknown> | null;
                };
                Update: {
                    food_name?: string;
                    status?: "danger" | "caution" | "safe";
                    detected_allergens?: string[];
                    description?: string;
                    confidence?: number;
                    raw_ai_response?: Record<string, unknown> | null;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}
