import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp } from "../context/AppContext";
import type { ScanResult, HistoryEntry } from "../context/AppContext";
import { scanService, USE_MOCK } from "../services/scanService";
import { historyService } from "../services/historyService";
import { useAuth } from "../context/AuthContext";
import { sanitizeSearchQuery } from "../utils/sanitize";
import { Camera as CapCamera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import {
  Camera,
  Search,
  X,
  ScanLine,
  Loader2,
  ImagePlus,
  ArrowLeft,
  SearchX,
} from "lucide-react";
import { T } from "../i18n/translations";
/** Convert a base64 data URI to a File object for upload. */
function dataUriToFile(dataUri: string, filename: string): File {
  const [meta, base64] = dataUri.split(",");
  const mime = meta.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], filename, { type: mime });
}



export default function Scan() {
  const searchResultRef = useRef<{ result: ScanResult; query: string } | null>(null);
  const menuResultsRef = useRef<ScanResult[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setScanResults, addToHistory, setActiveHistoryEntry, mode, familyMembers, currentUser, theme, language, allergies } = useApp();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const t = T[language];
  const [activeTab, setActiveTab] = useState<"camera" | "search">(
    searchParams.get("mode") === "search" ? "search" : "camera"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [currentProcessingSteps, setCurrentProcessingSteps] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [resultReady, setResultReady] = useState(false);

  const isFamilyMode = mode === "family" && familyMembers.length > 0;


  const SCAN_STEPS = isFamilyMode
    ? [
      t.stepAnalyzing,
      t.stepDetecting,
      t.stepIdentifying,
      t.stepCheckingYou(currentUser || "You"),
      ...familyMembers.map((m) => t.stepCheckingYou(m.name)),
      t.stepGenerating,
    ]
    : [
      t.stepAnalyzing,
      t.stepDetecting,
      t.stepIdentifying,
      t.stepMatchingProfile,
      t.stepGenerating,
    ];

  const SEARCH_STEPS = isFamilyMode
    ? [
      t.lookingUpFood,
      t.checkingAllergens,
      t.stepCheckingYou(currentUser || "You"),
      ...familyMembers.map((m) => t.stepCheckingYou(m.name)),
      t.stepGenerating,
    ]
    : [
      t.lookingUpFood,
      t.checkingAllergens,
      t.stepMatchingProfile,
      t.stepGenerating,
    ];




  const handleCameraCapture = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        // Native: use Capacitor Camera plugin
        const photo = await CapCamera.getPhoto({
          quality: 85,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          width: 1200,
          correctOrientation: true,
        });
        if (photo.dataUrl) {
          setPreviewUrl(photo.dataUrl);
          const file = dataUriToFile(photo.dataUrl, `scan_${Date.now()}.jpg`);
          setSelectedFile(file);
          startScan(file);
        }
      } else {
        // Web fallback: open file picker
        fileInputRef.current?.click();
      }
    } catch (err) {
      // User cancelled camera — ignore silently
      console.log("[Scan] Camera cancelled or error:", err);
    }
  };


  const startScan = (file: File) => {
    setSearchNotFound(false);
    setScanError(null);
    setResultReady(false);
    menuResultsRef.current = null;
    setCurrentProcessingSteps(SCAN_STEPS);
    setIsProcessing(true);
    setProcessingStep(0);

    scanService.analyzeMenu({
      imageUri: "camera-placeholder",
      userAllergies: allergies,
      profileId: user?.id,
      file,
    }).then((menuResults) => {
      menuResultsRef.current = menuResults;
      setResultReady(true);
    }).catch((err) => {
      console.error("[Scan] analyzeMenu error:", err);
      const message = err instanceof Error ? err.message : "Scan failed.";
      setIsProcessing(false);
      setScanError(message);
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchNotFound(false);
    setScanError(null);
    setResultReady(false);
    setCurrentProcessingSteps(SEARCH_STEPS);
    setIsProcessing(true);
    setProcessingStep(0);

    try {
      const cleanQuery = sanitizeSearchQuery(searchQuery);
      const result = await scanService.searchFood(cleanQuery, {
        userAllergies: allergies,
        profileId: user?.id,
      });
      if (!result) {
        setIsProcessing(false);
        setSearchNotFound(true);
        return;
      }
      searchResultRef.current = { result, query: cleanQuery };
      setResultReady(true);
    } catch (err) {
      console.error("[Scan] searchFood error:", err);
      setIsProcessing(false);
      setSearchNotFound(true);
    }
  };


  useEffect(() => {
    if (isProcessing && processingStep < currentProcessingSteps.length) {
      const timer = setTimeout(() => {
        setProcessingStep((prev) => prev + 1);
      }, activeTab === "search" ? 600 : 800); // search is faster
      return () => clearTimeout(timer);
    }
    if (isProcessing && currentProcessingSteps.length > 0 && processingStep >= currentProcessingSteps.length && resultReady) {
      // Processing complete — build results and navigate
      const finalize = async () => {
        if (activeTab === "search") {
          // Single-food search result
          const result = searchResultRef.current?.result as ScanResult;
          const query = searchResultRef.current?.query as string;
          searchResultRef.current = null;

          const newEntry: HistoryEntry = {
            id: `search_${Date.now()}`,
            restaurant: query,
            date: new Date().toISOString(),
            itemsScanned: 1,
            results: [result],
          };
          setActiveHistoryEntry(null);
          setScanResults([result]);
          addToHistory(newEntry);

          // Persist to Supabase so history survives re-login
          // In real mode the backend already saved results — only insert in mock mode
          if (user?.id && USE_MOCK) {
            historyService.addScanSession(
              user.id,
              "search",
              query,
              [result]
            ).catch((err) => console.error("[Scan] Supabase sync error:", err));
          }
          navigate("/results");
        } else {
          // Full menu scan — retrieve results from scanService
          const menuResults = menuResultsRef.current ?? [];
          const newEntry: HistoryEntry = {
            id: `scan_${Date.now()}`,
            restaurant: "Camera Scan",
            date: new Date().toISOString(),
            itemsScanned: menuResults.length,
            results: menuResults,
          };
          setActiveHistoryEntry(null);
          setScanResults(menuResults);
          addToHistory(newEntry);

          // Persist to Supabase so history survives re-login
          // In real mode the backend already saved results — only insert in mock mode
          if (user?.id && USE_MOCK) {
            historyService.addScanSession(
              user.id,
              "camera",
              null,
              menuResults
            ).catch((err) => console.error("[Scan] Supabase sync error:", err));
          }
          setSelectedFile(null);
          navigate("/results");
        }
      };
      finalize();
    }
  }, [isProcessing, processingStep, resultReady]);


  const headerColor = isDark ? "rgba(255,255,255,0.95)" : "#1e293b";
  const backBtnBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)";
  const backBtnBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(148,163,184,0.14)";
  const backBtnIcon = isDark ? "rgba(255,255,255,0.7)" : "#475569";
  const tabActiveBg = isDark ? "rgba(255,255,255,0.12)" : "#ffffff";
  const tabActiveText = isDark ? "#e2e8f0" : "#1e1b4b";
  const tabInactiveText = isDark ? "rgba(255,255,255,0.4)" : "#64748b";
  const tabActiveShadow = isDark
    ? "0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.1)"
    : "0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.1)";

  return (
    <MobileLayout noPadding>
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-dvh px-8"
            style={{ background: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.06)" }}
          >
            <div
              className="p-8 rounded-[28px] shadow-xl flex flex-col items-center max-w-sm w-full"
              style={{
                background: isDark ? "rgba(30,41,59,0.95)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(148,163,184,0.15)"}`,
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                <Loader2 size={40} className="text-indigo-500 animate-spin" strokeWidth={2.5} />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={processingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-bold text-center mb-6"
                  style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
                  transition={{ duration: 0.3 }}
                >
                  {processingStep < currentProcessingSteps.length ? currentProcessingSteps[processingStep] : t.completeMsg}
                </motion.div>
              </AnimatePresence>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9" }}
              >
                <motion.div
                  className="h-full bg-indigo-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((processingStep + 1) / currentProcessingSteps.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-dvh"
          >
            {/* Header */}
            <div className="px-7 pt-14 pb-4">
              <div className="flex items-center justify-between mb-7">
                <motion.button
                  onClick={() => navigate("/home")}
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                  style={{
                    background: backBtnBg,
                    border: backBtnBorder,
                    backdropFilter: "blur(16px)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft size={17} strokeWidth={2} style={{ color: backBtnIcon }} />
                </motion.button>
                <h2
                  className="font-display"
                  style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: headerColor }}
                >
                  {t.scanCTA}
                </h2>
                <div className="w-10" />
              </div>

              {/* Tab switcher */}
              <div className="glass-card rounded-[16px] p-1.5 flex mb-7">
                {(["camera", "search"] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setSearchNotFound(false); setScanError(null); }}
                    className="relative flex-1 py-3 rounded-[12px] flex items-center justify-center gap-2 z-10"
                    style={{
                      fontSize: 14,
                      fontWeight: activeTab === tab ? 650 : 500,
                      color: activeTab === tab ? tabActiveText : tabInactiveText,
                    }}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="scan-tab"
                        className="absolute inset-0 rounded-[12px]"
                        style={{
                          background: tabActiveBg,
                          boxShadow: tabActiveShadow,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2 font-display">
                      {tab === "camera" ? <Camera size={15} strokeWidth={2} /> : <Search size={15} strokeWidth={2} />}
                      {tab === "camera" ? t.tabCamera : t.tabSearch}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-7">
              <AnimatePresence initial={false}>
                {activeTab === "camera" ? (
                  <motion.div
                    key="camera-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    {/* Camera preview area */}
                    <div
                      className="w-full aspect-[3/4.5] rounded-3xl relative overflow-hidden mb-7 flex flex-col items-center justify-center p-8"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
                        border: previewUrl ? "none" : `2px dashed ${isDark ? "rgba(255,255,255,0.12)" : "rgba(148,163,184,0.35)"}`,
                      }}
                      onClick={handleCameraCapture}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Captured menu"
                          className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                        />
                      ) : (
                        <>
                          <Camera size={48} className={isDark ? "text-slate-600" : "text-slate-400"} strokeWidth={1.5} style={{ marginBottom: 16 }} />
                          <p className={`font-medium text-center ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                            {t.cameraPreview}
                          </p>
                          <p className="text-xs mt-2" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "#94a3b8" }}>
                            Tap to take a photo
                          </p>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full">
                      {/* Gallery picker */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                          title="Upload image from gallery"
                          ref={fileInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setSelectedFile(file);
                              setPreviewUrl(URL.createObjectURL(file));
                              startScan(file);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <motion.button
                          className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center relative z-0"
                          whileTap={{ scale: 0.9 }}
                        >
                          <ImagePlus size={21} className={isDark ? "text-slate-400" : "text-slate-500"} strokeWidth={1.7} />
                        </motion.button>
                      </div>
                      {/* Camera / Scan button */}
                      <motion.button
                        onClick={handleCameraCapture}
                        className="flex-1 text-white py-[15px] rounded-2xl flex items-center justify-center gap-2.5 font-display"
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          letterSpacing: "-0.01em",
                          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          boxShadow: "0 8px 24px -4px rgba(99,102,241,0.35)",
                        }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <ScanLine size={19} strokeWidth={2} />
                        {t.scanNowCTA}
                      </motion.button>
                    </div>
                    {scanError && (
                      <div className="mt-4 text-center">
                        <p className="text-sm font-medium" style={{ color: isDark ? "#fca5a5" : "#dc2626" }}>
                          {scanError}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="search-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Search input */}
                    <div className="relative mb-7">
                      <Search
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#94a3b8" }}
                        strokeWidth={2}
                      />
                      <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSearchNotFound(false); }}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full glass-elevated rounded-[16px] py-4 pl-12 pr-12 outline-none font-display"
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: isDark ? "#f1f5f9" : "#0f172a",
                        }}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => { setSearchQuery(""); setSearchNotFound(false); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <X size={17} style={{ color: isDark ? "rgba(255,255,255,0.3)" : "#cbd5e1" }} />
                        </button>
                      )}
                    </div>

                    {/* Not Found State */}
                    <AnimatePresence>
                      {searchNotFound && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -8, height: 0 }}
                          className="mb-6 overflow-hidden"
                        >
                          <div
                            className="rounded-[18px] p-5 flex flex-col items-center text-center"
                            style={{
                              background: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
                              border: `1px solid ${isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)"}`,
                            }}
                          >
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                              style={{
                                background: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)",
                              }}
                            >
                              <SearchX size={22} className={isDark ? "text-red-400" : "text-red-500"} strokeWidth={1.8} />
                            </div>
                            <p
                              className="font-display mb-1"
                              style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#fca5a5" : "#dc2626" }}
                            >
                              {t.foodNotFound}
                            </p>
                            <p style={{ fontSize: 12.5, color: isDark ? "rgba(255,255,255,0.45)" : "#94a3b8", lineHeight: 1.5 }}>
                              {t.couldntFindFood} "{searchQuery}"
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Quick suggestions */}
                    <div className="mb-7">
                      <p
                        className="mb-3 font-display"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.02em",
                          textTransform: "uppercase",
                          color: isDark ? "rgba(255,255,255,0.35)" : "#94a3b8",
                        }}
                      >
                        {t.popularSearches}
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          "Pad Thai",
                          "Sushi",
                          "Pizza",
                          "Burger",
                          "Salad",
                          "Indian Curry",
                        ].map((suggestion) => (
                          <motion.button
                            key={suggestion}
                            onClick={() => { setSearchQuery(suggestion); setSearchNotFound(false); }}
                            className="glass-card px-4 py-2.5 rounded-[12px] transition-colors font-display"
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              letterSpacing: "-0.01em",
                              color: isDark ? "rgba(255,255,255,0.65)" : "#475569",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Search button */}
                    <motion.button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim()}
                      className={`w-full py-[15px] rounded-2xl flex items-center justify-center gap-2.5 font-display transition-[background-color,color,box-shadow,border-color] duration-300 ${searchQuery.trim() ? "text-white" : ""}`}
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        ...(searchQuery.trim()
                          ? {
                            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                            boxShadow: "0 8px 24px -4px rgba(99,102,241,0.35)",
                          }
                          : {
                            background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
                            color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1",
                          }),
                      }}
                      whileTap={searchQuery.trim() ? { scale: 0.96 } : undefined}
                    >
                      <Search size={17} strokeWidth={2} />
                      {t.analyzeFood}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pb-28" />
          </motion.div>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
}