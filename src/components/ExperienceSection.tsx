import React from 'react';
import { motion } from 'motion/react';
import { SiteConfig } from '../data/siteConfig';
import { EditorialImage } from './EditorialImage';
import { EDITORIAL_EASE, StaggeredHeadline } from './MotionPrimitives';

interface ExperienceSectionProps {
  config: SiteConfig;
  reducedMotion: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  config,
  reducedMotion,
}) => {
  return (
    <section
      id="experience"
      className="relative bg-[#FAF9F6] py-24 text-[#171918] lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header */}
        <div className="mb-16 border-b border-[#171918]/12 pb-8">
          <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#B8754D] uppercase">
            {config.experience.label}
          </p>
          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <StaggeredHeadline
              as="h2"
              text={config.experience.headline}
              reducedMotion={reducedMotion}
              className="font-editorial text-4xl leading-[1.1] font-semibold text-[#171918] sm:text-5xl"
            />
            <p
              className={`max-w-md text-base leading-relaxed text-[#171918]/75 ${
                reducedMotion ? '' : 'animate-reveal-up-delay-1'
              }`}
            >
              {config.experience.subheadline}
            </p>
          </div>
        </div>

        {/* Three Pillars with Alternating Editorial Compositions */}
        <div className="space-y-16 lg:space-y-24">
          {config.experience.pillars.map((pillar, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div
                key={pillar.number}
                className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 ${
                  reducedMotion ? '' : 'animate-reveal-up'
                }`}
              >
                {/* Visual Frame */}
                <div
                  className={`lg:col-span-7 ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="group overflow-hidden rounded-lg border border-[#171918]/12 bg-[#171918] shadow-sm transition-shadow duration-300 hover:shadow-xl">
                    <EditorialImage
                      artKey={pillar.artKey}
                      alt={`${pillar.number} — ${pillar.title}`}
                      aspectClassName="aspect-[16/10]"
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                {/* Narrative Column */}
                <div
                  className={`flex flex-col justify-center lg:col-span-5 ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="flex items-center gap-3 font-mono-tabular text-xs font-semibold tracking-widest text-[#B8754D] uppercase">
                    <span>{pillar.number}</span>
                    <span aria-hidden="true">—</span>
                    <span>{pillar.title}</span>
                  </div>

                  <h3 className="font-editorial mt-3 text-3xl leading-tight font-semibold text-[#171918] sm:text-4xl">
                    {pillar.subtitle}
                  </h3>

                  <p className="mt-4 text-base leading-[1.75] text-[#171918]/80">
                    {pillar.description}
                  </p>

                  <div className="mt-6 border-t border-[#171918]/12 pt-4 font-mono-tabular text-xs text-[#737766]">
                    {pillar.detailNote}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
