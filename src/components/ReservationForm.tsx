import React, { useState, useMemo } from 'react';
import { MessageCircle, Copy, Check, AlertCircle, Calendar, Users, Clock } from 'lucide-react';
import {
  SiteConfig,
  isPlaceholderValue,
  normalizeWhatsAppNumber,
} from '../data/siteConfig';
import { MenuItem } from '../data/menu';

export interface OrderLineItem {
  item: MenuItem;
  quantity: number;
  note: string;
}

interface ReservationFormProps {
  config: SiteConfig;
  orderItems: OrderLineItem[];
  onClearOrder: () => void;
}

interface FormErrors {
  name?: string;
  whatsapp?: string;
  date?: string;
  time?: string;
  guests?: string;
}

function getTodayIsoString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  config,
  orderItems,
}) => {
  const todayStr = useMemo(() => getTodayIsoString(), []);

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState('2');
  const [notes, setNotes] = useState('');
  const [includeMenuOrder, setIncludeMenuOrder] = useState(true);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidated, setIsValidated] = useState(false);
  const [copied, setCopied] = useState(false);

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Mohon isi nama lengkap Anda (minimal 2 karakter).';
    }

    const digitsOnly = whatsapp.replace(/[^0-9+]/g, '');
    if (!digitsOnly || digitsOnly.length < 9) {
      nextErrors.whatsapp = 'Mohon masukkan nomor WhatsApp aktif yang valid (minimal 9 digit).';
    }

    if (!date) {
      nextErrors.date = 'Mohon pilih tanggal kunjungan.';
    } else if (date < todayStr) {
      nextErrors.date = 'Tanggal kunjungan tidak boleh memilih tanggal di masa lalu.';
    }

    if (!time) {
      nextErrors.time = 'Mohon pilih waktu kunjungan.';
    }

    const guestNum = Number(guests);
    if (!guests || Number.isNaN(guestNum) || guestNum < 1 || guestNum > 50) {
      nextErrors.guests = 'Jumlah tamu harus antara 1 hingga 50 orang.';
    }

    setErrors(nextErrors);
    const valid = Object.keys(nextErrors).length === 0;
    setIsValidated(valid);
    return valid;
  };

  // Format pesan sesuai PRD Bagian 14
  const formattedWhatsAppMessage = useMemo(() => {
    const baseLines = [
      `Halo ${config.brandName}, saya ingin melakukan reservasi.`,
      '',
      `Nama: ${name.trim() || '[Nama]'}`,
      `Nomor WhatsApp: ${whatsapp.trim() || '[Nomor WhatsApp]'}`,
      `Tanggal: ${date || '[Tanggal]'}`,
      `Waktu: ${time || '[Waktu]'} WIB`,
      `Jumlah tamu: ${guests || '[Jumlah]'} orang`,
      `Catatan: ${notes.trim() || '-'}`,
    ];

    if (includeMenuOrder && orderItems.length > 0) {
      baseLines.push('');
      baseLines.push('Daftar Pre-Order Menu:');
      orderItems.forEach((entry, idx) => {
        const notePart = entry.note ? ` (${entry.note})` : '';
        baseLines.push(
          `${idx + 1}. ${entry.item.name} × ${entry.quantity} — ${entry.item.priceFormatted}${notePart}`,
        );
      });
    }

    baseLines.push('');
    baseLines.push('Mohon informasi ketersediaannya. Terima kasih.');
    return baseLines.join('\n');
  }, [config.brandName, name, whatsapp, date, time, guests, notes, includeMenuOrder, orderItems]);

  const whatsappUrl = useMemo(() => {
    const encoded = encodeURIComponent(formattedWhatsAppMessage);
    const cleanPhone = isPlaceholderValue(config.whatsappNumber)
      ? ''
      : normalizeWhatsAppNumber(config.whatsappNumber);
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
  }, [formattedWhatsAppMessage, config.whatsappNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm();
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(formattedWhatsAppMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="reservation"
      className="relative bg-[#F2EBDD] py-24 text-[#171918] lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header */}
        <div className="mb-12 border-b border-[#171918]/12 pb-8">
          <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#B8754D] uppercase">
            TABLE RESERVATION &amp; ORDERING / 07
          </p>
          <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <h2 className="font-editorial text-4xl font-semibold text-[#171918] sm:text-5xl">
              Reserve Your Table.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-[#171918]/75">
              Rencanakan kunjungan Anda lebih awal. Formulir di bawah ini akan memvalidasi detail kunjungan dan menyusun pesan reservasi otomatis ke WhatsApp resmi kami.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Left Form Column */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-lg border border-[#171918]/12 bg-[#FAF9F6] p-7 shadow-sm sm:p-9 lg:col-span-7"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Nama Lengkap */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="res-name"
                  className="block text-xs font-semibold tracking-wider text-[#171918] uppercase"
                >
                  Nama Lengkap <span className="text-[#B8754D]">*</span>
                </label>
                <input
                  id="res-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (isValidated) setIsValidated(false);
                  }}
                  placeholder="Nama Anda"
                  className={`mt-2 w-full rounded border bg-white px-3.5 py-2.5 text-sm text-[#171918] placeholder:text-[#77766F]/70 focus:outline-none ${
                    errors.name
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-[#171918]/20 focus:border-[#B8754D]'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Nomor WhatsApp */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="res-wa"
                  className="block text-xs font-semibold tracking-wider text-[#171918] uppercase"
                >
                  Nomor WhatsApp <span className="text-[#B8754D]">*</span>
                </label>
                <input
                  id="res-wa"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    if (isValidated) setIsValidated(false);
                  }}
                  placeholder="Contoh: 081234567890"
                  className={`mt-2 w-full rounded border bg-white px-3.5 py-2.5 font-mono-tabular text-sm text-[#171918] placeholder:text-[#77766F]/70 focus:outline-none ${
                    errors.whatsapp
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-[#171918]/20 focus:border-[#B8754D]'
                  }`}
                />
                {errors.whatsapp && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.whatsapp}</span>
                  </p>
                )}
              </div>

              {/* Tanggal Kunjungan */}
              <div>
                <label
                  htmlFor="res-date"
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#171918] uppercase"
                >
                  <Calendar className="h-3.5 w-3.5 text-[#B8754D]" />
                  <span>Tanggal Kunjungan *</span>
                </label>
                <input
                  id="res-date"
                  type="date"
                  required
                  min={todayStr}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (isValidated) setIsValidated(false);
                  }}
                  className={`mt-2 w-full rounded border bg-white px-3.5 py-2.5 font-mono-tabular text-sm text-[#171918] focus:outline-none ${
                    errors.date
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-[#171918]/20 focus:border-[#B8754D]'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.date}</span>
                  </p>
                )}
              </div>

              {/* Waktu Kunjungan */}
              <div>
                <label
                  htmlFor="res-time"
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#171918] uppercase"
                >
                  <Clock className="h-3.5 w-3.5 text-[#B8754D]" />
                  <span>Waktu Kunjungan *</span>
                </label>
                <input
                  id="res-time"
                  type="time"
                  required
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    if (isValidated) setIsValidated(false);
                  }}
                  className={`mt-2 w-full rounded border bg-white px-3.5 py-2.5 font-mono-tabular text-sm text-[#171918] focus:outline-none ${
                    errors.time
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-[#171918]/20 focus:border-[#B8754D]'
                  }`}
                />
                {errors.time && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.time}</span>
                  </p>
                )}
              </div>

              {/* Jumlah Tamu */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="res-guests"
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#171918] uppercase"
                >
                  <Users className="h-3.5 w-3.5 text-[#B8754D]" />
                  <span>Jumlah Tamu (Orang) *</span>
                </label>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {['1', '2', '4', '6', '8'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setGuests(preset);
                        if (isValidated) setIsValidated(false);
                      }}
                      className={`rounded border px-3.5 py-2 font-mono-tabular text-xs font-semibold transition-colors ${
                        guests === preset
                          ? 'border-[#171918] bg-[#171918] text-[#FAF9F6]'
                          : 'border-[#171918]/20 bg-white text-[#171918] hover:border-[#B8754D]'
                      }`}
                    >
                      {preset} Tamu
                    </button>
                  ))}
                  <input
                    id="res-guests"
                    type="number"
                    min={1}
                    max={50}
                    value={guests}
                    onChange={(e) => {
                      setGuests(e.target.value);
                      if (isValidated) setIsValidated(false);
                    }}
                    className="w-24 rounded border border-[#171918]/20 bg-white px-3 py-2 font-mono-tabular text-sm text-[#171918] focus:border-[#B8754D] focus:outline-none"
                    aria-label="Jumlah tamu kustom"
                  />
                </div>
                {errors.guests && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.guests}</span>
                  </p>
                )}
              </div>

              {/* Catatan Tambahan */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="res-notes"
                  className="block text-xs font-semibold tracking-wider text-[#171918] uppercase"
                >
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  id="res-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    if (isValidated) setIsValidated(false);
                  }}
                  placeholder="Contoh: Area indoor tenang / dekat stopkontak / perayaan ulang tahun..."
                  className="mt-2 w-full rounded border border-[#171918]/20 bg-white p-3.5 text-sm text-[#171918] placeholder:text-[#77766F]/70 focus:border-[#B8754D] focus:outline-none"
                />
              </div>

              {/* Checkbox Sertakan Daftar Menu Pilihan */}
              {orderItems.length > 0 && (
                <div className="sm:col-span-2 rounded border border-[#171918]/12 bg-[#F2EBDD]/60 p-4">
                  <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-[#171918]">
                    <input
                      type="checkbox"
                      checked={includeMenuOrder}
                      onChange={(e) => setIncludeMenuOrder(e.target.checked)}
                      className="h-4 w-4 accent-[#B8754D]"
                    />
                    <span>
                      Sertakan {orderItems.reduce((acc, i) => acc + i.quantity, 0)} porsi menu pilihan saya ke dalam pesan reservasi
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#171918]/10 pt-6">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded bg-[#171918] px-6 py-3.5 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase whitespace-nowrap shrink-0 transition-colors hover:bg-[#B8754D]"
              >
                <span>Validasi &amp; Siapkan Pesan Reservasi</span>
              </button>

              <span className="text-xs text-[#77766F]">
                * Reservasi memerlukan konfirmasi balasan dari tim kami via WhatsApp.
              </span>
            </div>
          </form>

          {/* Right Live WhatsApp Message Builder & Action Panel */}
          <div className="flex flex-col justify-between rounded-lg border border-[#171918]/15 bg-[#171918] p-7 text-[#FAF9F6] shadow-xl sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-[#F2EBDD]/12 pb-4">
                <span className="font-mono-tabular text-xs font-medium tracking-wider text-[#B8754D] uppercase">
                  PRATINJAU PESAN WHATSAPP
                </span>
                <span className="font-mono-tabular text-[11px] text-[#F2EBDD]/60">
                  TUJUAN: {config.whatsappNumber}
                </span>
              </div>

              <pre className="mt-5 overflow-x-auto rounded border border-[#F2EBDD]/12 bg-[#111312] p-4 font-mono-tabular text-xs leading-relaxed whitespace-pre-wrap text-[#F2EBDD]/90">
                {formattedWhatsAppMessage}
              </pre>

              {isValidated && (
                <div
                  role="status"
                  className="mt-4 rounded border border-[#737766] bg-[#737766]/20 p-3.5 text-xs leading-relaxed text-[#F2EBDD]"
                >
                  Data formulir telah tervalidasi. Silakan klik tombol{' '}
                  <strong className="text-[#FAF9F6]">Kirim via WhatsApp</strong> di bawah ini untuk meneruskan permintaan reservasi Anda. Status reservasi akan dikonfirmasi setelah admin membalas pesan Anda.
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3 border-t border-[#F2EBDD]/12 pt-5">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!validateForm()) {
                      e.preventDefault();
                    }
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded bg-[#B8754D] px-5 py-3.5 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase whitespace-nowrap shrink-0 transition-colors hover:bg-[#A3633D]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Kirim via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center justify-center gap-1.5 rounded border border-[#F2EBDD]/20 bg-[#222524] px-4 py-3.5 text-xs font-semibold text-[#F2EBDD] whitespace-nowrap shrink-0 transition-colors hover:border-[#B8754D]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-[#737766]" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>
              </div>

              {isPlaceholderValue(config.whatsappNumber) && (
                <p className="font-mono-tabular text-[11px] leading-relaxed text-[#F2EBDD]/60">
                  Catatan: Nomor tujuan masih berupa placeholder <code className="text-[#B8754D]">[NOMOR WHATSAPP]</code>. Tautan tetap membuka WhatsApp dengan teks ter-encode sehingga Anda dapat memilih kontak tujuan.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
