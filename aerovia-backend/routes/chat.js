import express from 'express';

const router = express.Router();

const SYSTEM_PROMPT = `You are the Aerovia AI Concierge — an elite travel intelligence system for the Aerovia travel booking platform. Your personality:
- Speak like a knowledgeable, well-travelled editorial writer, not a chatbot
- Be concise but evocative. Use short, punchy sentences mixed with longer editorial ones
- Give specific, confident recommendations with price estimates in Indian Rupees (₹)
- Reference real destinations, airlines, hotels and experiences
- If someone asks about flights, hotels, packages or travel from India, be specific
- Use bold with **text** for destination names and key facts
- Keep responses under 150 words unless asked for detail
- Never say "I'm just an AI" — stay in character as a premium travel concierge
- Always end with a concrete next suggestion or question to move the conversation forward
- Aerovia serves travellers primarily from India

Aerovia offers: Flights, Hotels, Bus tickets, Curated Travel Packages, Flash Deals, and AI-powered trip planning.`;

// ─── Curated demo replies (used when GEMINI_API_KEY is not set) ───
const DEMO_REPLIES = [
  {
    match: ['tokyo', 'japan', 'kyoto'],
    reply: "**Tokyo** in shoulder season is unbeatable — hit it in **March** for cherry blossom or **November** for clear, cold air over Shinjuku. Air India direct from Delhi is roughly **₹42,000** return, and a 5-night Shinjuku stay runs **₹58,000** all-in. If it's your first time, anchor in **Shibuya** then day-trip to **Kamakura**. Want me to assemble a 7-day Tokyo + Kyoto loop?",
  },
  {
    match: ['iceland', 'aurora', 'northern lights'],
    reply: "**Iceland** is at its most dramatic between **September and February** — that's your aurora window. From India, expect **₹88,000** return via London or Frankfurt. The **Ring Road** in 6 days is the classic move, but if you have 9, do the full circumnavigation including the **Westfjords**. Want me to plan a budget version under ₹1.2L all-inclusive?",
  },
  {
    match: ['morocco', 'marrakech', 'sahara'],
    reply: "**Morocco** punches well above its price — full 7-day **Imperial Cities** circuit (Marrakech, Fes, Chefchaouen, Sahara overnight) lands around **₹28,000** excluding flights. Best months are **October to April**. Fly into Casablanca or Marrakech via Doha for around **₹38,000** return from Mumbai. Want a guided package or a self-driven version?",
  },
  {
    match: ['budget', 'cheap', 'affordable', 'under'],
    reply: "Smart move. Three high-value picks under **₹40,000** all-in (flights + 5 nights): **Bali** (₹32K), **Vietnam** (₹35K), **Sri Lanka** (₹22K). All offer beach, food, and culture without the European price tag. **Vietnam** is the strongest right now — Hanoi to Ho Chi Minh by overnight train, then Phu Quoc to decompress. Want me to sketch a 9-day Vietnam route?",
  },
  {
    match: ['warm', 'beach', 'december', 'winter'],
    reply: "For a warm December, three honest picks: **Maldives** (₹68K, all-inclusive water villa), **Goa** (₹18K, the obvious answer for a reason), or **Phuket** (₹35K, livelier nightlife). If you want zero crowds, push to **Sri Lanka's east coast** — **Arugam Bay** is just opening up its season. Which vibe fits — barefoot luxury, full-throttle, or quiet?",
  },
  {
    match: ['adventure', 'trek', 'mountain', 'patagonia'],
    reply: "**Patagonia** is the gold standard — granite spires, glaciers calving, total silence. Best window is **November to February**. Budget **₹72,000** for the **Torres del Paine W-Trek** (7 days, hut-to-hut), or scale up to ₹96K for the full **El Chaltén + Perito Moreno** loop. Flights from India run ₹95K+. Want a softer alternative? **Iceland** or **Ladakh** both deliver scale without the 22-hour flight.",
  },
  {
    match: ['package', 'all inclusive', 'all-inclusive'],
    reply: "Aerovia's bestsellers right now: **5-day Tokyo Electric Immersion** at ₹58K, **7-day Morocco Imperial Cities** at ₹28K, and the **6-day Iceland Ring Road North** at ₹88K. All include accommodation, key transfers, and curated experiences — flights are separate. Which appeals most?",
  },
  {
    match: ['flight', 'fly', 'cheapest'],
    reply: "Direct flights win on time, connections win on price. From **Delhi**, the smartest indirect routes right now: Tokyo via Bangkok (Thai, **₹36K**), Reykjavik via Frankfurt (Lufthansa, **₹74K**), Marrakech via Doha (Qatar, **₹38K**). For direct, **Air India to Tokyo** is reliably ₹42-48K return. Want me to lock a route for specific dates?",
  },
  {
    match: ['hello', 'hi', 'hey', 'help', 'start'],
    reply: "Welcome to **Aerovia**. I plan trips the way a friend who travels for a living would — opinionated, specific, no fluff. Tell me one of three things: **a destination** you're curious about, **a vibe** (warm, wild, cultural, lazy), or **a budget**. I'll take it from there. Where are we going?",
  },
];

function pickDemoReply(text) {
  const lower = (text || '').toLowerCase();
  for (const candidate of DEMO_REPLIES) {
    if (candidate.match.some(k => lower.includes(k))) return candidate.reply;
  }
  return "Good prompt. Without a live AI link I can still steer you well — the strongest current value picks from India are **Vietnam** (₹35K), **Morocco** (₹28K base), and **Iceland** if you want drama (₹88K). Tell me a vibe or a month and I'll narrow it down.";
}

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required.' });
    }

    const lastUser = messages[messages.length - 1];

    // ── Demo mode: no API key configured ──
    if (!process.env.GEMINI_API_KEY) {
      const reply = pickDemoReply(lastUser?.content || '');
      return res.json({ success: true, reply, mode: 'demo' });
    }

    // ── Live Gemini call ──
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // "Lite" models first — they have the highest free-tier quotas and are
    // more than enough for a concierge chat. Fall through to bigger models
    // only if every lite tier is busy.
    const candidateModels = process.env.GEMINI_MODEL
      ? [process.env.GEMINI_MODEL]
      : [
          'gemini-2.5-flash-lite',
          'gemini-2.0-flash-lite',
          'gemini-flash-latest',
          'gemini-2.5-flash',
          'gemini-2.0-flash',
        ];

    const allMessages = [...messages];
    const lastUserMessage = allMessages.pop();

    const history = allMessages.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const isOverloaded = (msg = '') => /\b503\b|overload|high demand|unavailable/i.test(msg);
    const isQuota = (msg = '') => /\b429\b|quota|rate.?limit|exceeded/i.test(msg);

    let lastError;
    for (const modelName of candidateModels) {
      // Up to 2 attempts per model: if first try is a transient 503, retry once.
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const chat = model.startChat({
            history: [
              { role: 'user', parts: [{ text: 'Who are you?' }] },
              { role: 'model', parts: [{ text: SYSTEM_PROMPT }] },
              ...history,
            ],
          });
          const result = await chat.sendMessage(lastUserMessage.content);
          return res.json({
            success: true,
            reply: result.response.text(),
            mode: 'live',
            model: modelName,
          });
        } catch (err) {
          lastError = err;
          const short = (err.message || '').slice(0, 200);
          console.warn(`[chat] ${modelName} attempt ${attempt + 1} failed: ${short}`);

          // Quota exhaustion — no point retrying this model, jump to next.
          if (isQuota(err.message)) break;

          // Transient overload — short backoff and retry once.
          if (isOverloaded(err.message) && attempt === 0) {
            await sleep(600);
            continue;
          }
          break;
        }
      }
    }
    throw lastError || new Error('All Gemini models failed');
  } catch (err) {
    console.error('[chat error]', err.message);
    // Always degrade gracefully — fall back to a demo reply rather than 500
    const lastUser = req.body?.messages?.[req.body.messages.length - 1];
    const reply = pickDemoReply(lastUser?.content || '');
    res.json({ success: true, reply, mode: 'fallback' });
  }
});

export default router;
