import React, { useEffect, useState } from 'react';
import { ArrowDownRight, MapPin } from 'lucide-react';
import { SiteConfig } from '../data/siteConfig';
import { ThreeDScene } from './ThreeDScene';
import { MagneticWrapper, StaggeredHeadline } from './MotionPrimitives';

interface HeroSectionProps {
  config: SiteConfig;
  reducedMotion: boolean;
}

class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="relative z-10 flex h-[380px] w-full flex-col items-center justify-center p-6 sm:h-[460px] lg:h-[560px]"
          role="img"
          aria-label="Ilustrasi cangkir kopi spesialti Malang"
        >
          <svg className="h-64 w-64 text-[#F2EBDD]" viewBox="0 0 240 240" fill="none">
            <ellipse
              cx="120"
              cy="182"
              rx="78"
              ry="18"
              fill="#232524"
              stroke="#B8754D"
              strokeWidth="1.5"
            />
            <path
              d="M68 96 H172 L158 164 C154 176 140 180 120 180 C100 180 86 176 82 164 Z"
              fill="#1E201F"
              stroke="#B8754D"
              strokeWidth="2"
            />
            <ellipse
              cx="120"
              cy="96"
              rx="52"
              ry="12"
              fill="#8C5330"
              stroke="#F2EBDD"
              strokeWidth="1"
            />
          </svg>
        </div>
      );
    }
    return this.props.children;
  }
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  reducedMotion,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(window.innerHeight || 800, 400);
      const current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      setScrollProgress(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const textTranslateY = reducedMotion ? 0 : scrollProgress * -24;
  const textOpacity = reducedMotion ? 1 : Math.max(0.25, 1 - scrollProgress * 0.75);
  const ridgeTranslateY = reducedMotion ? 0 : scrollProgress * 32;
  const sceneScale = reducedMotion ? 1 : 1 - scrollProgress * 0.05;

  return (
    <section
      id="home"
      className="relative flex min-h-[94svh] flex-col justify-between overflow-hidden bg-[#171918] pt-24 pb-10 lg:pt-28"
    >
      {/* Subtle Malang Volcanic Atmospheric Background & Multilayer Highland Silhouette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-36 left-1/4 h-[540px] w-[540px] rounded-full opacity-25 blur-3xl transition-transform duration-300"
          style={{
            background:
              'radial-gradient(circle, rgba(184,117,77,0.34) 0%, rgba(23,25,24,0) 70%)',
            transform: reducedMotion
              ? 'none'
              : `translate3d(0, ${scrollProgress * 45}px, 0)`,
          }}
        />
        <div className="bg-volcanic-grain absolute inset-0 opacity-70" />

        {/* Multilayer Malang Mountain Ridge Silhouette */}
        <svg
          className="absolute right-0 bottom-0 left-0 h-44 w-full text-[#1D201E] opacity-85 will-change-transform"
          style={{
            transform: `translate3d(0, ${ridgeTranslateY.toFixed(1)}px, 0)`,
          }}
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,220 L0,165 Q190,115 360,150 T760,92 T1140,138 T1440,105 L1440,220 Z" />
          <path
            d="M0,220 L0,185 Q280,145 540,170 T980,125 T1440,155 L1440,220 Z"
            fill="#141615"
            fillOpacity="0.78"
          />
        </svg>
      </div>

      {/* Main Split Editorial Container */}
      <div className="relative z-10 mx-auto my-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Editorial Column */}
        <div
          className="flex flex-col items-start will-change-transform lg:col-span-7"
          style={{
            transform: `translate3d(0, ${textTranslateY.toFixed(1)}px, 0)`,
            opacity: textOpacity,
          }}
        >
          {/* Small unboxed editorial kicker */}
          <p className="animate-reveal-up mb-4 font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#B8754D] uppercase">
            {config.hero.kicker}
          </p>

          {/* Main Display Editorial Headline with Staggered Word Reveal */}
          <StaggeredHeadline
            as="h1"
            text={config.hero.headline}
            reducedMotion={reducedMotion}
            delayOffset={0.08}
            className="font-editorial max-w-2xl text-[clamp(2.5rem,4.6vw,4.35rem)] leading-[1.06] font-semibold tracking-tight text-[#FAF9F6]"
          />

          {/* Editorial Subheadline */}
          <p
            className="animate-reveal-up mt-6 max-w-xl text-base leading-relaxed text-[#F2EBDD]/80 sm:text-lg"
            style={{ animationDelay: '220ms' }}
          >
            {config.hero.subheadline}
          </p>

          {/* Primary & Secondary CTAs */}
          <div
            className="animate-reveal-up mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '320ms' }}
          >
            <MagneticWrapper strength={4} reducedMotion={reducedMotion}>
              <a
                href="#menu"
                className="group inline-flex items-center gap-2.5 rounded bg-[#B8754D] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#FAF9F6] whitespace-nowrap shrink-0 shadow-sm transition-all duration-200 hover:bg-[#A4633D] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#F2EBDD]"
              >
                <span>{config.hero.primaryCta}</span>
                <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </MagneticWrapper>

            <MagneticWrapper strength={3} reducedMotion={reducedMotion}>
              <a
                href="#location"
                className="group inline-flex items-center gap-2 rounded border border-[#F2EBDD]/25 bg-[#1D201F]/80 px-6 py-3.5 text-sm font-medium text-[#F2EBDD] whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#B8754D] hover:bg-[#232725] hover:text-[#FAF9F6] focus-visible:outline-2 focus-visible:outline-[#B8754D]"
              >
                <MapPin className="h-4 w-4 text-[#B8754D] transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span>{config.hero.secondaryCta}</span>
              </a>
            </MagneticWrapper>
          </div>

          {/* Subtle Editorial Metadata Strip */}
          <div
            className="animate-reveal-up mt-12 flex flex-wrap items-center gap-3 border-t border-[#F2EBDD]/12 pt-5 font-mono-tabular text-xs tracking-widest text-[#77766F] uppercase"
            style={{ animationDelay: '420ms' }}
          >
            <span className="text-[#F2EBDD]/75">{config.hero.slowMomentsBadge}</span>
            <span aria-hidden="true">·</span>
            <span>{config.hero.estBadge}</span>
            <span aria-hidden="true">·</span>
            <span>{config.cityRegion}</span>
          </div>
        </div>

        {/* Right Interactive 3D Centerpiece Column */}
        <div
          style={{
            transform: `scale(${sceneScale.toFixed(3)})`,
            animationDelay: '160ms',
          }}
          className="animate-scale-in w-full will-change-transform lg:col-span-5"
        >
          <SceneErrorBoundary>
            <ThreeDScene
              scrollProgress={scrollProgress}
              reducedMotion={reducedMotion}
            />
          </SceneErrorBoundary>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 mx-auto mt-8 flex max-w-[1280px] flex-col items-center justify-center px-6">
        <a
          href="#story"
          className="group flex flex-col items-center gap-2 text-center focus-visible:outline-2 focus-visible:outline-[#B8754D]"
        >
          <span className="font-mono-tabular text-[11px] tracking-[0.25em] text-[#F2EBDD]/60 uppercase transition-colors group-hover:text-[#B8754D]">
            {config.hero.scrollCue}
          </span>
          <div className="relative h-10 w-[1px] overflow-hidden bg-[#F2EBDD]/15">
            <div className="animate-scroll-line h-full w-full bg-[#B8754D]" />
          </div>
        </a>
      </div>
    </section>
  );
};
