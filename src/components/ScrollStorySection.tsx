import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EDITORIAL_EASE, StaggeredHeadline } from './MotionPrimitives';

interface ScrollStorySectionProps {
  reducedMotion: boolean;
}

interface StoryAct {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
  accentColor: string;
}

const STORY_ACTS: StoryAct[] = [
  {
    id: 0,
    code: 'BABAK 01 — THE ORIGIN',
    title: 'Dari Tanah Vulkanik & Kabut Dataran Tinggi.',
    subtitle: 'Seleksi Bahan Baku & Karakter Asal',
    description:
      'Setiap cangkir dan sajian berawal dari penghormatan terhadap bahan baku. Biji kopi arabika yang tumbuh di lereng pegunungan Jawa Timur dipetik matang sempurna, bersanding dengan rempah segar dan hasil bumi pilihan.',
    metrics: 'ELEVATION 1.200–1.500 MASL · SINGLE ORIGIN & HOUSE BLEND',
    accentColor: '#737766',
  },
  {
    id: 1,
    code: 'BABAK 02 — THE CRAFT',
    title: 'Presisi Suhu, Tekanan, dan Waktu.',
    subtitle: 'Seni Ekstraksi & Teknik Dapur Artisanal',
    description:
      'Di balik bar dan dapur terbuka, kalibrasi menjadi bahasa utama. Aliran air bersuhu terukur mengekstraksi lapisan aroma manis dan floral, sementara teknik memasak lambat menjaga tekstur alami setiap hidangan.',
    metrics: '93°C WATER CALIBRATION · ARTISANAL POUR & SEAR',
    accentColor: '#B8754D',
  },
  {
    id: 2,
    code: 'BABAK 03 — THE MOMENT',
    title: 'Tersaji Hangat untuk Momen yang Tidak Tergesa.',
    subtitle: 'Harmoni Rasa, Ruang, dan Percakapan',
    description:
      'Saat cangkir keramik menyentuh meja batu andesit, seluruh proses bermuara pada satu hal: pengalaman bersantap yang utuh di tengah suasana sejuk Kota Malang.',
    metrics: 'SERVED IN HANDCRAFTED STONEWARE · SLOW LIVING',
    accentColor: '#F2EBDD',
  },
];

export const ScrollStorySection: React.FC<ScrollStorySectionProps> = ({
  reducedMotion,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeAct, setActiveAct] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [pointerTilt, setPointerTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 800;
      const totalScrollable = rect.height - viewportH * 0.45;
      if (totalScrollable <= 0) return;

      const raw = (viewportH * 0.55 - rect.top) / totalScrollable;
      const clamped = Math.min(Math.max(raw, 0), 1);
      setProgress(clamped);

      if (clamped < 0.36) {
        setActiveAct(0);
      } else if (clamped < 0.72) {
        setActiveAct(1);
      } else {
        setActiveAct(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    setPointerTilt({
      x: Math.max(-10, Math.min(10, ny * -8)),
      y: Math.max(-12, Math.min(12, nx * 10)),
    });
  };

  const handleStagePointerLeave = () => {
    setPointerTilt({ x: 0, y: 0 });
  };

  const currentAct = STORY_ACTS[activeAct];

  return (
    <section
      ref={sectionRef}
      aria-label="The Making of a Moment — Perjalanan 3 Babak"
      className="relative border-t border-[#F2EBDD]/10 bg-[#171918] py-24 text-[#FAF9F6] lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#F2EBDD]/12 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#B8754D] uppercase">
              SIGNATURE 3D SCROLL STORY
            </p>
            <StaggeredHeadline
              as="h2"
              text="THE MAKING OF A MOMENT"
              reducedMotion={reducedMotion}
              className="font-editorial mt-2 text-3xl font-semibold text-[#FAF9F6] sm:text-5xl"
            />
          </div>

          {/* Progress Indicator Bar */}
          <div className="flex items-center gap-4">
            <span className="font-mono-tabular text-xs text-[#F2EBDD]/70">
              BABAK 0{activeAct + 1} / 03
            </span>
            <div className="h-1 w-36 overflow-hidden rounded-full bg-[#F2EBDD]/15">
              <div
                className="h-full bg-[#B8754D] transition-all duration-150"
                style={{ width: `${Math.max(15, Math.round(progress * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Interactive Split Stage (No scroll hijacking; natural scroll + direct buttons) */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Interactive 3D / Kinetic SVG & CSS Stage */}
          <div className="lg:col-span-6">
            <div
              onPointerMove={handleStagePointerMove}
              onPointerLeave={handleStagePointerLeave}
              className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-[#F2EBDD]/15 bg-gradient-to-b from-[#1E201F] via-[#171918] to-[#121312] p-8 shadow-2xl"
            >
              {/* Dynamic Ambient Glow Shifting by Act */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-72 w-72 rounded-full opacity-35 blur-3xl transition-all duration-700"
                style={{
                  backgroundColor: currentAct.accentColor,
                  transform: `scale(${1 + progress * 0.25})`,
                }}
              />

              {/* 3D Perspective Geometric & Botanical Stage */}
              <div
                className="relative z-10 flex h-full w-full items-center justify-center"
                style={{
                  perspective: '900px',
                }}
              >
                <div
                  className="relative flex h-64 w-64 items-center justify-center transition-transform duration-300 ease-out will-change-transform"
                  style={{
                    transform: reducedMotion
                      ? 'none'
                      : `rotateX(${(10 - activeAct * 4 + pointerTilt.x).toFixed(1)}deg) rotateY(${((progress - 0.5) * 28 + pointerTilt.y).toFixed(1)}deg)`,
                  }}
                >
                  {/* Outer Orbital Compass Ring */}
                  <svg
                    className="absolute inset-0 h-full w-full text-[#F2EBDD]/20 transition-transform duration-700"
                    style={{
                      transform: reducedMotion
                        ? 'none'
                        : `rotate(${progress * 140}deg)`,
                    }}
                    viewBox="0 0 260 260"
                    fill="none"
                  >
                    <circle
                      cx="130"
                      cy="130"
                      r="118"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="6 6"
                    />
                    <circle
                      cx="130"
                      cy="130"
                      r="94"
                      stroke="#B8754D"
                      strokeOpacity="0.45"
                      strokeWidth="1"
                    />
                  </svg>

                  <AnimatePresence mode="wait">
                    {/* Act 01 Visual: Volcanic Origin & Coffee Beans */}
                    {activeAct === 0 && (
                      <motion.svg
                        key="act-0"
                        initial={
                          reducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, scale: 0.86, rotate: -6 }
                        }
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={
                          reducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.92, rotate: 6 }
                        }
                        transition={{ duration: 0.42, ease: EDITORIAL_EASE }}
                        className="h-48 w-48"
                        viewBox="0 0 200 200"
                        fill="none"
                      >
                        <path
                          d="M25 145 L75 75 L115 120 L145 85 L175 145 Z"
                          stroke="#737766"
                          strokeWidth="1.5"
                          fill="#737766"
                          fillOpacity="0.12"
                        />
                        <g transform="translate(100, 96)">
                          <ellipse
                            cx="-22"
                            cy="-6"
                            rx="22"
                            ry="15"
                            transform="rotate(-28 -22 -6)"
                            fill="#3B2314"
                            stroke="#B8754D"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M-36 -14 Q-22 -2 -8 2"
                            stroke="#F2EBDD"
                            strokeWidth="1.2"
                            strokeOpacity="0.7"
                          />
                          <ellipse
                            cx="20"
                            cy="4"
                            rx="24"
                            ry="16"
                            transform="rotate(22 20 4)"
                            fill="#2C190E"
                            stroke="#B8754D"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M4 -4 Q20 8 36 10"
                            stroke="#F2EBDD"
                            strokeWidth="1.2"
                            strokeOpacity="0.7"
                          />
                        </g>
                      </motion.svg>
                    )}

                    {/* Act 02 Visual: Precision Pour-Over & Extraction Craft */}
                    {activeAct === 1 && (
                      <motion.svg
                        key="act-1"
                        initial={
                          reducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, scale: 0.86, y: 10 }
                        }
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={
                          reducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.92, y: -10 }
                        }
                        transition={{ duration: 0.42, ease: EDITORIAL_EASE }}
                        className="h-48 w-48"
                        viewBox="0 0 200 200"
                        fill="none"
                      >
                        <path
                          d="M56 58 H144 L116 118 H84 Z"
                          fill="#252220"
                          stroke="#B8754D"
                          strokeWidth="2"
                        />
                        <path
                          d="M72 68 L92 110 M100 68 L100 110 M128 68 L108 110"
                          stroke="#F2EBDD"
                          strokeOpacity="0.35"
                          strokeWidth="1.2"
                        />
                        <line
                          x1="100"
                          y1="22"
                          x2="100"
                          y2="58"
                          stroke="#F2EBDD"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <line
                          x1="100"
                          y1="118"
                          x2="100"
                          y2="152"
                          stroke="#B8754D"
                          strokeWidth="3"
                        />
                        <path
                          d="M72 152 H128 L138 176 H62 Z"
                          fill="#B8754D"
                          fillOpacity="0.3"
                          stroke="#F2EBDD"
                          strokeWidth="1.5"
                        />
                      </motion.svg>
                    )}

                    {/* Act 03 Visual: The Completed Signature Cup & Rising Warmth */}
                    {activeAct === 2 && (
                      <motion.svg
                        key="act-2"
                        initial={
                          reducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, scale: 0.86, y: 12 }
                        }
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={
                          reducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.92, y: -8 }
                        }
                        transition={{ duration: 0.42, ease: EDITORIAL_EASE }}
                        className="h-48 w-48"
                        viewBox="0 0 200 200"
                        fill="none"
                      >
                        <path
                          className="animate-steam-1"
                          d="M84 74 Q76 54 88 38"
                          stroke="#F2EBDD"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          className="animate-steam-2"
                          d="M102 70 Q112 48 98 30"
                          stroke="#B8754D"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          className="animate-steam-3"
                          d="M118 76 Q126 56 114 42"
                          stroke="#F2EBDD"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <ellipse
                          cx="100"
                          cy="154"
                          rx="64"
                          ry="12"
                          fill="#262826"
                          stroke="#B8754D"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M56 92 H144 L132 144 C128 152 114 154 100 154 C86 154 72 152 68 144 Z"
                          fill="#1E201F"
                          stroke="#F2EBDD"
                          strokeWidth="1.8"
                        />
                        <ellipse
                          cx="100"
                          cy="92"
                          rx="44"
                          ry="10"
                          fill="#B8754D"
                          stroke="#FAF9F6"
                          strokeWidth="1.2"
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Stage Caption */}
              <div className="relative z-10 mt-auto flex w-full items-center justify-between border-t border-[#F2EBDD]/12 pt-4 font-mono-tabular text-[11px] text-[#F2EBDD]/70">
                <span>{currentAct.code}</span>
                <span>{currentAct.metrics}</span>
              </div>
            </div>
          </div>

          {/* Right Three-Act Narrative & Interactive Switcher */}
          <div className="space-y-6 lg:col-span-6">
            {STORY_ACTS.map((act, index) => {
              const isSelected = activeAct === index;
              return (
                <div
                  key={act.code}
                  onClick={() => setActiveAct(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveAct(index);
                    }
                  }}
                  className={`cursor-pointer rounded-lg border p-6 transition-all duration-300 ${
                    isSelected
                      ? 'border-[#B8754D] bg-[#1E2120] shadow-lg'
                      : 'border-[#F2EBDD]/10 bg-[#171918]/60 opacity-65 hover:border-[#F2EBDD]/30 hover:opacity-95'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-mono-tabular text-xs">
                    <span className="font-semibold text-[#B8754D]">{act.code}</span>
                    <span className="text-[#77766F]">{act.subtitle}</span>
                  </div>

                  <h3 className="font-editorial mt-2 text-2xl font-semibold text-[#FAF9F6] sm:text-3xl">
                    {act.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#F2EBDD]/80">
                    {act.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
