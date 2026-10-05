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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (quotaErr) {
      const trimmed = updated.map((p, idx) =>
        idx === 0
          ? p
          : {
              ...p,
              media: undefined,
              alternateImage:
                p.alternateImage && p.alternateImage.startsWith("data:") ? "" : p.alternateImage,
            },
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
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
