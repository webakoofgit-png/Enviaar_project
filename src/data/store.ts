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
    return Math.round(num * 0.01038 * 100) / 100; // Exchange rate: 1 INR = 0.01038 USD (e.g. ₹4,000 = $41.52)
  }

  if (country.currency === "AED") {
    if (customPrices?.priceAED && customPrices.priceAED > 0) {
      return customPrices.priceAED;
    }
    return Math.round(num * 0.03816 * 100) / 100; // Exchange rate: 1 INR = 0.03816 AED (e.g. ₹4,000 = AED 152.64)
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
    return `$${finalPrice.toLocaleString("en-US", { minimumFractionDigits: finalPrice % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;
  }

  if (country.currency === "AED") {
    return `AED ${finalPrice.toLocaleString("en-AE", { minimumFractionDigits: finalPrice % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;
  }

  return `₹${finalPrice.toLocaleString("en-IN")}`;
}

export const money = (
  value: number,
  country: CountryOption = supportedCountries[0]!,
  customPrices?: { priceUSD?: number | undefined; priceAED?: number | undefined } | undefined
) => formatPrice(value, country, customPrices);

const catalogue: Omit<Product, "id" | "description" | "rating">[] = [];

export const products: Product[] = [];

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
