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

// Dynamic image URL generator via Pollinations AI with seed support
function generatePollinationsUrl(keyword: string, defaultTopic: string, seed: string | number = 0) {
  const clean = keyword && keyword.trim() !== '' ? keyword.trim() : defaultTopic;
  const prompt = `${clean}, high quality food photography, studio lighting`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=400&nologo=true&seed=${seed}`;
}

// Fallback dynamic trends dataset with specific image keywords and unique seeds
function getFallbackTrends() {
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  const dateKey = new Date().toISOString().split('T')[0];

  return {
    trending_articles: [
      {
        judul: 'Fenomena Daun Jeruk Melimpah: Kenapa Basreng Krispi Pedas Terus Memuncaki FYP?',
        kategori: 'Jajanan Viral',
        tanggal_hari_ini: todayFormatted,
        ringkasan: 'Kombinasi aroma daun jeruk purut segar dengan cabai rawit merah sangrai menjadi formula viral yang sukses membuat jutaan anak muda ketagihan renyahnya camilan khas Bandung.',
        ringkasan_singkat: 'Kombinasi aroma daun jeruk purut segar dengan cabai rawit merah sangrai menjadi formula viral yang sukses membuat jutaan anak muda ketagihan renyahnya camilan khas Bandung.',
        isi_artikel_lengkap: 'Camilan basreng (bakso goreng) daun jeruk berhasil membuktikan diri sebagai penguasa konten kuliner di platform TikTok dan Instagram. Kunci kenikmatannya bukan sekadar rasa pedas membakar, melainkan harmonisasi antara daun jeruk purut pilihan yang disangrai kering bersama minyak bawang dan cabai rawit merah asli. Tekstur stik ikan tenggiri yang dipotong presisi menghasilkan kerenyahan maksimal yang tidak keras saat dikunyah. Para food vlogger sepakat bahwa sensasi kriuk berpadu aroma citrus aromatik inilah yang membuat siapapun sulit berhenti mengunyah begitu kemasan dibuka.',
        waktu_baca: '2 mnt baca',
        imageKeyword: 'indonesian spicy basreng chips with lime leaves daun jeruk',
        image_keyword: 'indonesian spicy basreng chips with lime leaves daun jeruk',
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('indonesian spicy basreng chips with lime leaves daun jeruk')}?width=600&height=400&nologo=true&seed=0`,
      },
      {
        judul: 'Evolusi Minuman Cafe di Rumah: Tren Bubuk Thai Tea & Matcha Crafting Makin Populer',
        kategori: 'Minuman Kekinian',
        tanggal_hari_ini: todayFormatted,
        ringkasan: 'Generasi muda kini gemar meracik sendiri minuman ala cafe premium menggunakan bubuk konsentrat pekat, hemat budget namun dengan cita rasa otentik.',
        ringkasan_singkat: 'Generasi muda kini gemar meracik sendiri minuman ala cafe premium menggunakan bubuk konsentrat pekat, hemat budget namun dengan cita rasa otentik.',
        isi_artikel_lengkap: 'Kenaikan tren konsumsi minuman cafe mendorong maraknya kreasi "home cafe" di kalangan Gen Z dan milenial. Menggunakan bubuk minuman berkualitas kafe bintang lima seperti Thai Tea daun teh pekat dan Matcha artisanal, siapa saja kini bisa menciptakan minuman segar ala gerai mall cukup dalam hitungan detik. Kawan Lokal menjawab tren ini dengan menghadirkan kemasan canister siap seduh yang praktis, ekonomis, dan menghasilkan rasa yang konsisten lezat.',
        waktu_baca: '3 mnt baca',
        imageKeyword: 'iced thai tea and matcha latte on cafe table',
        image_keyword: 'iced thai tea and matcha latte on cafe table',
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('iced thai tea and matcha latte on cafe table')}?width=600&height=400&nologo=true&seed=1`,
      },
      {
        judul: 'Seblak Kuah Jeletot & Baso Aci Rempah: Kenyamanan Kuliner Nusantara di Segala Suasana',
        kategori: 'Kuliner Hangat',
        tanggal_hari_ini: todayFormatted,
        ringkasan: 'Kuliner berkuah hangat dengan cita rasa kencur gurih pedas kembali membludak di pencarian media sosial, menginspirasi banyak variasi topping unik.',
        ringkasan_singkat: 'Kuliner berkuah hangat dengan cita rasa kencur gurih pedas kembali membludak di pencarian media sosial, menginspirasi banyak variasi topping unik.',
        isi_artikel_lengkap: 'Aroma kencur sangrai dan cabai pedas seblak kuah selalu memiliki tempat spesial di lidah masyarakat Indonesia. Musim hujan dan cuaca dingin semakin memperkuat popularitas seblak cuanki instan di keranjang kuning e-commerce. Kombinasi kerupuk kenyal, siomay kering renyah, dan pilus cikur gurih menciptakan sensasi makan berkuah yang menenangkan sekaligus menggugah selera.',
        waktu_baca: '2 mnt baca',
        imageKeyword: 'indonesian spicy seblak and baso aci in a bowl with ceker',
        image_keyword: 'indonesian spicy seblak and baso aci in a bowl with ceker',
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('indonesian spicy seblak and baso aci in a bowl with ceker')}?width=600&height=400&nologo=true&seed=2`,
      },
    ],
    new_menus: [
      {
        id: 'ai-menu-basreng-smoky-bbq',
        nama_menu: 'Basreng Stick Daun Jeruk Smoky BBQ Hot',
        deskripsi_menggugah_selera: 'Stik bakso ikan tenggiri renyah berpadu bumbu BBQ asap kayu manis, cabai bubuk grade A, dan taburan daun jeruk cincang kering yang melimpah.',
        kategori: 'Camilan Pedas Gurih',
        estimasi_harga_rupiah: 24000,
        alasan_populer: 'Viral karena sensasi kriuk tahan lama dan perpaduan wangi asap BBQ dengan pedas asam jeruk yang segar.',
        badge: '✨ Baru & Viral',
        imageKeyword: 'crispy basreng spicy bbq kaffir lime leaf indonesian snack food photography',
        image_keyword: 'crispy basreng spicy bbq kaffir lime leaf indonesian snack food photography',
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('crispy basreng spicy bbq kaffir lime leaf indonesian snack food photography')}?width=600&height=400&nologo=true&seed=101`,
        image: `https://image.pollinations.ai/prompt/${encodeURIComponent('crispy basreng spicy bbq kaffir lime leaf indonesian snack food photography')}?width=600&height=400&nologo=true&seed=101`,
      },
      {
        id: 'ai-menu-seblak-cuanki-mala',
        nama_menu: 'Seblak Cilok Cuanki Mala Chili Oil Bowl',
        deskripsi_menggugah_selera: 'Perpaduan seblak kenyal khas Bandung dengan kebas aroma lada Sichuan mala, siomay kering, dan minyak cabai wijen aromatik.',
        kategori: 'Seblak & Cuanki Kuah',
        estimasi_harga_rupiah: 28500,
        alasan_populer: 'Menu fusion yang sedang naik daun di TikTok, menghadirkan level pedas baru yang nagih tanpa rasa pahit.',
        badge: '✨ Baru & Viral',
        imageKeyword: 'spicy mala seblak cuanki noodle bowl with chili oil and fried siomay food photography',
        image_keyword: 'spicy mala seblak cuanki noodle bowl with chili oil and fried siomay food photography',
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('spicy mala seblak cuanki noodle bowl with chili oil and fried siomay food photography')}?width=600&height=400&nologo=true&seed=102`,
        image: `https://image.pollinations.ai/prompt/${encodeURIComponent('spicy mala seblak cuanki noodle bowl with chili oil and fried siomay food photography')}?width=600&height=400&nologo=true&seed=102`,
      },
      {
        id: 'ai-menu-thai-tea-boba-kit',
        nama_menu: 'Signature Thai Milk Tea Brown Sugar Boba Kit',
        deskripsi_menggugah_selera: 'Bubuk seduh racikan daun teh hitam Assam dan rempah Thailand pekat, creamy susu murni, lengkap dengan boba empuk kenyal.',
        kategori: 'Bubuk Minuman Kafe',
        estimasi_harga_rupiah: 32000,
        alasan_populer: 'Praktis diseduh hangat atau dingin, memberikan pengalaman nongkrong di cafe cukup dari meja kerja.',
        badge: '✨ Baru & Viral',
        imageKeyword: 'thai milk tea with tapioca brown sugar boba glass drink food photography',
        image_keyword: 'thai milk tea with tapioca brown sugar boba glass drink food photography',
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('thai milk tea with tapioca brown sugar boba glass drink food photography')}?width=600&height=400&nologo=true&seed=103`,
        image: `https://image.pollinations.ai/prompt/${encodeURIComponent('thai milk tea with tapioca brown sugar boba glass drink food photography')}?width=600&height=400&nologo=true&seed=103`,
      },
    ],
    auto_discovered_products: [
      {
        id: 'ai-prod-cromboloni-cokelat',
        name: 'Cromboloni Lumer Belgian Dark Chocolate',
        category: 'Dessert Kekinian',
        price: 28000,
        description: 'Pastry renyah berulir keemasan dengan isian lelehan cokelat Belgia lumer melimpah di setiap gigitan.',
        badge: '✨ Baru & Viral',
        imagePrompt: 'flaky chocolate cromboloni pastry with melted chocolate filling, professional food photography, close up, appetizing',
      },
      {
        id: 'ai-prod-cirambay-chili-oil',
        name: 'Cirambay Pedas Jeruk Nipis Chili Oil',
        category: 'Cemilan Pedas',
        price: 18500,
        description: 'Mie pipih tapioka kenyal lembut berpadu minyak cabai bawang putih wangi dan aroma segar daun jeruk.',
        badge: '✨ Baru & Viral',
        imagePrompt: 'indonesian spicy cirambay tapioca noodle with chili oil garlic lime leaf, close up food photography',
      },
      {
        id: 'ai-prod-matcha-cheese-cream',
        name: 'Kyoto Matcha Cheese Cream Foam Latte',
        category: 'Minuman Viral',
        price: 32000,
        description: 'Paduan teh hijau matcha artisanal pekat dengan lapisan busa krim keju gurih creamy yang memanjakan lidah.',
        badge: '✨ Baru & Viral',
        imagePrompt: 'iced matcha latte layered drink with thick savory cheese foam topping, aesthetic cafe lighting',
      },
      {
        id: 'ai-prod-pisang-bakar-karamel',
        name: 'Pisang Bakar Cokelat Keju Karamel Smokey',
        category: 'Dessert Tradisional',
        price: 22000,
        description: 'Pisang kepok manis bakar aroma arang disiram saus karamel mentega, limpahan keju cheddar parut, dan meses cokelat.',
        badge: '✨ Baru & Viral',
        imagePrompt: 'indonesian grilled banana with shredded cheese chocolate condensed milk drizzle on banana leaf',
      },
    ],
    grounded: true,
    date_key: dateKey,
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

// API: Get Real-Time Trends, Articles & Auto-Discovered Products
app.get('/api/trends', async (req, res) => {
  const now = Date.now();
  const isForce = req.query.force === 'true';
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  const dateKey = new Date().toISOString().split('T')[0];

  // 1. Serve from in-memory cache if fresh and not forcing
  if (!isForce && serverTrendsCache && now - serverTrendsCache.timestamp < CACHE_TTL_MS) {
    return res.json({
      ...serverTrendsCache.data,
      cached: true,
    });
  }

  // 2. If currently in quota cooldown and not forcing, serve fallback immediately
  if (!isForce && now < quotaCooldownUntil) {
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

    const prompt = `Kamu adalah Senior Culinary Trend Researcher dan Product Catalog Architect untuk website Kawan Lokal (toko jajanan viral, basreng daun jeruk, seblak cuanki, dan bubuk minuman cafe di Indonesia).
Setiap kali dipanggil, tugasmu adalah memberikan pembaruan tren kuliner real-time Indonesia hari ini (${todayFormatted}) menggunakan Google Search grounding.

Hasilkan output HANYA dalam format JSON valid murni tanpa markdown code block (tanpa \`\`\`json).
Format struktur JSON yang wajib ditaati:
{
  "trending_articles": [
    {
      "judul": "string judul artikel yang menarik",
      "kategori": "string (misal: Jajanan Viral / Minuman Kekinian / Kuliner Hangat / Street Food)",
      "tanggal_hari_ini": "${todayFormatted}",
      "ringkasan": "string ringkasan 2-3 kalimat menarik",
      "isi_artikel_lengkap": "string pembahasan mendalam 2-3 paragraf lengkap tentang tren ini, keunikan rasa/tekstur, dan alasan disukai",
      "waktu_baca": "2 mnt baca",
      "imageKeyword": "specific english visual food photography keywords for this dish"
    }
  ],
  "new_menus": [
    {
      "id": "string slug unik",
      "nama_menu": "string nama kreasi menu baru yang unik dan menggugah selera",
      "deskripsi_menggugah_selera": "string deskripsi rasa, tekstur kriuk/kenyal, dan aroma yang sangat menggoda",
      "kategori": "string kategori jajanan/minuman",
      "estimasi_harga_rupiah": 24000,
      "alasan_populer": "string alasan mengapa kreasi ini viral dan disukai banyak orang",
      "badge": "✨ Baru & Viral",
      "imageKeyword": "specific english food photography prompt for this menu"
    }
  ],
  "auto_discovered_products": [
    {
      "id": "string unik berawalan ai-prod-",
      "name": "Nama produk kuliner baru yang sedang viral di Indonesia (Bahasa Indonesia)",
      "category": "Kategori produk (bisa kategori baru seperti Dessert Kekinian, Minuman Viral, Cemilan Pedas, dll)",
      "price": 25000,
      "description": "Deskripsi singkat yang menggugah selera",
      "badge": "✨ Baru & Viral",
      "imagePrompt": "Deskripsi visual fotografi makanan yang sangat spesifik dalam Bahasa Inggris (contoh: flaky chocolate cromboloni pastry with melted chocolate filling, professional food photography, close up, appetizing)"
    }
  ]
}

Aturan Wajib:
1. "trending_articles" HARUS berisi tepat 3 artikel:
   - Artikel 1 mengenai Basreng / Keripik Pedas dengan imageKeyword: "indonesian spicy basreng chips with lime leaves daun jeruk"
   - Artikel 2 mengenai Minuman Cafe (Thai Tea / Matcha) dengan imageKeyword: "iced thai tea and matcha latte on cafe table"
   - Artikel 3 mengenai Seblak / Baso Aci Kuah dengan imageKeyword: "indonesian spicy seblak and baso aci in a bowl with ceker"
2. "new_menus" HARUS berisi 2-3 kreasi menu viral baru dengan badge "✨ Baru & Viral" dan imageKeyword spesifik.
3. "auto_discovered_products" HARUS berisi 3-4 produk jajanan/minuman baru yang sedang tren di Indonesia saat ini yang belum ada di katalog standar, lengkap dengan category dinamis dan imagePrompt fotografi makanan profesional dalam Bahasa Inggris.
4. "price" bertipe integer Rupiah wajar (misal: 18000, 24000, 28000, 32000).`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
    } catch {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
    }

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

    // Default required keywords for the 3 articles to guarantee 100% adherence
    const defaultArticleKeywords = [
      'indonesian spicy basreng chips with lime leaves daun jeruk',
      'iced thai tea and matcha latte on cafe table',
      'indonesian spicy seblak and baso aci in a bowl with ceker',
    ];

    // Format articles with imageKeyword, seed parameter, and dynamic imageUrl
    const formattedArticles = parsed.trending_articles.slice(0, 3).map((art: any, index: number) => {
      const keyword = art.imageKeyword || art.image_keyword || defaultArticleKeywords[index] || 'indonesian delicious food';
      const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(keyword)}?width=600&height=400&nologo=true&seed=${index}`;
      return {
        judul: art.judul,
        kategori: art.kategori || 'Tren Kuliner',
        tanggal_hari_ini: art.tanggal_hari_ini || todayFormatted,
        ringkasan: art.ringkasan || art.ringkasan_singkat || '',
        ringkasan_singkat: art.ringkasan || art.ringkasan_singkat || '',
        isi_artikel_lengkap: art.isi_artikel_lengkap || art.ringkasan || '',
        waktu_baca: art.waktu_baca || '2 mnt baca',
        imageKeyword: keyword,
        image_keyword: keyword,
        imageUrl: imgUrl,
      };
    });

    // Format new menus
    const formattedMenus = parsed.new_menus.map((m: any, idx: number) => {
      const keyword = m.imageKeyword || m.image_keyword || `${m.nama_menu} delicious indonesian snack`;
      const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(keyword + ', food photography')}?width=600&height=400&nologo=true&seed=${m.id || idx + 100}`;
      return {
        id: m.id || `ai-menu-${idx + 1}-${Date.now()}`,
        nama_menu: m.nama_menu,
        deskripsi_menggugah_selera: m.deskripsi_menggugah_selera,
        kategori: m.kategori || 'Camilan Pedas Gurih',
        estimasi_harga_rupiah: Number(m.estimasi_harga_rupiah) || 24000,
        alasan_populer: m.alasan_populer,
        badge: '✨ Baru & Viral',
        imageKeyword: keyword,
        image_keyword: keyword,
        imageUrl: imgUrl,
        image: imgUrl,
      };
    });

    // Format auto-discovered products
    const rawDiscovered = Array.isArray(parsed.auto_discovered_products) && parsed.auto_discovered_products.length > 0
      ? parsed.auto_discovered_products
      : getFallbackTrends().auto_discovered_products;

    const formattedProducts = rawDiscovered.map((p: any, idx: number) => {
      const pId = p.id || `ai-prod-${idx + 1}-${Date.now()}`;
      const promptText = p.imagePrompt || `${p.name}, professional food photography, appetizing`;
      return {
        id: pId,
        name: p.name,
        category: p.category || 'Tren Viral',
        price: Number(p.price) || 25000,
        description: p.description,
        badge: '✨ Baru & Viral',
        imagePrompt: promptText,
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText + ', high quality food photography, studio lighting')}?width=600&height=600&nologo=true&seed=${pId}`,
      };
    });

    const payload = {
      trending_articles: formattedArticles,
      new_menus: formattedMenus,
      auto_discovered_products: formattedProducts,
      grounded: true,
      date_key: dateKey,
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
      quotaCooldownUntil = Date.now() + 15 * 60 * 1000;
      console.warn(
        '[Trends API] Gemini API quota limit reached (429). Entering 15-minute cooldown and serving curated live trends dataset.'
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

// Dedicated API: Auto-Discover Trending Products
app.get('/api/auto-discover-products', async (req, res) => {
  const isForce = req.query.force === 'true';
  const url = isForce ? 'http://localhost:' + PORT + '/api/trends?force=true' : 'http://localhost:' + PORT + '/api/trends';
  try {
    if (serverTrendsCache?.data?.auto_discovered_products && !isForce) {
      return res.json({
        products: serverTrendsCache.data.auto_discovered_products,
        cached: true,
      });
    }
    const fallback = getFallbackTrends();
    return res.json({
      products: fallback.auto_discovered_products,
      date_key: fallback.date_key,
    });
  } catch {
    const fallback = getFallbackTrends();
    return res.json({
      products: fallback.auto_discovered_products,
      date_key: fallback.date_key,
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
