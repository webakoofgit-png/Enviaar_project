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

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80";

function sanitizeForStorage(p: Product): Product {
  const isBase64 = (url?: string) => typeof url === "string" && url.startsWith("data:");
  return {
    ...p,
    image: isBase64(p.image) && p.image.length > 3000 ? DEFAULT_FALLBACK_IMAGE : p.image,
    alternateImage: isBase64(p.alternateImage) && p.alternateImage.length > 3000 ? "" : p.alternateImage,
    media: p.media
      ? p.media.map((m) => ({
          ...m,
          url: isBase64(m.url) && m.url.length > 3000 ? DEFAULT_FALLBACK_IMAGE : m.url,
        }))
      : undefined,
  };
}

export function unmarkProductAsDeleted(nameOrId: { id?: string | number; name?: string }): void {
  if (typeof window === "undefined" || !nameOrId) return;
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const ids = new Set((parsed.ids || []).map(String));
    const names = new Set((parsed.names || []).map((n: string) => String(n).toLowerCase().trim()));

    if (nameOrId.id != null) ids.delete(String(nameOrId.id));
    if (nameOrId.name) names.delete(nameOrId.name.toLowerCase().trim());

    localStorage.setItem(
      DELETED_KEY,
      JSON.stringify({
        ids: Array.from(ids),
        names: Array.from(names),
      }),
    );
  } catch (err) {
    console.error("Failed to unmark product as deleted:", err);
  }
}

export function saveCustomProduct(product: Product): Product[] {
  if (typeof window === "undefined") return [];
  try {
    // Unmark as deleted in case a deleted key exists for this product name/ID
    unmarkProductAsDeleted(product);

    const current = getCustomProducts();
    const filtered = current.filter((p) => String(p.id) !== String(product.id));
    const updated = [product, ...filtered];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (quotaErr) {
      console.warn("localStorage quota hit, saving sanitized lightweight products");
      const sanitizedList = updated.map(sanitizeForStorage);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedList));
      } catch (e2) {
        // Keep only top 10 products if storage is severely constrained
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedList.slice(0, 10)));
      }
    }
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

const DELETED_KEY = "enviaar_deleted_product_keys";

export function getDeletedKeys(): { ids: Set<string>; names: Set<string> } {
  if (typeof window === "undefined") return { ids: new Set(), names: new Set() };
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    if (!raw) return { ids: new Set(), names: new Set() };
    const parsed = JSON.parse(raw);
    return {
      ids: new Set((parsed.ids || []).map(String)),
      names: new Set((parsed.names || []).map((n: string) => String(n).toLowerCase().trim())),
    };
  } catch {
    return { ids: new Set(), names: new Set() };
  }
}

export function markProductsAsDeleted(items: { id?: string | number; name?: string }[]): void {
  if (typeof window === "undefined" || !items || items.length === 0) return;
  try {
    const current = getDeletedKeys();
    items.forEach((item) => {
      if (item.id != null) current.ids.add(String(item.id));
      if (item.name) current.names.add(item.name.toLowerCase().trim());
    });
    localStorage.setItem(
      DELETED_KEY,
      JSON.stringify({
        ids: Array.from(current.ids),
        names: Array.from(current.names),
      }),
    );
  } catch (err) {
    console.error("Failed to mark products as deleted:", err);
  }
}

export function filterDeletedProducts<T extends { id?: string | number; name?: string }>(
  items: T[],
): T[] {
  const { ids, names } = getDeletedKeys();
  if (ids.size === 0 && names.size === 0) return items;
  return items.filter((item) => {
    if (!item) return false;
    if (item.id != null && ids.has(String(item.id))) return false;
    if (item.name && names.has(item.name.toLowerCase().trim())) return false;
    return true;
  });
}
