// High-resolution procedural studio culinary & architectural canvas art generator
// Zero external 404 dependencies; renders crisp data URLs cached in memory.

const artCache = new Map<string, string>();

export interface ArtThemeConfig {
  bgPrimary: string;
  bgSecondary: string;
  accent: string;
  highlight: string;
  vesselColor: string;
  subjectType:
    | 'espresso_copper'
    | 'cold_brew_mist'
    | 'matcha_stone'
    | 'cascara_botanical'
    | 'wagyu_truffle'
    | 'salmon_risotto'
    | 'duck_confit'
    | 'truffle_fries'
    | 'brioche_toast'
    | 'tiramisu_volcanic'
    | 'hojicha_tart'
    | 'interior_arch'
    | 'bar_craft'
    | 'atmosphere'
    | 'flavor'
    | 'moment'
    | 'gallery_table'
    | 'gallery_pour'
    | 'gallery_plate'
    | 'gallery_lounge';
  label: string;
  subtitle: string;
}

const THEME_MAP: Record<string, ArtThemeConfig> = {
  espresso_copper: {
    bgPrimary: '#171918',
    bgSecondary: '#2A211B',
    accent: '#B8754D',
    highlight: '#F2EBDD',
    vesselColor: '#222322',
    subjectType: 'espresso_copper',
    label: 'SIGNATURE ESPRESSO LAYER',
    subtitle: 'Double Ristretto · Cold Silky Milk',
  },
  cold_brew_mist: {
    bgPrimary: '#151819',
    bgSecondary: '#27201C',
    accent: '#C98456',
    highlight: '#FAF9F6',
    vesselColor: '#1E2022',
    subjectType: 'cold_brew_mist',
    label: '18H VOLCANIC COLD BREW',
    subtitle: 'Crystal Ice · Smoked Cinnamon Infused',
  },
  matcha_stone: {
    bgPrimary: '#181D18',
    bgSecondary: '#293026',
    accent: '#737766',
    highlight: '#F2EBDD',
    vesselColor: '#252624',
    subjectType: 'matcha_stone',
    label: 'UJI CEREMONIAL MATCHA',
    subtitle: 'Chasen Whisked · Sea Salt Cream',
  },
  cascara_botanical: {
    bgPrimary: '#1F1617',
    bgSecondary: '#311E20',
    accent: '#B85D4D',
    highlight: '#F2EBDD',
    vesselColor: '#281F1F',
    subjectType: 'cascara_botanical',
    label: 'HIGHLAND CASCARA INFUSION',
    subtitle: 'Sun-Dried Coffee Cherry · Hibiscus',
  },
  wagyu_truffle: {
    bgPrimary: '#171918',
    bgSecondary: '#261E1A',
    accent: '#B8754D',
    highlight: '#F2EBDD',
    vesselColor: '#202120',
    subjectType: 'wagyu_truffle',
    label: 'CHARCOAL-SEARED STRIPLOIN',
    subtitle: 'Potato Mousseline · King Oyster Jus',
  },
  salmon_risotto: {
    bgPrimary: '#181B1A',
    bgSecondary: '#242B28',
    accent: '#D08760',
    highlight: '#FAF9F6',
    vesselColor: '#272927',
    subjectType: 'salmon_risotto',
    label: 'PAN-SEARED SALMON & RISOTTO',
    subtitle: 'Herb Arborio · Lemon Dill Emulsion',
  },
  duck_confit: {
    bgPrimary: '#1B1816',
    bgSecondary: '#2E231C',
    accent: '#B8754D',
    highlight: '#F2EBDD',
    vesselColor: '#23201E',
    subjectType: 'duck_confit',
    label: '8-HOUR SPICED DUCK CONFIT',
    subtitle: 'Spiced Citrus Reduction · Baby Carrots',
  },
  truffle_fries: {
    bgPrimary: '#191816',
    bgSecondary: '#2A2620',
    accent: '#C59B6D',
    highlight: '#FAF9F6',
    vesselColor: '#242320',
    subjectType: 'truffle_fries',
    label: 'TRUFFLE & GRANA PADANO',
    subtitle: 'Hand-Cut Pommes · Rosemary Aioli',
  },
  brioche_toast: {
    bgPrimary: '#1B1917',
    bgSecondary: '#2C251F',
    accent: '#B8754D',
    highlight: '#F2EBDD',
    vesselColor: '#262422',
    subjectType: 'brioche_toast',
    label: 'MUSHROOM & RICOTTA TARTINE',
    subtitle: 'Artisanal Sourdough · Aged Balsamic',
  },
  tiramisu_volcanic: {
    bgPrimary: '#151414',
    bgSecondary: '#281F1B',
    accent: '#B8754D',
    highlight: '#F2EBDD',
    vesselColor: '#1E1C1B',
    subjectType: 'tiramisu_volcanic',
    label: 'VOLCANIC CACAO TIRAMISU',
    subtitle: 'Single-Origin Espresso · Mascarpone',
  },
  hojicha_tart: {
    bgPrimary: '#1A1715',
    bgSecondary: '#2D241E',
    accent: '#C28255',
    highlight: '#F2EBDD',
    vesselColor: '#24201D',
    subjectType: 'hojicha_tart',
    label: 'ROASTED HOJICHA BASQUE',
    subtitle: 'Caramelized Crust · Sea Salt Caramel',
  },
  interior_arch: {
    bgPrimary: '#141615',
    bgSecondary: '#25211D',
    accent: '#B8754D',
    highlight: '#F2EBDD',
    vesselColor: '#1E201F',
    subjectType: 'interior_arch',
    label: 'ARCHITECTURAL SANCTUARY',
    subtitle: 'Volcanic Stone · Warm Timber · Highland Light',
  },
  bar_craft: {
    bgPrimary: '#171918',
    bgSecondary: '#2B211A',
    accent: '#B8754D',
    highlight: '#FAF9F6',
    vesselColor: '#212221',
    subjectType: 'bar_craft',
    label: 'SLOW BAR & ESPRESSO ATELIER',
    subtitle: 'Precision Extraction · Handcrafted Ceramics',
  },
  atmosphere: {
    bgPrimary: '#161817',
    bgSecondary: '#26231F',
    accent: '#B8754D',
    highlight: '#F2EBDD',
    vesselColor: '#202221',
    subjectType: 'atmosphere',
    label: '01 · THE ATMOSPHERE',
    subtitle: 'Monolithic Andesite & Golden Dusk',
  },
  flavor: {
    bgPrimary: '#191716',
    bgSecondary: '#2D221B',
    accent: '#B8754D',
    highlight: '#FAF9F6',
    vesselColor: '#23201E',
    subjectType: 'flavor',
    label: '02 · THE FLAVOR',
    subtitle: 'Sensory Balance & Culinary Craft',
  },
  moment: {
    bgPrimary: '#171918',
    bgSecondary: '#242722',
    accent: '#737766',
    highlight: '#F2EBDD',
    vesselColor: '#20221F',
    subjectType: 'moment',
    label: '03 · THE MOMENT',
    subtitle: 'Unhurried Conversations in Malang',
  },
  gallery_table: {
    bgPrimary: '#171817',
    bgSecondary: '#29221C',
    accent: '#B8754D',
    highlight: '#F2EBDD',
    vesselColor: '#22211F',
    subjectType: 'gallery_table',
    label: 'COMMUNAL TIMBER TABLE',
    subtitle: 'Warm Pendant Illumination',
  },
  gallery_pour: {
    bgPrimary: '#151716',
    bgSecondary: '#2A2019',
    accent: '#B8754D',
    highlight: '#FAF9F6',
    vesselColor: '#1E1E1D',
    subjectType: 'gallery_pour',
    label: 'ARTISANAL POUR OVER',
    subtitle: 'Morning Highland Mist & Steam',
  },
  gallery_plate: {
    bgPrimary: '#181716',
    bgSecondary: '#2B231E',
    accent: '#B8754D',
    highlight: '#F2EBDD',
    vesselColor: '#232120',
    subjectType: 'gallery_plate',
    label: 'EVENING PLATING STUDY',
    subtitle: 'Handcrafted Ceramic & Reduction',
  },
  gallery_lounge: {
    bgPrimary: '#161816',
    bgSecondary: '#232722',
    accent: '#737766',
    highlight: '#F2EBDD',
    vesselColor: '#1F211F',
    subjectType: 'gallery_lounge',
    label: 'TERRACE & HIGHLAND BREEZE',
    subtitle: 'Semi-Outdoor Sanctuary',
  },
};

export function getProceduralArtUrl(
  key: string,
  width = 960,
  height = 720,
): string {
  const cacheKey = `${key}_${width}x${height}`;
  const cached = artCache.get(cacheKey);
  if (cached) return cached;

  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const theme = THEME_MAP[key] || THEME_MAP.espresso_copper;

  // 1. Studio Backdrop Gradient
  const bgGrad = ctx.createRadialGradient(
    width * 0.52,
    height * 0.44,
    width * 0.05,
    width * 0.5,
    height * 0.5,
    width * 0.78,
  );
  bgGrad.addColorStop(0, theme.bgSecondary);
  bgGrad.addColorStop(0.65, theme.bgPrimary);
  bgGrad.addColorStop(1, '#0E100F');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Architectural Diagonal Window Shadow Play (Leica / Editorial studio light)
  ctx.save();
  const beamGrad = ctx.createLinearGradient(0, 0, width * 0.85, height * 0.9);
  beamGrad.addColorStop(0, 'rgba(184, 117, 77, 0.16)');
  beamGrad.addColorStop(0.45, 'rgba(242, 235, 221, 0.05)');
  beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(width * 0.15, 0);
  ctx.lineTo(width * 0.68, 0);
  ctx.lineTo(width * 0.95, height);
  ctx.lineTo(width * 0.35, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. Travertine / Volcanic Stone Pedestal Surface at Bottom
  const tableY = height * 0.68;
  const surfaceGrad = ctx.createLinearGradient(0, tableY, 0, height);
  surfaceGrad.addColorStop(0, '#22211F');
  surfaceGrad.addColorStop(0.15, '#1B1B19');
  surfaceGrad.addColorStop(1, '#101110');
  ctx.fillStyle = surfaceGrad;
  ctx.fillRect(0, tableY, width, height - tableY);

  // Subtle horizon hairline
  ctx.strokeStyle = 'rgba(242, 235, 221, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, tableY);
  ctx.lineTo(width, tableY);
  ctx.stroke();

  const cx = width * 0.5;
  const cy = height * 0.52;

  // 4. Soft Contact Shadow on Pedestal
  const shadowGrad = ctx.createRadialGradient(
    cx,
    tableY + height * 0.04,
    width * 0.02,
    cx,
    tableY + height * 0.04,
    width * 0.28,
  );
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  shadowGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.28)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(cx, tableY + height * 0.04, width * 0.28, height * 0.055, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Domain-Specific Subject Composition
  ctx.save();
  if (
    theme.subjectType === 'interior_arch' ||
    theme.subjectType === 'atmosphere' ||
    theme.subjectType === 'gallery_lounge' ||
    theme.subjectType === 'gallery_table' ||
    theme.subjectType === 'moment'
  ) {
    // Architectural perspective arches, warm copper pendant lights, and volcanic stone columns
    const archCount = 3;
    for (let i = 0; i < archCount; i++) {
      const offset = (i - 1) * (width * 0.24);
      const archX = cx + offset;
      const archW = width * 0.18;
      const archTop = height * 0.22;

      ctx.strokeStyle = i === 1 ? 'rgba(184, 117, 77, 0.45)' : 'rgba(242, 235, 221, 0.14)';
      ctx.lineWidth = i === 1 ? 2 : 1.2;
      ctx.beginPath();
      ctx.arc(archX, archTop + archW * 0.5, archW * 0.5, Math.PI, 0, false);
      ctx.lineTo(archX + archW * 0.5, tableY);
      ctx.moveTo(archX - archW * 0.5, archTop + archW * 0.5);
      ctx.lineTo(archX - archW * 0.5, tableY);
      ctx.stroke();

      // Warm pendant lamp glow inside each arch
      const cordBottom = archTop + height * 0.14 + (i % 2) * 18;
      ctx.strokeStyle = 'rgba(242, 235, 221, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(archX, 0);
      ctx.lineTo(archX, cordBottom);
      ctx.stroke();

      const lampGlow = ctx.createRadialGradient(
        archX,
        cordBottom,
        2,
        archX,
        cordBottom,
        width * 0.12,
      );
      lampGlow.addColorStop(0, 'rgba(242, 235, 221, 0.95)');
      lampGlow.addColorStop(0.2, 'rgba(184, 117, 77, 0.55)');
      lampGlow.addColorStop(1, 'rgba(184, 117, 77, 0)');
      ctx.fillStyle = lampGlow;
      ctx.beginPath();
      ctx.arc(archX, cordBottom, width * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Foreground minimalist monolith table silhouette
    ctx.fillStyle = '#2A231E';
    ctx.fillRect(cx - width * 0.22, tableY - 12, width * 0.44, 14);
    ctx.fillStyle = '#1E1A17';
    ctx.fillRect(cx - width * 0.16, tableY + 2, width * 0.05, height * 0.12);
    ctx.fillRect(cx + width * 0.11, tableY + 2, width * 0.05, height * 0.12);
  } else if (
    theme.subjectType === 'espresso_copper' ||
    theme.subjectType === 'cold_brew_mist' ||
    theme.subjectType === 'matcha_stone' ||
    theme.subjectType === 'cascara_botanical' ||
    theme.subjectType === 'bar_craft' ||
    theme.subjectType === 'gallery_pour'
  ) {
    // Handcrafted Ceramic or Crystal Beverage Vessel on Volcanic Stone Coaster
    const cupW = width * 0.22;
    const cupH = height * 0.26;
    const cupTopY = tableY - cupH;

    // Coaster / Saucer
    ctx.fillStyle = '#2B2927';
    ctx.beginPath();
    ctx.ellipse(cx, tableY + 8, cupW * 0.82, height * 0.032, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(184, 117, 77, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cup Body
    const cupGrad = ctx.createLinearGradient(cx - cupW * 0.5, cupTopY, cx + cupW * 0.5, tableY);
    cupGrad.addColorStop(0, '#363432');
    cupGrad.addColorStop(0.35, theme.vesselColor);
    cupGrad.addColorStop(1, '#121312');
    ctx.fillStyle = cupGrad;

    ctx.beginPath();
    ctx.moveTo(cx - cupW * 0.5, cupTopY);
    ctx.lineTo(cx + cupW * 0.5, cupTopY);
    ctx.quadraticCurveTo(cx + cupW * 0.46, tableY + 4, cx + cupW * 0.32, tableY + 6);
    ctx.lineTo(cx - cupW * 0.32, tableY + 6);
    ctx.quadraticCurveTo(cx - cupW * 0.46, tableY + 4, cx - cupW * 0.5, cupTopY);
    ctx.closePath();
    ctx.fill();

    // Burnt copper metallic rim band
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, cupTopY, cupW * 0.5, height * 0.026, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Crema / Liquid Surface inside rim
    const cremaGrad = ctx.createRadialGradient(
      cx - cupW * 0.1,
      cupTopY,
      4,
      cx,
      cupTopY,
      cupW * 0.48,
    );
    cremaGrad.addColorStop(0, theme.highlight);
    cremaGrad.addColorStop(0.45, theme.accent);
    cremaGrad.addColorStop(1, '#241710');
    ctx.fillStyle = cremaGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cupTopY, cupW * 0.48, height * 0.024, 0, 0, Math.PI * 2);
    ctx.fill();

    // Delicate steam curves
    ctx.strokeStyle = 'rgba(242, 235, 221, 0.22)';
    ctx.lineWidth = 2;
    for (let s = -1; s <= 1; s++) {
      ctx.beginPath();
      const sx = cx + s * (cupW * 0.2);
      ctx.moveTo(sx, cupTopY - 12);
      ctx.bezierCurveTo(
        sx - 18,
        cupTopY - height * 0.09,
        sx + 20,
        cupTopY - height * 0.16,
        sx - 6,
        cupTopY - height * 0.24,
      );
      ctx.stroke();
    }
  } else {
    // High-End Culinary Stoneware Plating Study (Main Course, Light Bites, Dessert)
    const plateRx = width * 0.27;
    const plateRy = height * 0.095;
    const plateY = tableY - 6;

    // Outer ceramic rim
    const plateGrad = ctx.createRadialGradient(
      cx - plateRx * 0.2,
      plateY - 10,
      10,
      cx,
      plateY,
      plateRx,
    );
    plateGrad.addColorStop(0, '#353431');
    plateGrad.addColorStop(0.75, '#212220');
    plateGrad.addColorStop(1, '#141514');
    ctx.fillStyle = plateGrad;
    ctx.beginPath();
    ctx.ellipse(cx, plateY, plateRx, plateRy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(242, 235, 221, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner plating well
    ctx.beginPath();
    ctx.ellipse(cx, plateY, plateRx * 0.74, plateRy * 0.72, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(184, 117, 77, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Sauce reduction swoosh
    ctx.beginPath();
    ctx.arc(cx, plateY, plateRx * 0.48, 0.2, Math.PI * 1.15);
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Artisanal culinary centerpiece forms
    const foodGrad = ctx.createLinearGradient(
      cx - 60,
      plateY - 55,
      cx + 60,
      plateY + 10,
    );
    foodGrad.addColorStop(0, theme.highlight);
    foodGrad.addColorStop(0.5, theme.accent);
    foodGrad.addColorStop(1, '#2D1C12');
    ctx.fillStyle = foodGrad;

    const rx = cx - width * 0.09;
    const ry = plateY - height * 0.09;
    const rw = width * 0.18;
    const rh = height * 0.085;
    const rad = 16;
    ctx.beginPath();
    ctx.moveTo(rx + rad, ry);
    ctx.lineTo(rx + rw - rad, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
    ctx.lineTo(rx + rw, ry + rh - rad);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
    ctx.lineTo(rx + rad, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
    ctx.lineTo(rx, ry + rad);
    ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
    ctx.closePath();
    ctx.fill();

    // Micro-herb & garnish accents
    ctx.fillStyle = '#737766';
    ctx.beginPath();
    ctx.arc(cx - 24, plateY - height * 0.095, 7, 0, Math.PI * 2);
    ctx.arc(cx + 18, plateY - height * 0.085, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 6. Subtle Editorial Frame Hairline & Curated Typography Watermark in Corner
  ctx.strokeStyle = 'rgba(242, 235, 221, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Corner editorial registration marks
  ctx.fillStyle = 'rgba(242, 235, 221, 0.45)';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText('MALANG EDITION · STUDIO STUDY', 36, 44);

  ctx.fillStyle = 'rgba(184, 117, 77, 0.85)';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText(theme.label, 36, height - 48);

  ctx.fillStyle = 'rgba(242, 235, 221, 0.55)';
  ctx.font = '400 12px "Manrope", sans-serif';
  ctx.fillText(theme.subtitle, 36, height - 32);

  try {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    artCache.set(cacheKey, dataUrl);
    return dataUrl;
  } catch {
    return '';
  }
}
