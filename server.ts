import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Fallback dynamic trends dataset
function getFallbackTrends() {
  return {
    trending_articles: [
      {
        judul: 'Fenomena Daun Jeruk Melimpah: Kenapa Basreng Krispi Pedas Terus Memuncaki FYP?',
        ringkasan_singkat: 'Kombinasi aroma daun jeruk purut segar dengan cabai rawit merah sangrai menjadi formula viral yang sukses membuat jutaan anak muda ketagihan renyahnya camilan khas Bandung.',
        kategori: 'Jajanan Viral',
        waktu_baca: '2 mnt baca',
      },
      {
        judul: 'Evolusi Minuman Cafe di Rumah: Tren Bubuk Thai Tea & Matcha Crafting Makin Populer',
        ringkasan_singkat: 'Generasi Z kini gemar meracik sendiri minuman ala cafe premium menggunakan bubuk konsentrat pekat, hemat budget namun rasa otentik.',
        kategori: 'Minuman Kekinian',
        waktu_baca: '3 mnt baca',
      },
      {
        judul: 'Seblak Kuah Jeletot & Baso Aci Rempah: Kenyamanan Kuliner Nusantara di Musim Hujan',
        ringkasan_singkat: 'Kuliner berkuah hangat dengan cita rasa kencur gurih pedas kembali membludak di pencarian media sosial, menginspirasi banyak variasi topping unik.',
        kategori: 'Kuliner Hangat',
        waktu_baca: '2 mnt baca',
      },
    ],
    new_menus: [
      {
        nama_menu: 'Basreng Stick Daun Jeruk Smoky BBQ Hot',
        deskripsi_menggugah_selera: 'Stik bakso ikan tenggiri renyah berpadu bumbu BBQ asap kayu manis, cabai bubuk grade A, dan taburan daun jeruk cincang kering yang melimpah.',
        kategori: 'Camilan Gurih Pedas',
        estimasi_harga_rupiah: 24000,
        alasan_populer: 'Viral karena sensasi kriuk tahan lama dan perpaduan wangi asap BBQ dengan pedas asam jeruk yang segar.',
        badge: '🔥 Trending',
      },
      {
        nama_menu: 'Seblak Cilok Cuanki Mala Chili Oil Bowl',
        deskripsi_menggugah_selera: 'Perpaduan seblak kenyal khas Bandung dengan kebas aroma lada Sichuan mala, siomay kering, dan minyak cabai wijen aromatik.',
        kategori: 'Seblak & Cuanki Kuah',
        estimasi_harga_rupiah: 28500,
        alasan_populer: 'Menu fusion yang sedang naik daun di TikTok, menghadirkan level pedas baru yang nagih tanpa pahit.',
        badge: '✨ Menu Baru',
      },
      {
        nama_menu: 'Signature Thai Milk Tea Brown Sugar Boba Kit',
        deskripsi_menggugah_selera: 'Bubuk seduh racikan daun teh hitam Assam dan rempah Thailand pekat, creamy susu murni, lengkap dengan boba empuk kenyal.',
        kategori: 'Bubuk Minuman Kafe',
        estimasi_harga_rupiah: 32000,
        alasan_populer: 'Praktis diseduh hangat atau dingin, memberikan pengalaman nongkrong di cafe cukup dari meja kerja.',
        badge: '🔥 Trending',
      },
    ],
    grounded: false,
    last_updated: new Date().toISOString(),
  };
}

// In-memory server cache & 429 quota circuit breaker
interface ServerCacheEntry {
  data: any;
  timestamp: number;
}
let serverTrendsCache: ServerCacheEntry | null = null;
let quotaCooldownUntil: number = 0; // Epoch timestamp for quota cooldown
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes in-memory cache

// API: Get Real-Time Culinary Trends & New Menu Ideas via Gemini API with Google Search Grounding
app.get('/api/trends', async (_req, res) => {
  const now = Date.now();

  // 1. Serve from in-memory cache if fresh
  if (serverTrendsCache && now - serverTrendsCache.timestamp < CACHE_TTL_MS) {
    return res.json({
      ...serverTrendsCache.data,
      cached: true,
    });
  }

  // 2. If currently in quota cooldown, serve fallback immediately without spamming Gemini
  if (now < quotaCooldownUntil) {
    const fallback = getFallbackTrends();
    return res.json({
      ...fallback,
      cooldown_active: true,
      cooldown_seconds_remaining: Math.round((quotaCooldownUntil - now) / 1000),
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.warn('[Trends API] GEMINI_API_KEY not configured, serving curated trends.');
      const fallback = getFallbackTrends();
      return res.json(fallback);
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Kamu adalah asisten pengelola konten dan pengembang produk otomatis untuk website Kawan Lokal (toko jajanan viral, seblak cuanki basreng, dan bubuk minuman cafe di Indonesia).
Setiap kali dipanggil, tugasmu adalah memberikan pembaruan real-time berdasarkan tren pasar kuliner dan media sosial terkini (TikTok, Instagram, X) di Indonesia saat ini.

Cari informasi kuliner dan camilan paling viral di internet menggunakan Google Search dan hasilkan output HANYA dalam format JSON valid murni tanpa markdown code block (tanpa \`\`\`json).

Format struktur JSON:
{
  "trending_articles": [
    {
      "judul": "string",
      "ringkasan_singkat": "string",
      "kategori": "string",
      "waktu_baca": "string"
    }
  ],
  "new_menus": [
    {
      "nama_menu": "string",
      "deskripsi_menggugah_selera": "string",
      "kategori": "string",
      "estimasi_harga_rupiah": 24000,
      "alasan_populer": "string",
      "badge": "🔥 Trending"
    }
  ]
}

Aturan wajib:
1. "trending_articles" HARUS berisi tepat 3 artikel singkat terbaru mengenai tren kuliner/produk viral saat ini di Indonesia (judul, ringkasan_singkat, kategori, waktu_baca).
2. "new_menus" HARUS berisi 2 sampai 3 ide menu/produk baru yang inovatif berdasarkan makanan/jajanan yang sedang viral di Indonesia (nama_menu, deskripsi_menggugah_selera, kategori, estimasi_harga_rupiah, alasan_populer, badge).
3. "estimasi_harga_rupiah" harus bertipe number integer rupiah yang realistis (misal: 18000, 24000, 28000).
4. "badge" dapat bernilai "🔥 Trending" atau "✨ Menu Baru".
5. Gunakan bahasa Indonesia yang santai, menarik, dan persuasif.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      rawText = rawText.slice(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(rawText);
    if (!Array.isArray(parsed.trending_articles) || !Array.isArray(parsed.new_menus)) {
      throw new Error('Invalid JSON structure from Gemini response');
    }

    const payload = {
      trending_articles: parsed.trending_articles,
      new_menus: parsed.new_menus,
      grounded: true,
      last_updated: new Date().toISOString(),
    };

    // Cache successful response
    serverTrendsCache = {
      data: payload,
      timestamp: Date.now(),
    };

    return res.json(payload);
  } catch (err: any) {
    const isQuotaExceeded =
      err?.status === 'RESOURCE_EXHAUSTED' ||
      err?.message?.includes('429') ||
      err?.message?.includes('quota') ||
      err?.status === 429;

    if (isQuotaExceeded) {
      // 15-minute cooldown to prevent repeating 429 calls
      quotaCooldownUntil = Date.now() + 15 * 60 * 1000;
      console.warn(
        '[Trends API] Gemini API quota limit reached (429 RESOURCE_EXHAUSTED). Entering 15-minute cooldown and serving curated live trends dataset.'
      );
    } else {
      console.warn('[Trends API] Gemini request note:', err?.message || 'Using fallback trends');
    }

    const fallbackData = getFallbackTrends();
    serverTrendsCache = {
      data: fallbackData,
      timestamp: Date.now(),
    };

    return res.json({
      ...fallbackData,
      fallback_active: true,
      quota_exceeded: isQuotaExceeded,
    });
  }
});

// Setup dev server with Vite middleware or serve static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kawan Lokal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
