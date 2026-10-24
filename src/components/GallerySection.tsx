import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { EditorialImage } from './EditorialImage';
import { EDITORIAL_EASE, StaggeredHeadline } from './MotionPrimitives';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  artKey: string;
  spanClass: string;
  aspectClass: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Ruang Utama & Tekstur Batu Andesit',
    category: 'Interior & Arsitektur',
    caption:
      'Komposisi ruang dengan pencahayaan hangat yang menonjolkan tekstur monolitik batu vulkanik dan kayu gelap.',
    artKey: 'interior_arch',
    spanClass: 'md:col-span-7',
    aspectClass: 'aspect-[16/10]',
  },
  {
    id: 'gal-02',
    title: 'Ekstraksi Manual Slow Bar',
    category: 'Detail Minuman',
    caption:
      'Proses penyeduhan presisi untuk menghadirkan kejernihan rasa kopi dataran tinggi Jawa Timur.',
    artKey: 'gallery_pour',
    spanClass: 'md:col-span-5',
    aspectClass: 'aspect-[4/3] md:aspect-[11/10]',
  },
  {
    id: 'gal-03',
    title: 'Sajian Kuliner di Atas Keramik Stoneware',
    category: 'Makanan Signature',
    caption:
      'Penyajian hidangan utama dengan keseimbangan warna, tekstur, dan suhu meja.',
    artKey: 'gallery_plate',
    spanClass: 'md:col-span-4',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-04',
    title: 'Meja Komunal & Pencahayaan Senja',
    category: 'Suasana Meja',
    caption:
      'Sudut ideal untuk bekerja dengan tenang di siang hari atau berbincang hangat saat malam tiba.',
    artKey: 'gallery_table',
    spanClass: 'md:col-span-4',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-05',
    title: 'Teras Semi-Outdoor & Udara Sejuk Malang',
    category: 'Atmosfer Ruang',
    caption:
      'Area terbuka yang dirancang menyatu dengan sirkulasi udara sejuk khas Kota Malang.',
    artKey: 'gallery_lounge',
    spanClass: 'md:col-span-4',
    aspectClass: 'aspect-[4/3]',
  },
];

interface GallerySectionProps {
  reducedMotion: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  reducedMotion,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') {
        setActiveIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % GALLERY_ITEMS.length,
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length,
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const activeItem = activeIndex !== null ? GALLERY_ITEMS[activeIndex] : null;

  return (
    <section
      id="gallery"
      className="relative border-t border-[#F2EBDD]/10 bg-[#171918] py-24 text-[#FAF9F6] lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Editorial Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#F2EBDD]/12 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#B8754D] uppercase">
              VISUAL ARCHIVE / 04
            </p>
            <StaggeredHeadline
              as="h2"
              text="Frames of Space & Craft."
              reducedMotion={reducedMotion}
              className="font-editorial mt-2 text-4xl font-semibold text-[#FAF9F6] sm:text-5xl"
            />
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[#F2EBDD]/65">
            Visual galeri di bawah ini menggunakan studi visual placeholder beresolusi tinggi yang dapat diganti dengan foto resmi bisnis Anda. Klik gambar untuk membuka tampilan penuh (Lightbox).
          </p>
        </div>

        {/* Asymmetric Responsive Editorial Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {GALLERY_ITEMS.map((item, idx) => (
            <figure
              key={item.id}
              style={
                reducedMotion
                  ? undefined
                  : { animationDelay: `${idx * 65}ms` }
              }
              className={`group relative cursor-pointer overflow-hidden rounded-lg border border-[#F2EBDD]/12 bg-[#1D201F] transition-colors duration-200 hover:border-[#B8754D]/50 ${
                item.spanClass
              } ${reducedMotion ? '' : 'animate-reveal-up'}`}
              onClick={() => setActiveIndex(idx)}
              role="button"
              tabIndex={0}
              aria-label={`Buka foto ${item.title} di lightbox`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveIndex(idx);
                }
              }}
            >
              <EditorialImage
                artKey={item.artKey}
                alt={item.title}
                aspectClassName={item.aspectClass}
                className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              {/* Subtle Measured Scrim Overlay */}
              <figcaption className="flex items-center justify-between gap-4 border-t border-[#F2EBDD]/10 bg-[#171918]/95 px-5 py-3.5">
                <div>
                  <p className="font-mono-tabular text-[11px] text-[#B8754D] uppercase">
                    {item.category}
                  </p>
                  <h3 className="font-editorial text-lg font-semibold text-[#FAF9F6]">
                    {item.title}
                  </h3>
                </div>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#F2EBDD]/15 text-[#F2EBDD]/75 transition-all duration-200 group-hover:border-[#B8754D] group-hover:bg-[#B8754D]/15 group-hover:text-[#FAF9F6]">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox Modal with AnimatePresence Entrance & Exit */}
      <AnimatePresence>
        {activeItem && activeIndex !== null && (
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              initial={
                reducedMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95, y: 14 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: 10 }
              }
              transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
              className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-[#F2EBDD]/20 bg-[#171918] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Lightbox Header */}
              <div className="flex items-center justify-between border-b border-[#F2EBDD]/12 px-6 py-4">
                <div className="font-mono-tabular text-xs text-[#F2EBDD]/70">
                  <span>
                    FRAME 0{activeIndex + 1} / 0{GALLERY_ITEMS.length}
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span className="text-[#B8754D]">{activeItem.category}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#F2EBDD]/20 text-[#FAF9F6] transition-colors hover:border-[#B8754D] hover:text-[#B8754D]"
                  aria-label="Tutup lightbox"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Image Viewport */}
              <div className="relative bg-[#111211]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <EditorialImage
                      artKey={activeItem.artKey}
                      alt={activeItem.title}
                      aspectClassName="aspect-[16/10]"
                      width={1280}
                      height={800}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Prev / Next Navigation Buttons */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (activeIndex - 1 + GALLERY_ITEMS.length) %
                        GALLERY_ITEMS.length,
                    )
                  }
                  className="absolute top-1/2 left-4 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F2EBDD]/25 bg-[#171918]/85 text-[#FAF9F6] transition-colors hover:border-[#B8754D]"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((activeIndex + 1) % GALLERY_ITEMS.length)
                  }
                  className="absolute top-1/2 right-4 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F2EBDD]/25 bg-[#171918]/85 text-[#FAF9F6] transition-colors hover:border-[#B8754D]"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Lightbox Caption Footer */}
              <div className="p-6">
                <h3 className="font-editorial text-2xl font-semibold text-[#FAF9F6]">
                  {activeItem.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#F2EBDD]/75">
                  {activeItem.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
