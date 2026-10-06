export type MediaItem = {
  id: string;
  url: string;
  type: "image" | "video";
};

export type CurrencyCode = "INR" | "USD" | "AED";

export type CountryOption = {
  code: "IN" | "US" | "AE";
  name: string;
  currency: CurrencyCode;
  symbol: string;
  flag: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  material: string;
  finish: string;
  price: number; // Base price in INR
  priceUSD?: number | undefined; // Optional custom USD price override
  priceAED?: number | undefined; // Optional custom AED price override
  image: string;
  alternateImage: string;
  media?: MediaItem[] | undefined;
  badge?: "NEW" | "BESTSELLER" | "925 SILVER" | undefined;
  colors: string[];
  sizes?: string[] | undefined;
  description: string;
  rating: number;
};

export type CartItem = { product: Product; quantity: number; finish: string; size?: string | undefined };

