import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, MessageCircle, ExternalLink, Settings2 } from 'lucide-react';
import {
  SiteConfig,
  isPlaceholderValue,
  normalizeWhatsAppNumber,
} from '../data/siteConfig';
import {
  EDITORIAL_EASE,
  MagneticWrapper,
  StaggeredHeadline,
} from './MotionPrimitives';

interface LocationSectionProps {
  config: SiteConfig;
  onOpenConfigDrawer: () => void;
  reducedMotion?: boolean;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  config,
  onOpenConfigDrawer,
  reducedMotion = false,
}) => {
  const [mapsNoticeVisible, setMapsNoticeVisible] = useState(false);

  const isMapsPlaceholder = isPlaceholderValue(config.googleMapsUrl);
  const isWaPlaceholder = isPlaceholderValue(config.whatsappNumber);
  const cleanWa = isWaPlaceholder
    ? ''
    : normalizeWhatsAppNumber(config.whatsappNumber);

  const generalWaMessage = encodeURIComponent(
    `Halo ${config.brandName}, saya ingin menanyakan informasi lokasi dan ketersediaan meja hari ini.`,
  );
  const whatsappHref = cleanWa
    ? `https://wa.me/${cleanWa}?text=${generalWaMessage}`
    : `https://wa.me/?text=${generalWaMessage}`;

  return (
    <section
      id="location"
      className="relative border-t border-[#F2EBDD]/10 bg-[#171918] py-24 text-[#FAF9F6] lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#F2EBDD]/12 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#B8754D] uppercase">
              DESTINATION &amp; ACCESS / 06
            </p>
            <StaggeredHeadline
              as="h2"
              text="Your Next Favorite Place in Malang."
              reducedMotion={reducedMotion}
              className="font-editorial mt-2 text-4xl font-semibold text-[#FAF9F6] sm:text-5xl"
            />
          </div>
          <button
            type="button"
            onClick={onOpenConfigDrawer}
            className="inline-flex items-center gap-2 self-start rounded border border-[#F2EBDD]/20 bg-[#1E2120] px-4 py-2 font-mono-tabular text-xs text-[#F2EBDD]/85 whitespace-nowrap shrink-0 transition-colors hover:border-[#B8754D] hover:text-[#FAF9F6] lg:self-auto"
          >
            <Settings2 className="h-3.5 w-3.5 text-[#B8754D]" />
            <span>Uji / Edit Konfigurasi Lokasi</span>
          </button>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          {/* Left Information Card */}
          <div
            className={`flex flex-col justify-between rounded-lg border border-[#F2EBDD]/12 bg-[#1C1F1E] p-8 lg:col-span-6 ${
              reducedMotion ? '' : 'animate-reveal-up'
            }`}
          >
            <div className="space-y-7">
              <div>
                <div className="flex items-center gap-2 font-mono-tabular text-xs text-[#B8754D] uppercase">
                  <MapPin className="h-4 w-4" />
                  <span>ALAMAT LENGKAP</span>
                </div>
                <p className="font-editorial mt-2 text-2xl font-semibold text-[#FAF9F6]">
                  {config.address}
                </p>
                <p className="mt-1 text-xs text-[#F2EBDD]/65">
                  {config.cityRegion}
                </p>
              </div>

              <div className="border-t border-[#F2EBDD]/10 pt-6">
                <div className="flex items-center gap-2 font-mono-tabular text-xs text-[#B8754D] uppercase">
                  <Clock className="h-4 w-4" />
                  <span>JAM OPERASIONAL</span>
                </div>
                <p className="mt-2 font-mono-tabular text-base font-medium text-[#FAF9F6]">
                  {config.operatingHours}
                </p>
                <p className="mt-1 text-xs text-[#F2EBDD]/65">
                  Tersedia untuk sarapan santai, makan siang, kerja sore, hingga makan malam.
                </p>
              </div>

              <div className="border-t border-[#F2EBDD]/10 pt-6">
                <div className="flex items-center gap-2 font-mono-tabular text-xs text-[#B8754D] uppercase">
                  <MessageCircle className="h-4 w-4" />
                  <span>KONTAK &amp; WHATSAPP RESERVASI</span>
                </div>
                <p className="mt-2 font-mono-tabular text-base font-medium text-[#FAF9F6]">
                  {config.whatsappNumber}
                </p>
                <p className="mt-1 text-xs text-[#F2EBDD]/65">
                  URL Google Maps: <span className="font-mono-tabular">{config.googleMapsUrl}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3 border-t border-[#F2EBDD]/10 pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <MagneticWrapper strength={3} reducedMotion={reducedMotion}>
                  {isMapsPlaceholder ? (
                    <button
                      type="button"
                      onClick={() => setMapsNoticeVisible(true)}
                      className="inline-flex items-center gap-2 rounded bg-[#B8754D] px-5 py-3 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase whitespace-nowrap shrink-0 transition-colors hover:bg-[#A3633D]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Buka Google Maps</span>
                    </button>
                  ) : (
                    <a
                      href={config.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded bg-[#B8754D] px-5 py-3 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase whitespace-nowrap shrink-0 transition-colors hover:bg-[#A3633D]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Buka Google Maps</span>
                    </a>
                  )}
                </MagneticWrapper>

                <MagneticWrapper strength={3} reducedMotion={reducedMotion}>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-[#F2EBDD]/25 bg-[#232625] px-5 py-3 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase whitespace-nowrap shrink-0 transition-colors hover:border-[#B8754D]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#B8754D]" />
                    <span>Hubungi via WhatsApp</span>
                  </a>
                </MagneticWrapper>
              </div>

              {mapsNoticeVisible && isMapsPlaceholder && (
                <div
                  role="status"
                  className="rounded border border-[#B8754D]/50 bg-[#2A201A] p-3.5 text-xs leading-relaxed text-[#F2EBDD]"
                >
                  Data <code className="font-mono-tabular text-[#B8754D]">[URL GOOGLE MAPS]</code> masih berupa placeholder. Silakan lengkapi URL lokasi resmi pada{' '}
                  <code className="font-mono-tabular">src/data/siteConfig.ts</code> atau klik tombol{' '}
                  <button
                    type="button"
                    onClick={onOpenConfigDrawer}
                    className="font-semibold text-[#B8754D] underline"
                  >
                    Uji / Edit Konfigurasi Lokasi
                  </button>{' '}
                  untuk menguji tautan aktif.
                </div>
              )}
            </div>
          </div>

          {/* Right Map / Architectural Malang Topographic Preview */}
          <div
            className={`flex flex-col justify-between overflow-hidden rounded-lg border border-[#F2EBDD]/12 bg-[#1A1D1C] lg:col-span-6 ${
              reducedMotion ? '' : 'animate-reveal-up-delay-1'
            }`}
          >
            {config.googleMapsEmbedUrl ? (
              <iframe
                title={`Peta Lokasi ${config.brandName}`}
                src={config.googleMapsEmbedUrl}
                className="h-full min-h-[380px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="relative flex h-full min-h-[380px] flex-col justify-between p-8">
                {/* Topographic Grid & Malang Highland Visual */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full text-[#F2EBDD]/[0.05]"
                  viewBox="0 0 600 450"
                  fill="none"
                >
                  <path
                    d="M-50 120 Q 150 60, 320 140 T 650 100"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M-50 200 Q 180 130, 350 220 T 650 180"
                  stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M-50 290 Q 210 220, 390 300 T 650 270"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="300"
                    cy="225"
                    r="95"
                    stroke="#B8754D"
                    strokeOpacity="0.25"
                    strokeDasharray="4 6"
                  />
                  <circle
                    cx="300"
                    cy="225"
                    r="42"
                    stroke="#B8754D"
                    strokeOpacity="0.4"
                  />
                </svg>

                <div className="relative z-10 flex items-center justify-between font-mono-tabular text-xs text-[#F2EBDD]/60">
                  <span>MALANG CITY REGION · JAWA TIMUR</span>
                  <span className="text-[#B8754D]">MAP PLACEHOLDER READY</span>
                </div>

                <div className="relative z-10 my-auto flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#B8754D] bg-[#B8754D]/15 text-[#B8754D]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-editorial mt-4 text-2xl font-semibold text-[#FAF9F6]">
                    {config.brandName}
                  </h3>
                  <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#F2EBDD]/70">
                    Area pratinjau peta interaktif. Untuk menampilkan peta Google Maps secara langsung, isi properti{' '}
                    <code className="font-mono-tabular text-[#B8754D]">googleMapsUrl</code> atau{' '}
                    <code className="font-mono-tabular text-[#B8754D]">googleMapsEmbedUrl</code> pada konfigurasi bisnis.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#F2EBDD]/10 pt-4 font-mono-tabular text-[11px] text-[#77766F]">
                  <span>PARKIR KENDARAAN TERSEDIA</span>
                  <span>AKSES MUDAH DARI PUSAT KOTA MALANG</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
