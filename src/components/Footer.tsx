import React from 'react';
import { ArrowUp, Settings2 } from 'lucide-react';
import { SiteConfig } from '../data/siteConfig';

interface FooterProps {
  config: SiteConfig;
  onOpenConfigDrawer: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenConfigDrawer,
}) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#F2EBDD]/12 bg-[#171918] pt-20 pb-12 text-[#FAF9F6]">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Top Closing Statement Banner */}
        <div className="mb-16 flex flex-col justify-between gap-6 border-b border-[#F2EBDD]/12 pb-12 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono-tabular text-xs tracking-[0.22em] text-[#B8754D] uppercase">
              {config.conceptSubtitle}
            </p>
            <h2 className="font-editorial mt-3 text-3xl font-semibold text-[#FAF9F6] sm:text-5xl">
              &ldquo;{config.footerClosing}&rdquo;
            </h2>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 self-start rounded border border-[#F2EBDD]/20 bg-[#1E2120] px-4 py-2.5 font-mono-tabular text-xs font-medium text-[#F2EBDD] whitespace-nowrap shrink-0 transition-colors hover:border-[#B8754D] hover:text-[#FAF9F6] lg:self-auto"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="h-3.5 w-3.5 text-[#B8754D]" />
          </button>
        </div>

        {/* 4-Column Footer Navigation & Info Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Col 1: Brand Identity */}
          <div className="lg:col-span-4">
            <a
              href="#home"
              className="font-editorial text-2xl font-semibold tracking-wider text-[#FAF9F6]"
            >
              {config.brandName}
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#F2EBDD]/70">
              {config.tagline}
            </p>
            <p className="mt-4 font-mono-tabular text-xs text-[#77766F]">
              {config.hero.estBadge} · {config.cityRegion}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-mono-tabular text-xs font-semibold tracking-wider text-[#B8754D] uppercase">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F2EBDD]/75">
              <li>
                <a href="#home" className="transition-colors hover:text-[#FAF9F6]">
                  Home
                </a>
              </li>
              <li>
                <a href="#story" className="transition-colors hover:text-[#FAF9F6]">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#menu" className="transition-colors hover:text-[#FAF9F6]">
                  Signature Menu
                </a>
              </li>
              <li>
                <a href="#experience" className="transition-colors hover:text-[#FAF9F6]">
                  Experience
                </a>
              </li>
              <li>
                <a href="#gallery" className="transition-colors hover:text-[#FAF9F6]">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#location" className="transition-colors hover:text-[#FAF9F6]">
                  Location
                </a>
              </li>
              <li>
                <a href="#reservation" className="transition-colors hover:text-[#FAF9F6]">
                  Reservasi
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Location & Hours */}
          <div className="lg:col-span-4">
            <h3 className="font-mono-tabular text-xs font-semibold tracking-wider text-[#B8754D] uppercase">
              Lokasi &amp; Jam Operasional
            </h3>
            <div className="mt-4 space-y-3 text-sm text-[#F2EBDD]/75">
              <p>
                <span className="block font-medium text-[#FAF9F6]">Alamat:</span>
                {config.address}
              </p>
              <p>
                <span className="block font-medium text-[#FAF9F6]">Jam Operasional:</span>
                <span className="font-mono-tabular">{config.operatingHours}</span>
              </p>
              <p>
                <span className="block font-medium text-[#FAF9F6]">WhatsApp:</span>
                <span className="font-mono-tabular">{config.whatsappNumber}</span>
              </p>
            </div>
          </div>

          {/* Col 4: Socials & Owner Config Tool */}
          <div className="lg:col-span-2">
            <h3 className="font-mono-tabular text-xs font-semibold tracking-wider text-[#B8754D] uppercase">
              Media Sosial
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F2EBDD]/75">
              <li>
                <a
                  href={config.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#FAF9F6]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={config.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#FAF9F6]"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href={config.socials.threads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#FAF9F6]"
                >
                  Threads
                </a>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-[#F2EBDD]/10">
              <button
                type="button"
                onClick={onOpenConfigDrawer}
                className="inline-flex items-center gap-1.5 text-xs text-[#B8754D] transition-colors hover:text-[#F2EBDD]"
              >
                <Settings2 className="h-3.5 w-3.5" />
                <span>Panel Konfigurasi Bisnis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#F2EBDD]/10 pt-8 text-xs text-[#77766F] sm:flex-row">
          <p>
            &copy; {currentYear} {config.brandName}. All rights reserved.
          </p>
          <p className="font-mono-tabular">
            CRAFTED FOR MALANG COFFEE &amp; CULINARY EXPERIENCE
          </p>
        </div>
      </div>
    </footer>
  );
};
