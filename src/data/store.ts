import hero from "@/assets/enviaar-hero.jpg";
import productsEditorial from "@/assets/enviaar-products.jpg";
import festive from "@/assets/enviaar-festive.jpg";
import mens from "@/assets/enviaar-men.jpg";
import type { CountryOption, Product } from "@/types/store";

export const images = { hero, productsEditorial, festive, mens };

export const supportedCountries: CountryOption[] = [
  { code: "IN", name: "India", currency: "INR", symbol: "₹", flag: "🇮🇳" },
  { code: "US", name: "United States", currency: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "AE", name: "Dubai / UAE", currency: "AED", symbol: "AED", flag: "🇦🇪" },
];

export function getConvertedPrice(
  amountInINR: number,
  country: CountryOption = supportedCountries[0]!,
  customPrices?: { priceUSD?: number | undefined; priceAED?: number | undefined } | undefined
): number {
  const num = Number(amountInINR) || 0;

  if (country.currency === "USD") {
    if (customPrices?.priceUSD && customPrices.priceUSD > 0) {
      return customPrices.priceUSD;
    }
    return Math.round(num * 0.012); // Exchange rate: ~83.3 INR = 1 USD
  }

  if (country.currency === "AED") {
    if (customPrices?.priceAED && customPrices.priceAED > 0) {
      return customPrices.priceAED;
    }
    return Math.round(num * 0.044); // Exchange rate: ~22.7 INR = 1 AED
  }

  return num;
}

export function formatPrice(
  amountInINR: number,
  country: CountryOption = supportedCountries[0]!,
  customPrices?: { priceUSD?: number | undefined; priceAED?: number | undefined } | undefined
): string {
  const finalPrice = getConvertedPrice(amountInINR, country, customPrices);

  if (country.currency === "USD") {
    return `$${finalPrice.toLocaleString("en-US")}`;
  }

  if (country.currency === "AED") {
    return `AED ${finalPrice.toLocaleString("en-AE")}`;
  }

  return `₹${finalPrice.toLocaleString("en-IN")}`;
}

export const money = (
  value: number,
  country: CountryOption = supportedCountries[0]!,
  customPrices?: { priceUSD?: number | undefined; priceAED?: number | undefined } | undefined
) => formatPrice(value, country, customPrices);

const catalogue: Omit<Product, "id" | "description" | "rating">[] = [
  {
    slug: "aurelia-drop-earrings",
    name: "Aurelia Drop Earrings",
    category: "earrings",
    subcategory: "Danglers",
    material: "92.5 Silver",
    finish: "18K Gold Plated",
    price: 3490,
    image: festive,
    alternateImage: productsEditorial,
    badge: "NEW",
    colors: ["Gold", "Silver"],
  },
  {
    slug: "mira-pearl-studs",
    name: "Mira Pearl Studs",
    category: "earrings",
    subcategory: "Studs",
    material: "Hypoallergenic",
    finish: "Gold Plated",
    price: 1890,
    image: productsEditorial,
    alternateImage: hero,
    colors: ["Gold", "Rose Gold"],
  },
  {
    slug: "elara-necklace",
    name: "Elara Necklace Set",
    category: "necklaces",
    subcategory: "Heavy Necklace Sets",
    material: "Premium Alloy",
    finish: "22K Gold Plated",
    price: 7490,
    image: hero,
    alternateImage: festive,
    badge: "BESTSELLER",
    colors: ["Gold"],
  },
  {
    slug: "noor-pendant",
    name: "Noor Pendant Chain",
    category: "necklaces",
    subcategory: "Pendant Chains",
    material: "92.5 Silver",
    finish: "Rhodium Plated",
    price: 2990,
    image: productsEditorial,
    alternateImage: hero,
    badge: "925 SILVER",
    colors: ["Silver", "Rose Gold"],
  },
  {
    slug: "solene-bracelet",
    name: "Solène Tennis Bracelet",
    category: "bracelets",
    subcategory: "Bracelets",
    material: "Anti-Tarnish",
    finish: "Rhodium Plated",
    price: 4290,
    image: productsEditorial,
    alternateImage: mens,
    badge: "BESTSELLER",
    colors: ["Silver", "Gold"],
    sizes: ["S", "M", "L"],
  },
  {
    slug: "amaara-ring",
    name: "Amaara Cocktail Ring",
    category: "rings",
    subcategory: "Rings",
    material: "92.5 Silver",
    finish: "18K Gold Plated",
    price: 2790,
    image: productsEditorial,
    alternateImage: festive,
    badge: "NEW",
    colors: ["Gold", "Rose Gold"],
    sizes: ["6", "7", "8", "9"],
  },
  {
    slug: "tara-kada",
    name: "Tara Sculpted Kada",
    category: "kada",
    subcategory: "Kada",
    material: "Anti-Tarnish",
    finish: "22K Gold Plated",
    price: 3890,
    image: productsEditorial,
    alternateImage: hero,
    colors: ["Gold"],
    sizes: ["2.4", "2.6", "2.8"],
  },
  {
    slug: "avni-mangalsutra",
    name: "Avni Everyday Mangalsutra",
    category: "mangalsutra",
    subcategory: "Mangalsutra",
    material: "92.5 Silver",
    finish: "18K Gold Plated",
    price: 4590,
    image: productsEditorial,
    alternateImage: hero,
    badge: "NEW",
    colors: ["Gold"],
  },
  {
    slug: "veer-cuff",
    name: "Veer Minimal Cuff",
    category: "mens",
    subcategory: "Men’s Jewellery",
    material: "Stainless Steel",
    finish: "Gold Plated",
    price: 2490,
    image: mens,
    alternateImage: productsEditorial,
    badge: "NEW",
    colors: ["Gold", "Silver"],
    sizes: ["M", "L"],
  },
  {
    slug: "arjun-signet",
    name: "Arjun Signet Ring",
    category: "mens",
    subcategory: "Rings",
    material: "92.5 Silver",
    finish: "Rhodium Plated",
    price: 3290,
    image: mens,
    alternateImage: productsEditorial,
    colors: ["Silver", "Gold"],
    sizes: ["8", "9", "10"],
  },
  {
    slug: "gul-brooch",
    name: "Gul Heirloom Brooch",
    category: "brooches",
    subcategory: "Brooches",
    material: "Premium Alloy",
    finish: "Gold Plated",
    price: 2690,
    image: festive,
    alternateImage: productsEditorial,
    colors: ["Gold"],
  },
  {
    slug: "little-star-kada",
    name: "Little Star Baby Kada",
    category: "baby",
    subcategory: "Baby Jewellery",
    material: "92.5 Silver",
    finish: "Rhodium Plated",
    price: 1990,
    image: productsEditorial,
    alternateImage: hero,
    badge: "925 SILVER",
    colors: ["Silver"],
  },
];

export const products: Product[] = catalogue.map((product, index) => ({
  ...product,
  id: String(index + 1),
  description:
    "A refined ENVIAAR piece made for effortless transitions from everyday moments to occasions worth remembering.",
  rating: 4.8,
}));

export const collectionInfo: Record<string, { title: string; copy: string; image: string }> = {
  shop: {
    title: "Shop All",
    copy: "Jewellery for every chapter, chosen by you.",
    image: productsEditorial,
  },
  earrings: { title: "Earrings", copy: "Details that complete the story.", image: festive },
  bracelets: {
    title: "Bracelets",
    copy: "A quiet statement at every gesture.",
    image: productsEditorial,
  },
  necklaces: {
    title: "Necklaces & Pendant Sets",
    copy: "Pieces that frame every occasion.",
    image: hero,
  },
  rings: {
    title: "Rings",
    copy: "Small signatures, beautifully considered.",
    image: productsEditorial,
  },
  kada: { title: "Kada", copy: "Tradition, reimagined for now.", image: productsEditorial },
  mangalsutra: {
    title: "Mangalsutra",
    copy: "Modern symbols of enduring connection.",
    image: hero,
  },
  mens: {
    title: "Men’s Jewellery",
    copy: "Understated pieces with lasting character.",
    image: mens,
  },
  brooches: { title: "Brooches", copy: "An elegant finishing touch.", image: festive },
  baby: {
    title: "Baby Jewellery",
    copy: "Little keepsakes, made with care.",
    image: productsEditorial,
  },
  festive: {
    title: "The Festive Edit",
    copy: "Statement pieces for everything worth remembering.",
    image: festive,
  },
  "new-arrivals": {
    title: "New Arrivals",
    copy: "The newest expressions of ENVIAAR.",
    image: hero,
  },
  bestsellers: {
    title: "Bestsellers",
    copy: "The pieces our community returns to.",
    image: productsEditorial,
  },
};
