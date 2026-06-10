import type * as React from "react";

export interface AllergyItem {
  id: string;
  name: string;
  nameId: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>;
  description: string;
  descriptionId: string;
  severity: "high" | "moderate" | "low";
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  allergies: string[];
  colorIndex: number;
}

export interface ScanResult {
  id: string;
  name: string;
  status: "danger" | "caution" | "safe";
  allergens: string[];
  description: string;
  confidence: number;
}

export interface MemberResult {
  memberId: string;
  memberName: string;
  memberColorIndex: number;
  status: "danger" | "caution" | "safe";
  matchedAllergens: string[];
}

export interface HistoryEntry {
  id: string;
  date: string;
  restaurant: string;
  itemsScanned: number;
  results: ScanResult[];
  imageUrl?: string;
}

export type ThemeMode = "light" | "dark";
export type Language = "en" | "id";
export type AppMode = "personal" | "family";
