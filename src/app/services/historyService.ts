

import { supabase } from "./supabaseClient";
import type { HistoryEntry, ScanResult } from "../types";

export const historyService = {
    async getScanHistory(
        profileId: string,
        limit = 50
    ): Promise<HistoryEntry[]> {
        const { data: sessions, error } = await supabase
            .from("scan_sessions")
            .select("*, scan_results(*)")
            .eq("profile_id", profileId)
            .order("scanned_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("[historyService] getScanHistory error:", error.message);
            return [];
        }

        if (!sessions) return [];

        return sessions.map((session) => ({
            id: session.id,
            date: session.scanned_at,
            restaurant: session.query ?? "Camera Scan",
            itemsScanned: session.items_scanned,
            imageUrl: session.image_url ?? undefined,
            results: (session.scan_results ?? []).map(
                (r: {
                    id: string;
                    food_name: string;
                    status: "danger" | "caution" | "safe";
                    detected_allergens: string[];
                    description: string;
                    confidence: number;
                }) => ({
                    id: r.id,
                    name: r.food_name,
                    status: r.status,
                    allergens: r.detected_allergens ?? [],
                    description: r.description,
                    confidence: r.confidence,
                })
            ),
        }));
    },

    async addScanSession(
        profileId: string,
        source: "camera" | "search" | "gallery",
        query: string | null,
        results: ScanResult[],
        imageUrl?: string
    ): Promise<{ entry: HistoryEntry | null; error: string | null }> {
        const { data: session, error: sessionError } = await supabase
            .from("scan_sessions")
            .insert({
                profile_id: profileId,
                source,
                query,
                image_url: imageUrl ?? null,
                items_scanned: results.length,
            })
            .select()
            .single();

        if (sessionError || !session) {
            console.error("[historyService] addScanSession error:", sessionError?.message);
            return { entry: null, error: sessionError?.message ?? "Unknown error" };
        }

        if (results.length > 0) {
            const resultRows = results.map((r) => ({
                session_id: session.id,
                food_name: r.name,
                status: r.status,
                detected_allergens: r.allergens,
                description: r.description,
                confidence: r.confidence,
            }));

            const { error: resultsError } = await supabase
                .from("scan_results")
                .insert(resultRows);

            if (resultsError) {
                console.error("[historyService] addScanResults error:", resultsError.message);
                // Session was created but results failed — partial data scenario.
                // We don't delete the session to avoid data loss — it'll show 0 items.
            }
        }

        return {
            entry: {
                id: session.id,
                date: session.scanned_at,
                restaurant: query ?? "Camera Scan",
                itemsScanned: results.length,
                imageUrl: imageUrl,
                results,
            },
            error: null,
        };
    },

    async deleteScanSession(
        sessionId: string
    ): Promise<{ success: boolean; error: string | null }> {
        const { error } = await supabase
            .from("scan_sessions")
            .delete()
            .eq("id", sessionId);

        if (error) {
            console.error("[historyService] deleteScanSession error:", error.message);
            return { success: false, error: error.message };
        }
        return { success: true, error: null };
    },
};
