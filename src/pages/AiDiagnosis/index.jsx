import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { AlertTriangle, ArrowDown, Camera, Leaf, Loader2, LocateFixed, Sparkles, X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EditorialHero from '../../components/EditorialHero';
import { analyzePlantImage, preparePlantImage } from '../../lib/gemini';
import { useCart } from '../../lib/CartContext';
import { useGeoLocation } from '../../lib/useGeoLocation';
import { productAssetImages } from '../../lib/localImages';

const placeholderLeaf = productAssetImages.monstera;

const treatmentPlaceholders = [
  {
    name: 'No 04 Foliar Mist',
    category: 'Antifungal / Restorative',
    reason: 'Treatment recommendations unlock after Gemini reviews your plant photo.',
    image: productAssetImages.wateringCan,
    locked: true,
  },
  {
    name: 'No 12 Ionic Solution',
    category: 'Vascular Stabilizer',
    reason: 'Care products and tools will be matched from CHLORO inventory.',
    image: productAssetImages.scissors,
    locked: true,
  },
];

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

  const carePlan = result.recoveryProtocol?.length ? result.recoveryProtocol : result.carePlan || [];
  if (carePlan.length) {
    return carePlan.map((item) => ({
      label: item.timing || item.label,
      text: item.step || item.text,
    }));
  }

  return (result.immediateActions || []).map((item, index) => ({
    label: `Step ${index + 1}`,
    text: item,
  }));
};

const ReportMetric = ({ label, value }) => (
  <div className="border-t border-[#11110E]/12 py-4">
    <p className="font-label text-[8px] uppercase tracking-[0.26em] text-[#7A756A]">{label}</p>
    <p className="mt-2 font-headline text-[22px] leading-tight text-[#11110E]">{value}</p>
  </div>
);

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
    ? `रू ${Number(product.price || 0).toLocaleString('en-NP')}`
    : product.price;
  const disabledLabel = product.locked ? 'Analysis Required' : 'Awaiting Inventory';

  const content = (
    <article className="group">
      <div className="aspect-[1.08/1] overflow-hidden border border-[#11110E]/10 bg-[#E6E4DC]">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Leaf className="h-7 w-7 text-[#456565]" />
          </div>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="font-label text-[8px] uppercase tracking-[0.28em] text-[#7A756A]">{product.category || product.priority || 'Care Product'}</p>
          <h3 className="mt-2 font-headline text-[28px] leading-[0.96] text-[#11110E]">{product.name}</h3>
          <p className="mt-3 min-h-[42px] font-body text-[12px] leading-relaxed text-[#6D695F]">{product.reason}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!isRealProduct}
          className="mt-1 shrink-0 border border-[#11110E] px-4 py-2.5 text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FBF9F4] disabled:cursor-default disabled:border-[#11110E]/25 disabled:text-[#11110E]/35"
        >
          <span className="font-label text-[8px] uppercase tracking-[0.18em]">
            {isRealProduct ? (added ? 'Added' : `Add - ${priceLabel}`) : disabledLabel}
          </span>
        </button>
      </div>
    </article>
  );

  return <div className={index > 1 ? 'hidden' : ''}>{content}</div>;
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
  const [photoId, setPhotoId] = useState(() => `#${Math.random().toString(16).slice(2, 6).toUpperCase()}-B`);
  const [captureNotice, setCaptureNotice] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const labRef = useRef(null);
  const reportRef = useRef(null);
  const protocolRef = useRef(null);

  const topProblem = useMemo(() => result?.likelyProblems?.[0] || null, [result]);
  const protocol = getProtocol(result);
  const displayProducts = result?.productRecommendations || [];
  const clinicalState = useMemo(() => {
    if (isAnalyzing) return 'Reading Pigment & Structure';
    if (result) return 'Clinical Assessment Complete';
    if (image) return 'Plant Photo Ready';
    return 'Upload Plant Photo';
  }, [image, isAnalyzing, result]);
  const resultTitle = topProblem?.name || (result ? result.summary : image ? 'Ready for Clinical Analysis' : 'Awaiting Clinical Image');
  const confidenceLabel = result ? formatPercent(result.confidence) : image ? 'Ready' : 'Pending';
  const locationLabel = location ? getDetectedLocationLabel(location) : 'Nepal climate context';
  const regionLabel = location ? locationLabel : 'Nepal Default';
  const severityLabel = result ? severityCopy[result.severity] || 'Clinical Note' : image ? 'Prepared' : 'Standby';
  const reportActionLabel = isAnalyzing
    ? 'Analyzing Plant Photo'
    : result
      ? 'Export Full Lab Report'
      : image
        ? 'Begin Clinical Analysis'
        : 'Upload Image To Begin';
  const reportActionDisabled = !result && (!image || isPreparing || isAnalyzing);
  const treatmentCards = result ? displayProducts.slice(0, 2) : treatmentPlaceholders;

  const scrollToLab = useCallback(() => {
    labRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToReport = useCallback(() => {
    reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToProtocol = useCallback(() => {
    protocolRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleFiles = useCallback(async (files, source = 'upload') => {
    const selected = files?.[0];
    if (!selected) return;

    setError('');
    setResult(null);
    setIsPreparing(true);

    try {
      const prepared = await preparePlantImage(selected);
      setImage(prepared);
      setPhotoId(`#${Math.random().toString(16).slice(2, 6).toUpperCase()}-B`);
      setCaptureNotice(source === 'paste' ? 'Clipboard plant photo uploaded.' : 'Plant photo uploaded.');
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
    if (!result) return undefined;

    const timeout = window.setTimeout(scrollToReport, 180);
    return () => window.clearTimeout(timeout);
  }, [result, scrollToReport]);

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

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    const normalizedEmail = newsletterEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setNewsletterStatus('Enter a valid email address.');
      return;
    }

    try {
      const current = JSON.parse(window.localStorage.getItem('chloro_newsletter_signups') || '[]');
      const next = Array.from(new Set([...current, normalizedEmail]));
      window.localStorage.setItem('chloro_newsletter_signups', JSON.stringify(next));
    } catch {
      // The sign-up still succeeds visually if local storage is unavailable.
    }

    setNewsletterEmail('');
    setNewsletterStatus('Subscribed. Botanical care notes are saved for this browser.');
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#F7F3EA] text-[#11110E]"
    >
      <Navbar />

      <main className="pt-[82px]">
        <EditorialHero
          eyebrow="Gemini Vision Lab"
          title="AI Plant"
          italic="Diagnosis"
          copy="Upload a plant image, add field notes, and receive a visual assessment with likely causes, local Nepal care context, and recovery steps."
          image={placeholderLeaf}
          imageAlt="Monstera leaf detail for AI diagnosis"
          objectPosition="center"
          actions={(
            <button
              type="button"
              onClick={scrollToLab}
              className="border border-[#FBF9F4]/65 px-7 py-4 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#FBF9F4] hover:text-[#0F3A3A]"
            >
              Open Diagnostic Bench
            </button>
          )}
          meta={[
            { label: 'Status', value: clinicalState },
            { label: 'Region', value: regionLabel },
            { label: 'Model', value: 'Gemini' },
          ]}
        />

        <section ref={labRef} className="scroll-mt-[96px] border-b border-[#11110E]/10 bg-[#F7F3EA] px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-20">
          <div className="mx-auto w-full max-w-[1720px] md:w-[90vw]">
            <div className="text-center">
              <p className="font-label text-[8px] uppercase tracking-[0.42em] text-[#7A756A]">Diagnostic Module 0.1</p>
              <h1 className="mx-auto mt-5 max-w-[820px] font-headline text-[54px] leading-[0.92] tracking-tight text-[#11110E] md:text-[82px]">
                Plant Health Report
              </h1>
              <div className="mx-auto mt-10 h-20 w-px bg-[#11110E]/18" />
            </div>

            <div className="mt-16 grid border border-[#11110E]/12 bg-[#FFFEFA] lg:grid-cols-[minmax(0,1.24fr)_minmax(390px,0.76fr)]">
              <aside className="flex min-h-[520px] items-center justify-center border-b border-[#11110E]/12 p-6 md:p-10 lg:border-b-0 lg:border-r">
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
                  className={`relative block aspect-[4/5] w-full max-w-[620px] cursor-pointer overflow-hidden bg-[#E6E4DC] transition-all duration-300 ${
                    isDragging ? 'shadow-[0_26px_90px_rgba(17,17,14,0.18)] ring-1 ring-[#11110E]' : ''
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
                    alt="Plant photo"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-[#11110E]/8" />
                  <div className="pointer-events-none absolute inset-5 border border-white/45" />
                  <div className="absolute left-6 top-6 border border-white/45 bg-black/72 px-4 py-3 text-[#F7F3EA] backdrop-blur-sm">
                    <p className="font-label text-[8px] uppercase tracking-[0.22em]">Photo ID: {photoId}</p>
                    <p className="mt-1 font-label text-[7px] uppercase tracking-[0.2em] text-[#F7F3EA]/65">Sample set 3A, 2026</p>
                  </div>
                  <div className="absolute bottom-6 right-6 bg-[#FFFEFA] px-4 py-3 text-right shadow-[0_16px_45px_rgba(17,17,14,0.12)]">
                    <p className="font-label text-[7px] uppercase tracking-[0.18em] text-[#7A756A]">Confidence Score</p>
                    <p className="mt-1 font-headline text-[22px] leading-none text-[#11110E]">{confidenceLabel}</p>
                  </div>
                  <div className={`absolute left-1/2 top-1/2 flex w-[240px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border border-white/70 bg-[#FFFEFA]/94 px-5 py-8 text-center shadow-[0_18px_60px_rgba(24,24,18,0.12)] backdrop-blur-sm transition-opacity ${image ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                    {isPreparing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                    <span className="mt-5 font-label text-[9px] uppercase tracking-[0.18em] text-[#565149]">
                      {image ? 'Replace Photo' : 'Upload Plant Photo'}
                    </span>
                    <span className="mt-3 font-body text-[11px] leading-relaxed text-[#8A857A]">
                      Click, drop, or paste image
                    </span>
                  </div>
                  {(isPreparing || isAnalyzing) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#F7F3EA]/75">
                      <Loader2 className="h-8 w-8 animate-spin text-[#11110E]" />
                    </div>
                  )}
                </label>
              </aside>

              <section ref={reportRef} className="grid scroll-mt-[96px] divide-y divide-[#11110E]/12">
                <div className="p-7 md:p-10">
                  <p className="font-label text-[8px] font-bold uppercase tracking-[0.28em] text-[#A90000]">Severity: {severityLabel}</p>
                  <h2 className="mt-5 font-headline text-[38px] leading-[0.96] text-[#11110E] md:text-[48px]">
                    {resultTitle}
                  </h2>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="bg-[#E8E8E0] px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.18em] text-[#686256]">Region: {regionLabel}</span>
                    <span className="bg-[#E8E8E0] px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.18em] text-[#686256]">{clinicalState}</span>
                    <span className="bg-[#E8E8E0] px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.18em] text-[#686256]">{result?.nepalNotes?.[0] ? 'Nepal Context' : 'Gemini Vision'}</span>
                  </div>
                </div>

                <article className="p-7 md:p-10">
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="font-label text-[9px] uppercase tracking-[0.32em] text-[#7A756A]">The Assessment</h3>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#11110E]/12 bg-[#F7F3EA]">
                      {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#8A6A21]" />}
                    </div>
                  </div>
                  <p className="mt-7 font-body text-[14px] leading-loose text-[#5E5A52]">
                    {result?.summary || (image
                      ? 'Your plant photo is ready. Begin analysis to receive likely causes, visible stress notes, and care steps for Nepal conditions.'
                      : 'Upload a plant image to activate Gemini analysis. The report will stay grounded in visible evidence, field notes, and local climate context.')}
                  </p>
                  <div className="mt-8 grid gap-0 sm:grid-cols-2">
                    <ReportMetric label="Pathogen Identification" value={topProblem?.name || 'Pending'} />
                    <ReportMetric label="Metabolic Status" value={(topProblem?.evidence || result?.causes?.[0]) || 'Awaiting spectral reading'} />
                  </div>
                  <button
                    type="button"
                    onClick={result ? () => window.print() : handleAnalyze}
                    disabled={reportActionDisabled}
                    className="mt-8 flex w-full items-center justify-center gap-3 border border-[#11110E] px-5 py-4 font-label text-[9px] uppercase tracking-[0.2em] text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FFFEFA] disabled:cursor-not-allowed disabled:border-[#11110E]/25 disabled:text-[#11110E]/35"
                  >
                    {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
                    {reportActionLabel}
                  </button>
                  {captureNotice && (
                    <p className="mt-4 border border-[#456565]/20 bg-[#456565]/5 px-4 py-3 font-label text-[9px] uppercase tracking-[0.18em] text-[#456565]">
                      {captureNotice}
                    </p>
                  )}
                  {result && (
                    <Motion.button
                      type="button"
                      onClick={scrollToProtocol}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-5 flex w-full items-center justify-between gap-4 border border-[#456565]/25 bg-[#456565]/8 px-5 py-4 text-left transition-colors hover:border-[#456565] hover:bg-[#456565]/12"
                    >
                      <span>
                        <span className="block font-label text-[8px] font-bold uppercase tracking-[0.24em] text-[#456565]">Assessment Ready</span>
                        <span className="mt-2 block font-body text-[12px] leading-relaxed text-[#5E5A52]">
                          Continue down to prescribed care, matched products, and the recovery protocol.
                        </span>
                      </span>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#456565]/30 bg-[#FFFEFA] text-[#456565]">
                        <ArrowDown className="h-4 w-4" />
                      </span>
                    </Motion.button>
                  )}
                </article>

                <div className="grid gap-5 p-7 md:p-10">
                  <div className="flex flex-col gap-4 border border-[#11110E]/12 bg-[#F7F3EA] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <LocateFixed className="mt-0.5 h-4 w-4 shrink-0 text-[#8A6A21]" />
                      <div>
                        <p className="font-label text-[8px] uppercase tracking-[0.24em] text-[#6D695F]">Location Context</p>
                        <p className="mt-2 font-body text-[12px] leading-relaxed text-[#5E5A52]">
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
                      className="shrink-0 border border-[#11110E] px-4 py-3 font-label text-[9px] uppercase tracking-[0.18em] text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FFFEFA] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {locating ? 'Locating' : location ? 'Refresh' : 'Use Location'}
                    </button>
                  </div>

                  <div>
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
                      rows={4}
                      placeholder="Yellow lower leaves, sticky residue, brown tips, recent repotting, balcony sun..."
                      className="mt-4 w-full resize-none border border-[#11110E]/12 bg-[#FFFEFA] p-4 font-body text-sm leading-relaxed text-[#333029] outline-none placeholder:text-[#918B80] focus:border-[#11110E]"
                    />
                  </div>

                  {error && (
                    <div className="flex gap-3 border border-[#A90000]/25 bg-[#A90000]/5 px-4 py-3 text-[#A90000]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="font-body text-sm leading-relaxed">{error}</p>
                    </div>
                  )}

                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setResult(null);
                        setError('');
                        setCaptureNotice('');
                      }}
                      className="inline-flex w-max items-center gap-2 border border-[#11110E]/12 bg-[#FFFEFA] px-4 py-3 font-label text-[9px] uppercase tracking-[0.18em] text-[#6D695F] transition-colors hover:border-[#11110E] hover:text-[#11110E]"
                    >
                      <X className="h-4 w-4" />
                      Clear Photo
                    </button>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="bg-[#F7F3EA] px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto w-full max-w-[1720px] md:w-[90vw]">
            <div className="flex flex-col justify-between gap-6 border-b border-[#11110E]/10 pb-7 md:flex-row md:items-end">
              <div>
                <p className="font-label text-[8px] uppercase tracking-[0.34em] text-[#7A756A]">Recommended Care</p>
                <h2 className="mt-3 font-headline text-[38px] leading-none text-[#11110E] md:text-[52px]">Care Products For This Plant</h2>
              </div>
              <p className="max-w-[330px] font-body text-[12px] leading-relaxed text-[#6D695F] md:text-right">
                Targeted care products are selected from live CHLORO inventory after analysis.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-[1460px] grid-cols-1 gap-8 md:grid-cols-2">
              {treatmentCards.map((product, index) => (
                <ProductCard
                  key={product.id || product.name}
                  product={product}
                  delay={index * 0.08}
                  imageFrameClassName="aspect-[1/0.92] max-h-[620px]"
                />
              ))}
            </div>

            {result && !displayProducts.length && (
              <p className="mt-6 border border-[#11110E]/10 bg-[#FFFEFA] px-5 py-4 font-body text-[13px] leading-relaxed text-[#6D695F]">
                Gemini did not find a matching inventory item. Add care products in the admin inventory to make this section recommend real stock.
              </p>
            )}

            <div ref={protocolRef} className="mt-24 grid scroll-mt-[96px] gap-10 border-t border-[#11110E]/10 pt-12 lg:grid-cols-[320px_1fr]">
              <div>
                <p className="font-label text-[8px] uppercase tracking-[0.34em] text-[#7A756A]">Logistics</p>
                <h2 className="mt-3 font-headline text-[36px] leading-[0.95] text-[#11110E] md:text-[48px]">Recovery Protocol</h2>
              </div>
              <div className="divide-y divide-[#11110E]/10 border-t border-[#11110E]/10">
                {protocol.slice(0, 4).map((item, index) => (
                  <div key={`${item.label}-${item.text}`} className="grid gap-5 py-7 md:grid-cols-[64px_1fr_1.35fr]">
                    <p className="font-label text-[22px] text-[#11110E]/28">{String(index + 1).padStart(2, '0')}</p>
                    <div>
                      <p className="font-label text-[8px] uppercase tracking-[0.24em] text-[#7A756A]">{item.label}</p>
                      <p className="mt-2 font-headline text-[24px] leading-none text-[#11110E]">{item.label}</p>
                    </div>
                    <p className="font-body text-[13px] leading-relaxed text-[#5E5A52]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {result?.disclaimer && (
              <p className="mt-12 max-w-[700px] border-t border-[#E5E1D7] pt-6 font-body text-[12px] leading-relaxed text-[#8A857A]">
                {result.disclaimer}
              </p>
            )}
          </div>
        </section>

        <section className="bg-[#F7F3EA] px-6 pb-24 md:px-10">
          <div className="mx-auto w-full max-w-[1720px] border border-[#11110E]/14 bg-[#FFFEFA] px-6 py-20 text-center md:w-[90vw] md:px-10">
            <h2 className="font-headline text-[clamp(2.15rem,5vw,3.25rem)] leading-[0.95] text-[#11110E]">
              Expertise delivered weekly.
            </h2>
            <p className="mx-auto mt-5 max-w-[430px] font-body text-[13px] leading-relaxed text-[#6D695F]">
              Join our botanical registry for clinical insights, care protocols, and laboratory updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-12 flex max-w-[520px] flex-col gap-4 sm:flex-row sm:items-end sm:border-b sm:border-[#11110E]/30">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(event) => {
                  setNewsletterEmail(event.target.value);
                  setNewsletterStatus('');
                }}
                placeholder="Email address"
                className="min-w-0 flex-1 border-b border-[#11110E]/30 bg-transparent py-3 font-label text-[10px] tracking-[0.16em] text-[#11110E] outline-none placeholder:text-[#11110E]/40 sm:border-b-0"
              />
              <button type="submit" className="border border-[#11110E] px-5 py-3 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FFFEFA] sm:border-0 sm:px-0">
                Submit
              </button>
            </form>
            {newsletterStatus && (
              <p className="mx-auto mt-4 max-w-[520px] font-body text-[12px] leading-relaxed text-[#5E5A52]">
                {newsletterStatus}
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default AiDiagnosisPage;
