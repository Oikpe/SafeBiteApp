# SafeBite — Deployment Guide

## Quick Reference

Untuk membuat APK yang bisa scanning menu secara real, ikuti langkah ini secara berurutan.

---

## Step 1: Deploy Model Backend ke HuggingFace Spaces

### 1.1 Buat Akun & Token
1. Daftar di https://huggingface.co/join
2. Buat API token di https://huggingface.co/settings/tokens
   - Klik **"Create new token"**
   - Name: `safebite`
   - Type: **Read** (cukup)
   - Copy token (`hf_xxx...`)

### 1.2 Buat Space
1. Buka https://huggingface.co/new-space
2. Isi:
   - **Owner**: akun kamu
   - **Space name**: `safebite-scanner`
   - **SDK**: **Docker**
   - **Hardware**: **CPU basic** (gratis)
   - **Visibility**: Public (gratis) atau Private
3. Klik **Create Space**

### 1.3 Upload Files
Di halaman Space, klik **"Files"** → **"Upload files"** → upload 3 file:

```
model/Dockerfile
model/main.py
model/requirements.txt
```

⚠️ **PENTING**: Upload file-file ini ke ROOT Space (bukan subfolder).
Artinya di Space harus terlihat:
```
├── Dockerfile
├── main.py
└── requirements.txt
```

### 1.4 Set Secrets
Di Space → **Settings** → scroll ke **"Variables and secrets"**:

| Key | Value | Type |
|-----|-------|------|
| `SUPABASE_URL` | `https://zquoepuaofuwxskggqdz.supabase.co` | Secret |
| `SUPABASE_SERVICE_ROLE_KEY` | (ambil dari Supabase Dashboard → Settings → API) | Secret |
| `HF_TOKEN` | (token yang kamu buat di step 1.1) | Secret |

### 1.5 Tunggu Build
- Space akan otomatis build setelah upload files
- Proses build ~5-10 menit (DocTR agak besar)
- Status akan berubah dari **Building** → **Running**
- Kamu akan mendapat URL: `https://USERNAME-safebite-scanner.hf.space`

### 1.6 Test
Buka browser → ketik URL Space kamu. Harusnya muncul:
```json
{"status": "online", "message": "Menu Scanner API is active."}
```

---

## Step 2: Hubungkan Frontend ke Cloud

### 2.1 Update .env
```env
# Ubah dari mock ke real
VITE_USE_MOCK_AI=false

# Ganti URL ke HuggingFace Space kamu
VITE_MODEL_API_URL=https://USERNAME-safebite-scanner.hf.space
```

### 2.2 Build & Sync
```bash
npm run cap:sync
```

---

## Step 3: Build APK

### 3.1 Buka di Android Studio
```bash
npx cap open android
```

### 3.2 Build APK
Di Android Studio:
1. Menu → **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Tunggu build selesai
3. APK ada di: `android/app/build/outputs/apk/debug/app-debug.apk`

### 3.3 Share ke Penguji
- Kirim file `app-debug.apk` via WhatsApp / Google Drive
- Penguji install di HP → izinkan "Install from unknown sources"
- Done! App siap pakai 🎉

---

## Troubleshooting

### Space build gagal
- Cek logs di tab **"Logs"** pada halaman Space
- Pastikan 3 file (Dockerfile, main.py, requirements.txt) ada di root

### API tidak bisa diakses dari app
- Pastikan CSP di `index.html` mengandung `https://*.hf.space` di `connect-src`
- Pastikan Space sudah **Running** (bukan Building/Error)

### Scanning error di APK
- Pastikan `VITE_USE_MOCK_AI=false` di `.env`
- Pastikan `VITE_MODEL_API_URL` sudah benar (tanpa trailing slash)
- Rebuild: `npm run cap:sync`

### HuggingFace Space sleep (cold start)
- Free tier Spaces akan sleep setelah tidak dipakai
- Request pertama mungkin lambat (30-60 detik) karena cold start
- Ini normal — request berikutnya akan cepat
