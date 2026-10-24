import React from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { SiteConfig } from '../data/siteConfig';

interface TestimonialSectionProps {
  config: SiteConfig;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  config,
}) => {
  const hasVerifiedTestimonials = config.testimonials.length > 0;

  return (
    <section
      aria-label="Ulasan & Kesan Pengunjung"
      className="relative border-t border-[#171918]/10 bg-[#F2EBDD] py-20 text-[#171918] lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#171918]/12 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#B8754D] uppercase">
              GUEST IMPRESSIONS / 05
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-semibold text-[#171918] sm:text-5xl">
              Moments Worth Coming Back For.
            </h2>
          </div>
          <p className="font-mono-tabular text-xs text-[#77766F]">
            TRANSPARANSI ULASAN · HANYA MENAMPILKAN KESAN PELANGGAN TERVERIFIKASI
          </p>
        </div>

        {hasVerifiedTestimonials ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {config.testimonials.map((item) => (
              <blockquote
                key={item.id}
                className="flex flex-col justify-between rounded-lg border border-[#171918]/12 bg-[#FAF9F6] p-7"
              >
                <p className="font-editorial text-xl leading-relaxed text-[#171918] italic">
                  &ldquo;{item.content}&rdquo;
                </p>
                <footer className="mt-6 border-t border-[#171918]/10 pt-4 text-xs">
                  <div className="font-semibold text-[#171918]">
                    {item.customerName}
                  </div>
                  <div className="mt-1 font-mono-tabular text-[#77766F]">
                    {item.roleOrContext && <span>{item.roleOrContext}</span>}
                    {item.source && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span>{item.source}</span>
                      </>
                    )}
                    {item.verifiedRating && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span className="text-[#B8754D]">
                          {item.verifiedRating}/5
                        </span>
                      </>
                    )}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          /* Sesuai PRD Bagian 12: Jangan membuat testimoni palsu seolah-olah berasal dari pelanggan nyata. */
          <div className="rounded-lg border border-[#171918]/12 bg-[#FAF9F6] p-8 sm:p-12">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 font-mono-tabular text-xs text-[#B8754D] uppercase">
                  <MessageSquareQuote className="h-4 w-4" />
                  <span>RUANG CERITA PENGUNJUNG</span>
                </div>
                <h3 className="font-editorial mt-3 text-2xl font-semibold text-[#171918] sm:text-3xl">
                  Jadilah Pelanggan Pertama yang Membagikan Pengalaman Anda.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#171918]/75">
                  Kami tidak menampilkan ulasan atau rating fiktif. Bagian ini disiapkan secara khusus untuk memuat kesan autentik dari tamu yang telah berkunjung ke{' '}
                  <span className="font-semibold text-[#171918]">
                    {config.brandName}
                  </span>
                  .
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:items-end">
                <a
                  href="#reservation"
                  className="inline-flex items-center justify-center rounded bg-[#171918] px-6 py-3 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase whitespace-nowrap shrink-0 transition-colors hover:bg-[#B8754D]"
                >
                  Rencanakan Kunjungan
                </a>
                <span className="font-mono-tabular text-[11px] text-[#77766F]">
                  Data ulasan dikelola di src/data/siteConfig.ts
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
