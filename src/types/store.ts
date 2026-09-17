export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  material: string;
  finish: string;
  price: number;
  image: string;
  alternateImage: string;
  badge?: "NEW" | "BESTSELLER" | "925 SILVER";
  colors: string[];
  sizes?: string[];
  description: string;
  rating: number;
};

export type CartItem = { product: Product; quantity: number; finish: string; size?: string };
