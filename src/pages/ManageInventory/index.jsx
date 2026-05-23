import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EditorialHero from '../../components/EditorialHero';
import { supabase } from '../../supabase';
import { productAssetImages, publicPlantImages } from '../../lib/localImages';

const MODEL_BUCKET = 'plant-model';
const MODEL_FILE_TYPES = ['glb', 'gltf'];
const MODEL_MAX_BYTES = 50 * 1024 * 1024;
const MODEL_MIME_TYPES = {
  glb: 'application/octet-stream',
  gltf: 'model/gltf+json',
};
const IMAGE_BUCKET = 'product-images';
const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const WATER_FREQUENCY_OPTIONS = [
  'Every 3 Days',
  'Every 12 Hours',
  'Every Day',
  'Every 7 Days',
  'Every 10 Days',
  'Every 14 Days',
  'When Soil is Dry',
  'Misting Only',
];
const CATEGORY_OPTIONS = [
  'Indoor Plants',
  'Pots & Planters',
  'Care Tools',
  'Gardening Tools',
  'Fresh Flowers',
  'Outdoor Plants',
  'Plant Care',
];
const PLANT_CARE_CATEGORIES = ['Indoor Plants', 'Outdoor Plants', 'Fresh Flowers'];
const GIFT_SECTION_OPTIONS = [
  { id: 'gift-set', label: 'Gift Sets', helper: 'Bundles, gift-ready plants, floral pieces, and vessels.' },
  { id: 'care-kit', label: 'Care Kits', helper: 'Tools or plant-care products that work as a useful gift.' },
  { id: 'premium', label: 'Premium', helper: 'Higher-end gift picks that should appear in Premium.' },
];
const GIFT_MANAGED_TAGS = ['gift', 'gift-set', 'care-kit', 'premium'];

const normalizeTag = (value) => String(value || '').trim().toLowerCase();

const parseTagsInput = (value) => (
  String(value || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
);

const uniqueTags = (tags) => (
  tags.filter((tag, index) => (
    tags.findIndex((item) => normalizeTag(item) === normalizeTag(tag)) === index
  ))
);

const giftSectionsFromTags = (tags = []) => {
  const normalizedTags = new Set((tags || []).map(normalizeTag));
  return GIFT_SECTION_OPTIONS
    .map((option) => option.id)
    .filter((id) => normalizedTags.has(id));
};

const buildProductTags = ({ tagsInput, isGift, giftSections }) => {
  const baseTags = parseTagsInput(tagsInput).filter((tag) => !GIFT_MANAGED_TAGS.includes(normalizeTag(tag)));
  if (!isGift) return uniqueTags(baseTags);
  return uniqueTags([...baseTags, 'gift', ...giftSections]);
};

const isPlantCareCategory = (category) => PLANT_CARE_CATEGORIES.includes(category);

const fallbackImageForCategory = (category) => {
  const categoryLabel = String(category || '').toLowerCase();
  if (categoryLabel.includes('care') || categoryLabel.includes('tool')) return productAssetImages.wateringCan;
  if (categoryLabel.includes('pot') || categoryLabel.includes('planter')) return productAssetImages.vessel;
  return publicPlantImages.orchid;
};

const safeFileName = (fileName) => (
  String(fileName || 'inventory-file')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'inventory-file'
);

const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes)) return 'unknown size';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
};

const getStorageErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  return [
    error.message,
    error.error,
    error.name,
    error.statusCode ? `status ${error.statusCode}` : '',
    error.status ? `status ${error.status}` : '',
    error.cause?.message,
  ].filter(Boolean).join(' - ') || fallback;
};

const encodeStoragePath = (path) => (
  String(path)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
);

const uploadStorageObject = async ({ bucket, path, file, contentType }) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL/key is missing from the Vite environment.');
  }

  const { data: authData, error: authError } = await supabase.auth.getSession();
  if (authError) throw authError;
  if (!authData.session?.access_token) {
    throw new Error('Your login session expired. Please log in again before uploading.');
  }

  const endpoint = `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeStoragePath(path)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${authData.session.access_token}`,
      'Cache-Control': '3600',
      'Content-Type': contentType,
      'x-upsert': 'false',
    },
    body: file,
  });

  if (!response.ok) {
    const text = await response.text();
    let details = text;

    try {
      const json = JSON.parse(text);
      details = [json.message, json.error, json.statusCode || json.status]
        .filter(Boolean)
        .join(' - ');
    } catch {
      // Keep the raw response text.
    }

    throw new Error(`Storage upload failed (${response.status}): ${details || response.statusText}`);
  }
};

const ManageInventory = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isModelUploading, setIsModelUploading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [info, setInfo] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(1);
  const [waterFrequency, setWaterFrequency] = useState('Every 7 Days');
  const [optimalPlace, setOptimalPlace] = useState('Bright Indirect Light');
  const [provenance, setProvenance] = useState('');
  const [curatorQuote, setCuratorQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [season, setSeason] = useState('All Year');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftSections, setGiftSections] = useState([]);
  const [category, setCategory] = useState('Indoor Plants');
  const [tagsInput, setTagsInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isWaterFrequencyOpen, setIsWaterFrequencyOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const showPlantCareFields = isPlantCareCategory(category);

  useEffect(() => {
    if (isEditMode) {
      const fetchPlant = async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            setName(data.name || '');
            setDescription(data.description || '');
            setInfo(data.info || '');
            setPrice(data.price || '');
            setStock(data.stock || 1);
            setWaterFrequency(data.water_frequency || 'Every 7 Days');
            setOptimalPlace(data.optimal_place || 'Bright Indirect Light');
            setProvenance(data.provenance || '');
            setCuratorQuote(data.curator_quote || '');
            setImageUrl(data.images && data.images.length > 0 ? data.images[0] : '');
            setModelUrl(data.model_url || '');
            setSeason(data.season || 'All Year');
            setIsFeatured(data.is_featured || false);
            setIsGift(data.is_gift || false);
            setGiftSections(giftSectionsFromTags(data.tags || []));
            setCategory(data.category || 'Indoor Plants');
            setTagsInput(data.tags ? data.tags.join(', ') : '');
          }
        } catch {
          setErrorMsg('Failed to load plant details.');
        }
      };

      fetchPlant();
    }
  }, [id, isEditMode]);

  const handleModelFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!MODEL_FILE_TYPES.includes(extension)) {
      setErrorMsg('Please upload a .glb or .gltf model file.');
      event.target.value = '';
      return;
    }

    if (file.size > MODEL_MAX_BYTES) {
      setErrorMsg(`This model is ${formatFileSize(file.size)}. Please upload a GLB/GLTF under 50 MB or compress it in Blender first.`);
      event.target.value = '';
      return;
    }

    setIsModelUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const modelPath = `inventory/${isEditMode ? id : 'drafts'}/${Date.now()}-${safeFileName(file.name)}`;
      const modelMimeType = MODEL_MIME_TYPES[extension] || 'application/octet-stream';
      const uploadFile = file.type === modelMimeType
        ? file
        : new File([await file.arrayBuffer()], file.name, {
            type: modelMimeType,
            lastModified: file.lastModified,
          });
      await uploadStorageObject({
        bucket: MODEL_BUCKET,
        path: modelPath,
        file: uploadFile,
        contentType: modelMimeType,
      });

      const { data } = supabase.storage.from(MODEL_BUCKET).getPublicUrl(modelPath);
      setModelUrl(data.publicUrl);

      if (isEditMode) {
        const { error: attachError } = await supabase
          .from('products')
          .update({ model_url: data.publicUrl })
          .eq('id', id);

        if (attachError) {
          setErrorMsg(`Model uploaded, but it could not be attached to this product: ${attachError.message}`);
          return;
        }

        setSuccessMsg('3D model uploaded and attached to this product.');
        return;
      }

      setSuccessMsg('3D model uploaded. Click Save to attach it to this new inventory item.');
    } catch (err) {
      console.error('3D model upload failed', err);
      setErrorMsg(
        `${[getStorageErrorMessage(err, 'Could not upload the 3D model file.'), err.details].filter(Boolean).join(' - ')} Check that "${MODEL_BUCKET}" exists in the same Supabase project as your .env, accepts application/octet-stream/model files, and the GLB is under 50 MB.`
      );
    } finally {
      setIsModelUploading(false);
      event.target.value = '';
    }
  };

  const handleImageFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!file.type.startsWith('image/') || !IMAGE_FILE_TYPES.includes(extension)) {
      setErrorMsg('Please upload a JPG, PNG, WebP, or GIF image file.');
      event.target.value = '';
      return;
    }

    setIsImageUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const imagePath = `inventory/${Date.now()}-${safeFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(imagePath, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(imagePath);
      setImageUrl(data.publicUrl);
      setSuccessMsg('Image uploaded. Click Save to attach it to this inventory item.');
    } catch (err) {
      setErrorMsg(
        `${getStorageErrorMessage(err, 'Could not upload the product image.')} Make sure the Supabase storage bucket "${IMAGE_BUCKET}" exists and is public.`
      );
    } finally {
      setIsImageUploading(false);
      event.target.value = '';
    }
  };

  const handleGiftToggle = (checked) => {
    setIsGift(checked);
    if (!checked) {
      setGiftSections([]);
      return;
    }

    if (giftSections.length === 0) {
      if (category === 'Care Tools' || category === 'Plant Care' || category === 'Gardening Tools') {
        setGiftSections(['care-kit']);
      } else {
        setGiftSections(['gift-set']);
      }
    }
  };

  const toggleGiftSection = (sectionId) => {
    setGiftSections((current) => (
      current.includes(sectionId)
        ? current.filter((item) => item !== sectionId)
        : [...current, sectionId]
    ));
  };

  const handleSaveProduct = async () => {
    if (!name || !price) {
      setErrorMsg("Name and Market Valuation are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const productImages = imageUrl.trim()
      ? [imageUrl.trim()]
      : [fallbackImageForCategory(category)];

    const productModelUrl = modelUrl.trim() || null;
    const productTags = buildProductTags({ tagsInput, isGift, giftSections });

    try {
      let error;
      if (isEditMode) {
        const { error: updateError } = await supabase.from('products').update({
          name,
          description,
          info,
          price: parseFloat(price),
          stock: parseInt(stock, 10) || 0,
          water_frequency: waterFrequency,
          optimal_place: optimalPlace,
          provenance,
          curator_quote: curatorQuote,
          images: productImages,
          model_url: productModelUrl,
          season,
          is_featured: isFeatured,
          is_gift: isGift,
          category,
          tags: productTags
        }).eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('products').insert({
          name,
          description,
          info,
          price: parseFloat(price),
          stock: parseInt(stock, 10) || 0,
          water_frequency: waterFrequency,
          optimal_place: optimalPlace,
          provenance,
          curator_quote: curatorQuote,
          images: productImages,
          model_url: productModelUrl,
          season,
          is_featured: isFeatured,
          is_gift: isGift,
          category,
          tags: productTags
        });
        error = insertError;
      }

      if (error) throw error;

      navigate('/archive#inventory');
    } catch (err) {
      setErrorMsg(err.message || 'Error occurred while saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col items-center overflow-x-hidden w-full relative"
    >
      <Navbar />

      <main className="w-full flex-grow mt-[82px] pb-32">
        <EditorialHero
          eyebrow={isEditMode ? 'Edit Inventory Listing' : 'New Inventory Listing'}
          title={isEditMode ? 'Update' : 'Add'}
          italic="Inventory Item"
          copy="Create plants, care tools, pots, and gift-ready products with stock, pricing, season, tags, and catalogue imagery in one place."
          image={isEditMode ? productAssetImages.vessel : productAssetImages.wateringCan}
          imageAlt="Inventory item"
          objectPosition="center"
          actions={(
            <Link to="/archive#inventory" className="border border-[#FBF9F4]/65 px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#FBF9F4] hover:text-[#0F3A3A]">
              Back to Inventory
            </Link>
          )}
          meta={[
            { label: 'Category', value: category },
            { label: 'Gift Page', value: isGift ? 'Yes' : 'No' },
            { label: 'Stock', value: String(stock || 0).padStart(2, '0') },
          ]}
        />

        <div className="page-shell page-gutter pt-14">
          <div className="max-w-6xl mx-auto w-full">

           {/* Interactive Layout Section */}
           <Motion.div
             initial={{ opacity: 0, y: 25 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
             className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12"
           >

               {/* Left Column Data */}
               <div className="lg:col-span-8 bg-white p-10 md:p-14 border border-[#B1B3A9]/20 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-10">
                  {errorMsg && (
                     <div className="bg-red-50 text-red-500 font-body text-[12px] p-4 rounded border border-red-100">
                     {errorMsg}
                     </div>
                  )}
                  {successMsg && (
                     <div className="bg-[#EFF7F2] text-[#0F3A3A] font-body text-[12px] p-4 rounded border border-[#0F3A3A]/10">
                     {successMsg}
                     </div>
                  )}

                  {/* Section Label: Identity */}
                  <div className="flex items-center gap-3 pb-2 border-b border-[#B1B3A9]/15">
                    <span className="material-symbols-outlined text-[#785A1A] text-[18px]">eco</span>
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Product Identity</span>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Product Name</label>
                     <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Monstera Deliciosa or Moisture Meter" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-headline text-2xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Short Descriptor</label>
                     <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Araceae Monstera or Care Tool" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-xl italic text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Description / About the Item</label>
                     <textarea value={info} onChange={e => setInfo(e.target.value)} placeholder="e.g. Known colloquially as the Swiss Cheese Plant, this architectural masterpiece..." rows="3" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-[16px] text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full resize-none"></textarea>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Provenance / Origin</label>
                     <input type="text" value={provenance} onChange={e => setProvenance(e.target.value)} placeholder="e.g. Western Africa, Tropical Lowland Rainforests" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-lg text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                  </div>

                  {/* Section Label: Catalogue Display */}
                  <div className="flex items-center gap-3 pb-2 border-b border-[#B1B3A9]/15 pt-4">
                    <span className="material-symbols-outlined text-[#785A1A] text-[18px]">auto_stories</span>
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Catalogue Display</span>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Curator Quote / Tagline</label>
                     <textarea value={curatorQuote} onChange={e => setCuratorQuote(e.target.value)} placeholder='e.g. "The Lyrata requires patience and an understanding of light&apos;s gentle choreography."' rows="2" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-[16px] italic text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full resize-none"></textarea>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Primary Category</label>
                     <select value={category} onChange={e => setCategory(e.target.value)} className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-headline text-xl text-[#31332C] font-normal focus:border-[#785A1A] cursor-pointer">
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                     </select>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Product Tags / Collections</label>
                     <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="e.g. Pet-Friendly, Low-Maintenance, New Arrivals" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-[15px] text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                     <p className="font-body text-[11px] text-[#5E6058]/60">Comma separated. Used for homepage filters and discovery badges.</p>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Image URL</label>
                     <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Paste a direct image URL" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-[15px] text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                     <div className="flex flex-wrap items-center gap-3">
                       <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#B1B3A9]/30 bg-[#FBF9F4] px-4 py-2 font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#31332C] transition-colors hover:border-[#785A1A] hover:text-[#785A1A]">
                         <span className="material-symbols-outlined text-[17px]">add_photo_alternate</span>
                         {isImageUploading ? 'Uploading...' : 'Upload Image'}
                         <input
                           type="file"
                           accept="image/jpeg,image/png,image/webp,image/gif"
                           onChange={handleImageFileUpload}
                           disabled={isImageUploading}
                           className="sr-only"
                         />
                       </label>
                       {imageUrl && (
                         <a href={imageUrl} target="_blank" rel="noreferrer" className="font-body text-[11px] text-[#785A1A] underline-offset-4 hover:underline">
                           Open current image
                         </a>
                       )}
                     </div>
                     <p className="font-body text-[11px] text-[#5E6058]/60">Paste a direct image URL or upload an image. This will be the hero image on the catalogue page.</p>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">3D Model URL</label>
                     <input type="url" value={modelUrl} onChange={e => setModelUrl(e.target.value)} placeholder="Paste a .glb or .gltf model URL" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-[15px] text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                     <div className="flex flex-wrap items-center gap-3">
                       <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#B1B3A9]/30 bg-[#FBF9F4] px-4 py-2 font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#31332C] transition-colors hover:border-[#785A1A] hover:text-[#785A1A]">
                         <span className="material-symbols-outlined text-[17px]">upload_file</span>
                         {isModelUploading ? 'Uploading...' : 'Upload Model'}
                         <input
                           type="file"
                           accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                           onChange={handleModelFileUpload}
                           disabled={isModelUploading}
                           className="sr-only"
                         />
                       </label>
                       {modelUrl && (
                         <>
                           <a href={modelUrl} target="_blank" rel="noreferrer" className="font-body text-[11px] text-[#785A1A] underline-offset-4 hover:underline">
                             Open current model
                           </a>
                           <button
                             type="button"
                             onClick={() => setModelUrl('')}
                             className="font-label text-[10px] font-bold uppercase tracking-[0.14em] text-[#9F403D] underline-offset-4 hover:underline"
                           >
                             Remove model
                           </button>
                         </>
                       )}
                     </div>
                     <p className="font-body text-[11px] text-[#5E6058]/60">Optional. Paste a hosted URL or upload a .glb/.gltf file for the catalogue room preview and supported mobile AR viewing. Existing products attach the model immediately after upload; new products attach it when saved.</p>
                     <p className="font-body text-[11px] text-[#5E6058]/60">GLB is recommended. Maximum upload size: 50 MB.</p>
                  </div>

                  {/* Section Label: Care & Pricing */}
                  <div className="flex items-center gap-3 pb-2 border-b border-[#B1B3A9]/15 pt-4">
                    <span className="material-symbols-outlined text-[#785A1A] text-[18px]">spa</span>
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Care & Pricing</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Inventory ID</label>
                         <input type="text" placeholder="SPEC-000-KTM" className="bg-[#FBF9F4] border border-[#B1B3A9]/20 p-4 outline-none font-label text-[12px] text-[#31332C] font-bold tracking-widest uppercase rounded-lg focus:border-[#785A1A] hover:border-[#B1B3A9]/50 transition-all w-full" />
                      </div>
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Market Valuation (रू)</label>
                         <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="bg-transparent border-b border-[#31332C]/20 py-4 outline-none font-headline text-xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                      </div>
                  </div>

                  {showPlantCareFields && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-3 group">
                           <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Optimal Placement</label>
                           <input type="text" value={optimalPlace} onChange={e => setOptimalPlace(e.target.value)} placeholder="e.g. Bright Indirect Light" className="bg-transparent border-b border-[#31332C]/20 py-4 outline-none font-headline text-xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                        </div>
                        <div className="flex flex-col gap-3 group">
                           <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Watering Frequency</label>
                           <div className="relative">
                             <button
                               type="button"
                               onClick={() => setIsWaterFrequencyOpen((current) => !current)}
                               onBlur={() => window.setTimeout(() => setIsWaterFrequencyOpen(false), 120)}
                               className="flex min-h-[57px] w-full items-center justify-between border-b border-[#31332C]/20 bg-transparent py-4 text-left font-headline text-xl font-normal text-[#31332C] outline-none transition-all hover:border-[#B1B3A9]/60 focus:border-[#785A1A]"
                               aria-haspopup="listbox"
                               aria-expanded={isWaterFrequencyOpen}
                             >
                               <span>{waterFrequency}</span>
                               <span className="material-symbols-outlined text-[20px] text-[#785A1A]">expand_more</span>
                             </button>
                             {isWaterFrequencyOpen && (
                               <div
                                 role="listbox"
                                 className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-64 overflow-y-auto border border-[#D9DBCF] bg-[#FBF9F4] shadow-xl shadow-black/10"
                               >
                                 {WATER_FREQUENCY_OPTIONS.map((option) => (
                                   <button
                                     key={option}
                                     type="button"
                                     role="option"
                                     aria-selected={waterFrequency === option}
                                     onMouseDown={(event) => event.preventDefault()}
                                     onClick={() => {
                                       setWaterFrequency(option);
                                       setIsWaterFrequencyOpen(false);
                                     }}
                                     className={`flex w-full items-center justify-between px-4 py-3 text-left font-body text-[14px] transition-colors ${
                                       waterFrequency === option
                                         ? 'bg-[#0F3A3A] text-[#FBF9F4]'
                                         : 'text-[#31332C] hover:bg-[#E8E9E0]'
                                     }`}
                                   >
                                     {option}
                                   </button>
                                 ))}
                               </div>
                             )}
                           </div>
                        </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Stock Quantity</label>
                         <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="1" className="bg-transparent border-b border-[#31332C]/20 py-4 outline-none font-headline text-xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                      </div>
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black transition-colors">Total Inventory Value</label>
                         <div className="bg-transparent border-b border-[#31332C]/20 py-4 font-headline text-xl text-[#785A1A] w-full flex items-center min-h-[57px]">
                           रू {((parseFloat(price) || 0) * (parseInt(stock, 10) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </div>
                      </div>
                  </div>
                  {/* Section Label: Display Attributes (New) */}
                  <div className="flex items-center gap-3 pb-2 border-b border-[#B1B3A9]/15 pt-4">
                    <span className="material-symbols-outlined text-[#785A1A] text-[18px]">verified</span>
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Display Attributes</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Seasonal Availability</label>
                         <select value={season} onChange={e => setSeason(e.target.value)} className="bg-transparent border-b border-[#31332C]/20 py-4 outline-none font-headline text-xl text-[#31332C] font-normal focus:border-[#785A1A] cursor-pointer">
                            <option value="All Year">All Year</option>
                            <option value="Spring/Summer">Spring & Summer</option>
                            <option value="Autumn/Winter">Autumn & Winter</option>
                            <option value="Spring Only">Spring Only</option>
                            <option value="Summer Only">Summer Only</option>
                         </select>
                      </div>

                      <div className="flex flex-col gap-3 group justify-center">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors mb-2">Featured Status</label>
                         <label className="relative inline-flex items-center cursor-pointer max-w-max">
                           <input type="checkbox" className="sr-only peer" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#785A1A]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5F5E5E]"></div>
                           <span className="ml-3 font-body text-sm text-[#31332C]">{isFeatured ? 'Featured Product' : 'Standard Listing'}</span>
                         </label>
                         <p className="font-body text-[10px] text-[#5E6058]/60 mt-1">Featured items appear at the top of the discovery grid.</p>
                      </div>
                  </div>

                  <div className="border border-[#B1B3A9]/25 bg-[#FBF9F4] p-5">
                    <label className="flex cursor-pointer items-start gap-4">
                      <input
                        type="checkbox"
                        className="mt-1 h-5 w-5 accent-[#0F3A3A]"
                        checked={isGift}
                        onChange={(event) => handleGiftToggle(event.target.checked)}
                      />
                      <span>
                        <span className="block font-label text-[10px] font-black uppercase tracking-[0.18em] text-[#31332C]">
                          Show on gift page
                        </span>
                        <span className="mt-2 block font-body text-[13px] leading-relaxed text-[#5E6058]">
                          Enable this when the product should appear in the Gifts page sections like Curated, Gift Sets, Care Kits, or Premium.
                        </span>
                      </span>
                    </label>
                    {isGift && (
                      <div className="mt-5 border-t border-[#B1B3A9]/20 pt-5">
                        <p className="font-label text-[9px] font-black uppercase tracking-[0.18em] text-[#785A1A]">Gift Page Sections</p>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                          {GIFT_SECTION_OPTIONS.map((option) => {
                            const selected = giftSections.includes(option.id);
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleGiftSection(option.id)}
                                className={`border p-4 text-left transition-colors ${
                                  selected
                                    ? 'border-[#0F3A3A] bg-[#0F3A3A] text-[#FBF9F4]'
                                    : 'border-[#B1B3A9]/35 bg-white text-[#31332C] hover:border-[#0F3A3A]/40'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[17px]">
                                    {selected ? 'check_box' : 'check_box_outline_blank'}
                                  </span>
                                  <span className="font-label text-[9px] font-black uppercase tracking-[0.14em]">{option.label}</span>
                                </span>
                                <span className={`mt-2 block font-body text-[11px] leading-relaxed ${selected ? 'text-[#FBF9F4]/75' : 'text-[#5E6058]'}`}>
                                  {option.helper}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-3 font-body text-[11px] text-[#5E6058]/65">Curated includes every product marked for the gift page.</p>
                      </div>
                    )}
                  </div>

               </div>

               {/* Right Column - Image Preview */}
               <Motion.div
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                 className="lg:col-span-4 space-y-8 h-full"
               >
                   <div className="flex flex-col gap-3 h-full">
                     <label className="flex items-center gap-2 font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black">
                        <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                        Asset Preview
                     </label>
                     <Motion.div
                       whileHover={{ borderColor: '#785A1A', backgroundColor: 'rgba(251,249,244,0.5)' }}
                       className="flex-grow w-full border border-[#B1B3A9]/20 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center p-6 transition-all group min-h-[400px] overflow-hidden"
                     >
                        {imageUrl.trim() ? (
                          <div className="w-full h-full relative">
                            <img
                              src={imageUrl}
                              alt="Plant preview"
                              className="w-full h-full object-cover rounded-lg max-h-[500px]"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                            <div className="hidden w-full h-full items-center justify-center flex-col gap-4" style={{ display: 'none' }}>
                              <span className="material-symbols-outlined text-[28px] text-[#9F403D]">broken_image</span>
                              <p className="font-body text-xs text-[#9F403D] text-center">Could not load image. Check the URL.</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-[#EFEEE6] rounded-full flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300">
                               <span className="material-symbols-outlined text-[28px] text-[#B1B3A9] group-hover:text-[#785A1A] transition-colors">image</span>
                            </div>
                            <p className="font-label text-[11px] uppercase tracking-widest text-[#5E6058] font-bold text-center mb-2">No image provided</p>
                            <p className="font-body text-xs text-[#5E6058]/60 text-center max-w-[200px]">Paste an image URL in the field on the left to preview.</p>
                          </>
                        )}
                     </Motion.div>

                     {/* Quick Info Preview */}
                     {name && (
                       <Motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="bg-[#F5F4ED] border border-[#B1B3A9]/15 rounded-xl p-5 space-y-3"
                       >
                         <p className="font-label text-[9px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Catalogue Preview</p>
                         <h3 className="font-headline text-2xl text-[#31332C] leading-tight">{name}</h3>
                         {description && <p className="font-body text-sm italic text-[#5E6058]">{description}</p>}
                         {provenance && (
                           <div className="pt-2 border-t border-[#B1B3A9]/15">
                             <p className="font-label text-[9px] tracking-[0.1em] uppercase opacity-50 font-black">Provenance</p>
                             <p className="font-body text-xs text-[#31332C]">{provenance}</p>
                           </div>
                         )}
                         {price && (
                           <p className="font-headline text-xl text-[#31332C]">रू {Number(price).toLocaleString()}</p>
                         )}
                       </Motion.div>
                     )}
                   </div>
               </Motion.div>
           </Motion.div>

           <Motion.div
             initial={{ scaleX: 0 }}
             whileInView={{ scaleX: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
             className="w-full h-[1px] bg-[#B1B3A9]/20 mt-16 mb-8 origin-left"
           />

           {/* Action Handlers */}
           <Motion.div
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
             className="flex justify-between items-center bg-white rounded-2xl p-6 md:px-10 py-6 border border-[#B1B3A9]/20 shadow-sm"
           >
              <Link to="/archive" className="font-label text-[11px] font-bold tracking-[0.2em] uppercase text-[#9F403D] hover:text-[#31332C] transition-colors flex items-center gap-2">
                 <span className="material-symbols-outlined text-[16px]">close</span>
                 Cancel
              </Link>
              <Motion.button
                whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSaveProduct}
                disabled={isSubmitting || isImageUploading || isModelUploading}
                className="bg-[#5F5E5E] text-[#FAF7F6] px-10 py-4 font-label text-[12px] tracking-[1.5px] font-black uppercase flex items-center gap-3 hover:bg-[#31332C] rounded-lg transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {isImageUploading ? 'Uploading Image...' : isModelUploading ? 'Uploading Model...' : isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save' : 'Add')}
                 <div className="w-[1px] h-4 bg-white/20"></div>
                 <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Motion.button>
           </Motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default ManageInventory;
