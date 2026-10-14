export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorEmail?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

const STORAGE_KEY = "enviaar_product_reviews";
import { API_BASE_URL } from "@/config/api";

export const initialReviews: Review[] = [];

export function getLocalReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read reviews from localStorage", err);
    return [];
  }
}

export function saveLocalReviews(reviews: Review[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error("Failed to save reviews to localStorage", err);
  }
}

export function getReviewsForProduct(productId: string, allReviews: Review[]): Review[] {
  return allReviews.filter((r) => String(r.productId) === String(productId));
}

export async function fetchAllReviews(): Promise<Review[]> {
  const local = getLocalReviews();
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews`);
    if (res.ok) {
      const serverReviews = await res.json();
      if (Array.isArray(serverReviews) && serverReviews.length > 0) {
        // Merge & deduplicate by ID
        const seen = new Set<string>();
        const merged: Review[] = [];
        for (const r of [...serverReviews, ...local]) {
          if (r && r.id && !seen.has(String(r.id))) {
            seen.add(String(r.id));
            merged.push(r);
          }
        }
        saveLocalReviews(merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn("Express backend offline for reviews, using local storage");
  }
  return local;
}

export async function addProductReview(data: {
  productId: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  title: string;
  comment: string;
}): Promise<Review> {
  const newReview: Review = {
    id: `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    productId: String(data.productId),
    authorName: data.authorName.trim() || "Verified Buyer",
    authorEmail: data.authorEmail?.trim() || "",
    rating: Math.min(5, Math.max(1, data.rating || 5)),
    title: data.title.trim() || "Great Jewellery Piece",
    comment: data.comment.trim(),
    createdAt: new Date().toISOString().substring(0, 10),
    verifiedPurchase: true,
  };

  const current = getLocalReviews();
  const updated = [newReview, ...current];
  saveLocalReviews(updated);

  try {
    await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });
  } catch (e) {
    console.warn("Backend API offline when posting review");
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("enviaar_reviews_updated"));
  }

  return newReview;
}

export async function deleteProductReview(reviewId: string): Promise<boolean> {
  const current = getLocalReviews();
  const filtered = current.filter((r) => String(r.id) !== String(reviewId));
  saveLocalReviews(filtered);

  try {
    await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
  } catch (e) {
    console.warn("Backend API offline when deleting review");
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("enviaar_reviews_updated"));
  }

  return true;
}
