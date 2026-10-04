const { buildRecipePrompt } = require('./prompts');
const { extractAndCleanJson, validateRecipe } = require('./schema');

const DEFAULT_GEMMA_MODEL = 'gemma-3-27b-it';

/**
 * Extract recipe using Gemma via Google AI Studio generateContent API
 */
async function callGemmaAPI({ prompt, images = [], apiKey, model = DEFAULT_GEMMA_MODEL }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const parts = [{ text: prompt }];

  if (Array.isArray(images) && images.length > 0) {
    for (const img of images) {
      if (img && img.buffer && img.mimetype) {
        parts.push({
          inline_data: {
            mime_type: img.mimetype,
            data: img.buffer.toString('base64')
          }
        });
      }
    }
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 3072
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Google AI Studio Gemma API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidate = data.candidates && data.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      throw new Error('Empty or blocked response from Gemma model');
    }

    const rawText = candidate.content.parts.map(p => p.text || '').join('');
    return rawText;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Extract recipe using any OpenAI-compatible endpoint (Ollama, vLLM, LM Studio)
 */
async function callOpenAICompatAPI({ prompt, images = [], baseUrl, model, apiKey = '' }) {
  const cleanBase = (baseUrl || 'http://localhost:11434/v1').replace(/\/+$/, '');
  const url = `${cleanBase}/chat/completions`;

  const contentParts = [{ type: 'text', text: prompt }];

  if (Array.isArray(images) && images.length > 0) {
    for (const img of images) {
      if (img && img.buffer && img.mimetype) {
        contentParts.push({
          type: 'image_url',
          image_url: {
            url: `data:${img.mimetype};base64,${img.buffer.toString('base64')}`
          }
        });
      }
    }
  }

  const payload = {
    model: model || 'gemma:27b',
    messages: [
      {
        role: 'user',
        content: contentParts
      }
    ],
    temperature: 0.2
  };

  const headers = {
    'Content-Type': 'application/json'
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`OpenAI-compatible LLM error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const message = data.choices && data.choices[0] && data.choices[0].message;
    if (!message || !message.content) {
      throw new Error('Empty response from OpenAI-compatible LLM endpoint');
    }

    return message.content;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fallback mock response for offline / key-less evaluation
 */
function getMockExtraction(userText = '') {
  const isKhichuri = /khichuri|খিচুড়ি|ডাল|চাল/i.test(userText);
  const isIlish = /ilish|ইলিশ|সর্ষে/i.test(userText);

  if (isIlish) {
    return {
      title_bn: "দাদুর সর্ষে ইলিশ (নোট থেকে উদ্ধারকৃত)",
      title_en: "Dadu's Mustard Hilsa (Transcribed from Notes)",
      ingredients: [
        { name_bn: "ইলিশ মাছের টুকরো", name_en: "Hilsa fish steaks", quantity: "4", unit: "pieces" },
        { name_bn: "কালো ও হলুদ সর্ষে বাটা", name_en: "Mustard paste", quantity: "2.5", unit: "tbsp" },
        { name_bn: "কাঁচা লঙ্কা", name_en: "Green chillies", quantity: "5", unit: "pieces" },
        { name_bn: "সর্ষের তেল", name_en: "Pure mustard oil", quantity: "3", unit: "tbsp" },
        { name_bn: "কালো জিরে", name_en: "Nigella seeds (kalo jeere)", quantity: "0.5", unit: "tsp" },
        { name_bn: "হলুদ গুঁড়ো", name_en: "Turmeric powder", quantity: "0.5", unit: "tsp" },
        { name_bn: "লবণ", name_en: "Salt", quantity: "1", unit: "tsp" }
      ],
      steps_bn: [
        "মাছের টুকরোগুলো ভালো করে ধুয়ে জল ঝরিয়ে নুন ও সামান্য হলুদ মাখিয়ে ১০ মিনিট রাখুন।",
        "কড়াইয়ে খাঁটি সর্ষের তেল ধোঁয়া ওঠা পর্যন্ত গরম করুন, তারপর গ্যাস কমিয়ে কালো জিরে ও চেরা কাঁচা লঙ্কা ফোড়ন দিন।",
        "সর্ষে বাটা জল দিয়ে গুলে কড়াইয়ে ঢালুন, হলুদ ও নুন দিন। ফুটে উঠলে মাছের টুকরো সাবধানে ছেড়ে দিন।",
        "ঢাকা দিয়ে মাঝারি আঁচে ৭-৮ মিনিট রান্না করুন। নামানোর আগে উপর থেকে কাঁচা সর্ষের তেল ও দুটি কাঁচা লঙ্কা ছড়িয়ে নামিয়ে নিন।"
      ],
      steps_en: [
        "Wash hilsa steaks, drain well, and marinate with salt and a pinch of turmeric for 10 minutes.",
        "Heat pure mustard oil until smoky, lower heat and temper with nigella seeds and slit green chillies.",
        "Mix the mustard paste with 1 cup warm water and pour into the pan with remaining turmeric and salt. Bring to a gentle boil.",
        "Carefully slide in the fish steaks, cover and simmer on medium flame for 7-8 minutes.",
        "Drizzle 1 tbsp raw pungent mustard oil and slit chillies on top right before turning off the heat."
      ],
      servings: 4,
      time_minutes: 25,
      notes: "সর্ষে বাটার সময় অবশ্যই এক চিমটি নুন আর একটা কাঁচা লঙ্কা দেবে যেন তিতকুটে না হয়। রান্নার শেষে কাঁচা তেলের ঝাঁঝ ছাড়া এই রান্না অসম্পূর্ণ।",
      uncertain: [
        "সর্ষের অনুপাত: হলুদ ও কালো সর্ষের ভাগ নোটে উল্লেখ নেই (সমপরিমাণ ধরা হয়েছে)",
        "জলের পরিমাণ ছেঁড়া কাগজে অস্পষ্ট ছিল"
      ]
    };
  }

  // Default rich Bengali culinary transcription
  return {
    title_bn: "দাদুর মনমাতানো পঞ্চফোড়ন খিচুড়ি",
    title_en: "Dadu's Fragrant Panch Phoron Khichuri",
    ingredients: [
      { name_bn: "গোবিন্দভোগ চাল", name_en: "Gobindobhog aromatic rice", quantity: "1", unit: "cup" },
      { name_bn: "ভাজা মুগ ডাল", name_en: "Roasted yellow moong dal", quantity: "1", unit: "cup" },
      { name_bn: "ঘি", name_en: "Desi ghee", quantity: "2", unit: "tbsp" },
      { name_bn: "সর্ষের তেল", name_en: "Mustard oil", quantity: "2", unit: "tbsp" },
      { name_bn: "পঞ্চফোড়ন", name_en: "Panch phoron (Bengali 5-spice)", quantity: "1", unit: "tsp" },
      { name_bn: "শুকনো লঙ্কা ও তেজপাতা", name_en: "Dried bay leaf & red chillies", quantity: "2", unit: "pieces" },
      { name_bn: "আদা বাটা", name_en: "Fresh ginger paste", quantity: "1", unit: "tbsp" },
      { name_bn: "জিরে গুঁড়ো", name_en: "Cumin powder", quantity: "1", unit: "tsp" },
      { name_bn: "হলুদ গুঁড়ো", name_en: "Turmeric powder", quantity: "0.5", unit: "tsp" },
      { name_bn: "কাঁচা লঙ্কা", name_en: "Green chillies", quantity: "4", unit: "pieces" },
      { name_bn: "চিনি", name_en: "Sugar", quantity: "0.5", unit: "tsp" },
      { name_bn: "লবণ", name_en: "Salt", quantity: "1.5", unit: "tsp" }
    ],
    steps_bn: [
      "শুকনো কড়াইতে মুগ ডাল হালকা লালচে সুবাস বের হওয়া পর্যন্ত ভেজে ধুয়ে নিন। গোবিন্দভোগ চালও ধুয়ে জল ঝরিয়ে রাখুন।",
      "হাঁড়িতে সর্ষের তেল গরম করে তেজপাতা, শুকনো লঙ্কা ও পঞ্চফোড়ন ফোড়ন দিন।",
      "আদা বাটা, জিরে গুঁড়ো, হলুদ গুঁড়ো ও সামান্য জল দিয়ে মশলা ভালো করে কষিয়ে নিন।",
      "ধুয়ে রাখা চাল ও ডাল ঢেলে মশলার সঙ্গে ২ মিনিট নাড়াচাড়া করুন।",
      "চার কাপ ফুটন্ত গরম জল, নুন ও কাঁচা লঙ্কা দিয়ে মাঝারি আঁচে ঢাকা দিয়ে ফুটতে দিন। চাল-ডাল সেদ্ধ হয়ে মাখামাখা হওয়া পর্যন্ত রান্না করুন।",
      "নামানোর আগে উপর থেকে খাঁটি গাওয়া ঘি ও সামান্য চিনি ছড়িয়ে নেড়ে ঢাকা বন্ধ রাখুন ৫ মিনিট।"
    ],
    steps_en: [
      "Dry-roast the moong dal on medium heat until fragrant and slightly golden, then wash gently along with the Gobindobhog rice.",
      "Heat mustard oil in a heavy-bottomed pot; add bay leaves, dried red chillies, and panch phoron until spluttering.",
      "Add ginger paste, cumin powder, turmeric, and a splash of water; sauté until the oil releases.",
      "Add the drained rice and roasted dal, gently coating them in the aromatic spiced oil for 2 minutes.",
      "Pour in 4 cups of boiling hot water, salt, and slit green chillies. Cover and simmer on low-medium heat until soft and porridge-like.",
      "Finish with fragrant desi ghee and a pinch of sugar; rest covered for 5 minutes before serving."
    ],
    servings: 4,
    time_minutes: 40,
    notes: "ডাল বেশি কড়া ভাজলে খিচুড়ি শক্ত হবে, হালকা লালচে রঙ হলেই নামাবে। চাল-ডাল সমপরিমাণ হওয়া চাই, আর জল সবসময় ফুটন্ত দেবে।",
    uncertain: [
      "ঘিয়ের পরিমাণ অস্পষ্ট (হাতে লেখা নোটে '১ বা ২ চামচ' কিছুটা কাটাছেঁড়া ছিল)",
      "চিনির মাপ: দিদিমার লেখায় 'এক চিমটি মিষ্টি' লেখা ছিল"
    ]
  };
}

/**
 * Main recipe extraction workflow with repair and retry (max 2 retries)
 */
async function extractRecipe({ text = '', images = [] }) {
  const provider = (process.env.LLM_PROVIDER || 'gemma').toLowerCase();
  const gemmaKey = process.env.GEMMA_API_KEY || '';
  const gemmaModel = process.env.GEMMA_MODEL || DEFAULT_GEMMA_MODEL;
  const baseUrl = process.env.LLM_BASE_URL || 'http://localhost:11434/v1';
  const openAiModel = process.env.LLM_MODEL || 'gemma:27b';
  const openAiKey = process.env.LLM_API_KEY || '';

  // If running in gemma mode without an API key, provide helpful demo mock extraction
  if (provider === 'gemma' && !gemmaKey) {
    const mock = getMockExtraction(text);
    return {
      ...mock,
      _meta: {
        provider: 'mock-offline',
        model: 'demo-fallback',
        warning: 'GEMMA_API_KEY not configured in environment. Returned demonstration recipe with verified Bengali structure.'
      }
    };
  }

  const prompt = buildRecipePrompt(text);
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      let currentPrompt = prompt;
      if (attempt > 1 && lastError) {
        currentPrompt = `${prompt}\n\nATTENTION: Attempt #${attempt}. Your previous response failed with error: "${lastError.message}". Output ONLY valid, strictly well-formed JSON conforming exactly to the schema. No markdown wrapper, no unescaped characters.`;
      }

      let rawResponse = '';
      if (provider === 'openai_compat') {
        rawResponse = await callOpenAICompatAPI({
          prompt: currentPrompt,
          images,
          baseUrl,
          model: openAiModel,
          apiKey: openAiKey
        });
      } else {
        // default: gemma
        rawResponse = await callGemmaAPI({
          prompt: currentPrompt,
          images,
          apiKey: gemmaKey,
          model: gemmaModel
        });
      }

      const cleanJsonString = extractAndCleanJson(rawResponse);
      const parsed = JSON.parse(cleanJsonString);
      const validated = validateRecipe(parsed);

      return {
        ...validated,
        _meta: {
          provider,
          model: provider === 'openai_compat' ? openAiModel : gemmaModel,
          attempts: attempt
        }
      };
    } catch (err) {
      lastError = err;
      // If we still have retries, continue loop
      if (attempt === 3) {
        throw new Error(`Failed to extract recipe after 3 attempts: ${lastError.message}`);
      }
    }
  }

  throw lastError || new Error('Unknown extraction error');
}

module.exports = {
  extractRecipe,
  getMockExtraction
};
