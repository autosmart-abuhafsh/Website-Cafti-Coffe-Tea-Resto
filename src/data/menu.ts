export type MenuCategory =
  | 'All'
  | 'Coffee'
  | 'Non-Coffee'
  | 'Main Course'
  | 'Light Bites'
  | 'Dessert';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  shortDescription: string;
  fullDescription: string;
  priceFormatted: string;
  priceNumeric: number;
  servingTemp: string;
  tastingNotes: string[];
  pairingSuggestion: string;
  artStyle:
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
    | 'hojicha_tart';
  isSignature?: boolean;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  'All',
  'Coffee',
  'Non-Coffee',
  'Main Course',
  'Light Bites',
  'Dessert',
];

// Catatan sesuai PRD Bagian 8:
// Data berikut merupakan data demonstrasi/contoh terstruktur yang mudah diedit pemilik bisnis.
export const MENU_DEMO_DISCLAIMER =
  'Daftar menu dan harga di bawah ini adalah data demonstrasi contoh desain (Contoh Katalog) yang dapat disesuaikan sepenuhnya melalui src/data/menu.ts.';

export const menuItems: MenuItem[] = [
  {
    id: 'coffee-01',
    name: 'Arjuna Mist Dirty Latte (Contoh)',
    category: 'Coffee',
    shortDescription:
      'Double ristretto arabika dataran tinggi di atas susu dingin bertekstur silky dengan sentuhan gula aren organik.',
    fullDescription:
      'Komposisi berlapis antara susu dingin yang dikocok perlahan dengan double shot ristretto hangat di permukaan. Menghadirkan kontras suhu hangat-dingin dengan karakter cokelat hitam, karamel lembut, dan aftertaste bersih.',
    priceFormatted: 'Rp 38.000',
    priceNumeric: 38000,
    servingTemp: 'Chilled Glass · Layered Hot Shot',
    tastingNotes: ['Dark Cocoa', 'Toasted Hazelnut', 'Palm Nectar'],
    pairingSuggestion: 'Smoked Butter Croissant atau Brioche Toast',
    artStyle: 'espresso_copper',
    isSignature: true,
  },
  {
    id: 'coffee-02',
    name: 'Volcanic Smoked Cold Brew (Contoh)',
    category: 'Coffee',
    shortDescription:
      'Cold brew ekstraksi 18 jam dengan infusi aroma kayu manis bakar dan kulit jeruk segar.',
    fullDescription:
      'Diekstraksi perlahan selama 18 jam menggunakan air mineral terfiltrasi, kemudian disajikan di atas es batu kristal besar dengan sentuhan kayu manis panggang dan zest jeruk sunkist.',
    priceFormatted: 'Rp 42.000',
    priceNumeric: 42000,
    servingTemp: 'Over Crystal Ice',
    tastingNotes: ['Bright Citrus', 'Cinnamon Bark', 'Velvet Finish'],
    pairingSuggestion: 'Dark Chocolate Ganache Tart',
    artStyle: 'cold_brew_mist',
    isSignature: true,
  },
  {
    id: 'non-coffee-01',
    name: 'Uji Ceremonial Matcha Cloud (Contoh)',
    category: 'Non-Coffee',
    shortDescription:
      'Matcha ceremonial grade whisked hangat di atas susu oat dingin dan sea-salt cream tipis.',
    fullDescription:
      'Menggunakan bubuk teh hijau ceremonial pilihan yang dikocok menggunakan chasen bambu hingga menghasilkan micro-foam lembut, dipadukan dengan oat milk ringan serta lapisan krim gurih.',
    priceFormatted: 'Rp 44.000',
    priceNumeric: 44000,
    servingTemp: 'Iced / Warm',
    tastingNotes: ['Umami Green Tea', 'Creamy Oat', 'Subtle Sea Salt'],
    pairingSuggestion: 'Hojicha Basque Cheesecake',
    artStyle: 'matcha_stone',
  },
  {
    id: 'non-coffee-02',
    name: 'Highland Cascara & Rosella Tea (Contoh)',
    category: 'Non-Coffee',
    shortDescription:
      'Seduhan kulit ceri kopi kering dengan kelopak rosella merah, madu hutan, dan daun mint.',
    fullDescription:
      'Minuman botanikal segar yang menggabungkan manis alami kulit buah kopi (cascara) dari lereng pegunungan dengan keasaman elegan bunga rosella dan madu murni.',
    priceFormatted: 'Rp 36.000',
    priceNumeric: 36000,
    servingTemp: 'Artisanal Glass Carafe',
    tastingNotes: ['Dried Cherry', 'Hibiscus Floral', 'Wildflower Honey'],
    pairingSuggestion: 'Truffle Parmesan Pommes Frites',
    artStyle: 'cascara_botanical',
  },
  {
    id: 'main-01',
    name: 'Charcoal-Seared Beef Striploin & Jus (Contoh)',
    category: 'Main Course',
    shortDescription:
      'Potongan striploin panggang arang dengan potato mousseline lembut, jamur tiram raja, dan saus demi-glace.',
    fullDescription:
      'Daging sapi pilihan yang dipanggang di atas bara untuk mengunci sari daging, disajikan bersama kentang tumbuk bertekstur lembut, king oyster mushroom panggang mentega herbal, dan reduksi jus kaldu.',
    priceFormatted: 'Rp 128.000',
    priceNumeric: 128000,
    servingTemp: 'Warm Stoneware Plate',
    tastingNotes: ['Smoky Umami', 'Herb Butter', 'Velvety Potato'],
    pairingSuggestion: 'Volcanic Smoked Cold Brew',
    artStyle: 'wagyu_truffle',
    isSignature: true,
  },
  {
    id: 'main-02',
    name: 'Pan-Seared Salmon & Herb Risotto (Contoh)',
    category: 'Main Course',
    shortDescription:
      'Fillet salmon berkulit renyah di atas arborio risotto kaldu rempah, edamame, dan lemon-dill oil.',
    fullDescription:
      'Salmon yang dimasak perlahan hingga bagian kulit garing keemasan sementara dagingnya tetap lembut, disandingkan dengan risotto beras Italia yang dimasak perlahan bersama parmesan dan daun dill.',
    priceFormatted: 'Rp 115.000',
    priceNumeric: 115000,
    servingTemp: 'Warm Deep Bowl',
    tastingNotes: ['Crispy Skin', 'Zesty Dill', 'Aged Parmigiano'],
    pairingSuggestion: 'Highland Cascara & Rosella Tea',
    artStyle: 'salmon_risotto',
  },
  {
    id: 'main-03',
    name: 'Spiced Duck Leg Confit & Orange Glaze (Contoh)',
    category: 'Main Course',
    shortDescription:
      'Paha bebek confit masak lambat 8 jam dengan saus reduksi jeruk rempah dan baby carrots panggang.',
    fullDescription:
      'Teknik memasak klasik dengan suhu rendah hingga tekstur daging sangat empuk dan kulit renyah, diberi sentuhan saus reduksi citrus dan rempah Nusantara yang hangat.',
    priceFormatted: 'Rp 108.000',
    priceNumeric: 108000,
    servingTemp: 'Warm Ceramic Plate',
    tastingNotes: ['Crisp Savory', 'Warm Spices', 'Caramelized Citrus'],
    pairingSuggestion: 'Arjuna Mist Dirty Latte',
    artStyle: 'duck_confit',
  },
  {
    id: 'bites-01',
    name: 'Truffle & Grana Padano Pommes Frites (Contoh)',
    category: 'Light Bites',
    shortDescription:
      'Kentang potong tangan goreng garing dengan minyak truffle putih, parutan keju Grana Padano, dan rosemary.',
    fullDescription:
      'Camilan hangat yang cocok untuk berbagi di meja. Kentang pilihan digoreng dua tahap agar renyah di luar dan lembut di dalam, ditaburi rosemary segar dan disajikan dengan saus aioli bawang putih panggang.',
    priceFormatted: 'Rp 48.000',
    priceNumeric: 48000,
    servingTemp: 'Hot Sharing Bowl',
    tastingNotes: ['Earthy Truffle', 'Crisp Rosemary', 'Roasted Garlic Aioli'],
    pairingSuggestion: 'Semua varian Coffee & Non-Coffee',
    artStyle: 'truffle_fries',
  },
  {
    id: 'bites-02',
    name: 'Artisanal Mushroom & Ricotta Tartine (Contoh)',
    category: 'Light Bites',
    shortDescription:
      'Roti sourdough panggang dengan olesan ricotta lembut, tumisan jamur hutan, dan balsamic glaze.',
    fullDescription:
      'Potongan tebal roti sourdough fermentasi alami yang dipanggang dengan minyak zaitun, diberi lapisan keju ricotta kocok, campuran jamur tumis thyme, dan tetesan cuka balsamik tua.',
    priceFormatted: 'Rp 54.000',
    priceNumeric: 54000,
    servingTemp: 'Warm Wooden / Stone Board',
    tastingNotes: ['Crusty Sourdough', 'Creamy Ricotta', 'Savory Thyme'],
    pairingSuggestion: 'Arjuna Mist Dirty Latte',
    artStyle: 'brioche_toast',
  },
  {
    id: 'dessert-01',
    name: 'Espresso Mascarpone Volcanic Tiramisu (Contoh)',
    category: 'Dessert',
    shortDescription:
      'Lapisan savoiardi rendaman single-origin espresso, krim mascarpone ringan, dan taburan dark cocoa.',
    fullDescription:
      'Interpretasi modern tiramisu klasik dengan keseimbangan rasa pahit-manis dari espresso house blend kami, krim mascarpone yang ringan, serta taburan bubuk kakao gelap yang menyerupai debu vulkanik.',
    priceFormatted: 'Rp 56.000',
    priceNumeric: 56000,
    servingTemp: 'Chilled Ceramic Vessel',
    tastingNotes: ['Rich Espresso', 'Velvet Mascarpone', '70% Dark Cacao'],
    pairingSuggestion: 'Double Espresso atau Manual Brew V60',
    artStyle: 'tiramisu_volcanic',
    isSignature: true,
  },
  {
    id: 'dessert-02',
    name: 'Roasted Hojicha & Caramelized Basque Tart (Contoh)',
    category: 'Dessert',
    shortDescription:
      'Cheesecake panggang beraroma teh hijau sangrai (hojicha) dengan bagian tengah lembut dan permukaan karamel.',
    fullDescription:
      'Perpaduan tekstur lembut di bagian tengah dengan aroma smoky khas teh hojicha panggang Jepang, disajikan dengan saus karamel garam laut dan crumble kacang almond.',
    priceFormatted: 'Rp 52.000',
    priceNumeric: 52000,
    servingTemp: 'Chilled / Room Temp',
    tastingNotes: ['Roasted Tea', 'Burnt Caramel', 'Toasted Almond'],
    pairingSuggestion: 'Uji Ceremonial Matcha Cloud',
    artStyle: 'hojicha_tart',
  },
];
