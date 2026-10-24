export interface TestimonialItem {
  id: string;
  customerName: string;
  roleOrContext?: string;
  content: string;
  verifiedRating?: number;
  source?: string;
  date?: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  conceptSubtitle: string;
  establishedYear: string;
  cityRegion: string;
  address: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  whatsappNumber: string;
  operatingHours: string;
  emailContact: string;
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    slowMomentsBadge: string;
    estBadge: string;
    scrollCue: string;
  };
  story: {
    label: string;
    headline: string;
    leadParagraph: string;
    secondaryParagraph: string;
    editorialNote: string;
    architecturalMaterials: {
      name: string;
      origin: string;
      character: string;
      swatchHex: string;
    }[];
  };
  experience: {
    label: string;
    headline: string;
    subheadline: string;
    pillars: {
      number: string;
      title: string;
      subtitle: string;
      description: string;
      detailNote: string;
      artKey: 'atmosphere' | 'flavor' | 'moment';
    }[];
  };
  socials: {
    instagram: string;
    tiktok: string;
    threads: string;
  };
  footerClosing: string;
  testimonials: TestimonialItem[];
}

export const defaultSiteConfig: SiteConfig = {
  brandName: 'Cafti Coffe Tea & Resto',
  tagline: 'The Art of Coffee, Food & Movement — Malang Edition',
  conceptSubtitle: 'COFFEE · CUISINE · COMMUNITY',
  establishedYear: '2019',
  cityRegion: 'Kota Malang, Jawa Timur',
  address: '[ALAMAT LENGKAP]',
  googleMapsUrl: '[URL GOOGLE MAPS]',
  googleMapsEmbedUrl: '',
  whatsappNumber: '[NOMOR WHATSAPP]',
  operatingHours: '[JAM OPERASIONAL]',
  emailContact: 'reservasi@namacafe-malang.id',
  hero: {
    kicker: 'COFFEE · CUISINE · COMMUNITY',
    headline: 'Bukan Sekadar Rasa. Sebuah Pengalaman.',
    subheadline:
      'Temukan perpaduan rasa, ruang, dan suasana dalam pengalaman bersantap yang berbeda di Malang.',
    primaryCta: 'Jelajahi Menu',
    secondaryCta: 'Temukan Lokasi Kami',
    slowMomentsBadge: 'MADE FOR SLOW MOMENTS',
    estBadge: 'EST. 2019',
    scrollCue: 'SCROLL TO EXPLORE',
  },
  story: {
    label: 'OUR PHILOSOPHY / 01',
    headline: 'Setiap Ruang Punya Cerita. Setiap Rasa Punya Karakter.',
    leadParagraph:
      'Terinspirasi oleh udara sejuk dataran tinggi Malang dan ketenangan tekstur batu vulkanik, ruang ini dirancang sebagai tempat jeda dari ritme harian yang tergesa. Setiap sudut memadukan pencahayaan hangat, material kayu gelap, dan akustik ruang yang menenangkan.',
    secondaryParagraph:
      'Dari cangkir kopi pagi yang diseduh dengan presisi hingga sajian malam yang dinikmati bersama orang terdekat, kami merayakan pertemuan antara teknik kuliner modern, keramahtamahan yang tulus, dan percakapan yang bermakna.',
    editorialNote:
      'Narasi filosofi di atas merupakan placeholder editorial yang dapat disesuaikan dengan cerita autentik brand Anda pada file src/data/siteConfig.ts.',
    architecturalMaterials: [
      {
        name: 'Batu Andesit Vulkanik',
        origin: 'Tekstur Monolitik',
        character: 'Menyerap cahaya berlebih dan menghadirkan kesan teduh khas lereng pegunungan.',
        swatchHex: '#262826',
      },
      {
        name: 'Kayu Jati & Sonokeling',
        origin: 'Finishing Matte Alami',
        character: 'Memberikan kehangatan organik pada meja komunal maupun sudut intim.',
        swatchHex: '#433228',
      },
      {
        name: 'Aksen Burnt Copper',
        origin: 'Detail Pencahayaan & Bar',
        character: 'Memantulkan pendar cahaya keemasan saat senja turun di Kota Malang.',
        swatchHex: '#B8754D',
      },
      {
        name: 'Keramik Stoneware',
        origin: 'Tableware Pilihan',
        character: 'Menjaga suhu ekstraksi kopi dan memperkuat estetika penyajian hidangan.',
        swatchHex: '#E6DEC8',
      },
    ],
  },
  experience: {
    label: 'THE THREE PILLARS / 03',
    headline: 'More Than a Place to Eat.',
    subheadline:
      'Tiga fondasi utama yang membentuk keseluruhan atmosfer, cita rasa, dan interaksi di setiap kunjungan Anda.',
    pillars: [
      {
        number: '01',
        title: 'THE ATMOSPHERE',
        subtitle: 'Ruang, Cahaya & Materialitas',
        description:
          'Ruang dengan pencahayaan, material, dan suasana yang mendukung momen bersantai. Perpaduan langit-langit tinggi, sirkulasi udara sejuk, dan tata cahaya temaram yang bergeser mengikuti waktu.',
        detailNote: 'Indoor Dining · Semi-Outdoor Terrace · Quiet Reading & Work Nook',
        artKey: 'atmosphere',
      },
      {
        number: '02',
        title: 'THE FLAVOR',
        subtitle: 'Kurasi Rasa & Presisi Penyajian',
        description:
          'Kopi dan hidangan yang disajikan dengan perhatian terhadap pengalaman rasa. Setiap komposisi dirancang untuk menonjolkan keseimbangan tekstur, suhu penyajian, dan harmoni aroma.',
        detailNote: 'Specialty Espresso Bar · Slow Bar Manual Brew · All-Day Artisanal Kitchen',
        artKey: 'flavor',
      },
      {
        number: '03',
        title: 'THE MOMENT',
        subtitle: 'Koneksi & Kebersamaan',
        description:
          'Tempat untuk bertemu, berbincang, bekerja, dan menghabiskan waktu bersama. Dirancang agar setiap percakapan maupun waktu fokus Anda mengalir tanpa gangguan.',
        detailNote: 'Intimate Tables · Communal Long Table · Private Gathering Ready',
        artKey: 'moment',
      },
    ],
  },
  socials: {
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    threads: 'https://threads.net',
  },
  footerClosing: 'Good Taste. Great Spaces. Better Moments.',
  // Sesuai PRD Bagian 12: Jangan membuat testimoni palsu seolah-olah berasal dari pelanggan nyata.
  // Kosong secara default hingga pemilik bisnis mengisi ulasan terverifikasi.
  testimonials: [],
};

// Pratinjau contoh pengisian konfigurasi jika pemilik bisnis ingin menguji simulasi data lengkap
export const demoPreviewSiteConfig: Partial<SiteConfig> = {
  brandName: 'KALA VULKANIK — MALANG',
  establishedYear: '2026',
  address: 'Jl. Ijen Boulevard (Contoh Simulasi Konfigurasi), Klojen, Kota Malang, Jawa Timur',
  googleMapsUrl: 'https://maps.google.com/?q=Malang+Jawa+Timur',
  whatsappNumber: '6281234567890',
  operatingHours: 'Setiap Hari · 08.00 – 23.00 WIB',
  hero: {
    ...defaultSiteConfig.hero,
    estBadge: 'EST. 2026',
  },
};

export function isPlaceholderValue(val: string): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  return trimmed.startsWith('[') && trimmed.endsWith(']');
}

export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  return digits;
}
