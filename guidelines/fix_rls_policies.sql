-- ═══════════════════════════════════════════════════════════════════════════════
-- SafeBite RLS Policy Fix
-- ═══════════════════════════════════════════════════════════════════════════════
-- Tabel user_allergies, scan_sessions, dan scan_results kemungkinan memiliki
-- RLS yang dinonaktifkan (oleh teman). Script ini mengaktifkan kembali RLS
-- dan membuat policies yang benar.
--
-- CARA PAKAI:
-- 1. Buka Supabase Dashboard → SQL Editor
-- 2. Paste seluruh isi file ini
-- 3. Klik "Run"
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Step 1: Enable RLS on all tables ────────────────────────────────────────
ALTER TABLE public.user_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

-- Pastikan tabel lain juga aktif (sudah aktif, tapi untuk safety)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_allergies ENABLE ROW LEVEL SECURITY;


-- ─── Step 2: Drop existing policies (if any) to avoid conflicts ──────────────
-- user_allergies
DROP POLICY IF EXISTS "Users can view own allergies" ON public.user_allergies;
DROP POLICY IF EXISTS "Users can insert own allergies" ON public.user_allergies;
DROP POLICY IF EXISTS "Users can delete own allergies" ON public.user_allergies;

-- scan_sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON public.scan_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.scan_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.scan_sessions;

-- scan_results
DROP POLICY IF EXISTS "Users can view own results" ON public.scan_results;
DROP POLICY IF EXISTS "Users can insert own results" ON public.scan_results;


-- ─── Step 3: Create proper RLS policies ──────────────────────────────────────

-- ── user_allergies ──
-- Users can SELECT their own allergy records
CREATE POLICY "Users can view own allergies"
  ON public.user_allergies FOR SELECT
  USING (auth.uid() = profile_id);

-- Users can INSERT their own allergy records
CREATE POLICY "Users can insert own allergies"
  ON public.user_allergies FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Users can DELETE their own allergy records
CREATE POLICY "Users can delete own allergies"
  ON public.user_allergies FOR DELETE
  USING (auth.uid() = profile_id);


-- ── scan_sessions ──
-- Users can SELECT their own scan sessions
CREATE POLICY "Users can view own sessions"
  ON public.scan_sessions FOR SELECT
  USING (auth.uid() = profile_id);

-- Users can INSERT their own scan sessions (from frontend mock mode)
CREATE POLICY "Users can insert own sessions"
  ON public.scan_sessions FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Users can DELETE their own scan sessions
CREATE POLICY "Users can delete own sessions"
  ON public.scan_sessions FOR DELETE
  USING (auth.uid() = profile_id);


-- ── scan_results ──
-- Users can SELECT results belonging to their own sessions
CREATE POLICY "Users can view own results"
  ON public.scan_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.scan_sessions
      WHERE scan_sessions.id = scan_results.session_id
        AND scan_sessions.profile_id = auth.uid()
    )
  );

-- Users can INSERT results for their own sessions (from frontend mock mode)
CREATE POLICY "Users can insert own results"
  ON public.scan_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.scan_sessions
      WHERE scan_sessions.id = scan_results.session_id
        AND scan_sessions.profile_id = auth.uid()
    )
  );


-- ═══════════════════════════════════════════════════════════════════════════════
-- CATATAN PENTING:
--
-- Model backend (model/main.py) menggunakan SUPABASE_SERVICE_ROLE_KEY yang
-- secara otomatis BYPASS semua RLS policies. Jadi backend tetap bisa INSERT
-- ke scan_sessions dan scan_results tanpa masalah.
--
-- Frontend menggunakan anon key + user JWT, sehingga hanya bisa akses
-- data milik user yang sedang login.
-- ═══════════════════════════════════════════════════════════════════════════════
