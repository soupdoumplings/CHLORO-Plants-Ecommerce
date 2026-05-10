import React, { useEffect, useMemo, useRef, useState } from 'react';
import loungeChairBg from '../../../assets/bg (1).png';
import mirrorWallBg from '../../../assets/bg (2).png';
import rattanChairBg from '../../../assets/bg (3).png';
import terracottaBenchBg from '../../../assets/bg (4).png';
import lampCornerBg from '../../../assets/bg (5).png';

const MODEL_VIEWER_SCRIPT_ID = 'model-viewer-script';
const MODEL_VIEWER_SRC = '/vendor/model-viewer.min.js';
const DEFAULT_CAMERA_ORBIT = '25deg 72deg 4m';
const DEFAULT_FIELD_OF_VIEW = '11deg';
const DEFAULT_MODEL_OFFSETS = { x: 0, y: 0 };
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const ROOM_BACKGROUNDS = [
  {
    name: 'Lounge chair',
    src: loungeChairBg,
    position: 'center center',
    placement: { x: '24%', y: '12%', width: 'clamp(108px, 14vw, 210px)', height: 'clamp(210px, 31vw, 430px)' },
    shadow: { x: '24%', y: '11%', width: 'clamp(150px, 20vw, 320px)', height: 'clamp(38px, 5.4vw, 78px)', rotate: '-6deg', opacity: 0.5 },
    modelFilter: 'saturate(0.82) contrast(0.92) brightness(0.94) sepia(0.07)',
  },
  {
    name: 'Mirror wall',
    src: mirrorWallBg,
    position: 'center center',
    placement: { x: '50%', y: '10%', width: 'clamp(116px, 15vw, 220px)', height: 'clamp(224px, 33vw, 450px)' },
    shadow: { x: '50%', y: '10%', width: 'clamp(160px, 21vw, 330px)', height: 'clamp(40px, 5.5vw, 80px)', rotate: '0deg', opacity: 0.42 },
    modelFilter: 'saturate(0.78) contrast(0.9) brightness(0.98)',
  },
  {
    name: 'Rattan chair',
    src: rattanChairBg,
    position: 'center center',
    placement: { x: '29%', y: '11%', width: 'clamp(116px, 15vw, 220px)', height: 'clamp(224px, 33vw, 450px)' },
    shadow: { x: '29%', y: '11%', width: 'clamp(165px, 21vw, 335px)', height: 'clamp(42px, 5.6vw, 82px)', rotate: '-8deg', opacity: 0.48 },
    modelFilter: 'saturate(0.82) contrast(0.92) brightness(0.95) sepia(0.08)',
  },
  {
    name: 'Terracotta bench',
    src: terracottaBenchBg,
    position: 'center center',
    placement: { x: '62%', y: '27%', width: 'clamp(100px, 13vw, 190px)', height: 'clamp(190px, 27vw, 380px)' },
    shadow: { x: '62%', y: '27%', width: 'clamp(135px, 17vw, 260px)', height: 'clamp(32px, 4.5vw, 64px)', rotate: '-2deg', opacity: 0.44 },
    modelFilter: 'saturate(0.8) contrast(0.92) brightness(0.96) sepia(0.1)',
  },
  {
    name: 'Lamp corner',
    src: lampCornerBg,
    position: 'center center',
    placement: { x: '29%', y: '12%', width: 'clamp(116px, 15vw, 220px)', height: 'clamp(224px, 33vw, 450px)' },
    shadow: { x: '29%', y: '12%', width: 'clamp(165px, 21vw, 335px)', height: 'clamp(40px, 5.5vw, 80px)', rotate: '-4deg', opacity: 0.52 },
    modelFilter: 'saturate(0.78) contrast(0.92) brightness(0.9) sepia(0.1)',
  },
];

const PlantRoomViewer = ({ modelUrl, plantName }) => {
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [modelStatus, setModelStatus] = useState({ key: '', loaded: false, error: false });
  const [isMoveMode, setIsMoveMode] = useState(false);
  const [modelOffsets, setModelOffsets] = useState(() => ROOM_BACKGROUNDS.map(() => DEFAULT_MODEL_OFFSETS));
  const sceneRef = useRef(null);
  const viewerRef = useRef(null);
  const dragRef = useRef(null);
  const activeRoom = ROOM_BACKGROUNDS[activeRoomIndex];
  const activeOffset = modelOffsets[activeRoomIndex] || DEFAULT_MODEL_OFFSETS;
  const modelKey = `${modelUrl || 'missing'}-${activeRoomIndex}`;
  const isModelLoaded = modelStatus.key === modelKey && modelStatus.loaded;
  const hasModelError = modelStatus.key === modelKey && modelStatus.error;
  const roomStyle = useMemo(
    () => ({
      '--model-x': activeRoom.placement.x,
      '--model-y': activeRoom.placement.y,
      '--model-width': activeRoom.placement.width,
      '--model-height': activeRoom.placement.height,
      '--shadow-x': activeRoom.shadow.x,
      '--shadow-y': activeRoom.shadow.y,
      '--shadow-width': activeRoom.shadow.width,
      '--shadow-height': activeRoom.shadow.height,
      '--shadow-rotate': activeRoom.shadow.rotate,
      '--shadow-opacity': activeRoom.shadow.opacity,
      '--model-filter': activeRoom.modelFilter,
      '--drag-x': `${activeOffset.x}%`,
      '--drag-y': `${activeOffset.y}%`,
    }),
    [activeOffset, activeRoom]
  );

  useEffect(() => {
    if (!modelUrl || typeof window === 'undefined' || document.getElementById(MODEL_VIEWER_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = MODEL_VIEWER_SCRIPT_ID;
    script.type = 'module';
    script.src = MODEL_VIEWER_SRC;
    document.head.appendChild(script);
  }, [modelUrl]);

  useEffect(() => {
    const viewerEl = viewerRef.current;
    if (!viewerEl || !modelUrl) return undefined;

    const markLoaded = () => setModelStatus({ key: modelKey, loaded: true, error: false });
    const markError = () => setModelStatus({ key: modelKey, loaded: false, error: true });
    const handleProgress = (event) => {
      if (event?.detail?.totalProgress >= 1) {
        markLoaded();
      }
    };

    viewerEl.addEventListener('load', markLoaded);
    viewerEl.addEventListener('model-visibility', markLoaded);
    viewerEl.addEventListener('progress', handleProgress);
    viewerEl.addEventListener('error', markError);

    if (viewerEl.loaded || viewerEl.modelIsVisible) {
      markLoaded();
    }

    return () => {
      viewerEl.removeEventListener('load', markLoaded);
      viewerEl.removeEventListener('model-visibility', markLoaded);
      viewerEl.removeEventListener('progress', handleProgress);
      viewerEl.removeEventListener('error', markError);
    };
  }, [modelKey, modelUrl]);

  const resetCamera = () => {
    const viewerEl = viewerRef.current;
    if (!viewerEl) return;

    viewerEl.cameraOrbit = DEFAULT_CAMERA_ORBIT;
    viewerEl.fieldOfView = DEFAULT_FIELD_OF_VIEW;
    viewerEl.cameraTarget = 'auto auto auto';
    viewerEl.jumpCameraToGoal?.();
  };

  const resetPlacement = () => {
    setModelOffsets(prev => prev.map((offset, index) => (
      index === activeRoomIndex ? DEFAULT_MODEL_OFFSETS : offset
    )));
  };

  const handlePlacementPointerDown = (event) => {
    if (!isMoveMode || !modelUrl || hasModelError) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      roomIndex: activeRoomIndex,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: activeOffset,
    };
  };

  const handlePlacementPointerMove = (event) => {
    if (!dragRef.current || !sceneRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    const rect = sceneRef.current.getBoundingClientRect();
    const drag = dragRef.current;
    const nextOffset = {
      x: clamp(drag.startOffset.x + ((event.clientX - drag.startX) / rect.width) * 100, -34, 34),
      y: clamp(drag.startOffset.y + ((event.clientY - drag.startY) / rect.height) * 100, -26, 30),
    };

    setModelOffsets(prev => prev.map((offset, index) => (
      index === drag.roomIndex ? nextOffset : offset
    )));
  };

  const handlePlacementPointerEnd = (event) => {
    if (!dragRef.current) return;

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current = null;
  };

  return (
    <section className="my-16 border-y border-[#D9DBCF] py-10 md:my-24 md:py-14">
      <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#785A1A]">
            Room Preview
          </p>
          <h2 className="mt-3 max-w-4xl font-headline text-4xl leading-tight text-[#31332C] md:text-6xl">
            Style {plantName || 'this plant'} before it arrives
          </h2>
        </div>
        <p className="max-w-sm font-body text-sm leading-7 text-[#5E6058] lg:justify-self-end lg:text-right">
          Switch rooms below, then drag the plant to inspect its scale and silhouette from every angle.
        </p>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[#D9DBCF] bg-[#FBF9F4] shadow-[0_24px_70px_rgba(49,51,44,0.12)]">
        <div
          ref={sceneRef}
          className="relative aspect-[4/5] min-h-[420px] overflow-hidden bg-[#E8E2D5] sm:aspect-[16/11] lg:aspect-[1402/820]"
          style={roomStyle}
        >
          <img
            key={activeRoom.src}
            src={activeRoom.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: activeRoom.position }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />

          <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2 md:left-7 md:top-7">
            <div className="rounded-full bg-[#FBF9F4]/90 px-4 py-2 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#31332C] shadow-sm backdrop-blur">
              {activeRoom.name}
            </div>
            <div className="rounded-full bg-black/35 px-4 py-2 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur">
            {modelUrl ? 'Interactive 3D' : 'Model Needed'}
            </div>
          </div>

          {modelUrl && !hasModelError && (
            <div className="pointer-events-none absolute z-[8] h-[calc(var(--model-height)*0.86)] w-[calc(var(--model-width)*1.5)] -translate-x-1/2 rounded-full bg-black/20 blur-3xl max-sm:left-[calc(50%+var(--drag-x))] max-sm:bottom-[calc(8%-var(--drag-y))] max-sm:h-[250px] max-sm:w-[210px] sm:left-[calc(var(--model-x)+var(--drag-x))] sm:bottom-[calc(var(--model-y)-var(--drag-y)+3%)]" />
          )}

          <div
            className={`absolute z-10 h-[var(--model-height)] w-[var(--model-width)] -translate-x-1/2 overflow-visible max-sm:left-[calc(50%+var(--drag-x))] max-sm:bottom-[calc(8%-var(--drag-y))] max-sm:h-[260px] max-sm:w-[132px] sm:left-[calc(var(--model-x)+var(--drag-x))] sm:bottom-[calc(var(--model-y)-var(--drag-y))] ${isMoveMode ? 'cursor-move touch-none' : ''}`}
            onPointerDown={handlePlacementPointerDown}
            onPointerMove={handlePlacementPointerMove}
            onPointerUp={handlePlacementPointerEnd}
            onPointerCancel={handlePlacementPointerEnd}
          >
            {modelUrl ? (
              <>
                {!isModelLoaded && !hasModelError && (
                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/55 border-t-transparent bg-black/20 backdrop-blur animate-spin" />
                )}
                {hasModelError ? (
                  <div className="absolute bottom-0 left-1/2 w-[190px] -translate-x-1/2 rounded-[8px] border border-white/45 bg-black/45 px-4 py-3 text-center font-label text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur">
                    Model could not load
                  </div>
                ) : (
                  <model-viewer
                    ref={viewerRef}
                    key={modelKey}
                    src={modelUrl}
                    alt={`${plantName || 'Plant'} 3D room preview`}
                    camera-controls
                    auto-rotate
                    auto-rotate-delay="2600"
                    ar
                    shadow-intensity="1.6"
                    shadow-softness="0.82"
                    exposure="0.82"
                    environment-image="neutral"
                    camera-orbit={DEFAULT_CAMERA_ORBIT}
                    field-of-view={DEFAULT_FIELD_OF_VIEW}
                    min-camera-orbit="auto 5deg 0.45m"
                    max-camera-orbit="auto 145deg 12m"
                    min-field-of-view="5deg"
                    max-field-of-view="45deg"
                    interpolation-decay="120"
                    interaction-prompt="none"
                    reveal="auto"
                    loading="eager"
                    touch-action={isMoveMode ? 'none' : 'pan-y'}
                    style={{ background: 'transparent', backgroundColor: 'transparent', '--poster-color': 'transparent', filter: 'var(--model-filter)' }}
                    className={`h-[170%] w-[170%] -translate-x-[21%] -translate-y-[23%] ${isMoveMode ? 'pointer-events-none cursor-move' : 'cursor-grab active:cursor-grabbing'}`}
                  >
                    <span slot="poster" />
                    <span slot="progress-bar" />
                  </model-viewer>
                )}
              </>
            ) : (
              <div className="absolute bottom-0 left-1/2 w-[200px] -translate-x-1/2 rounded-[8px] border border-white/45 bg-black/40 px-5 py-4 text-center font-label text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur">
                Add model_url for 3D preview
              </div>
            )}
          </div>

          {modelUrl && !hasModelError && (
            <>
              <div className="pointer-events-none absolute z-[9] h-[var(--shadow-height)] w-[var(--shadow-width)] -translate-x-1/2 rounded-full bg-black blur-2xl max-sm:left-[calc(50%+var(--drag-x))] max-sm:bottom-[calc(8%-var(--drag-y))] max-sm:h-14 max-sm:w-52 sm:left-[calc(var(--shadow-x)+var(--drag-x))] sm:bottom-[calc(var(--shadow-y)-var(--drag-y))]" style={{ opacity: 'var(--shadow-opacity)', transform: 'translateX(-50%) rotate(var(--shadow-rotate)) scaleX(1.3)' }} />
              <div className="pointer-events-none absolute z-[11] h-[calc(var(--shadow-height)*0.46)] w-[calc(var(--shadow-width)*0.62)] -translate-x-1/2 rounded-full bg-black blur-md max-sm:left-[calc(50%+var(--drag-x))] max-sm:bottom-[calc(9%-var(--drag-y))] max-sm:h-5 max-sm:w-28 sm:left-[calc(var(--shadow-x)+var(--drag-x))] sm:bottom-[calc(var(--shadow-y)-var(--drag-y)+1%)]" style={{ opacity: 0.42, transform: 'translateX(-50%) rotate(var(--shadow-rotate))' }} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[11] h-[24%] bg-gradient-to-t from-black/30 via-black/[0.08] to-transparent mix-blend-multiply" />
            </>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent" />

          {modelUrl && !hasModelError && (
            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMoveMode(prev => !prev)}
                className={`flex h-11 items-center gap-2 rounded-full border border-white/45 px-4 font-label text-[9px] font-bold uppercase tracking-[0.14em] shadow-sm backdrop-blur transition-colors ${isMoveMode ? 'bg-[#785A1A] text-white' : 'bg-[#FBF9F4]/90 text-[#31332C] hover:bg-white'}`}
                aria-pressed={isMoveMode}
                aria-label="Toggle model move mode"
                title="Toggle model move mode"
              >
                <span className="material-symbols-outlined text-[19px]">open_with</span>
                Move
              </button>
              <button
                type="button"
                onClick={resetPlacement}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-[#FBF9F4]/90 text-[#31332C] shadow-sm backdrop-blur transition-colors hover:bg-white"
                aria-label="Reset model placement"
                title="Reset model placement"
              >
                <span className="material-symbols-outlined text-[20px]">undo</span>
              </button>
              <button
                type="button"
                onClick={resetCamera}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-[#FBF9F4]/90 text-[#31332C] shadow-sm backdrop-blur transition-colors hover:bg-white"
                aria-label="Reset 3D model view"
                title="Reset 3D model view"
              >
                <span className="material-symbols-outlined text-[20px]">center_focus_strong</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-3 bg-[#FBF9F4] p-3 sm:grid-cols-5">
          {ROOM_BACKGROUNDS.map((room, index) => {
            const isActive = index === activeRoomIndex;

            return (
              <button
                key={room.src}
                type="button"
                onClick={() => setActiveRoomIndex(index)}
                className={`group flex min-h-[76px] items-center gap-3 rounded-[6px] border p-2 text-left transition-all duration-300 ${
                  isActive
                    ? 'border-[#785A1A] bg-[#F5F4ED] shadow-sm'
                    : 'border-transparent bg-transparent hover:border-[#D9DBCF] hover:bg-[#F5F4ED]/70'
                }`}
                aria-label={`Show ${room.name} room view`}
                aria-pressed={isActive}
                title={room.name}
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[4px] bg-[#E8E2D5]">
                  <img
                    src={room.src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="min-w-0">
                  <span className={`block font-label text-[10px] font-bold uppercase tracking-[0.14em] ${
                    isActive ? 'text-[#31332C]' : 'text-[#5E6058]'
                  }`}>
                    {room.name}
                  </span>
                  <span className="mt-1 block font-body text-[11px] leading-4 text-[#797C73]">
                    View {index + 1}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlantRoomViewer;
