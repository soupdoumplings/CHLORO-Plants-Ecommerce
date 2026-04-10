const API_BASE = 'https://plant.id/api/v3/kb/plants';

const ensureApiKey = () => {
  const apiKey = import.meta.env.VITE_KINDWISE_API_KEY;
  if (!apiKey) {
    throw new Error('Missing API key. Set VITE_KINDWISE_API_KEY in your .env file.');
  }
  return apiKey;
};

const request = async (url) => {
  const apiKey = ensureApiKey();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
  });

  if (!response.ok) {
    let message = `Kindwise request failed (${response.status}).`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // Keep fallback message if response is not JSON.
    }
    throw new Error(message);
  }

  return response.json();
};

export const searchPlantNames = async (query, options = {}) => {
  const { limit = 8, language = 'en', thumbnails = true } = options;
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    language,
    thumbnails: String(thumbnails),
  });

  return request(`${API_BASE}/name_search?${params.toString()}`);
};

export const fetchPlantDetail = async (accessToken, options = {}) => {
  const { language = 'en' } = options;
  const details = [
    'common_names',
    'url',
    'description',
    'taxonomy',
    'rank',
    'gbif_id',
    'inaturalist_id',
    'image',
    'synonyms',
    'edible_parts',
    'watering',
    'propagation_methods',
  ];

  const params = new URLSearchParams({
    details: details.join(','),
    language,
  });

  return request(`${API_BASE}/${accessToken}?${params.toString()}`);
};
