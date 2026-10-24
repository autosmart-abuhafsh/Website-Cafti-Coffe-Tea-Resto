import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { SiteConfig } from '../data/siteConfig';
import { EDITORIAL_EASE, MagneticWrapper } from './MotionPrimitives';

interface NavbarProps {
  config: SiteConfig;
  orderCount: number;
  onOpenOrderDrawer: () => void;
  reducedMotion?: boolean;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#story' },
  { label: 'Menu', href: '#menu' },
  { label: 'Experience', href: '#experience' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Location', href: '#location' },
];

export const Navbar: React.FC<NavbarProps> = ({
  config,
  orderCount,
  onOpenOrderDrawer,
  reducedMotion = false,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [pageProgress, setPageProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 36);
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      setPageProgress(Math.min(1, Math.max(0, y / maxScroll)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-[#F2EBDD]/10 bg-[#171918]/95 shadow-lg'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          className="font-editorial text-lg font-semibold tracking-wider text-[#FAF9F6] whitespace-nowrap shrink-0 transition-colors hover:text-[#B8754D] focus-visible:outline-2 focus-visible:outline-[#B8754D]"
        >
          {config.brandName}
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#F2EBDD]/80"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#FAF9F6] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#B8754D] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-[#B8754D]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Mobile Drawer Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {orderCount > 0 && (
            <button
              type="button"
              onClick={onOpenOrderDrawer}
              className="rounded border border-[#B8754D]/60 bg-[#221D1A] px-3.5 py-2 font-mono-tabular text-xs font-medium text-[#F2EBDD] whitespace-nowrap shrink-0 transition-colors hover:border-[#B8754D] hover:bg-[#B8754D]/20"
            >
              Pesanan ({orderCount})
            </button>
          )}

          <MagneticWrapper
            strength={3}
            reducedMotion={reducedMotion}
            className="hidden sm:inline-block"
          >
            <a
              href="#reservation"
              className="inline-flex items-center justify-center rounded bg-[#B8754D] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase whitespace-nowrap shrink-0 transition-colors duration-200 hover:bg-[#A3633D] focus-visible:outline-2 focus-visible:outline-[#F2EBDD]"
            >
              Reservasi
            </a>
          </MagneticWrapper>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-[#F2EBDD]/15 text-[#FAF9F6] transition-colors hover:border-[#B8754D] lg:hidden"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Subtle Scroll Progress Hairline along Bottom of Navbar when Scrolled */}
      {scrolled && (
        <div
          aria-hidden="true"
          className="h-[1px] w-full bg-transparent overflow-hidden"
        >
          <div
            className="h-full bg-[#B8754D]/80 origin-left transition-transform duration-100 ease-out"
            style={{ transform: `scaleX(${pageProgress.toFixed(3)})` }}
          />
        </div>
      )}

      {/* Mobile Navigation Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
            className="border-b border-[#F2EBDD]/15 bg-[#171918] px-6 pt-3 pb-6 shadow-2xl lg:hidden"
          >
            <nav aria-label="Navigasi Mobile" className="flex flex-col space-y-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-[#F2EBDD]/5 py-3 text-base font-medium text-[#F2EBDD]/90 transition-colors hover:text-[#B8754D]"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4">
                <a
                  href="#reservation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded bg-[#B8754D] px-5 py-3 text-center text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase transition-colors hover:bg-[#A3633D]"
                >
                  Reservasi Meja
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
