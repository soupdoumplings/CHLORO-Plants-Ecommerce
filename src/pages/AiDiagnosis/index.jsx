import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { AlertTriangle, Camera, Leaf, Loader2, LocateFixed, ShoppingBag, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { analyzePlantImage, preparePlantImage } from '../../lib/gemini';
import { useCart } from '../../lib/CartContext';
import { useGeoLocation } from '../../lib/useGeoLocation';

const placeholderLeaf = 'https://images.unsplash.com/photo-1614594075920-b4842c4f6f86?auto=format&fit=crop&q=80&w=900';

const severityCopy = {
  low: 'Observation',
  medium: 'Stabilize',
  high: 'Critical Care',
  unclear: 'Further Inspection',
};

const formatPercent = (value) => `${Math.round(Number(value || 0) * 100)}%`;

const getDiagnosisErrorMessage = (error) => {
  const message = error?.message || '';

  if (message.toLowerCase().includes('json')) {
    return 'The AI response was not clean enough to read. Please run the analysis once more.';
  }

  if (message.toLowerCase().includes('api key')) {
    return 'The AI service needs a valid Gemini API key before diagnosis can run.';
  }

  if (message.toLowerCase().includes('edge function')) {
    return 'The AI diagnosis service is not reachable yet. Check the deployed Supabase function.';
  }

  return message || 'Diagnosis failed. Please try again.';
};

const getDetectedLocationLabel = (detectedLocation) => {
  if (!detectedLocation?.address) return 'your current area';
  return detectedLocation.address.neighbourhood
    || detectedLocation.address.city
    || detectedLocation.address.addressLine
    || detectedLocation.address.country
    || 'your current area';
};

const getDiagnosisRegion = (detectedLocation) => {
  if (!detectedLocation?.address) return 'Kathmandu, Nepal';
  return [
    detectedLocation.address.neighbourhood,
    detectedLocation.address.city,
    detectedLocation.address.country || 'Nepal',
  ].filter(Boolean).join(', ') || 'Nepal';
};

const getProtocol = (result) => {
  if (!result) {
    return [
      { label: 'Capture', text: 'Upload a clear image showing the leaf surface, stem, pot, and soil condition.' },
      { label: 'Context', text: 'Add symptoms, watering habits, recent repotting, and where the plant sits in your home.' },
    ];
  }

  const carePlan = result.carePlan || [];
  if (carePlan.length) {
    return carePlan.map((item) => ({
      label: item.timing,
      text: item.step,
    }));
  }

  return (result.immediateActions || []).map((item, index) => ({
    label: `Step ${index + 1}`,
    text: item,
  }));
};

const ProductCard = ({ product, index }) => {
  const { addToBag } = useCart();
  const [added, setAdded] = useState(false);
  const isRealProduct = Boolean(product.id);

  const handleAdd = async () => {
    if (!isRealProduct) return;

    const response = await addToBag({
      ...product,
      price: Number(product.price || 0),
      rawPrice: Number(product.price || 0),
      image: product.image,
    });

    if (response?.success) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1500);
    } else if (response?.error) {
      window.alert(response.error);
    }
  };

  const priceLabel = isRealProduct
    ? `NPR ${Number(product.price || 0).toLocaleString('en-NP')}`
    : product.price;

  const content = (
    <article className="bg-[#F7F5EF] p-5">
      <div className="aspect-[1.12/1] overflow-hidden bg-[#E6E4DC]">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Leaf className="h-7 w-7 text-[#456565]" />
          </div>
        )}
      </div>
      <p className="mt-5 font-label text-[8px] uppercase tracking-[0.3em] text-[#7A756A]">{product.category || product.priority || 'Apothecary'}</p>
      <h3 className="mt-2 font-headline text-[22px] leading-tight text-[#181812]">{product.name}</h3>
      <p className="mt-3 min-h-[42px] font-body text-[12px] leading-relaxed text-[#6D695F]">{product.reason}</p>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!isRealProduct}
        className="mt-5 flex w-full items-center justify-center gap-2 bg-[#555555] px-4 py-3 text-[#FBF9F4] transition-colors hover:bg-[#181812] disabled:cursor-default disabled:bg-[#8F8B82]"
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        <span className="font-label text-[9px] uppercase tracking-[0.2em]">
          {isRealProduct ? (added ? 'Added to Regimen' : `Add to Regimen - ${priceLabel}`) : 'Awaiting Inventory'}
        </span>
      </button>
    </article>
  );

  return isRealProduct ? (
    <Link to={`/catalogue/${product.id}`} className="block">{content}</Link>
  ) : (
    <div className={index > 1 ? 'hidden' : ''}>{content}</div>
  );
};

const AiDiagnosisPage = () => {
  const { location, loading: locating, error: locationError, isSupported, requestLocation } = useGeoLocation();
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [specimenId, setSpecimenId] = useState(() => `#${Math.random().toString(16).slice(2, 6).toUpperCase()}-B`);
  const [captureNotice, setCaptureNotice] = useState('');

  const topProblem = useMemo(() => result?.likelyProblems?.[0] || null, [result]);
  const protocol = getProtocol(result);
  const displayProducts = result?.productRecommendations || [];
  const clinicalState = useMemo(() => {
    if (isAnalyzing) return 'Reading Pigment & Structure';
    if (result) return 'Clinical Assessment Complete';
    if (image) return 'Specimen Captured';
    return 'Awaiting Specimen';
  }, [image, isAnalyzing, result]);
  const resultTitle = topProblem?.name || (result ? result.summary : image ? 'Ready for Clinical Analysis' : 'Awaiting Clinical Image');
  const confidenceLabel = result ? formatPercent(result.confidence) : image ? 'Ready' : 'Pending';
  const locationLabel = location ? getDetectedLocationLabel(location) : 'Nepal climate context';

  const handleFiles = useCallback(async (files, source = 'upload') => {
    const selected = files?.[0];
    if (!selected) return;

    setError('');
    setResult(null);
    setIsPreparing(true);

    try {
      const prepared = await preparePlantImage(selected);
      setImage(prepared);
      setSpecimenId(`#${Math.random().toString(16).slice(2, 6).toUpperCase()}-B`);
      setCaptureNotice(source === 'paste' ? 'Clipboard specimen captured.' : 'Specimen image captured.');
    } catch (err) {
      setError(err.message || 'Could not load that image.');
    } finally {
      setIsPreparing(false);
    }
  }, []);

  useEffect(() => {
    if (!captureNotice) return undefined;

    const timeout = window.setTimeout(() => setCaptureNotice(''), 2400);
    return () => window.clearTimeout(timeout);
  }, [captureNotice]);

  useEffect(() => {
    const handlePaste = (event) => {
      const items = Array.from(event.clipboardData?.items || []);
      const imageItem = items.find((item) => item.type.startsWith('image/'));
      const file = imageItem?.getAsFile();

      if (!file) return;

      event.preventDefault();
      handleFiles([file], 'paste');
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  const handleAnalyze = async () => {
    if (!image) {
      setError('Upload a plant image first.');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      const diagnosis = await analyzePlantImage({
        image: {
          data: image.data,
          mimeType: image.mimeType,
          name: image.name,
        },
        notes,
        region: getDiagnosisRegion(location),
      });
      setResult(diagnosis);
    } catch (err) {
      setError(getDiagnosisErrorMessage(err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    await requestLocation();
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FAF8F2] text-[#181812]"
    >
      <Navbar />

      <main className="pt-[82px]">
        <section className="grid grid-cols-1 border-b border-[#EDE9DF] px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[1fr_210px]">
          <div>
            <p className="font-label text-[9px] uppercase tracking-[0.55em] text-[#736D61]">Botanical Intelligence v.2.4</p>
            <h1 className="mt-4 max-w-[900px] font-headline text-[64px] leading-[0.88] tracking-[-0.03em] md:text-[100px]">
              The Digital <span className="italic">Clinician</span>
            </h1>
            <p className="mt-8 max-w-[560px] font-body text-[15px] leading-relaxed text-[#69645B]">
              Upload, drag, or paste a clear plant photo. Gemini reads visible symptoms, then returns a practical care assessment for Nepal homes and CHLORO inventory.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Upload', 'Drag', 'Paste'].map((item) => (
                <span key={item} className="border border-[#DED8CC] bg-[#FFFEFA] px-4 py-2 font-label text-[9px] uppercase tracking-[0.22em] text-[#6D695F]">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-10 flex items-center justify-start lg:mt-0 lg:justify-center">
            <div className="flex h-24 w-24 items-center justify-center bg-[#E7E7DF] text-[#456565]">
              <Leaf className="h-8 w-8 fill-current" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[42vw_1fr]">
          <aside className="border-b border-[#EDE9DF] px-6 py-12 md:px-10 lg:min-h-[1200px] lg:border-b-0 lg:border-r">
            <div className="flex max-w-[520px] items-center justify-between gap-5">
              <p className="font-label text-[9px] uppercase tracking-[0.35em] text-[#7A756A]">01. Capture Specimen</p>
              <p className="font-label text-[8px] uppercase tracking-[0.22em] text-[#456565]">{clinicalState}</p>
            </div>

            <label
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFiles(event.dataTransfer.files);
              }}
              className={`relative mt-8 block aspect-[4/5] max-w-[520px] cursor-pointer overflow-hidden border bg-[#F0D0A4] transition-all duration-300 ${
                isDragging ? 'border-[#456565] shadow-[0_20px_80px_rgba(69,101,101,0.14)]' : 'border-[#D7C8AE]'
              }`}
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => handleFiles(event.target.files)}
              />
              <img
                src={image?.previewUrl || placeholderLeaf}
                alt="Plant specimen"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#EFC98F]/10" />
              <div className="absolute left-1/2 top-1/2 flex w-[220px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border border-white/55 bg-[#F5F2E9]/92 px-5 py-8 text-center shadow-[0_18px_60px_rgba(24,24,18,0.08)] backdrop-blur-sm">
                {isPreparing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                <span className="mt-5 font-label text-[9px] uppercase tracking-[0.18em] text-[#565149]">
                  {image ? 'Replace Specimen' : 'Upload New Specimen'}
                </span>
                <span className="mt-3 font-body text-[11px] leading-relaxed text-[#8A857A]">
                  Click, drop, or paste image
                </span>
              </div>
              {(isPreparing || isAnalyzing) && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F2]/75">
                  <Loader2 className="h-8 w-8 animate-spin text-[#456565]" />
                </div>
              )}
            </label>
            {captureNotice && (
              <p className="mt-4 max-w-[520px] border border-[#456565]/20 bg-[#456565]/5 px-4 py-3 font-label text-[9px] uppercase tracking-[0.18em] text-[#456565]">
                {captureNotice}
              </p>
            )}

            <div className="mt-5 flex max-w-[520px] items-start justify-between gap-4">
              <div>
                <p className="font-headline text-[16px] leading-tight">Specimen ID: {specimenId}</p>
                <p className="mt-1 font-label text-[8px] uppercase tracking-[0.18em] text-[#8A857A]">{result?.plantLikely || (image ? 'Pending Identification' : 'Awaiting Specimen')}</p>
              </div>
              <div className="text-right">
                <p className="font-headline text-[16px] leading-tight">{confidenceLabel}</p>
                <p className="mt-1 font-label text-[8px] uppercase tracking-[0.18em] text-[#8A857A]">Confidence Score</p>
              </div>
            </div>

            <div className="mt-10 max-w-[520px] border border-[#DED8CC] bg-[#FFFEFA] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <LocateFixed className="mt-0.5 h-4 w-4 shrink-0 text-[#456565]" />
                  <div>
                    <p className="font-label text-[9px] uppercase tracking-[0.28em] text-[#6D695F]">Location Context</p>
                    <p className="mt-2 font-body text-[12px] leading-relaxed text-[#6D695F]">
                      {locating
                        ? 'Detecting your current plant-care climate...'
                        : location
                          ? `Using ${locationLabel} for local humidity, season, and light guidance.`
                          : 'Allow location access for more accurate Nepal-specific diagnosis.'}
                    </p>
                    {locationError && (
                      <p className="mt-2 font-label text-[9px] font-semibold tracking-[0.06em] text-[#A90000]">
                        {locationError}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={!isSupported || locating}
                  className="shrink-0 border border-[#456565] px-4 py-3 font-label text-[9px] uppercase tracking-[0.18em] text-[#456565] transition-colors hover:bg-[#456565] hover:text-[#FFFEFA] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {locating ? 'Locating' : location ? 'Refresh' : 'Use Location'}
                </button>
              </div>
            </div>

            <div className="mt-10 max-w-[520px]">
              <div className="flex items-end justify-between gap-4">
                <label htmlFor="diagnosis-notes" className="font-label text-[9px] uppercase tracking-[0.35em] text-[#7A756A]">
                  Field Notes
                </label>
                <p className="font-label text-[8px] uppercase tracking-[0.18em] text-[#A8A298]">Optional</p>
              </div>
              <textarea
                id="diagnosis-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={6}
                placeholder="Yellow lower leaves, sticky residue, brown tips, recent repotting, balcony sun..."
                className="mt-4 w-full resize-none border border-[#DED8CC] bg-[#FFFEFA] p-4 font-body text-sm leading-relaxed text-[#333029] outline-none placeholder:text-[#918B80] focus:border-[#785A1A]"
              />
              {error && (
                <div className="mt-4 flex gap-3 border border-[#A90000]/25 bg-[#A90000]/5 px-4 py-3 text-[#A90000]">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="font-body text-sm leading-relaxed">{error}</p>
                </div>
              )}
              <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!image || isPreparing || isAnalyzing}
                  className="flex items-center justify-center gap-3 bg-[#181812] px-6 py-4 text-[#FAF8F2] transition-colors hover:bg-[#555555] disabled:cursor-not-allowed disabled:bg-[#A8A298]"
                >
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                    {isAnalyzing ? 'Analyzing Specimen' : 'Begin Clinical Analysis'}
                  </span>
                </button>
                {image && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setResult(null);
                      setError('');
                      setCaptureNotice('');
                    }}
                    className="flex w-14 items-center justify-center border border-[#DED8CC] bg-[#FFFEFA] text-[#6D695F] transition-colors hover:border-[#181812] hover:text-[#181812]"
                    title="Clear specimen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </aside>

          <section className="px-6 py-12 md:px-12">
            <p className="font-label text-[9px] uppercase tracking-[0.35em] text-[#7A756A]">02. Analysis & Results</p>
            <h2 className="mt-8 font-headline text-[38px] leading-tight text-[#A90000] md:text-[45px]">
              {resultTitle}
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="bg-[#E8E8E0] px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.18em] text-[#686256]">
                {result ? severityCopy[result.severity] || 'Clinical Note' : image ? 'Prepared' : 'Standby'}
              </span>
              <span className="bg-[#E8E8E0] px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.18em] text-[#686256]">
                {result?.nepalNotes?.[0] ? 'Nepal Context' : 'Gemini Vision'}
              </span>
            </div>

            <article className="mt-16 max-w-[700px] bg-white px-8 py-9 shadow-[0_1px_0_rgba(0,0,0,0.05)] md:px-12 md:py-11">
              <h3 className="font-headline text-[25px] italic">The Assessment</h3>
              <p className="mt-8 font-body text-[14px] leading-loose text-[#6C675E]">
                {result?.summary || (image
                  ? 'The specimen is captured. Begin clinical analysis to receive a structured reading of pigmentation, visible stress, likely causes, and care steps for Nepal conditions.'
                  : 'Awaiting a live specimen. Upload, drag, or paste a plant image to activate Gemini analysis. The assessment will remain grounded in visible evidence and local care context.')}
              </p>
              <p className="mt-7 font-body text-[14px] leading-loose text-[#6C675E]">
                {(topProblem?.evidence || result?.causes?.[0]) || 'For best results, include affected leaves, healthy leaves, the stem base, pot, and soil surface. Notes about watering, light, and recent repotting sharpen the diagnosis.'}
              </p>
            </article>

            <div className="mt-14 flex max-w-[700px] items-center justify-between border-b border-[#E5E1D7] pb-5">
              <p className="font-label text-[9px] uppercase tracking-[0.35em] text-[#7A756A]">03. Prescribed Apothecary</p>
              <Link to="/discovery" className="font-label text-[8px] uppercase tracking-[0.18em] text-[#785A1A] underline underline-offset-4">
                View Full Range
              </Link>
            </div>
            {result && displayProducts.length ? (
              <div className="mt-8 grid max-w-[700px] grid-cols-1 gap-7 sm:grid-cols-2">
                {displayProducts.slice(0, 2).map((product, index) => (
                  <ProductCard key={product.id || product.name} product={product} index={index} />
                ))}
              </div>
            ) : result ? (
              <div className="mt-8 max-w-[700px] border border-[#E5E1D7] bg-white px-8 py-7">
                <p className="font-headline text-[24px] italic text-[#181812]">No prescribed product yet.</p>
                <p className="mt-3 font-body text-[13px] leading-relaxed text-[#6D695F]">
                  Gemini did not find a matching item in CHLORO inventory. Add care products in the database to make this section recommend only real stock.
                </p>
              </div>
            ) : (
              <div className="mt-8 max-w-[700px] border border-[#E5E1D7] bg-[#FFFEFA] px-8 py-7">
                <p className="font-headline text-[24px] italic text-[#181812]">Prescriptions unlock after analysis.</p>
                <p className="mt-3 font-body text-[13px] leading-relaxed text-[#6D695F]">
                  The assistant will only recommend products that exist in your CHLORO product database.
                </p>
              </div>
            )}

            <div className="mt-16 max-w-[700px] border-t border-[#E5E1D7] pt-10">
              <p className="font-label text-[9px] uppercase tracking-[0.35em] text-[#7A756A]">Recovery Protocol</p>
              <div className="mt-7 space-y-7">
                {protocol.slice(0, 4).map((item, index) => (
                  <div key={`${item.label}-${item.text}`} className="grid grid-cols-[42px_1fr] gap-5">
                    <p className="font-headline text-[22px] italic text-[#785A1A]">{String(index + 1).padStart(2, '0')}</p>
                    <div>
                      <p className="font-label text-[9px] uppercase tracking-[0.28em] text-[#6D695F]">{item.label}</p>
                      <p className="mt-2 font-body text-[13px] leading-relaxed text-[#6D695F]">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {result?.disclaimer && (
              <p className="mt-12 max-w-[700px] border-t border-[#E5E1D7] pt-6 font-body text-[12px] leading-relaxed text-[#8A857A]">
                {result.disclaimer}
              </p>
            )}
          </section>
        </section>

        <section className="bg-[#F2F0E8] px-6 py-24 text-center md:px-10">
          <h2 className="font-headline text-[45px] leading-tight md:text-[54px]">
            Expertise delivered <span className="italic">weekly.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[410px] font-body text-[13px] leading-relaxed text-[#777166]">
            Join our inner circle for clinical plant care insights and early access to the archive.
          </p>
          <form className="mx-auto mt-12 flex max-w-[440px] items-center border-b border-[#9D968A]">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="min-w-0 flex-1 bg-transparent py-3 font-label text-[9px] uppercase tracking-[0.2em] outline-none placeholder:text-[#9D968A]"
            />
            <button type="button" className="py-3 font-label text-[9px] uppercase tracking-[0.2em] text-[#555047]">Submit</button>
          </form>
        </section>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default AiDiagnosisPage;
