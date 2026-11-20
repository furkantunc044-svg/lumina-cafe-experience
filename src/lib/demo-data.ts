import { AllergenKey, Category, DemoOrder, Product, Venue } from "./types";

export const ALLERGEN_LABELS: Record<AllergenKey, { label: string; short: string }> = {
  sut: { label: "Süt & Laktoz", short: "Süt" },
  gluten: { label: "Gluten", short: "Gluten" },
  yumurta: { label: "Yumurta", short: "Yumurta" },
  findik: { label: "Sert Kabuklu Yemiş", short: "Fındık" },
  soya: { label: "Soya", short: "Soya" },
};

export const DEMO_VENUE: Venue = {
  id: "venue-lumina-01",
  name: "Lumina Coffee & Bistro",
  slug: "lumina",
  tagline: "Artisan Roastery & Modern Kitchen",
  address: "Moda Caddesi No: 42, Kadıköy / İstanbul",
  primary_color: "#D9A05B",
  accent_color: "#F3C78A",
  google_review_url: "https://g.page/r/lumina-coffee-bistro-demo/review",
  instagram_url: "https://instagram.com",
  tiktok_url: "https://tiktok.com",
  spotify_url: "https://open.spotify.com",
};

export const DEMO_CATEGORIES: Category[] = [
  {
    id: "cat-coffee",
    venue_id: DEMO_VENUE.id,
    name: "İmza Kahveler",
    subtitle: "Özel kavrum çekirdekler",
    sort_order: 1,
  },
  {
    id: "cat-dessert",
    venue_id: DEMO_VENUE.id,
    name: "Tatlılar",
    subtitle: "Günlük taze pastane",
    sort_order: 2,
  },
  {
    id: "cat-main",
    venue_id: DEMO_VENUE.id,
    name: "Ana Yemekler",
    subtitle: "Şefin sıcak mutfağı",
    sort_order: 3,
  },
  {
    id: "cat-cold",
    venue_id: DEMO_VENUE.id,
    name: "Soğuk İçecekler",
    subtitle: "Ferahlatıcı karışımlar",
    sort_order: 4,
  },
];

export const DEMO_PRODUCTS: Product[] = [
  // İmza Kahveler
  {
    id: "prod-latte",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-coffee",
    name: "Lumina Signature Latte",
    description:
      "Çift shot Etiyopya Yirgacheffe espresso, kadifemsi mikroköpük süt ve ev yapımı Madagascar vanilya dokunuşu.",
    price: 165,
    prep_time: "4 dk",
    media_url:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
    motion_style: "zoom",
    allergens: ["sut"],
    paired_product_id: "prod-sansebastian",
    pairing_note:
      "Baristanın Eşleştirmesi: Bu kahvenin yumuşak vanilya notalarını en iyi akışkan San Sebastian Cheesecake tamamlar.",
    badge: "En Çok Tercih Edilen",
    calories: "190 kcal",
  },
  {
    id: "prod-v60",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-coffee",
    name: "V60 Pour Over (Colombia)",
    description:
      "El yapımı demleme. Karamel, kırmızı meyveler ve hafif narenciye asiditesiyle berrak bir içim.",
    price: 175,
    prep_time: "6 dk",
    media_url:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    motion_style: "pan",
    allergens: [],
    paired_product_id: "prod-croissant",
    pairing_note:
      "Baristanın Eşleştirmesi: V60'ın meyvemsi notaları, fırından yeni çıkan tereyağlı Taze Kruvasan ile kusursuz dengelenir.",
    badge: "Single Origin",
    calories: "5 kcal",
  },
  {
    id: "prod-cortado",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-coffee",
    name: "Amber Honey Cortado",
    description:
      "Yoğun double ristretto, eşit oranda ipeksi süt ve organik kestane balı ile dengelenmiş güçlü karakter.",
    price: 155,
    prep_time: "3 dk",
    media_url:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    motion_style: "float",
    allergens: ["sut"],
    paired_product_id: "prod-tiramisu",
    pairing_note:
      "Baristanın Eşleştirmesi: Yoğun ristretto aroması, mascarpone kremalı Lumina Tiramisu ile harika bir ikili oluşturur.",
    calories: "120 kcal",
  },

  // Tatlılar
  {
    id: "prod-sansebastian",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-dessert",
    name: "San Sebastian Cheesecake",
    description:
      "Dışı karamelize, içi akışkan klasik Bask cheesecake. Yanında sıcak Belçika sütlü çikolata sosu ile servis edilir.",
    price: 240,
    prep_time: "3 dk",
    media_url:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
    motion_style: "zoom",
    allergens: ["sut", "yumurta", "gluten"],
    paired_product_id: "prod-latte",
    pairing_note:
      "Tatlı Eşleştirmesi: Akışkan dokusunu Lumina Signature Latte'nin yumuşak içimiyle taçlandırın.",
    badge: "Şefin İmzası",
    calories: "460 kcal",
  },
  {
    id: "prod-croissant",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-dessert",
    name: "Taze Fransız Kruvasan",
    description:
      "72 saat soğuk fermantasyon, %100 Fransız tereyağı ile kat kat çıtır dokulu fırından taze kruvasan.",
    price: 145,
    prep_time: "2 dk",
    media_url:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
    motion_style: "pan",
    allergens: ["gluten", "sut", "yumurta"],
    paired_product_id: "prod-v60",
    pairing_note:
      "Sabah Ritüeli: Tereyağlı çıtır katmanlar V60 Pour Over ile en iyi uyumu yakalar.",
    calories: "310 kcal",
  },
  {
    id: "prod-tiramisu",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-dessert",
    name: "Lumina Artisan Tiramisu",
    description:
      "Kendi espresso harmanımızla ıslatılmış kedi dili, İtalyan mascarpone kreması ve bitter kakao.",
    price: 225,
    prep_time: "3 dk",
    media_url:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80",
    motion_style: "float",
    allergens: ["sut", "yumurta", "gluten"],
    paired_product_id: "prod-cortado",
    pairing_note:
      "Baristanın Önerisi: Amber Honey Cortado ile kakao notalarını öne çıkarın.",
    calories: "380 kcal",
  },

  // Ana Yemekler
  {
    id: "prod-burger",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-main",
    name: "Lumina Trüf Smash Burger",
    description:
      "Çift 90g dry-aged dana köfte, eritilmiş cheddar, karamelize soğan, trüflü aioli sos ve brioche ekmek. Trüflü patates ile.",
    price: 390,
    prep_time: "14 dk",
    media_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    motion_style: "zoom",
    allergens: ["gluten", "sut", "yumurta"],
    paired_product_id: "prod-lemonade",
    pairing_note:
      "Şefin Eşleştirmesi: Trüf ve cheddar yoğunluğunu Ev Yapımı Naneli Limonata ile ferahlatın.",
    badge: "Çok Satan",
    calories: "740 kcal",
  },
  {
    id: "prod-avocado",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-main",
    name: "Poşe Yumurtalı Avokado Tost",
    description:
      "Ekşi mayalı artisan ekmek üzerinde ezilmiş avokado, iki adet organik poşe yumurta, mikro filizler ve chili yağı.",
    price: 295,
    prep_time: "10 dk",
    media_url:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    motion_style: "pan",
    allergens: ["gluten", "yumurta"],
    paired_product_id: "prod-matcha",
    pairing_note:
      "Sağlıklı Eşleşme: Buzlu Ceremonial Matcha Latte ile enerjinizi dengede tutun.",
    calories: "490 kcal",
  },

  // Soğuk İçecekler
  {
    id: "prod-lemonade",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-cold",
    name: "Ev Yapımı Naneli Limonata",
    description:
      "Taze sıkılmış Bodrum limonu, bahçe nanesi, hafif zencefil infüzyonu ve kırık buz.",
    price: 135,
    prep_time: "3 dk",
    media_url:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
    motion_style: "float",
    allergens: [],
    paired_product_id: "prod-burger",
    pairing_note:
      "Mükemmel İkili: Lumina Trüf Smash Burger ile harika bir denge kurar.",
    calories: "95 kcal",
  },
  {
    id: "prod-matcha",
    venue_id: DEMO_VENUE.id,
    category_id: "cat-cold",
    name: "Iced Ceremonial Matcha",
    description:
      "Japonya Uji bölgesi birinci sınıf ceremonial matcha, yulaf sütü ve hafif akçaağaç şurubu.",
    price: 185,
    prep_time: "4 dk",
    media_url:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80",
    motion_style: "zoom",
    allergens: ["soya"],
    paired_product_id: "prod-avocado",
    pairing_note:
      "Baristanın Eşleştirmesi: Poşe Yumurtalı Avokado Tost ile günün en taze eşleşmesi.",
    badge: "Vegan Seçenek",
    calories: "110 kcal",
  },
];

export const INITIAL_DEMO_ORDER: DemoOrder = {
  id: "order-masa-12",
  venue_id: DEMO_VENUE.id,
  table_number: 12,
  items: [
    { id: "oi-1", product_id: "prod-latte", name: "Lumina Signature Latte", price: 165, is_paid: false },
    { id: "oi-2", product_id: "prod-latte", name: "Lumina Signature Latte", price: 165, is_paid: false },
    { id: "oi-3", product_id: "prod-sansebastian", name: "San Sebastian Cheesecake", price: 240, is_paid: false },
    { id: "oi-4", product_id: "prod-burger", name: "Lumina Trüf Smash Burger", price: 390, is_paid: false },
    { id: "oi-5", product_id: "prod-lemonade", name: "Ev Yapımı Naneli Limonata", price: 135, is_paid: false },
  ],
  total_amount: 1095,
};

export function getVenueBySlug(slug: string): Venue {
  if (slug === DEMO_VENUE.slug) return DEMO_VENUE;
  return {
    ...DEMO_VENUE,
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1) + " Coffee & Bistro",
  };
}

export function getProductById(id?: string): Product | undefined {
  if (!id) return undefined;
  return DEMO_PRODUCTS.find((p) => p.id === id);
}
