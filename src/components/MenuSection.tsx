import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Plus, Minus, MessageCircle, ShoppingBag, ArrowUpRight } from 'lucide-react';
import {
  MENU_CATEGORIES,
  MENU_DEMO_DISCLAIMER,
  MenuCategory,
  MenuItem,
  menuItems,
} from '../data/menu';
import {
  SiteConfig,
  isPlaceholderValue,
  normalizeWhatsAppNumber,
} from '../data/siteConfig';
import { EditorialImage } from './EditorialImage';
import { EDITORIAL_EASE, StaggeredHeadline } from './MotionPrimitives';

interface MenuSectionProps {
  config: SiteConfig;
  onAddToOrder: (item: MenuItem, quantity: number, note: string) => void;
  reducedMotion: boolean;
}

interface MenuCardProps {
  item: MenuItem;
  index: number;
  reducedMotion: boolean;
  isAdded: boolean;
  onOpenModal: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  index,
  reducedMotion,
  isAdded,
  onOpenModal,
  onQuickAdd,
}) => {
  const [imgShift, setImgShift] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    setImgShift({
      x: Math.max(-6, Math.min(6, nx * -5)),
      y: Math.max(-6, Math.min(6, ny * -5)),
    });
  };

  const handlePointerLeave = () => {
    setImgShift({ x: 0, y: 0 });
  };

  return (
    <motion.article
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.42,
        delay: Math.min(index * 0.04, 0.24),
        ease: EDITORIAL_EASE,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group flex flex-col justify-between overflow-hidden rounded-lg border border-[#171918]/10 bg-[#FAF9F6] transition-all duration-200 hover:-translate-y-1 hover:border-[#B8754D]/45 hover:shadow-lg"
    >
      <div>
        {/* Clickable Image Container (70% visual lead with subtle pointer parallax) */}
        <div
          onClick={() => onOpenModal(item)}
          className="relative cursor-pointer overflow-hidden bg-[#171918]"
        >
          <div
            style={{
              transform: reducedMotion
                ? 'none'
                : `translate3d(${imgShift.x.toFixed(1)}px, ${imgShift.y.toFixed(1)}px, 0) scale(1.03)`,
              transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <EditorialImage
              artKey={item.artStyle}
              alt={item.name}
              aspectClassName="aspect-[4/3]"
              className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>

          {/* Subtle Hover Quick-Inspect Prompt */}
          <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1 rounded bg-[#171918]/85 px-2.5 py-1 font-mono-tabular text-[10px] tracking-wider text-[#FAF9F6] uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span>Detail Sajian</span>
            <ArrowUpRight className="h-3 w-3 text-[#B8754D]" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Unboxed clean metadata with middle-dot separator (Zero-Pill Discipline) */}
          <div className="flex items-center justify-between gap-2 font-mono-tabular text-xs text-[#77766F] uppercase">
            <div>
              <span>{item.category}</span>
              {item.isSignature && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="font-medium text-[#B8754D]">Signature</span>
                </>
              )}
            </div>
            <span className="font-semibold text-[#171918]">{item.priceFormatted}</span>
          </div>

          <h3 className="font-editorial mt-2 text-2xl font-semibold text-[#171918]">
            <button
              type="button"
              onClick={() => onOpenModal(item)}
              className="text-left transition-colors hover:text-[#B8754D] focus-visible:outline-2 focus-visible:outline-[#B8754D]"
            >
              {item.name}
            </button>
          </h3>

          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-[#171918]/75">
            {item.shortDescription}
          </p>

          {/* Unboxed tasting notes line */}
          <p className="mt-4 border-t border-[#171918]/8 pt-3 font-mono-tabular text-[11px] text-[#737766]">
            {item.tastingNotes.join(' · ')}
          </p>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-[#171918]/8 bg-[#F7F4EC] px-6 py-3.5">
        <button
          type="button"
          onClick={() => onOpenModal(item)}
          className="text-xs font-semibold text-[#171918] underline-offset-4 transition-colors hover:text-[#B8754D] hover:underline whitespace-nowrap shrink-0"
        >
          Lihat Detail
        </button>

        <button
          type="button"
          onClick={() => onQuickAdd(item)}
          className={`inline-flex items-center gap-1.5 rounded px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 ${
            isAdded
              ? 'bg-[#737766] text-[#FAF9F6]'
              : 'bg-[#171918] text-[#FAF9F6] hover:bg-[#B8754D]'
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>{isAdded ? 'Ditambahkan' : 'Tambah Pesanan'}</span>
        </button>
      </div>
    </motion.article>
  );
};

export const MenuSection: React.FC<MenuSectionProps> = ({
  config,
  onAddToOrder,
  reducedMotion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [activeProduct, setActiveProduct] = useState<MenuItem | null>(null);
  const [modalQty, setModalQty] = useState<number>(1);
  const [modalNote, setModalNote] = useState<string>('');
  const [addedFeedbackId, setAddedFeedbackId] = useState<string | null>(null);

  const filteredItems =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeProduct) {
        setActiveProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProduct]);

  const handleOpenModal = (item: MenuItem) => {
    setActiveProduct(item);
    setModalQty(1);
    setModalNote('');
  };

  const handleQuickAdd = (item: MenuItem) => {
    onAddToOrder(item, 1, '');
    setAddedFeedbackId(item.id);
    setTimeout(() => {
      setAddedFeedbackId((prev) => (prev === item.id ? null : prev));
    }, 1400);
  };

  const buildDirectWhatsAppUrl = (item: MenuItem, qty: number, note: string) => {
    const messageLines = [
      `Halo ${config.brandName}, saya ingin bertanya / memesan menu berikut:`,
      '',
      `Menu: ${item.name}`,
      `Jumlah: ${qty} porsi`,
      `Estimasi Harga: ${item.priceFormatted} / porsi`,
      note.trim() ? `Catatan: ${note.trim()}` : 'Catatan: -',
      '',
      'Mohon informasi ketersediaannya. Terima kasih.',
    ];
    const encoded = encodeURIComponent(messageLines.join('\n'));
    const cleanPhone = isPlaceholderValue(config.whatsappNumber)
      ? ''
      : normalizeWhatsAppNumber(config.whatsappNumber);
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
  };

  return (
    <section
      id="menu"
      className="relative bg-[#F2EBDD] py-24 text-[#171918] lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Editorial Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#171918]/12 pb-10 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#B8754D] uppercase">
              CURATED CULINARY &amp; COFFEE / 02
            </p>
            <StaggeredHeadline
              as="h2"
              text="Crafted to Be Remembered."
              reducedMotion={reducedMotion}
              className="font-editorial mt-3 text-4xl leading-[1.1] font-semibold text-[#171918] sm:text-5xl"
            />
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, delay: 0.15, ease: EDITORIAL_EASE }}
              className="mt-3 max-w-xl text-base leading-relaxed text-[#171918]/75"
            >
              Temukan pilihan rasa yang dirancang untuk menemani setiap momen.
            </motion.p>
          </div>

          {/* Interactive Category Filter Segmented Controls with Sliding Active Indicator */}
          <div
            role="tablist"
            aria-label="Filter kategori menu"
            className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#171918]/10 bg-[#FAF9F6] p-1.5"
          >
            {MENU_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative rounded-md px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#B8754D] ${
                    isActive
                      ? 'text-[#FAF9F6]'
                      : 'text-[#171918]/70 hover:bg-[#F2EBDD]/60 hover:text-[#171918]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={reducedMotion ? undefined : 'activeMenuCategoryTab'}
                      transition={{ duration: 0.24, ease: EDITORIAL_EASE }}
                      className="absolute inset-0 rounded-md bg-[#171918] shadow-sm"
                    />
                  )}
                  <span className="relative z-10">
                    {category === 'All' ? 'Semua Menu' : category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explicit Demo Menu Notice (Per PRD Section 8) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded border border-[#171918]/10 bg-[#FAF9F6]/80 px-4 py-2.5 text-xs text-[#77766F]">
          <span>{MENU_DEMO_DISCLAIMER}</span>
          <span className="font-mono-tabular font-medium text-[#171918]">
            Menampilkan {filteredItems.length} sajian
          </span>
        </div>

        {/* 3-Column Editorial Product Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => (
            <MenuCard
              key={item.id}
              item={item}
              index={idx}
              reducedMotion={reducedMotion}
              isAdded={addedFeedbackId === item.id}
              onOpenModal={handleOpenModal}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      </div>

      {/* Accessible Product Detail & Order Modal with Smooth Entrance & Exit */}
      <AnimatePresence>
        {activeProduct && (
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-product-title"
            onClick={() => setActiveProduct(null)}
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
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#171918]/15 bg-[#FAF9F6] text-[#171918] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#171918]/10 bg-[#FAF9F6]/95 px-6 py-4">
                <div className="font-mono-tabular text-xs text-[#77766F] uppercase">
                  <span>{activeProduct.category}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{activeProduct.servingTemp}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProduct(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#171918]/15 text-[#171918] transition-colors hover:border-[#B8754D] hover:text-[#B8754D]"
                  aria-label="Tutup detail menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <EditorialImage
                    artKey={activeProduct.artStyle}
                    alt={activeProduct.name}
                    aspectClassName="aspect-[4/3] sm:aspect-square"
                    className="rounded border border-[#171918]/10"
                  />
                </div>

                <div className="flex flex-col justify-between sm:col-span-7">
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3
                        id="modal-product-title"
                        className="font-editorial text-2xl font-semibold text-[#171918] sm:text-3xl"
                      >
                        {activeProduct.name}
                      </h3>
                    </div>

                    <p className="mt-1 font-mono-tabular text-lg font-semibold text-[#B8754D]">
                      {activeProduct.priceFormatted}
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-[#171918]/80">
                      {activeProduct.fullDescription}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-[#171918]/10 pt-4 text-xs">
                      <div>
                        <span className="font-semibold text-[#171918]">Karakter Rasa: </span>
                        <span className="text-[#171918]/75">
                          {activeProduct.tastingNotes.join(' · ')}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#171918]">Rekomendasi Pairing: </span>
                        <span className="text-[#171918]/75">
                          {activeProduct.pairingSuggestion}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Note Controls */}
                  <div className="mt-6 space-y-4 border-t border-[#171918]/10 pt-4">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="modal-qty"
                        className="text-xs font-semibold tracking-wide text-[#171918] uppercase"
                      >
                        Jumlah Porsi
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#171918]/20 text-[#171918] hover:border-[#B8754D]"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span
                          id="modal-qty"
                          className="font-mono-tabular w-6 text-center text-sm font-semibold"
                        >
                          {modalQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setModalQty((q) => q + 1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#171918]/20 text-[#171918] hover:border-[#B8754D]"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="modal-note"
                        className="block text-xs font-semibold tracking-wide text-[#171918] uppercase"
                      >
                        Catatan Pesanan (Opsional)
                      </label>
                      <input
                        id="modal-note"
                        type="text"
                        value={modalNote}
                        onChange={(e) => setModalNote(e.target.value)}
                        placeholder="Contoh: Less sugar, es terpisah, tingkat kematangan medium..."
                        className="mt-1.5 w-full rounded border border-[#171918]/20 bg-white px-3 py-2 text-xs text-[#171918] placeholder:text-[#77766F] focus:border-[#B8754D] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onAddToOrder(activeProduct, modalQty, modalNote);
                          setActiveProduct(null);
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded bg-[#171918] px-4 py-2.5 text-xs font-semibold text-[#FAF9F6] whitespace-nowrap shrink-0 transition-colors hover:bg-[#B8754D]"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Masukkan Daftar Pesanan</span>
                      </button>

                      <a
                        href={buildDirectWhatsAppUrl(activeProduct, modalQty, modalNote)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded border border-[#B8754D] bg-[#B8754D]/10 px-4 py-2.5 text-xs font-semibold text-[#171918] whitespace-nowrap shrink-0 transition-colors hover:bg-[#B8754D] hover:text-[#FAF9F6]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Pesan via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
