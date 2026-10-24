import React from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import {
  SiteConfig,
  defaultSiteConfig,
  demoPreviewSiteConfig,
} from '../data/siteConfig';

interface ConfigPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onUpdateConfig: (next: SiteConfig) => void;
}

export const ConfigPreviewDrawer: React.FC<ConfigPreviewDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  if (!isOpen) return null;

  const handleApplySimulation = () => {
    onUpdateConfig({
      ...config,
      ...demoPreviewSiteConfig,
      hero: {
        ...config.hero,
        ...(demoPreviewSiteConfig.hero || {}),
      },
    });
  };

  const handleResetDefaultPlaceholders = () => {
    onUpdateConfig(defaultSiteConfig);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-label="Panel Konfigurasi Identitas Bisnis"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-[#F2EBDD]/15 bg-[#171918] text-[#FAF9F6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#F2EBDD]/12 px-6 py-5">
          <div>
            <p className="font-mono-tabular text-[11px] text-[#B8754D] uppercase">
              SITE CONFIG LIVE EDITOR
            </p>
            <h2 className="font-editorial text-2xl font-semibold text-[#FAF9F6]">
              Konfigurasi Data Bisnis
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#F2EBDD]/20 text-[#FAF9F6] hover:border-[#B8754D]"
            aria-label="Tutup panel konfigurasi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6 text-xs">
          <p className="leading-relaxed text-[#F2EBDD]/75">
            Sesuai PRD, secara default website menampilkan placeholder resmi agar tidak mengarang data faktual. Gunakan panel ini untuk menguji tampilan ketika data bisnis telah diisi, atau ubah permanen pada{' '}
            <code className="font-mono-tabular text-[#B8754D]">
              src/data/siteConfig.ts
            </code>
            .
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleApplySimulation}
              className="inline-flex items-center gap-1.5 rounded bg-[#B8754D] px-3.5 py-2 font-semibold text-[#FAF9F6] transition-colors hover:bg-[#A3633D]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Isi Data Contoh Simulasi</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaultPlaceholders}
              className="inline-flex items-center gap-1.5 rounded border border-[#F2EBDD]/20 bg-[#222524] px-3.5 py-2 font-semibold text-[#F2EBDD] transition-colors hover:border-[#B8754D]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset ke Placeholder PRD</span>
            </button>
          </div>

          <div className="space-y-4 border-t border-[#F2EBDD]/12 pt-4">
            <div>
              <label className="block font-mono-tabular text-[11px] text-[#F2EBDD]/70 uppercase">
                Nama Cafe / Restoran
              </label>
              <input
                type="text"
                value={config.brandName}
                onChange={(e) =>
                  onUpdateConfig({ ...config, brandName: e.target.value })
                }
                className="mt-1.5 w-full rounded border border-[#F2EBDD]/20 bg-[#1F2221] px-3 py-2 text-xs text-[#FAF9F6] focus:border-[#B8754D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tabular text-[11px] text-[#F2EBDD]/70 uppercase">
                Tahun Berdiri (EST.)
              </label>
              <input
                type="text"
                value={config.establishedYear}
                onChange={(e) =>
                  onUpdateConfig({
                    ...config,
                    establishedYear: e.target.value,
                    hero: {
                      ...config.hero,
                      estBadge: `EST. ${e.target.value}`,
                    },
                  })
                }
                className="mt-1.5 w-full rounded border border-[#F2EBDD]/20 bg-[#1F2221] px-3 py-2 font-mono-tabular text-xs text-[#FAF9F6] focus:border-[#B8754D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tabular text-[11px] text-[#F2EBDD]/70 uppercase">
                Alamat Lengkap
              </label>
              <input
                type="text"
                value={config.address}
                onChange={(e) =>
                  onUpdateConfig({ ...config, address: e.target.value })
                }
                className="mt-1.5 w-full rounded border border-[#F2EBDD]/20 bg-[#1F2221] px-3 py-2 text-xs text-[#FAF9F6] focus:border-[#B8754D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tabular text-[11px] text-[#F2EBDD]/70 uppercase">
                Nomor WhatsApp (Format 628xxx)
              </label>
              <input
                type="text"
                value={config.whatsappNumber}
                onChange={(e) =>
                  onUpdateConfig({ ...config, whatsappNumber: e.target.value })
                }
                className="mt-1.5 w-full rounded border border-[#F2EBDD]/20 bg-[#1F2221] px-3 py-2 font-mono-tabular text-xs text-[#FAF9F6] focus:border-[#B8754D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tabular text-[11px] text-[#F2EBDD]/70 uppercase">
                Jam Operasional
              </label>
              <input
                type="text"
                value={config.operatingHours}
                onChange={(e) =>
                  onUpdateConfig({ ...config, operatingHours: e.target.value })
                }
                className="mt-1.5 w-full rounded border border-[#F2EBDD]/20 bg-[#1F2221] px-3 py-2 text-xs text-[#FAF9F6] focus:border-[#B8754D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tabular text-[11px] text-[#F2EBDD]/70 uppercase">
                URL Google Maps
              </label>
              <input
                type="url"
                value={config.googleMapsUrl}
                onChange={(e) =>
                  onUpdateConfig({ ...config, googleMapsUrl: e.target.value })
                }
                className="mt-1.5 w-full rounded border border-[#F2EBDD]/20 bg-[#1F2221] px-3 py-2 font-mono-tabular text-xs text-[#FAF9F6] focus:border-[#B8754D] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#F2EBDD]/12 p-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded bg-[#B8754D] py-3 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase transition-colors hover:bg-[#A3633D]"
          >
            Selesai &amp; Terapkan Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
