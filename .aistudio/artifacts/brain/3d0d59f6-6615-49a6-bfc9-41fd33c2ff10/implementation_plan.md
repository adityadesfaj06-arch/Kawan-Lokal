# Integrasi Tren Kuliner Real-Time & Generator Menu Baru Gemini AI

Menambahkan dua fitur dinamis berbasis kecerdasan buatan (*AI-powered*) yang ditenagai oleh **Gemini API (`gemini-3.8-flash`)** dengan **Google Search Grounding**:
1. **Section Artikel & Tren Real-Time**: Menyajikan berita & tren jajanan kuliner viral terkini di Indonesia dengan tombol refresh dan auto-fetch.
2. **Generator Menu Baru Otomatis (Trending Menu)**: Rekomendasi 2-3 ide produk/menu baru viral mingguan yang langsung dapat dipesan atau dimasukkan ke keranjang dengan label eksklusif.
3. **Mekanisme Caching 24 Jam di `localStorage`**: Mencegah kuota API terkuras dan memastikan kecepatan muat halaman instan, hanya me-refresh otomatis sehari sekali atau saat pengguna menekan tombol *Refresh Update Terbaru*.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan Utama & Penyelarasan**:
> - **Model AI**: Menggunakan `gemini-3.8-flash` dengan alat bawaan `tools: [{ googleSearch: {} }]` untuk mendapatkan tren kuliner internet Indonesia yang aktual dan akurat, tanpa memerlukan API key berbayar.
> - **Keamanan API Key**: Sesuai standar AI Studio, panggilan Gemini API diisolasi di endpoint backend (`/api/trends`) menggunakan Express server (`server.ts`) sehingga `GEMINI_API_KEY` tidak terekspos di browser client.
> - **Interaktivitas Menu Baru**: Rekomendasi menu baru dilengkapi tombol *"Pesan Menu Ini / Tambah ke Keranjang"* sehingga pengunjung dapat langsung merasakan alur belanja nyata hingga checkout.
> - **Penempatan UI**: Seksi *Tren & Artikel Real-time* diletakkan di halaman utama (Beranda) tepat di atas katalog produk dan terhubung ke halaman `/articles`, sedangkan *Trending Menu Baru Minggu Ini* ditempatkan secara terintegrasi di bagian atas katalog menu produk.

---

## 1. Overview & Core Concept

- **Apa yang Dikerjakan**:
  - Backend proxy route `/api/trends` yang memanggil Google Gen AI SDK dengan model `gemini-3.8-flash` dan Search Grounding.
  - Komponen **Section Tren Real-Time** (`RealtimeTrendsSection.tsx`) menampilkan 3 artikel tren viral kuliner nusantara (judul, ringkasan, kategori, estimasi waktu baca, serta badge indikator *Verified with Google Search*).
  - Komponen **Trending Menu Baru** (`TrendingMenuSection.tsx`) menampilkan 2-3 kreasi jajanan viral baru (nama produk, deskripsi menggugah selera, estimasi harga IDR, alasan viral, badge `🔥 Trending` / `✨ Menu Baru`, dan aksi belanja).
  - Indikator waktu pembaruan terakhir (*"Diperbarui 10 menit lalu"*) dan tombol interaktif *"⚡ Refresh Update Terbaru"* dengan status animasi putar.
  - Animasi skeleton loading yang anggun dan berkelas saat AI memproses data.

- **Target Persona & Nilai**:
  - Penggemar camilan lokal dan pemilik usaha kuliner yang ingin selalu mengetahui jajanan yang sedang viral di TikTok/Instagram/X di Indonesia secara real-time.

---

## 2. User Experience & Visual Design

- **Alur Pengguna (User Flow)**:
  1. Pengunjung membuka website: Sistem memeriksa `localStorage` (`kawanlokal_trends_cache`). Jika ada data dan usianya belum 24 jam, konten langsung ditampilkan secara instan tanpa jeda loading.
  2. Jika cache kosong atau sudah kedaluwarsa (> 24 jam), sistem otomatis menjalankan skeleton loading dan mengambil update terbaru via Gemini API + Google Search.
  3. Pengguna dapat menekan tombol *"Refresh Update Terbaru"* kapan saja untuk memaksa pembaruan data real-time dengan efek toast konfirmasi.
  4. Pada kartu Menu Baru, pengunjung dapat mengklik tombol *"Coba Menu Ini"* untuk langsung menambahkan produk ke keranjang belanja dengan estimasi harga resmi.

- **Tema Visual & Komponen**:
  - Warna selaras dengan identitas Kawan Lokal: Latar belakang krem hangat (`#FFFDF8`, `#FAF7F2`), aksen terakota (`#E85D32`), dan cokelat rempah gelap (`#241A14`).
  - Kartu bernuansa modern editorial dengan garis tepi halus (`border-[#D9C7AE]/60`), bayangan lembut (*soft shadows*), dan ikon badge search grounding Google.
  - Skeleton loading berupa pulse gradient bertema krem keemasan yang nyaman dipandang.

---

## 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Backend Server Route vs Client Direct Call**:
  - *Pilihan*: Mengimplementasikan `server.ts` Express entry point yang mem-proxy permintaan `/api/trends`.
  - *Alasan*: Menjaga kunci rahasia `GEMINI_API_KEY` tetap aman di lingkungan server dan memenuhi batasan arsitektur platform AI Studio.
- **Keputusan 2: Strategi Caching 24 Jam di LocalStorage**:
  - *Pilihan*: Menyimpan payload JSON + timestamp Unix di `localStorage`.
  - *Alasan*: Pengunjung tidak mengalami jeda loading berulang saat berpindah-pindah halaman, menghemat kuota Google Search grounding, namun tetap memberikan kebebasan update manual melalui tombol refresh.
- **Keputusan 3: Penanganan Fallback Data**:
  - *Pilihan*: Menyediakan template fallback tren terkurasi jika terjadi gangguan jaringan atau pembatasan kuota internet pihak ketiga.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│                                                             │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │ RealtimeTrendsSection │       │  TrendingMenuSection  │  │
│  │   (3 Artikel Viral)   │       │  (2-3 Rekomendasi AI) │  │
│  └───────────┬───────────┘       └───────────┬───────────┘  │
│              │                               │              │
│              └───────────────┬───────────────┘              │
│                              ▼                              │
│                 ┌───────────────────────────┐               │
│                 │      useAiTrends Hook     │               │
│                 │   (Check Cache 24 Jam)    │               │
│                 └─────────────┬─────────────┘               │
│                               │ (Jika miss / refresh)       │
└───────────────────────────────┼─────────────────────────────┘
                                │ GET /api/trends
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Full-Stack Express Server                   │
│                        (server.ts)                          │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Google Gen AI SDK (@google/genai)                   │   │
│   │ Model: gemini-3.8-flash                             │   │
│   │ Tool: { googleSearch: {} }                          │   │
│   │ System Prompt: Kurator Kuliner Viral Indonesia      │   │
│   │ Output: Structured JSON                             │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

- **Struktur Data JSON**:
```typescript
interface TrendingArticle {
  judul: string;
  ringkasan_singkat: string;
  kategori: string;
  waktu_baca: string;
}

interface NewMenuItem {
  nama_menu: string;
  deskripsi_menggugah_selera: string;
  kategori: string;
  estimasi_harga_rupiah: number;
  alasan_populer: string;
  badge?: '🔥 Trending' | '✨ Menu Baru';
}

interface AiTrendsResponse {
  trending_articles: TrendingArticle[];
  new_menus: NewMenuItem[];
  last_updated: string;
}
```
