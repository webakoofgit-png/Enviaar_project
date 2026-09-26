import type { Product } from "@/types/store";

const STORAGE_KEY = "enviaar_custom_products";

export function getCustomProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read custom products from localStorage", err);
    return [];
  }
}

export function saveCustomProduct(product: Product): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getCustomProducts();
    const filtered = current.filter((p) => String(p.id) !== String(product.id));
    const updated = [product, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save custom product to localStorage", err);
    return [];
  }
}

export function removeCustomProducts(ids: (string | number)[]): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const idSet = new Set(ids.map(String));
    const current = getCustomProducts();
    const updated = current.filter((p) => !idSet.has(String(p.id)));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to remove custom products from localStorage", err);
    return [];
  }
}
