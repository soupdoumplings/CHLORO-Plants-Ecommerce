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
    recoveryProtocol: {
      type: 'array',
      minItems: 3,
      maxItems: 4,
      items: {
        type: 'object',
        properties: {
          timing: { type: 'string' },
          step: { type: 'string' },
        },
        required: ['timing', 'step'],
      },
    },
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
    'recoveryProtocol',
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

const includesAny = (text, terms) => terms.some((term) => text.includes(term));

const getDiagnosisIssueType = (text) => {
  const lower = cleanText(text, 2000).toLowerCase();

  if (includesAny(lower, ['pest', 'insect', 'mite', 'webbing', 'sticky', 'scale', 'thrip', 'aphid', 'chewed', 'holes', 'feeding'])) return 'pest';
  if (includesAny(lower, ['fungal', 'fungus', 'spot', 'spots', 'lesion', 'blight', 'mildew', 'mold', 'rot spreading'])) return 'fungal';
  if (includesAny(lower, ['overwater', 'waterlogged', 'root rot', 'soggy', 'mushy', 'yellow lower', 'drainage'])) return 'overwatering';
  if (includesAny(lower, ['underwater', 'dry', 'crispy', 'curling', 'wilted', 'shrivel', 'brown tip', 'brown edge'])) return 'dryness';
  if (includesAny(lower, ['sunburn', 'scorch', 'bleached', 'direct sun', 'burnt', 'pale patch'])) return 'light-stress';
  if (includesAny(lower, ['nutrient', 'chlorosis', 'pale leaves', 'deficiency', 'yellowing'])) return 'nutrition';

  return 'general';
};

const buildDynamicRecoveryProtocol = (source) => {
  const text = typeof source === 'string'
    ? source
    : [
      source?.summary,
      source?.plantLikely,
      source?.severity,
      ...asArray(source?.causes),
      ...asArray(source?.immediateActions),
      ...asArray(source?.nepalNotes),
      ...asArray(source?.prevention),
      ...asArray(source?.likelyProblems).flatMap((item) => [item.name, item.evidence]),
    ].join(' ');

  switch (getDiagnosisIssueType(text)) {
    case 'pest':
      return [
        { timing: 'Today', step: 'Isolate the plant and inspect leaf undersides, stems, and new growth for pests.' },
        { timing: 'After inspection', step: 'Wipe visible residue with a damp cloth; test neem spray on one small leaf area.' },
        { timing: 'In 48 hours', step: 'Recheck for fresh bite marks, webbing, or sticky residue before repeating treatment.' },
      ];
    case 'fungal':
      return [
        { timing: 'Today', step: 'Remove the worst spotted leaves with clean scissors and keep foliage dry.' },
        { timing: 'Next watering', step: 'Water soil only; avoid misting while spots are spreading.' },
        { timing: 'This week', step: 'Increase airflow and move the plant away from humid corners or crowded plants.' },
      ];
    case 'overwatering':
      return [
        { timing: 'Today', step: 'Pause watering and check that drainage holes are open and soil is not soggy.' },
        { timing: 'Next watering', step: 'Water only after the topsoil dries and excess water can drain fully.' },
        { timing: 'This week', step: 'Move to bright indirect light and monitor yellowing or soft stems.' },
      ];
    case 'dryness':
      return [
        { timing: 'Today', step: 'Trim crisp edges only if fully dry, then check whether the root ball is pulling away.' },
        { timing: 'Next watering', step: 'Water slowly at soil level until evenly moist, then drain completely.' },
        { timing: 'This week', step: 'Stabilize humidity and keep the plant away from hot windows or dry drafts.' },
      ];
    case 'light-stress':
      return [
        { timing: 'Today', step: 'Move the plant out of direct sun and leave scorched tissue attached unless fully dry.' },
        { timing: 'Next watering', step: 'Keep watering normal; do not compensate for sun damage with extra water.' },
        { timing: 'This week', step: 'Use bright indirect light and watch new leaves for healthier color.' },
      ];
    case 'nutrition':
      return [
        { timing: 'Today', step: 'Check soil moisture and pests first; do not fertilize a stressed or soggy plant.' },
        { timing: 'Next watering', step: 'Flush gently if salts are visible, then return to a steady watering rhythm.' },
        { timing: 'This month', step: 'Feed lightly only after new growth resumes and light is stable.' },
      ];
    default:
      return [
        { timing: 'Today', step: 'Isolate the plant and document the most damaged leaves before changing care.' },
        { timing: 'Next check', step: 'Use soil moisture, leaf undersides, and stem firmness to choose the next action.' },
        { timing: 'This week', step: 'Keep light, airflow, and watering consistent while watching for spread.' },
      ];
  }
};

const buildChatFallback = (rawText) => {
  const reply = extractStringField(rawText, 'reply', cleanText(rawText.replace(/[{}[\]",]/g, ' '), 420));

  return {
    reply: reply || 'I can help with plant care, gifts, and checkout. Please ask once more with one specific question.',
    productRecommendations: [],
    suggestedActions: ['Open AI diagnosis', 'Find easy-care plants', 'Choose a gift'],
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
  const fallbackProtocol = buildDynamicRecoveryProtocol(`${summary} ${likelyProblem} ${rawText}`);

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
    carePlan: fallbackProtocol,
    recoveryProtocol: fallbackProtocol,
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

const hasAnyTerm = (text, terms) => terms.some((term) => text.includes(term));

const getProductSearchText = (product) => [
  product.name,
  product.category,
  product.description,
  ...(product.tags || []),
].join(' ').toLowerCase();

const buildDiagnosisSearchText = (diagnosis) => [
  diagnosis.summary,
  diagnosis.plantLikely,
  diagnosis.severity,
  ...asArray(diagnosis.causes),
  ...asArray(diagnosis.immediateActions),
  ...asArray(diagnosis.nepalNotes),
  ...asArray(diagnosis.prevention),
  ...asArray(diagnosis.likelyProblems).flatMap((item) => [item.name, item.evidence]),
  ...asArray(diagnosis.recoveryProtocol || diagnosis.carePlan).flatMap((item) => [item.timing, item.step]),
].join(' ').toLowerCase();

const getFallbackReason = (product, diagnosisText) => {
  const productText = getProductSearchText(product);

  if (hasAnyTerm(productText, ['neem', 'spray', 'pest']) && hasAnyTerm(diagnosisText, ['pest', 'insect', 'mite', 'sticky', 'feeding', 'holes'])) {
    return 'Matches visible pest or insect-feeding stress and supports cautious first-response leaf care.';
  }

  if (hasAnyTerm(productText, ['pruning', 'scissor', 'fungal']) && hasAnyTerm(diagnosisText, ['remove', 'trim', 'damaged', 'infected', 'fungal', 'spot', 'lesion'])) {
    return 'Useful for cleanly removing damaged tissue before monitoring new growth.';
  }

  if (hasAnyTerm(productText, ['meter', 'moisture']) && hasAnyTerm(diagnosisText, ['water', 'topsoil', 'overwater', 'root', 'drain', 'dry'])) {
    return 'Helps confirm soil moisture before the next watering decision.';
  }

  if (hasAnyTerm(productText, ['watering']) && hasAnyTerm(diagnosisText, ['water', 'topsoil', 'drain'])) {
    return 'Supports controlled soil-level watering after the recovery protocol.';
  }

  if (hasAnyTerm(productText, ['mist', 'foliar', 'humidity']) && hasAnyTerm(diagnosisText, ['humidity', 'dust', 'leaf', 'airflow'])) {
    return 'Supports gentle foliage cleaning and humidity care when leaves are not actively rotting.';
  }

  if (hasAnyTerm(productText, ['soil', 'bark', 'root']) && hasAnyTerm(diagnosisText, ['root', 'rot', 'orchid', 'drain', 'repot'])) {
    return 'Improves root airflow and drainage when repotting is part of recovery.';
  }

  return 'A practical care tool matched to the diagnosis and recovery protocol.';
};

const scoreProductForDiagnosis = (product, diagnosisText) => {
  const productText = getProductSearchText(product);
  let score = productCareScore(product);

  if (!productText.includes('care') && !productText.includes('tool') && !productText.includes('diagnosis')) {
    score -= 4;
  }

  if (product.stock > 0) score += 2;
  if (hasAnyTerm(productText, ['neem', 'spray', 'pest']) && hasAnyTerm(diagnosisText, ['pest', 'insect', 'mite', 'sticky', 'feeding', 'holes'])) score += 10;
  if (hasAnyTerm(productText, ['pruning', 'scissor', 'fungal']) && hasAnyTerm(diagnosisText, ['remove', 'trim', 'damaged', 'infected', 'fungal', 'spot', 'lesion'])) score += 9;
  if (hasAnyTerm(productText, ['meter', 'moisture']) && hasAnyTerm(diagnosisText, ['water', 'topsoil', 'overwater', 'root', 'drain', 'dry'])) score += 8;
  if (hasAnyTerm(productText, ['watering']) && hasAnyTerm(diagnosisText, ['water', 'topsoil', 'drain'])) score += 6;
  if (hasAnyTerm(productText, ['mist', 'foliar', 'humidity']) && hasAnyTerm(diagnosisText, ['humidity', 'dust', 'leaf', 'airflow'])) score += 5;
  if (hasAnyTerm(productText, ['soil', 'bark', 'root']) && hasAnyTerm(diagnosisText, ['root', 'rot', 'orchid', 'drain', 'repot'])) score += 7;

  return score;
};

const buildFallbackProductRecommendations = (diagnosis, products) => {
  const diagnosisText = buildDiagnosisSearchText(diagnosis);

  return [...products]
    .map((product) => ({
      product,
      score: scoreProductForDiagnosis(product, diagnosisText),
    }))
    .filter(({ product, score }) => score > 0 && product.stock > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ product }, index) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      reason: getFallbackReason(product, diagnosisText),
      usage: cleanText(product.description, 140) || 'Use as directed for plant recovery support.',
      priority: index === 0 ? 'essential' : 'helpful',
      generatedBy: 'inventory-fallback',
    }));
};

const isGenericProtocol = (protocol) => {
  const text = asArray(protocol)
    .map((item) => `${item.timing || ''} ${item.step || ''}`)
    .join(' ')
    .toLowerCase();

  return includesAny(text, [
    'isolate the plant and remove heavily damaged leaf tissue',
    'isolate the specimen and remove heavily damaged leaf tissue',
    'water only when the topsoil has dried',
    'improve airflow and bright indirect light',
  ]);
};

const normalizeProtocol = (result) => {
  const protocolSource = asArray(result.recoveryProtocol).length
    ? result.recoveryProtocol
    : asArray(result.carePlan).length
      ? result.carePlan
      : asArray(result.immediateActions).map((step, index) => ({
        timing: index === 0 ? 'Today' : `Step ${index + 1}`,
        step,
      }));

  const normalized = asArray(protocolSource).slice(0, 4).map((item, index) => ({
    timing: cleanText(item.timing || item.label, 80) || (index === 0 ? 'Today' : `Step ${index + 1}`),
    step: cleanText(item.step || item.text, 190) || 'Monitor the plant and adjust care gradually.',
  }));

  if (isGenericProtocol(normalized)) {
    return buildDynamicRecoveryProtocol(result);
  }

  return normalized;
};

const normalizeDiagnosisResult = (result) => {
  const recoveryProtocol = normalizeProtocol(result);

  return {
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
    recoveryProtocol,
    carePlan: recoveryProtocol,
    nepalNotes: asArray(result.nepalNotes).slice(0, 3).map((item) => cleanText(item, 180)),
    prevention: asArray(result.prevention).slice(0, 4).map((item) => cleanText(item, 180)),
    productRecommendations: asArray(result.productRecommendations).slice(0, 3),
    askForMoreInfo: asArray(result.askForMoreInfo).slice(0, 3).map((item) => cleanText(item, 160)),
    disclaimer: cleanText(result.disclaimer, 300) || 'This is image-based guidance, not a definitive laboratory diagnosis.',
    recoveredFromMalformedJson: Boolean(result.recoveredFromMalformedJson),
  };
};

const normalizeChatResult = (result) => ({
  reply: cleanText(result.reply, 700) || 'I can help with plant care, products, gifts, and checkout.',
  productRecommendations: asArray(result.productRecommendations).slice(0, 2),
  suggestedActions: asArray(result.suggestedActions).slice(0, 3).map((item) => cleanText(item, 80)),
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
- Prefer 1 or 2 care-tool recommendations when any listed product supports the recovery protocol.
- If the list is empty or no listed care item fits, return an empty productRecommendations array.
- Never invent product IDs, prices, pesticides, or medicines.

Recovery protocol rules:
- Always return recoveryProtocol with 3 concise rows for the UI.
- Use dynamic timing labels based on the visible issue. Examples: "Today", "After inspection", "In 48 hours", "Next watering", "This week", "This month".
- Each recoveryProtocol step must be specific to the uploaded photo, user notes, and Nepal climate context.
- Do not reuse the same generic protocol across different diagnoses.
- For pest damage, focus on underside inspection, residue removal, and rechecking.
- For fungal spotting, focus on dry foliage, sterile trimming, and airflow.
- For overwatering/root stress, focus on drainage, paused watering, and soil moisture checks.
- For scorch/dryness, focus on light relocation, slow watering, and humidity stabilization.

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
  const attachedProducts = attachValidProducts(normalized.productRecommendations, products);
  const productRecommendations = attachedProducts.length
    ? attachedProducts
    : buildFallbackProductRecommendations(normalized, products);

  return jsonResponse({
    ...normalized,
    productRecommendations,
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

  const prompt = `
You are Sprout, CHLORO's smart botanical shopping and care assistant for Nepal.
Answer the latest customer message using concise, friendly, practical guidance.

Rules:
- Be specific to Nepal when useful: Kathmandu valley, monsoon humidity, dry winter rooms, balcony sun, dust, and indoor watering.
- For possible diseases or pests, give safe first steps and suggest the /ai-diagnosis image upload page when a visual diagnosis is needed.
- Recommend only products from the CHLORO product list below. If none fit or the list is empty, return no product recommendations.
- Do not invent stock, discounts, delivery promises, pesticides, or medical claims.
- Keep the reply under 90 words unless the user asks for detail.
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
  const normalized = normalizeChatResult(result);

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
