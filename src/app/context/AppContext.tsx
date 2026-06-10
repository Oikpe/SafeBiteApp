import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import type {
  FamilyMember,
  ScanResult,
  HistoryEntry,
  ThemeMode,
  Language,
  AppMode,
} from "../types";
import { MEMBER_COLORS } from "../constants/memberColors";
import { storageService, STORAGE_KEYS } from "../services/storageService";
import { profileService } from "../services/profileService";
import { allergyService } from "../services/allergyService";
import { familyService } from "../services/familyService";
import { historyService } from "../services/historyService";
import { useAuth } from "./AuthContext";

function validateHistory(raw: unknown): HistoryEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((entry): entry is HistoryEntry => {
    if (!entry || typeof entry !== 'object') return false;
    if (typeof entry.id !== 'string' || !entry.id) return false;
    if (typeof entry.date !== 'string' || !entry.date) return false;
    if (!Array.isArray(entry.results)) return false;
    if (typeof entry.itemsScanned !== 'number') return false;
    return true;
  });
}

export { ALLERGY_LIST, SORTED_ALLERGY_LIST } from "../constants/allergies";
export { MEMBER_COLORS } from "../constants/memberColors";
export type { AllergyItem, FamilyMember, ScanResult, MemberResult, HistoryEntry } from "../types";

interface AppState {
  mode: AppMode | null;
  currentUser: string;
  allergies: string[];
  familyMembers: FamilyMember[];
  activeMemberId: string | null;
  scanResults: ScanResult[];
  history: HistoryEntry[];
  activeHistoryEntry: HistoryEntry | null;
  hasCompletedOnboarding: boolean;
  theme: ThemeMode;
  language: Language;
  hydrating: boolean;

  setMode: (mode: AppMode) => void;
  setCurrentUser: (name: string) => void;
  setAllergies: (allergies: string[]) => void;
  toggleAllergy: (id: string) => void;
  addFamilyMember: (member: Omit<FamilyMember, "colorIndex">) => void;
  updateFamilyMember: (
    id: string,
    updates: Partial<Pick<FamilyMember, "name" | "allergies">>
  ) => void;
  removeFamilyMember: (id: string) => void;
  setActiveMember: (id: string | null) => void;
  setScanResults: (results: ScanResult[]) => void;
  addToHistory: (entry: HistoryEntry) => void;
  setActiveHistoryEntry: (entry: HistoryEntry | null) => void;
  completeOnboarding: () => void;
  resetApp: () => void;
  getActiveAllergies: () => string[];
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [mode, setModeState] = useState<AppMode | null>(
    () => storageService.getSync<AppMode | null>(STORAGE_KEYS.MODE, null)
  );
  const [currentUser, setCurrentUserState] = useState(
    () => storageService.getSync<string>(STORAGE_KEYS.CURRENT_USER, "")
  );
  const [allergies, setAllergies] = useState<string[]>(
    () => storageService.getSync<string[]>(STORAGE_KEYS.ALLERGIES, [])
  );
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    () => storageService.getSync<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS, [])
  );
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    () => storageService.getSync<boolean>(STORAGE_KEYS.HAS_ONBOARDED, false)
  );
  const [theme, setThemeState] = useState<ThemeMode>(
    () => storageService.getSync<ThemeMode>(STORAGE_KEYS.THEME, "light")
  );
  const [language, setLanguageState] = useState<Language>(
    () => storageService.getSync<Language>(STORAGE_KEYS.LANGUAGE, "en")
  );
  const [history, setHistory] = useState<HistoryEntry[]>(
    () => validateHistory(storageService.getSync<unknown>(STORAGE_KEYS.HISTORY, []))
  );

  const [activeMemberId, setActiveMember] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [activeHistoryEntry, setActiveHistoryEntry] = useState<HistoryEntry | null>(null);
  const [hydratingInternal, setHydratingInternal] = useState(true);

  const [hydratedForUserId, setHydratedForUserId] = useState<string | null>(null);

  const hydrating = hydratingInternal || (!!user?.id && user.id !== hydratedForUserId);

  const hydrateFromSupabase = useCallback(async (userId: string) => {
    setHydratingInternal(true);
    try {
      const [profile, userAllergies, members, scanHistory] = await Promise.all([
        profileService.getProfile(userId),
        allergyService.getUserAllergies(userId),
        familyService.getFamilyMembers(userId),
        historyService.getScanHistory(userId, 50),
      ]);

      if (profile) {
        setModeState(profile.app_mode as AppMode);
        setCurrentUserState(profile.display_name);
        setThemeState(profile.theme as ThemeMode);
        setLanguageState(profile.language as Language);
        setHasCompletedOnboarding(profile.has_completed_onboarding);

        storageService.set(STORAGE_KEYS.MODE, profile.app_mode);
        storageService.set(STORAGE_KEYS.CURRENT_USER, profile.display_name);
        storageService.set(STORAGE_KEYS.THEME, profile.theme);
        storageService.set(STORAGE_KEYS.LANGUAGE, profile.language);
        storageService.set(STORAGE_KEYS.HAS_ONBOARDED, profile.has_completed_onboarding);
      } else {
        console.warn("[AppContext] Profile not found — retrying in 1s...");
        const retryProfile = await new Promise<Awaited<ReturnType<typeof profileService.getProfile>>>(resolve => {
          setTimeout(async () => resolve(await profileService.getProfile(userId)), 1000);
        });
        if (retryProfile) {
          setModeState(retryProfile.app_mode as AppMode);
          setCurrentUserState(retryProfile.display_name);
          setThemeState(retryProfile.theme as ThemeMode);
          setLanguageState(retryProfile.language as Language);
          setHasCompletedOnboarding(retryProfile.has_completed_onboarding);
          storageService.set(STORAGE_KEYS.MODE, retryProfile.app_mode);
          storageService.set(STORAGE_KEYS.CURRENT_USER, retryProfile.display_name);
          storageService.set(STORAGE_KEYS.THEME, retryProfile.theme);
          storageService.set(STORAGE_KEYS.LANGUAGE, retryProfile.language);
          storageService.set(STORAGE_KEYS.HAS_ONBOARDED, retryProfile.has_completed_onboarding);
        } else {
          console.error("[AppContext] Profile still not found after retry — user may need to re-onboard.");
        }
      }

      setAllergies(userAllergies);
      storageService.set(STORAGE_KEYS.ALLERGIES, userAllergies);

      setFamilyMembers(members);
      storageService.set(STORAGE_KEYS.FAMILY_MEMBERS, members);

      setHistory(scanHistory);
      storageService.set(STORAGE_KEYS.HISTORY, scanHistory);

      setHydratedForUserId(userId);
    } catch (err) {
      console.error("[AppContext] Hydration error:", err);
      setHydratedForUserId(userId);
    } finally {
      setHydratingInternal(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      hydrateFromSupabase(user.id);
    } else {
      storageService.clearAll();
      document.documentElement.classList.remove("dark");
      setModeState(null);
      setCurrentUserState("");
      setAllergies([]);
      setFamilyMembers([]);
      setHasCompletedOnboarding(false);
      setThemeState("light");
      setLanguageState("en");
      setHistory([]);
      setActiveMember(null);
      setScanResults([]);
      setActiveHistoryEntry(null);
      setHydratingInternal(false);
      setHydratedForUserId(null);
    }
  }, [user?.id, hydrateFromSupabase]);

  useEffect(() => { storageService.set(STORAGE_KEYS.MODE, mode); }, [mode]);
  useEffect(() => { storageService.set(STORAGE_KEYS.CURRENT_USER, currentUser); }, [currentUser]);
  useEffect(() => { storageService.set(STORAGE_KEYS.ALLERGIES, allergies); }, [allergies]);
  useEffect(() => { storageService.set(STORAGE_KEYS.FAMILY_MEMBERS, familyMembers); }, [familyMembers]);
  useEffect(() => { storageService.set(STORAGE_KEYS.HAS_ONBOARDED, hasCompletedOnboarding); }, [hasCompletedOnboarding]);
  useEffect(() => { storageService.set(STORAGE_KEYS.THEME, theme); }, [theme]);
  useEffect(() => { storageService.set(STORAGE_KEYS.LANGUAGE, language); }, [language]);
  useEffect(() => { storageService.set(STORAGE_KEYS.HISTORY, history); }, [history]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setMode = (m: AppMode) => {
    setModeState(m);
    if (user?.id) {
      profileService.updateProfile(user.id, { app_mode: m });
    }
  };

  const setCurrentUser = (name: string) => {
    setCurrentUserState(name);
    if (user?.id) {
      profileService.updateProfile(user.id, { display_name: name });
    }
  };

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    if (user?.id) {
      profileService.updateProfile(user.id, { theme: t });
    }
  };

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    if (user?.id) {
      profileService.updateProfile(user.id, { language: l });
    }
  };

  const toggleAllergy = (id: string) => {
    setAllergies((prev) => {
      const next = prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id];
      if (user?.id) {
        allergyService.setUserAllergies(user.id, next);
      }
      return next;
    });
  };

  const addFamilyMember = (member: Omit<FamilyMember, "colorIndex">) => {
    const colorIndex = familyMembers.length % MEMBER_COLORS.length;
    const newMember = { ...member, colorIndex };
    setFamilyMembers((prev) => [...prev, newMember]);

    if (user?.id) {
      familyService.addFamilyMember(user.id, member, colorIndex);
    }
  };

  const updateFamilyMember = (
    id: string,
    updates: Partial<Pick<FamilyMember, "name" | "allergies">>
  ) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );

    familyService.updateFamilyMember(id, updates);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));

    familyService.removeFamilyMember(id);
  };

  const getActiveAllergies = () => {
    if (activeMemberId) {
      const member = familyMembers.find((m) => m.id === activeMemberId);
      return member?.allergies ?? [];
    }
    return allergies;
  };

  const addToHistory = (entry: HistoryEntry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 50));
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        currentUser,
        allergies,
        familyMembers,
        activeMemberId,
        scanResults,
        history,
        activeHistoryEntry,
        hasCompletedOnboarding,
        theme,
        language,
        hydrating,
        setMode,
        setCurrentUser,
        setAllergies: (newAllergies: string[]) => {
          setAllergies(newAllergies);
          if (user?.id) {
            allergyService.setUserAllergies(user.id, newAllergies);
          }
        },
        toggleAllergy,
        addFamilyMember,
        updateFamilyMember,
        removeFamilyMember,
        setActiveMember,
        setScanResults,
        addToHistory,
        setActiveHistoryEntry,
        completeOnboarding: () => {
          storageService.set(STORAGE_KEYS.HAS_ONBOARDED, true);
          setHasCompletedOnboarding(true);
          if (user?.id) {
            profileService.completeOnboarding(user.id);
          }
        },
        resetApp: () => {
          storageService.clearAll();
          document.documentElement.classList.remove("dark");
          setModeState(null);
          setCurrentUserState("");
          setAllergies([]);
          setFamilyMembers([]);
          setHasCompletedOnboarding(false);
          setThemeState("light");
          setLanguageState("en");
          setHistory([]);
          setActiveMember(null);
          setScanResults([]);
          setActiveHistoryEntry(null);
        },
        getActiveAllergies,
        setTheme,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
