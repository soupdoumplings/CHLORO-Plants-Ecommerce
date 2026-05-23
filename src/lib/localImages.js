import discoveryHero from '../assets/discovery-hero.png';
import heroImage from '../assets/hero.png';
import lycasteImage from '../assets/products/lycaste.png';
import monsteraImage from '../assets/products/monstera.png';
import proteaImage from '../assets/products/protea.png';
import scissorsImage from '../assets/products/scissors.png';
import succulentsImage from '../assets/products/succulents.png';
import terrariumImage from '../assets/products/terrarium.png';
import vesselImage from '../assets/products/vessel.png';
import wateringCanImage from '../assets/products/watering-can.png';

export const fallbackCatalogImage = monsteraImage;
export const fallbackHeroImage = discoveryHero;
export const fallbackEditorialImage = heroImage;

export const productAssetImages = {
  lycaste: lycasteImage,
  monstera: monsteraImage,
  protea: proteaImage,
  scissors: scissorsImage,
  succulents: succulentsImage,
  terrarium: terrariumImage,
  vessel: vesselImage,
  wateringCan: wateringCanImage,
};

export const publicPlantImages = {
  orchid: '/orchid.jpg',
  money: '/money.jpg',
  leaf: '/lof.jpg',
  lily: '/lily.jpg',
  lavender: '/lavender.jpg',
  flower: '/ful.jpg',
  phool: '/phool.png',
  cat: '/cat.jpg',
  BlackRose: '/BlackRose.jpg',
  gifts: '/Gifts.jpg',
};

const appAssetHosts = new Set([
  'localhost:5173',
  'localhost:3000',
  'petals-and-pots.vercel.app',
]);

export const normalizeAppImageUrl = (imageUrl, fallbackImage = fallbackCatalogImage) => {
  if (!imageUrl) return fallbackImage;
  if (typeof imageUrl !== 'string') return imageUrl;

  const trimmedUrl = imageUrl.trim();
  if (!trimmedUrl) return fallbackImage;
  if (trimmedUrl.startsWith('/')) return trimmedUrl;

  try {
    const url = new URL(trimmedUrl);
    if (appAssetHosts.has(url.host)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return trimmedUrl;
  }

  return trimmedUrl;
};

export const getProductImage = (product, fallbackImage = fallbackCatalogImage) => (
  normalizeAppImageUrl(product?.images?.[0] || product?.image, fallbackImage)
);
