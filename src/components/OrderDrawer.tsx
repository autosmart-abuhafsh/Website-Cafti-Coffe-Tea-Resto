import React from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, CalendarCheck } from 'lucide-react';
import {
  SiteConfig,
  isPlaceholderValue,
  normalizeWhatsAppNumber,
} from '../data/siteConfig';
import { OrderLineItem } from './ReservationForm';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  items: OrderLineItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  config,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const totalEstimated = items.reduce(
    (sum, entry) => sum + entry.item.priceNumeric * entry.quantity,
    0,
  );

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalEstimated);

  const buildOrderWhatsAppUrl = () => {
    const lines = [
      `Halo ${config.brandName}, saya ingin memesan menu berikut:`,
      '',
      ...items.map((entry, idx) => {
        const noteStr = entry.note ? ` (Catatan: ${entry.note})` : '';
        return `${idx + 1}. ${entry.item.name} × ${entry.quantity} — ${entry.item.priceFormatted}${noteStr}`;
      }),
      '',
      `Estimasi Total: ${formattedTotal}`,
      '',
      'Mohon informasi ketersediaan dan instruksi pemesanan lebih lanjut. Terima kasih.',
    ];
    const encoded = encodeURIComponent(lines.join('\n'));
    const cleanPhone = isPlaceholderValue(config.whatsappNumber)
      ? ''
      : normalizeWhatsAppNumber(config.whatsappNumber);
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-label="Daftar Pesanan Menu"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-[#F2EBDD]/15 bg-[#FAF9F6] text-[#171918] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#171918]/12 px-6 py-5">
          <div>
            <p className="font-mono-tabular text-[11px] text-[#B8754D] uppercase">
              WHATSAPP ORDER BUILDER
            </p>
            <h2 className="font-editorial text-2xl font-semibold text-[#171918]">
              Daftar Pilihan Menu
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#171918]/15 text-[#171918] hover:border-[#B8754D]"
            aria-label="Tutup daftar pesanan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-editorial text-2xl text-[#171918]/70">
                Daftar pesanan Anda masih kosong.
              </p>
              <p className="mt-2 text-xs text-[#77766F]">
                Pilih menu favorit Anda pada bagian Signature Menu untuk menyusun pesan pemesanan WhatsApp.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((entry) => (
                <div
                  key={entry.item.id}
                  className="rounded border border-[#171918]/12 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-editorial text-lg font-semibold text-[#171918]">
                        {entry.item.name}
                      </h3>
                      <p className="font-mono-tabular text-xs font-medium text-[#B8754D]">
                        {entry.item.priceFormatted} / porsi
                      </p>
                      {entry.note && (
                        <p className="mt-1 text-xs text-[#77766F]">
                          Catatan: {entry.note}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(entry.item.id)}
                      className="text-[#77766F] transition-colors hover:text-red-700"
                      aria-label={`Hapus ${entry.item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#171918]/8 pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(entry.item.id, -1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#171918]/20 text-xs"
                        aria-label="Kurangi porsi"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono-tabular w-6 text-center text-xs font-semibold">
                        {entry.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(entry.item.id, 1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#171918]/20 text-xs"
                        aria-label="Tambah porsi"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-mono-tabular text-xs font-semibold text-[#171918]">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(entry.item.priceNumeric * entry.quantity)}
                    </span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-medium text-[#77766F] underline hover:text-red-700"
              >
                Kosongkan semua daftar pilihan
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#171918]/12 bg-[#F2EBDD] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-[#171918] uppercase">
                Estimasi Total (Contoh)
              </span>
              <span className="font-mono-tabular text-lg font-bold text-[#171918]">
                {formattedTotal}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#77766F]">
              * Belum termasuk pajak/layanan. Pemesanan diteruskan melalui WhatsApp tanpa klaim pembayaran otomatis.
            </p>

            <div className="mt-4 space-y-2.5">
              <a
                href={buildOrderWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded bg-[#B8754D] px-5 py-3 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase transition-colors hover:bg-[#A3633D]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Pesan Menu via WhatsApp</span>
              </a>

              <a
                href="#reservation"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded border border-[#171918]/25 bg-[#FAF9F6] px-5 py-2.5 text-xs font-semibold text-[#171918] transition-colors hover:border-[#171918]"
              >
                <CalendarCheck className="h-4 w-4 text-[#B8754D]" />
                <span>Gabungkan dengan Reservasi Meja</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
