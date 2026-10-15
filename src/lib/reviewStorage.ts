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

export const DUMMY_REVIEW_IDS = new Set(["rev_101", "rev_102", "rev_103", "rev_104"]);
export const DUMMY_AUTHORS = new Set(["ananya sharma", "rohan v.", "priya kapoor", "meera nair"]);

export function isDummyReview(r: any): boolean {
  if (!r) return true;
  if (DUMMY_REVIEW_IDS.has(String(r.id))) return true;
  if (DUMMY_AUTHORS.has(String(r.authorName || "").trim().toLowerCase())) return true;
  return false;
}

export function getLocalReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => !isDummyReview(r));
  } catch (err) {
    console.error("Failed to read reviews from localStorage", err);
    return [];
  }
}

export function saveLocalReviews(reviews: Review[]): void {
  if (typeof window === "undefined") return;
  try {
    const clean = (reviews || []).filter((r) => !isDummyReview(r));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch (err) {
    console.error("Failed to save reviews to localStorage", err);
  }
}

export function getReviewsForProduct(productId: string, allReviews: Review[]): Review[] {
  return allReviews.filter((r) => String(r.productId) === String(productId) && !isDummyReview(r));
}

export async function fetchAllReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews`);
    if (res.ok) {
      const serverReviews = await res.json();
      if (Array.isArray(serverReviews)) {
        const clean = serverReviews.filter((r) => !isDummyReview(r));
        saveLocalReviews(clean);
        return clean;
      }
    }
  } catch (err) {
    console.warn("Express backend offline for reviews, using local storage");
  }
  const local = getLocalReviews();
  const clean = local.filter((r) => !isDummyReview(r));
  saveLocalReviews(clean);
  return clean;
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
