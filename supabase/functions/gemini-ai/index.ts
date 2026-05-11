// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_API_KEY');
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const PRODUCT_CONTEXT_LIMIT = 20;
const PRODUCT_FETCH_LIMIT = 40;

const supabase = SUPABASE_URL && SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const diagnosisSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    plantLikely: { type: 'string' },
    confidence: { type: 'number' },
    severity: { type: 'string', enum: ['low', 'medium', 'high', 'unclear'] },
    likelyProblems: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          confidence: { type: 'number' },
          evidence: { type: 'string' },
        },
        required: ['name', 'confidence', 'evidence'],
      },
    },
    causes: { type: 'array', maxItems: 3, items: { type: 'string' } },
    immediateActions: { type: 'array', maxItems: 4, items: { type: 'string' } },
    carePlan: {
      type: 'array',
      maxItems: 4,
      items: {
        type: 'object',
        properties: {
          step: { type: 'string' },
          timing: { type: 'string' },
        },
        required: ['step', 'timing'],
      },
    },
    nepalNotes: { type: 'array', maxItems: 3, items: { type: 'string' } },
    prevention: { type: 'array', maxItems: 4, items: { type: 'string' } },
    productRecommendations: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          reason: { type: 'string' },
          usage: { type: 'string' },
          priority: { type: 'string', enum: ['essential', 'helpful', 'optional'] },
        },
        required: ['id', 'name', 'reason', 'usage', 'priority'],
      },
    },
    askForMoreInfo: { type: 'array', maxItems: 3, items: { type: 'string' } },
    disclaimer: { type: 'string' },
  },
  required: [
    'summary',
    'plantLikely',
    'confidence',
    'severity',
    'likelyProblems',
    'causes',
    'immediateActions',
    'carePlan',
    'nepalNotes',
    'prevention',
    'productRecommendations',
    'askForMoreInfo',
    'disclaimer',
  ],
};

const chatSchema = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    productRecommendations: {
      type: 'array',
      maxItems: 2,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['id', 'name', 'reason'],
      },
    },
    suggestedActions: { type: 'array', maxItems: 3, items: { type: 'string' } },
  },
  required: ['reply', 'productRecommendations', 'suggestedActions'],
};

const jsonResponse = (body, status = 200) => (
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
);

const httpError = (message, status = 500) => Object.assign(new Error(message), { status });

const cleanText = (value, maxLength = 600) => (
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
);

const stripCodeFence = (value) => (
  String(value || '')
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
);

const parseJsonLenient = (value) => {
  const text = stripCodeFence(value);
  const candidates = [text];
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start !== -1 && end > start) {
    candidates.push(text.slice(start, end + 1));
  }

  for (const candidate of candidates) {
    const cleaned = candidate.replace(/,\s*([}\]])/g, '$1');
    try {
      return JSON.parse(cleaned);
    } catch {
      // Try the next candidate.
    }
  }

  return null;
};

const extractStringField = (text, field, fallback = '') => {
  const match = stripCodeFence(text).match(new RegExp(`"${field}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)`, 'i'));
  if (!match) return fallback;

  try {
    return JSON.parse(`"${match[1]}"`);
  } catch {
    return cleanText(match[1], 500) || fallback;
  }
};

const extractNumberField = (text, field, fallback = 0) => {
  const match = stripCodeFence(text).match(new RegExp(`"${field}"\\s*:\\s*([0-9.]+)`, 'i'));
  return match ? Number(match[1]) : fallback;
};

const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const buildChatFallback = (rawText) => {
  const reply = extractStringField(rawText, 'reply', cleanText(rawText.replace(/[{}[\]",]/g, ' '), 420));

  return {
    reply: reply || 'I can help with plant care, gifts, and checkout. Please ask once more with one specific question.',
    productRecommendations: [],
    suggestedActions: ['Browse gift-ready products', 'Find easy-care plants', 'Checkout help'],
    recoveredFromMalformedJson: true,
  };
};

const buildDiagnosisFallback = (rawText) => {
  const summary = extractStringField(
    rawText,
    'summary',
    'The image shows visible plant stress, but the AI response was incomplete. Start with cautious care: isolate the plant, inspect leaves and stems closely, and adjust watering only after checking soil moisture.',
  );
  const likelyProblem = extractStringField(rawText, 'name', 'Visible leaf stress');

  return {
    summary,
    plantLikely: extractStringField(rawText, 'plantLikely', 'Unclear from image'),
    confidence: Math.min(0.75, Math.max(0.35, extractNumberField(rawText, 'confidence', 0.55))),
    severity: extractStringField(rawText, 'severity', 'unclear'),
    likelyProblems: [{
      name: likelyProblem,
      confidence: Math.min(0.75, Math.max(0.35, extractNumberField(rawText, 'confidence', 0.55))),
      evidence: extractStringField(rawText, 'evidence', 'Visible discoloration or damage is present, but the response was incomplete.'),
    }],
    causes: ['Possible watering imbalance, humidity stress, pest damage, or fungal leaf spotting.'],
    immediateActions: [
      'Move the plant away from other plants until you inspect the leaves and stems.',
      'Check soil moisture before watering again; keep drainage clear.',
      'Remove badly damaged leaves with clean scissors.',
      'Wipe nearby leaves and inspect the undersides for pests.',
    ],
    carePlan: [
      { timing: 'Today', step: 'Isolate the plant and remove heavily damaged leaf tissue.' },
      { timing: 'Next watering', step: 'Water only when the topsoil has dried; avoid letting the pot sit in water.' },
      { timing: 'This week', step: 'Improve airflow and bright indirect light, especially during humid Nepal weather.' },
    ],
    nepalNotes: ['In Nepal homes, monsoon humidity can make fungal spots spread faster, while dry winter rooms can brown leaf edges.'],
    prevention: ['Avoid overhead watering.', 'Clean leaves regularly.', 'Keep the pot draining freely.'],
    productRecommendations: [],
    askForMoreInfo: ['Share a closer photo of the leaf underside.', 'Mention watering frequency and light exposure.'],
    disclaimer: 'This is cautious guidance from the uploaded image. Consult a local nursery or agronomist if damage spreads quickly.',
    recoveredFromMalformedJson: true,
  };
};

const normalizeProduct = (product) => ({
  id: String(product.id),
  name: cleanText(product.name, 120),
  category: cleanText(product.category || 'Indoor Plants', 80),
  price: Number(product.price || 0),
  tags: Array.isArray(product.tags) ? product.tags.map((tag) => cleanText(tag, 50)).filter(Boolean).slice(0, 5) : [],
  description: cleanText(product.description || product.info || product.curator_quote, 180),
  image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
  stock: Number(product.stock || 0),
});

const productCareScore = (product) => {
  const text = [
    product.name,
    product.category,
    product.description,
    ...(product.tags || []),
  ].join(' ').toLowerCase();

  const careTerms = [
    'care',
    'tool',
    'soil',
    'fertilizer',
    'feed',
    'neem',
    'spray',
    'mist',
    'meter',
    'pruning',
    'scissor',
    'watering',
    'fungal',
    'diagnosis',
  ];

  const careScore = careTerms.reduce((score, term) => score + (text.includes(term) ? 2 : 0), 0);
  const stockScore = product.stock > 0 ? 2 : 0;
  return careScore + stockScore;
};

const rankProductsForPrompt = (products) => (
  [...products]
    .sort((a, b) => productCareScore(b) - productCareScore(a))
    .slice(0, PRODUCT_CONTEXT_LIMIT)
);

const loadProducts = async () => {
  if (!supabase) return [];

  try {
    const activeResult = await supabase
      .from('products')
      .select('id,name,price,category,tags,description,info,curator_quote,images,stock,is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(PRODUCT_FETCH_LIMIT);

    if (!activeResult.error) {
      return rankProductsForPrompt((activeResult.data || []).map(normalizeProduct));
    }

    const fallbackResult = await supabase
      .from('products')
      .select('id,name,price,category,tags,description,info,curator_quote,images,stock')
      .order('created_at', { ascending: false })
      .limit(PRODUCT_FETCH_LIMIT);

    if (fallbackResult.error) throw fallbackResult.error;
    return rankProductsForPrompt((fallbackResult.data || []).map(normalizeProduct));
  } catch (error) {
    console.error('Product lookup failed:', error.message);
    return [];
  }
};

const callGemini = async ({
  contents,
  responseJsonSchema,
  maxOutputTokens = 1800,
  fallback,
}) => {
  if (!GEMINI_API_KEY) {
    throw httpError('Missing GEMINI_API_KEY Supabase secret.', 500);
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.24,
        maxOutputTokens,
        responseMimeType: 'application/json',
        responseSchema: responseJsonSchema,
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.message || `Gemini request failed with ${response.status}.`;
    if (response.status === 429 || message.toLowerCase().includes('quota')) {
      throw httpError('Free Gemini quota reached. Please wait and try again later.', 429);
    }
    throw httpError(message, response.status >= 400 && response.status < 500 ? 400 : 502);
  }

  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  const parsed = parseJsonLenient(text);
  if (parsed) return parsed;

  console.error('Gemini returned malformed JSON:', text.slice(0, 1200));
  if (fallback) return fallback(text);

  throw httpError('Gemini returned JSON that could not be parsed.', 502);
};

const attachValidProducts = (recommendations, products) => {
  const productsById = new Map(products.map((product) => [String(product.id), product]));

  return (recommendations || [])
    .map((item) => {
      const product = productsById.get(String(item.id));
      if (!product) return null;
      return {
        ...item,
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
      };
    })
    .filter(Boolean)
    .slice(0, 4);
};

const normalizeDiagnosisResult = (result) => ({
  summary: cleanText(result.summary, 700) || 'The plant shows visible stress that needs closer inspection.',
  plantLikely: cleanText(result.plantLikely, 120) || 'Unclear from image',
  confidence: Number.isFinite(Number(result.confidence)) ? Number(result.confidence) : 0.5,
  severity: ['low', 'medium', 'high', 'unclear'].includes(result.severity) ? result.severity : 'unclear',
  likelyProblems: asArray(result.likelyProblems).slice(0, 3).map((item) => ({
    name: cleanText(item.name, 100) || 'Visible plant stress',
    confidence: Number.isFinite(Number(item.confidence)) ? Number(item.confidence) : 0.5,
    evidence: cleanText(item.evidence, 240) || 'Visible symptoms in the uploaded image.',
  })),
  causes: asArray(result.causes).slice(0, 3).map((item) => cleanText(item, 180)),
  immediateActions: asArray(result.immediateActions).slice(0, 4).map((item) => cleanText(item, 180)),
  carePlan: asArray(result.carePlan).slice(0, 4).map((item) => ({
    step: cleanText(item.step, 180) || 'Monitor the plant and adjust care gradually.',
    timing: cleanText(item.timing, 80) || 'Next',
  })),
  nepalNotes: asArray(result.nepalNotes).slice(0, 3).map((item) => cleanText(item, 180)),
  prevention: asArray(result.prevention).slice(0, 4).map((item) => cleanText(item, 180)),
  productRecommendations: asArray(result.productRecommendations).slice(0, 3),
  askForMoreInfo: asArray(result.askForMoreInfo).slice(0, 3).map((item) => cleanText(item, 160)),
  disclaimer: cleanText(result.disclaimer, 300) || 'This is image-based guidance, not a definitive laboratory diagnosis.',
  recoveredFromMalformedJson: Boolean(result.recoveredFromMalformedJson),
});

const dedupeActions = (items) => (
  [...new Set(asArray(items).map((item) => cleanText(item, 80)).filter(Boolean))].slice(0, 3)
);

const buildContextualChatActions = (latestMessage, actions) => {
  const lower = cleanText(latestMessage, 500).toLowerCase();
  const hasAny = (words) => words.some((word) => lower.includes(word));

  if (hasAny(['gift', 'friend', 'send', 'present', 'birthday', 'housewarming'])) {
    return ['Browse gift-ready products', 'Find easy-care plants', 'Checkout help'];
  }

  if (hasAny(['diagnosis', 'diagnose', 'yellow', 'drooping', 'pest', 'fungal', 'sick', 'spots'])) {
    return ['Open AI diagnosis', 'Find care tools', 'Ask about watering'];
  }

  if (hasAny(['order', 'delivery', 'track', 'payment', 'checkout'])) {
    return ['Open my orders', 'Checkout help', 'Browse gift-ready products'];
  }

  return dedupeActions(actions);
};

const normalizeChatResult = (result, latestMessage = '') => ({
  reply: cleanText(result.reply, 700) || 'I can help with plant care, products, gifts, and checkout.',
  productRecommendations: asArray(result.productRecommendations).slice(0, 2),
  suggestedActions: buildContextualChatActions(latestMessage, result.suggestedActions),
  recoveredFromMalformedJson: Boolean(result.recoveredFromMalformedJson),
});

const handleDiagnosis = async (body) => {
  const image = body.image || {};
  const imageData = String(image.data || '').replace(/^data:[^,]+,/, '');
  const mimeType = image.mimeType || 'image/jpeg';

  if (!imageData) {
    return jsonResponse({ error: 'Upload a plant image before running diagnosis.' }, 400);
  }

  const products = await loadProducts();
  const userNotes = cleanText(body.notes, 900);
  const region = cleanText(body.region || 'Kathmandu, Nepal', 120);

  const prompt = `
You are CHLORO's plant diagnosis assistant for homes and balconies in Nepal.
Analyze the uploaded plant photo and produce practical, cautious plant-care guidance.

Local context:
- Default region is ${region}; consider Kathmandu valley homes, monsoon humidity, dry winter air, balcony dust, hard tap water, overwatering during humid weeks, and bright indirect indoor light.
- Do not claim certainty from the image alone. Use "unclear" when the photo does not show enough detail.
- Recommend professional nursery/agronomist help for severe pest infestation, spreading fungal disease, root rot, or valuable plants.

Product recommendation rules:
- Recommend only products from the available CHLORO product list below.
- If the list is empty or no item fits, return an empty productRecommendations array.
- Never invent product IDs, prices, pesticides, or medicines.
- Keep every string concise: summary under 55 words, care steps under 20 words each.
- Return complete minified JSON only. No markdown.

User notes: ${userNotes || 'None'}
Available CHLORO products JSON:
${JSON.stringify(products)}
`.trim();

  const result = await callGemini({
    contents: [{
      role: 'user',
      parts: [
        { text: prompt },
        { inlineData: { mimeType, data: imageData } },
      ],
    }],
    responseJsonSchema: diagnosisSchema,
    maxOutputTokens: 4096,
    fallback: buildDiagnosisFallback,
  });
  const normalized = normalizeDiagnosisResult(result);

  return jsonResponse({
    ...normalized,
    productRecommendations: attachValidProducts(normalized.productRecommendations, products),
    model: GEMINI_MODEL,
  });
};

const handleChat = async (body) => {
  const products = await loadProducts();
  const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
  const context = cleanText(body.context, 180);

  const transcript = messages
    .map((message) => `${message.sender === 'bot' ? 'Assistant' : 'Customer'}: ${cleanText(message.text, 520)}`)
    .join('\n');
  const latestCustomerMessage = [...messages].reverse().find((message) => message.sender !== 'bot')?.text || '';

  const prompt = `
You are Sprout, CHLORO's smart botanical shopping and care assistant for Nepal.
Answer the latest customer message using concise, friendly, practical guidance.

Rules:
- Be specific to Nepal when useful: Kathmandu valley, monsoon humidity, dry winter rooms, balcony sun, dust, and indoor watering.
- For possible diseases or pests, give safe first steps and suggest the /ai-diagnosis image upload page when a visual diagnosis is needed.
- For gift questions, use the recipient city, budget, occasion, and care level when provided. Suggest gift-ready or easy-care options and the /products-gifts page; do not suggest diagnosis unless the customer mentions symptoms or an image.
- For delivery or checkout questions, say the recipient address can be entered at checkout, but do not promise coverage, timing, or fees unless product/order data says so.
- Recommend only products from the CHLORO product list below. If none fit or the list is empty, return no product recommendations.
- Do not invent stock, discounts, delivery promises, pesticides, or medical claims.
- Keep the reply under 90 words unless the user asks for detail.
- Suggested actions must match the latest customer intent. Avoid "Open AI diagnosis" for shopping, gifts, checkout, or order-tracking requests.
- Return complete minified JSON only. No markdown.

Current page/category context: ${context || 'General shop assistant'}
Available CHLORO products JSON:
${JSON.stringify(products)}

Conversation:
${transcript || 'Customer: Hi'}
`.trim();

  const result = await callGemini({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    responseJsonSchema: chatSchema,
    maxOutputTokens: 2048,
    fallback: buildChatFallback,
  });
  const normalized = normalizeChatResult(result, latestCustomerMessage);

  return jsonResponse({
    ...normalized,
    productRecommendations: attachValidProducts(normalized.productRecommendations, products),
    model: GEMINI_MODEL,
  });
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));

    if (body.mode === 'diagnosis') {
      return await handleDiagnosis(body);
    }

    if (body.mode === 'chat') {
      return await handleChat(body);
    }

    return jsonResponse({ error: 'Unsupported Gemini mode.' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Gemini assistant failed.' }, error.status || 500);
  }
});
