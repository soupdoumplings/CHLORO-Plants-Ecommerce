import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { AlertTriangle, Camera, Leaf, Loader2, LocateFixed, ShoppingBag, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { analyzePlantImage, preparePlantImage } from '../../lib/gemini';
import { useCart } from '../../lib/CartContext';
import { useGeoLocation } from '../../lib/useGeoLocation';

const placeholderLeaf = 'https://images.unsplash.com/photo-1614594075920-b4842c4f6f86?auto=format&fit=crop&q=80&w=1400';

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const staggerReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

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
    ? `Rs ${Number(product.price || 0).toLocaleString('en-NP')}`
    : product.price;

  const content = (
    <Motion.article
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group border border-[#11110E]/12 bg-[#F7F3EA]"
    >
      <div className="aspect-[1.08/1] overflow-hidden bg-[#E6E4DC]">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Leaf className="h-7 w-7 text-[#456565]" />
          </div>
        )}
      </div>
      <div className="p-5">
      <p className="font-label text-[8px] uppercase tracking-[0.3em] text-[#8A6A21]">{product.category || product.priority || 'Apothecary'}</p>
      <h3 className="mt-2 font-headline text-[31px] leading-[0.96] text-[#11110E]">{product.name}</h3>
      <p className="mt-3 min-h-[42px] font-body text-[12px] leading-relaxed text-[#6D695F]">{product.reason}</p>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!isRealProduct}
        className="mt-5 flex w-full items-center justify-center gap-2 border border-[#11110E] px-4 py-3 text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FBF9F4] disabled:cursor-default disabled:border-[#8F8B82] disabled:text-[#8F8B82]"
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        <span className="font-label text-[9px] uppercase tracking-[0.2em]">
          {isRealProduct ? (added ? 'Added to Regimen' : `Add to Regimen - ${priceLabel}`) : 'Awaiting Inventory'}
        </span>
      </button>
      </div>
    </Motion.article>
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
  const insightCards = [
    {
      label: 'Severity',
      value: result ? severityCopy[result.severity] || 'Clinical Note' : image ? 'Prepared' : 'Standby',
    },
    {
      label: 'Region',
      value: location ? locationLabel : 'Nepal Default',
    },
    {
      label: 'Confidence',
      value: confidenceLabel,
    },
  ];

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
      className="min-h-screen bg-[#F7F3EA] text-[#11110E]"
    >
      <Navbar />

      <main className="pt-[82px]">
        <section className="relative min-h-[560px] overflow-hidden bg-[#050505] text-[#F7F3EA]">
          <img
            src={image?.previewUrl || placeholderLeaf}
            alt="Diagnostic specimen backdrop"
            className="absolute inset-0 h-full w-full object-cover opacity-72"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/30 to-black/12" />
          <div className="absolute right-8 top-8 hidden border border-[#F7F3EA]/35 bg-black/55 px-5 py-4 backdrop-blur-sm md:block">
            <p className="font-label text-[8px] uppercase tracking-[0.26em] text-[#F7F3EA]/60">Specimen ID: {specimenId}</p>
            <p className="mt-1 font-label text-[8px] uppercase tracking-[0.26em] text-[#F7F3EA]/60">{clinicalState}</p>
          </div>
          <Motion.div
            variants={staggerReveal}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex min-h-[560px] max-w-[1380px] flex-col justify-end px-6 pb-16 md:px-12 lg:px-16"
          >
            <Motion.p variants={sectionReveal} transition={{ duration: 0.55 }} className="font-label text-[9px] uppercase tracking-[0.55em] text-[#C6E9E9]">
              Diagnostic Module 0.1
            </Motion.p>
            <Motion.h1 variants={sectionReveal} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mt-5 max-w-[680px] font-headline text-[74px] leading-[0.78] tracking-tight md:text-[118px]">
              The<br />Digital<br />Clinician
            </Motion.h1>
            <Motion.div variants={sectionReveal} transition={{ duration: 0.7 }} className="mt-9 h-px w-24 bg-[#F7F3EA]/55" />
          </Motion.div>
        </section>

        <section className="mx-auto grid max-w-[1380px] grid-cols-1 gap-0 px-6 py-16 md:px-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.72fr)] lg:py-24">
          <aside className="border border-[#11110E]/12 bg-[#F7F3EA] p-4 md:p-6">
            <Motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 flex items-center justify-between gap-5"
            >
              <p className="font-label text-[9px] uppercase tracking-[0.35em] text-[#7A756A]">Specimen Capture</p>
              <p className="font-label text-[8px] uppercase tracking-[0.22em] text-[#8A6A21]">{confidenceLabel}</p>
            </Motion.div>

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
              className={`chloro-scan-frame relative block aspect-[4/5] cursor-pointer overflow-hidden border bg-[#F0D0A4] transition-all duration-300 ${
                isDragging ? 'border-[#11110E] shadow-[0_20px_80px_rgba(17,17,14,0.14)]' : 'border-[#D7C8AE]'
              } ${isAnalyzing ? 'is-scanning' : ''}`}
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
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[#11110E]/5" />
              <div className="pointer-events-none absolute inset-5 border border-white/40" />
              <div className="pointer-events-none absolute left-5 top-5 h-10 w-10 border-l border-t border-white/70" />
              <div className="pointer-events-none absolute bottom-5 right-5 h-10 w-10 border-b border-r border-white/70" />
              <div className="absolute left-5 top-5 border border-white/45 bg-black/70 px-4 py-3 text-[#F7F3EA] backdrop-blur-sm">
                <p className="font-label text-[8px] uppercase tracking-[0.22em]">Specimen ID: {specimenId}</p>
                <p className="mt-1 font-label text-[7px] uppercase tracking-[0.2em] text-[#F7F3EA]/65">Sample set 3A, 2026</p>
              </div>
              <div className={`absolute left-1/2 top-1/2 flex w-[230px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border border-white/65 bg-[#FFFEFA]/92 px-5 py-8 text-center shadow-[0_18px_60px_rgba(24,24,18,0.12)] backdrop-blur-sm transition-opacity ${image ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                {isPreparing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                <span className="mt-5 font-label text-[9px] uppercase tracking-[0.18em] text-[#565149]">
                  {image ? 'Replace Specimen' : 'Upload New Specimen'}
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
            {captureNotice && (
              <p className="mt-4 max-w-[520px] border border-[#456565]/20 bg-[#456565]/5 px-4 py-3 font-label text-[9px] uppercase tracking-[0.18em] text-[#456565]">
                {captureNotice}
              </p>
            )}

            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_220px]">
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
                  rows={6}
                  placeholder="Yellow lower leaves, sticky residue, brown tips, recent repotting, balcony sun..."
                  className="mt-4 w-full resize-none border border-[#11110E]/12 bg-[#FFFEFA] p-4 font-body text-sm leading-relaxed text-[#333029] outline-none placeholder:text-[#918B80] focus:border-[#11110E]"
                />
              </div>

              <div className="border border-[#11110E]/12 bg-[#FFFEFA] p-5">
                <p className="font-label text-[8px] uppercase tracking-[0.22em] text-[#8A857A]">Plant ID</p>
                <p className="mt-2 font-headline text-[22px] leading-tight">{result?.plantLikely || (image ? 'Pending' : 'Awaiting')}</p>
                <ReportMetric label="Confidence" value={confidenceLabel} />
                <ReportMetric label="State" value={image ? 'Captured' : 'Open'} />
              </div>
            </div>

            <div className="mt-5 border border-[#11110E]/12 bg-[#FFFEFA] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <LocateFixed className="mt-0.5 h-4 w-4 shrink-0 text-[#8A6A21]" />
                  <div>
                    <p className="font-label text-[9px] uppercase tracking-[0.28em] text-[#6D695F]">Location Context</p>
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
            </div>

            <div className="mt-5">
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
                  className="flex items-center justify-center gap-3 bg-[#11110E] px-6 py-4 text-[#F7F3EA] transition-colors hover:bg-[#2F2A22] disabled:cursor-not-allowed disabled:bg-[#A8A298]"
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
                    className="flex w-14 items-center justify-center border border-[#11110E]/12 bg-[#FFFEFA] text-[#6D695F] transition-colors hover:border-[#11110E] hover:text-[#11110E]"
                    title="Clear specimen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </aside>

          <Motion.section
            variants={staggerReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="border-y border-r border-[#11110E]/12 bg-[#FFFEFA] p-8 md:p-12"
          >
            <Motion.p variants={sectionReveal} transition={{ duration: 0.55 }} className="font-label text-[9px] uppercase tracking-[0.35em] text-[#A90000]">Severity: {result ? severityCopy[result.severity] || 'Clinical Note' : image ? 'Prepared' : 'Standby'}</Motion.p>
            <Motion.h2 variants={sectionReveal} transition={{ duration: 0.65 }} className="mt-8 max-w-[760px] font-headline text-[44px] leading-[0.94] text-[#11110E] md:text-[66px]">
              {resultTitle}
            </Motion.h2>
            <Motion.div variants={sectionReveal} transition={{ duration: 0.55 }} className="mt-5 flex flex-wrap gap-2">
              {insightCards.map((card) => (
                <span key={card.label} className="chloro-hover-lift bg-[#E8E8E0] px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.18em] text-[#686256]">
                  {card.label}: {card.value}
                </span>
              ))}
              <span className="chloro-hover-lift bg-[#E8E8E0] px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.18em] text-[#686256]">
                {result?.nepalNotes?.[0] ? 'Nepal Context' : 'Gemini Vision'}
              </span>
            </Motion.div>

            <Motion.article
              variants={sectionReveal}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-14 max-w-[760px] border-t border-[#11110E]/12 pt-9"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="font-label text-[9px] uppercase tracking-[0.32em] text-[#7A756A]">The Assessment</h3>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#11110E]/12 bg-[#F7F3EA]">
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#8A6A21]" />}
                </div>
              </div>
              <p className="mt-8 max-w-[580px] font-body text-[15px] leading-loose text-[#5E5A52]">
                {result?.summary || (image
                  ? 'The specimen is captured. Begin clinical analysis to receive a structured reading of pigmentation, visible stress, likely causes, and care steps for Nepal conditions.'
                  : 'Awaiting a live specimen. Upload, drag, or paste a plant image to activate Gemini analysis. The assessment will remain grounded in visible evidence and local care context.')}
              </p>
              <div className="mt-10 grid gap-0 sm:grid-cols-2">
                <ReportMetric label="Pathogen Identification" value={topProblem?.name || 'Pending'} />
                <ReportMetric label="Metabolic Status" value={(topProblem?.evidence || result?.causes?.[0]) || 'Awaiting spectral reading'} />
              </div>
              <button type="button" className="mt-10 w-full border border-[#11110E] px-5 py-4 font-label text-[9px] uppercase tracking-[0.2em] text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FFFEFA]">
                Export Full Lab Report
              </button>
            </Motion.article>

            {result?.disclaimer && (
              <Motion.p variants={sectionReveal} transition={{ duration: 0.55 }} className="mt-12 max-w-[700px] border-t border-[#E5E1D7] pt-6 font-body text-[12px] leading-relaxed text-[#8A857A]">
                {result.disclaimer}
              </Motion.p>
            )}
          </Motion.section>
        </section>

        <section className="mx-auto max-w-[1380px] px-6 pb-20 md:px-12">
          <Motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.65 }} className="flex flex-col gap-5 border-b border-[#11110E]/12 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-label text-[9px] uppercase tracking-[0.35em] text-[#7A756A]">Curated Care</p>
              <h2 className="mt-3 font-headline text-[44px] leading-none text-[#11110E] md:text-[64px]">Prescribed Apothecary</h2>
            </div>
            <Link to="/products-gifts" className="font-label text-[8px] uppercase tracking-[0.18em] text-[#8A6A21] underline underline-offset-4">
              View Full Range
            </Link>
          </Motion.div>

          {result && displayProducts.length ? (
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {displayProducts.slice(0, 2).map((product, index) => (
                <ProductCard key={product.id || product.name} product={product} index={index} />
              ))}
            </div>
          ) : (
            <Motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.55 }} className="mt-10 border border-[#11110E]/10 bg-[#FFFEFA] px-8 py-7">
              <p className="font-headline text-[28px] italic text-[#181812]">{result ? 'No prescribed product yet.' : 'Prescriptions unlock after analysis.'}</p>
              <p className="mt-3 max-w-[560px] font-body text-[13px] leading-relaxed text-[#6D695F]">
                {result
                  ? 'Gemini did not find a matching item in CHLORO inventory. Add care products in the database to make this section recommend only real stock.'
                  : 'The assistant will only recommend products that exist in your CHLORO product database.'}
              </p>
            </Motion.div>
          )}
        </section>

        <section className="mx-auto max-w-[1380px] px-6 pb-24 md:px-12">
          <div className="grid gap-10 bg-[#050505] p-8 text-[#F7F3EA] md:p-12 lg:grid-cols-[300px_1fr]">
            <div>
              <p className="font-label text-[9px] uppercase tracking-[0.35em] text-[#C6E9E9]/70">Logistics</p>
              <h2 className="mt-4 font-headline text-[48px] leading-[0.9] md:text-[62px]">Recovery<br />Protocol</h2>
              <div className="mt-8 h-px w-20 bg-[#F7F3EA]" />
            </div>
            <div className="space-y-0">
              {protocol.slice(0, 4).map((item, index) => (
                <Motion.div
                  key={`${item.label}-${item.text}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="grid gap-5 border-t border-[#F7F3EA]/18 py-7 md:grid-cols-[70px_1fr_1.5fr]"
                >
                  <p className="font-label text-[22px] text-[#F7F3EA]/55">{String(index + 1).padStart(2, '0')}</p>
                  <div>
                    <p className="font-label text-[8px] uppercase tracking-[0.26em] text-[#F7F3EA]/45">{item.label}</p>
                    <p className="mt-2 font-headline text-[26px] leading-none">{item.label}</p>
                  </div>
                  <p className="font-body text-[13px] leading-relaxed text-[#F7F3EA]/72">{item.text}</p>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        <Motion.section
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mb-24 max-w-[1380px] border border-[#11110E] bg-[#F7F3EA] px-6 py-24 text-center text-[#11110E] md:px-10"
        >
          <Motion.h2 variants={sectionReveal} transition={{ duration: 0.65 }} className="font-headline text-[52px] leading-[0.9] md:text-[70px]">
            Care notes, <span className="italic">composed weekly.</span>
          </Motion.h2>
          <Motion.p variants={sectionReveal} transition={{ duration: 0.55 }} className="mx-auto mt-5 max-w-[430px] font-body text-[13px] leading-relaxed text-[#5E5A52]">
            Join our inner circle for clinical plant care insights and early access to the archive.
          </Motion.p>
          <Motion.form variants={sectionReveal} transition={{ duration: 0.55 }} className="mx-auto mt-12 flex max-w-[440px] items-center border-b border-[#11110E]/40">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="min-w-0 flex-1 bg-transparent py-3 font-label text-[9px] uppercase tracking-[0.2em] outline-none placeholder:text-[#11110E]/40"
            />
            <button type="button" className="py-3 font-label text-[9px] uppercase tracking-[0.2em] text-[#11110E]">Submit</button>
          </Motion.form>
        </Motion.section>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default AiDiagnosisPage;
