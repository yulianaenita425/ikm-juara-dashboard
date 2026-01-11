# 🚀 GITHUB SETUP GUIDE - IKM JUARA DASHBOARD

## ✅ STATUS SAAT INI
- ✅ Git repository sudah diinisialisasi
- ✅ Semua file sudah di-commit
- ✅ Siap untuk push ke GitHub
- ✅ Setup scripts sudah dibuat

---

## 🌐 STEP 1: BUAT REPOSITORY GITHUB

### 📝 **Cara Manual (Recommended):**

1. **Buka browser dan pergi ke:** https://github.com/new

2. **Isi form repository:**
   - **Repository name:** `ikm-juara-dashboard`
   - **Description:** `Dashboard sistem database IKM JUARA untuk DisnakerKUKM Kota Madiun`
   - **Visibility:** Public ✅
   - **Initialize repository:** JANGAN centang apapun ❌

3. **Klik "Create repository"**

---

## 📤 STEP 2: PUSH CODE KE GITHUB

Setelah repository dibuat, GitHub akan menampilkan halaman dengan instruksi. 

### 🖥️ **Jalankan commands ini di terminal:**

```bash
# Ganti YOUR_USERNAME dengan username GitHub Anda
git remote add origin https://github.com/YOUR_USERNAME/ikm-juara-dashboard.git
git branch -M main
git push -u origin main
```

### 🪟 **Atau gunakan script otomatis (Windows):**
```cmd
github-setup.bat
```

### 🐧 **Atau gunakan script otomatis (Linux/Mac):**
```bash
chmod +x github-setup.sh
./github-setup.sh
```

---

## 🔗 STEP 3: CONNECT KE VERCEL

### 📋 **Langkah-langkah:**

1. **Buka Vercel Dashboard:** https://vercel.com/dashboard

2. **Klik "Add New..." → "Project"**

3. **Klik "Continue with GitHub"**
   - Authorize Vercel untuk akses GitHub Anda

4. **Import Repository:**
   - Cari `ikm-juara-dashboard`
   - Klik "Import"

5. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detect)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

6. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

7. **Klik "Deploy"**

---

## 🎯 HASIL SETELAH SETUP

### ✅ **Yang Akan Anda Dapatkan:**

1. **🔄 Auto-Deployment**
   - Setiap push ke main branch → otomatis deploy
   - Preview deployment untuk pull requests

2. **💾 Backup & Version Control**
   - Kode tersimpan aman di GitHub
   - History lengkap semua perubahan
   - Rollback mudah jika ada masalah

3. **👥 Team Collaboration**
   - Multiple developer bisa bekerja sama
   - Code review process
   - Branch management

4. **🚀 Professional Workflow**
   - CI/CD pipeline
   - Automated testing
   - Environment management

---

## 🛠️ TROUBLESHOOTING

### ❓ **Jika ada error saat push:**
```bash
# Jika remote sudah ada
git remote set-url origin https://github.com/YOUR_USERNAME/ikm-juara-dashboard.git

# Jika branch conflict
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### ❓ **Jika Vercel tidak detect Next.js:**
- Pastikan `package.json` ada di root folder
- Pastikan ada `next.config.js`
- Manual set Framework Preset ke "Next.js"

### ❓ **Jika environment variables error:**
- Copy dari file `.env.local` yang sudah ada
- Paste di Vercel Environment Variables
- Redeploy project

---

## 📞 BANTUAN

Jika mengalami kesulitan:

1. **Check Git status:** `git status`
2. **Check remotes:** `git remote -v`
3. **Check branches:** `git branch -a`

---

## 🎉 SETELAH SETUP SELESAI

Anda akan memiliki:
- ✅ **GitHub Repository:** https://github.com/YOUR_USERNAME/ikm-juara-dashboard
- ✅ **Vercel Deployment:** https://ikm-juara-dashboard-xxx.vercel.app
- ✅ **Auto-deployment** pada setiap push
- ✅ **Professional development workflow**

---

*Setup guide created: ${new Date().toLocaleString('id-ID')}*