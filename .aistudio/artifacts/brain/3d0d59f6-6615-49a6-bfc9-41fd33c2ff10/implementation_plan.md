# Rencana Implementasi: Gambar Artikel Unik & Auto-Discovery Katalog Produk Dinamis

Peningkatan menyeluruh untuk memastikan:
1. Setiap kartu artikel dinamis memiliki gambar yang 100% akurat dan unik sesuai judulnya (tanpa duplikasi) menggunakan keyword visual spesifik, parameter `&seed=${index}`, dan kontainer tinggi 200px proporsional.
2. Katalog Produk dan Filter Kategori bekerja 100% dinamis (Auto-Discovery & Auto-Inject) menggunakan Gemini 2.5 Flash dengan Google Search grounding, generator foto `imagePrompt` dengan seed unik, tab kategori otomatis bertambah dinamis, dan persistensi `localStorage` harian.

---

## 1. Konfirmasi Preferensi Pengguna (User Answers)
- **Urutan Tab Kategori**: Urutan abjad setelah tab 'Semua' lengkap dengan badge penghitung jumlah item per kategori.
- **Waktu Eksekusi Auto-Inject**: Otomatis saat pergantian hari kalender baru (`YYYY-MM-DD`) saat website pertama kali dibuka, serta tombol refresh manual untuk memaksa pencarian tren baru kapan saja.
- **Bentuk Notifikasi**: Toast notifikasi interaktif saat produk baru berhasil ditambahkan, ditambah badge indikator jumlah produk baru di header katalog produk.

---

## 2. Arsitektur & Spesifikasi Teknis

### A. Komponen Artikel Dinamis & Generator Gambar Akurat
- **Keyword Visual Spesifik**:
  - Artikel Basreng: `"indonesian spicy basreng chips with lime leaves daun jeruk"`
  - Artikel Thai Tea & Matcha: `"iced thai tea and matcha latte on cafe table"`
  - Artikel Seblak & Baso Aci: `"indonesian spicy seblak and baso aci in a bowl with ceker"`
  - Artikel dinamis AI lainnya: AI mewajibkan properti `imageKeyword` spesifik dalam bahasa Inggris.
- **URL Generator Gambar dengan Seed Unik**:
  ```tsx
  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item.imageKeyword || 'indonesian food')}?width=600&height=400&nologo=true&seed=${index}`}
  ```
  Penambahan `&seed=${index}` (atau `&seed=${item.id}`) menjamin tidak ada dua kartu artikel yang menampilkan gambar kembar/duplikat.
- **Sizing & Tampilan Visual**:
  - Kontainer ber-radius (`rounded-2xl` / `rounded-[20px]`).
  - Gambar berukuran `width: 100%; height: 200px; object-fit: cover;`.
  - Dilengkapi skeleton loader krem hangat (`#EADDCC`/`#F8F5EF`) dan fallback anti-error.

### B. Auto-Discovery & Auto-Inject Katalog Produk
- **Backend Service (`/api/auto-discover-products` / `/api/trends`)**:
  - Menggunakan model `gemini-2.5-flash` dengan `googleSearch` grounding aktif.
  - JSON Schema ketat untuk produk baru:
    - `id`: string unik (`ai-prod-${slug}-${timestamp}`)
    - `name`: Nama produk menggugah selera (Bahasa Indonesia)
    - `category`: Kategori relevan (bisa kategori baru yang belum pernah ada)
    - `price`: Nilai Rupiah wajar (misal Rp 15.000 - Rp 35.000)
    - `description`: Deskripsi rasa dan tekstur
    - `badge`: `'✨ Baru & Viral'`
    - `imagePrompt`: Prompt fotografi makanan profesional dalam Bahasa Inggris
- **Foto Produk Baru Otomatis**:
  ```tsx
  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(product.imagePrompt + ', high quality food photography, studio lighting')}?width=600&height=600&nologo=true&seed=${product.id}`}
  ```
- **Katalog & Filter Kategori Dinamis (`CategorySection.tsx` & `DiscoverPage.tsx`)**:
  - Tab kategori tidak di-hardcode:
    ```tsx
    const categories = ['Semua', ...Array.from(new Set(products.map(p => p.category))).sort()];
    ```
  - Ketika kategori baru seperti `"Minuman Viral"`, `"Dessert Kekinian"`, atau `"Cemilan Pedas"` masuk, tab kategori langsung muncul sendiri di bar filter.
  - Setiap tab menampilkan badge jumlah item (misal: `Semua (24)`, `Basreng Crispy (8)`, `Minuman Viral (3)`).
- **Auto-Save & Injeksi Harian (`localStorage`)**:
  - Menyimpan produk AI ke `localStorage` dengan key `kawanlokal_ai_products` dan `kawanlokal_products_date`.
  - Jika tanggal hari ini berbeda atau data belum ada, jalankan fetch otomatis di background.
  - Produk baru disuntikkan ke urutan teratas katalog dengan badge `'✨ Baru Ditambahkan Otomatis'`.
  - Tampilkan toast: `✨ 3 Produk Viral Baru Berhasil Ditambahkan ke Katalog!`

---

## 3. Rencana Modifikasi File

1. **`src/types.ts`**:
   - Perbarui antarmuka `TrendingArticle` untuk mendukung `imageKeyword` dan `image_keyword`.
   - Perbarui antarmuka `Product` untuk mendukung `imagePrompt`, `isAiDiscovered?: boolean`, dan kategori dinamis.
2. **`server.ts`**:
   - Perbarui prompt AI dan skema Gemini untuk menghasilkan `imageKeyword` spesifik per artikel (Basreng, Thai Tea, Seblak, dll.).
   - Tambahkan endpoint atau integrasikan auto-discovery produk baru dengan Google Search grounding dan `imagePrompt` detail.
3. **`src/components/RealtimeTrendsSection.tsx`**:
   - Pasang kontainer gambar `w-full h-[200px] object-cover rounded-2xl` dengan URL ber-seed unik `&seed=${index}`.
   - Terapkan keyword spesifik untuk artikel bawaan/fallback.
4. **`src/context/AiTrendsContext.tsx`**:
   - Integrasikan state produk dinamis gabungan (`products = [...aiDiscoveredProducts, ...baseProducts]`).
   - Logika auto-check tanggal kalender harian di `localStorage`.
   - Handler manual refresh untuk katalog dan artikel.
5. **`src/components/CategorySection.tsx` & `src/components/DiscoverPage.tsx`**:
   - Ganti filter kategori statis menjadi dinamis dari `products.map(p => p.category)`.
   - Tampilkan badge jumlah produk pada masing-masing tab kategori.
   - Sediakan badge `'✨ Baru Ditambahkan Otomatis'` pada kartu produk baru.

---

## 4. Rencana Pengujian & Verifikasi

1. **Verifikasi Tampilan Artikel**:
   - Pastikan ketiga kartu artikel memiliki gambar yang berbeda sesuai teks (Basreng daun jeruk, Thai tea/matcha, Seblak ceker).
   - Pastikan tidak ada duplikasi berkat parameter `&seed=${index}`.
   - Pastikan dimensi presisi `height: 200px; width: 100%; object-fit: cover; rounded-2xl`.
2. **Verifikasi Auto-Discovery Katalog & Kategori Dinamis**:
   - Buka katalog produk dan amati kemunculan produk baru hasil temuan AI di posisi teratas.
   - Amati tab kategori: pastikan kategori baru muncul secara otomatis tanpa refresh ulang halaman.
   - Klik tab kategori baru tersebut dan verifikasi penyaringan produk bekerja dengan benar.
3. **Verifikasi Persistensi & Error Handling**:
   - Cek `localStorage` di browser.
   - Uji tombol `🔄 Cek Tren Baru Sekarang` dan pastikan toast notifikasi interaktif muncul.
   - Uji build dengan `compile_applet` dan `lint_applet`.
