const MAX_IMAGE_EDGE = 1200;
const JPEG_QUALITY = 0.78;

const stripDataUrlPrefix = (dataUrl) => dataUrl.replace(/^data:[^,]+,/, '');

const readFileAsDataUrl = (file) => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  })
);

const loadImage = (src) => (
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not prepare the selected image.'));
    image.src = src;
  })
);

const canvasToDataUrl = (canvas, mimeType) => (
  new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(canvas.toDataURL(mimeType, JPEG_QUALITY));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }, mimeType, JPEG_QUALITY);
  })
);

export const preparePlantImage = async (file) => {
  if (!file) throw new Error('Select a plant image first.');
  if (!file.type.startsWith('image/')) throw new Error('Please upload a JPG, PNG, or WebP image.');

  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const outputMimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not process this image in the browser.');
  context.drawImage(image, 0, 0, width, height);

  const resizedDataUrl = await canvasToDataUrl(canvas, outputMimeType);

  return {
    data: stripDataUrlPrefix(resizedDataUrl),
    mimeType: outputMimeType,
    previewUrl: resizedDataUrl,
    name: file.name,
  };
};

const invokeGemini = async (body) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables for Gemini assistant.');
  }

  let response;
  let data = null;

  try {
    response = await fetch(`${supabaseUrl}/functions/v1/gemini-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Gemini Edge Function is not reachable. Deploy `supabase/functions/gemini-ai` and confirm CORS/preflight is enabled.');
  }

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error || data?.message || `Gemini assistant failed with status ${response.status}.`;

    if (message.toLowerCase().includes('api key not valid')) {
      throw new Error('Gemini API key is not valid. Set a fresh `GEMINI_API_KEY` Supabase secret and redeploy `gemini-ai`.');
    }

    if (message.toLowerCase().includes('missing gemini_api_key')) {
      throw new Error('Missing `GEMINI_API_KEY` Supabase secret for the Gemini Edge Function.');
    }

    if (message.toLowerCase().includes('failed to send')) {
      throw new Error('Gemini Edge Function is not reachable. Deploy `supabase/functions/gemini-ai` and set the `GEMINI_API_KEY` Supabase secret.');
    }

    throw new Error(message);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};

export const analyzePlantImage = ({ image, notes, region }) => (
  invokeGemini({
    mode: 'diagnosis',
    image,
    notes,
    region,
  })
);

export const sendBotanicalChat = ({ messages, context }) => (
  invokeGemini({
    mode: 'chat',
    messages,
    context,
  })
);
