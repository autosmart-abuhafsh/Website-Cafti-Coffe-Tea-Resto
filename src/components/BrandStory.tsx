import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SiteConfig } from '../data/siteConfig';
import { EditorialImage } from './EditorialImage';
import { EDITORIAL_EASE, StaggeredHeadline } from './MotionPrimitives';

interface BrandStoryProps {
  config: SiteConfig;
  reducedMotion: boolean;
}

export const BrandStory: React.FC<BrandStoryProps> = ({
  config,
  reducedMotion,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (rect.bottom < 0 || rect.top > vh) return;
      const centerRatio = (rect.top + rect.height / 2 - vh / 2) / vh;
      setParallaxOffset(Math.max(-24, Math.min(24, centerRatio * -22)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative border-t border-[#F2EBDD]/10 bg-[#171918] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Top Editorial Index Label */}
        <div
          className={`mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-[#F2EBDD]/12 pb-5 ${
            reducedMotion ? '' : 'animate-reveal-up'
          }`}
        >
          <span className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#B8754D] uppercase">
            {config.story.label}
          </span>
          <span className="font-mono-tabular text-xs text-[#77766F]">
            THE ART OF COFFEE, FOOD &amp; MOVEMENT — MALANG EDITION
          </span>
        </div>

        {/* Main Asymmetric 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Narrative Column */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <StaggeredHeadline
                as="h2"
                text={config.story.headline}
                reducedMotion={reducedMotion}
                className="font-editorial text-3xl leading-[1.14] font-semibold text-[#FAF9F6] sm:text-4xl lg:text-5xl"
              />

              <p
                className={`mt-7 text-base leading-[1.75] text-[#F2EBDD]/85 sm:text-lg ${
                  reducedMotion ? '' : 'animate-reveal-up-delay-1'
                }`}
              >
                {config.story.leadParagraph}
              </p>

              <p
                className={`mt-5 text-base leading-[1.75] text-[#F2EBDD]/70 ${
                  reducedMotion ? '' : 'animate-reveal-up-delay-2'
                }`}
              >
                {config.story.secondaryParagraph}
              </p>

              <p
                className={`mt-6 border-t border-[#F2EBDD]/10 pt-4 font-mono-tabular text-xs leading-relaxed text-[#77766F] ${
                  reducedMotion ? '' : 'animate-reveal-up-delay-3'
                }`}
              >
                {config.story.editorialNote}
              </p>
            </div>

            {/* Tactile Materiality Palette (Staggered Cards) */}
            <div className="mt-10 pt-6">
              <p className="mb-4 font-mono-tabular text-xs tracking-widest text-[#F2EBDD]/60 uppercase">
                PALET MATERIALITAS &amp; RUANG
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {config.story.architecturalMaterials.map((mat, idx) => (
                  <div
                    key={mat.name}
                    style={
                      reducedMotion
                        ? undefined
                        : { animationDelay: `${100 + idx * 70}ms` }
                    }
                    className={`group rounded border border-[#F2EBDD]/10 bg-[#1C1F1E] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8754D]/45 hover:bg-[#202422] ${
                      reducedMotion ? '' : 'animate-reveal-up'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-4 shrink-0 rounded-full border border-[#F2EBDD]/25 transition-transform duration-200 group-hover:scale-110"
                        style={{ backgroundColor: mat.swatchHex }}
                      />
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-[#FAF9F6]">
                          {mat.name}
                        </h3>
                        <p className="font-mono-tabular text-[11px] text-[#B8754D]">
                          {mat.origin}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-[#F2EBDD]/70">
                      {mat.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Architectural & Craft Visual Study Column with Measured Scroll Parallax */}
          <div
            className={`flex flex-col justify-between gap-6 lg:col-span-6 ${
              reducedMotion ? '' : 'animate-reveal-up-delay-1'
            }`}
          >
            <div
              style={{
                transform: reducedMotion
                  ? 'none'
                  : `translate3d(0, ${parallaxOffset.toFixed(1)}px, 0)`,
              }}
              className="group relative overflow-hidden rounded border border-[#F2EBDD]/12 transition-transform duration-200 ease-out will-change-transform"
            >
              <EditorialImage
                artKey="interior_arch"
                alt="Suasana interior modern dengan tekstur batu vulkanik dan pencahayaan hangat"
                aspectClassName="aspect-[16/11]"
                className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="flex items-center justify-between border-t border-[#F2EBDD]/10 bg-[#1B1D1C] px-5 py-3.5 text-xs text-[#F2EBDD]/75">
                <span>STUDY 01 · ARSITEKTUR &amp; PENCAHAYAAN RUANG</span>
                <span className="font-mono-tabular text-[#B8754D]">MALANG HIGHLAND MOOD</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="group overflow-hidden rounded border border-[#F2EBDD]/12 bg-[#1B1D1C] transition-colors hover:border-[#B8754D]/40">
                <EditorialImage
                  artKey="bar_craft"
                  alt="Proses penyeduhan kopi di slow bar"
                  aspectClassName="aspect-[4/3]"
                  className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="p-4">
                  <p className="font-mono-tabular text-[11px] text-[#B8754D] uppercase">
                    SLOW BAR ATELIER
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#F2EBDD]/75">
                    Presisi suhu air dan rasio seduh untuk menonjolkan karakter biji kopi pilihan.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded border border-[#F2EBDD]/12 bg-[#1C1E1D] p-6 transition-colors hover:border-[#737766]/50">
                <div>
                  <span className="font-mono-tabular text-xs text-[#737766] uppercase">
                    ATMOSFER KOTA MALANG
                  </span>
                  <h3 className="font-editorial mt-2 text-2xl font-semibold text-[#FAF9F6]">
                    Sejuk, Teduh, dan Berkarakter.
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#F2EBDD]/75">
                    Menghadirkan ritme yang tenang bagi mahasiswa, pekerja kreatif, pasangan, maupun keluarga yang menghargai kualitas rasa dan kenyamanan ruang.
                  </p>
                </div>
                <div className="mt-6 border-t border-[#F2EBDD]/10 pt-3 font-mono-tabular text-[11px] text-[#F2EBDD]/60">
                  <span>ELEVATION INSPIRED</span>
                  <span aria-hidden="true"> · </span>
                  <span>WARM ACOUSTICS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
