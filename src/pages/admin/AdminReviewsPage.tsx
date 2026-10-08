import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Star,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchAllReviews,
  deleteProductReview,
  type Review,
} from "@/lib/reviewStorage";
import { useStore } from "@/context/StoreContext";

export function AdminReviewsPage() {
  const { products } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchAllReviews();
      setReviews(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    const handleUpdate = () => loadReviews();
    window.addEventListener("enviaar_reviews_updated", handleUpdate);
    return () => {
      window.removeEventListener("enviaar_reviews_updated", handleUpdate);
    };
  }, []);

  const handleDeleteReview = async (id: string, authorName: string) => {
    try {
      await deleteProductReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success(`Review by "${authorName}" deleted successfully`);
    } catch (err) {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to match product name
  const getProductName = (productId: string) => {
    const p = products.find((prod) => String(prod.id) === String(productId));
    return p ? p.name : `Product #${productId}`;
  };

  const getProductImage = (productId: string) => {
    const p = products.find((prod) => String(prod.id) === String(productId));
    return p ? p.image : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&q=80";
  };

  const filteredReviews = reviews.filter((r) => {
    const pName = getProductName(r.productId).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      pName.includes(q) ||
      r.authorName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q);

    const matchesRating =
      filterRating === "All" || String(r.rating) === filterRating;

    return matchesQuery && matchesRating;
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <MessageSquare className="h-6 w-6 text-amber-600" />
            Customer Reviews & Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage text-only product reviews, view customer ratings, and delete unwanted or spam reviews.
          </p>
        </div>
        <button
          onClick={loadReviews}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Reviews
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Customer Reviews</span>
          <div className="mt-1 text-2xl font-bold text-slate-900">{reviews.length}</div>
          <span className="text-[10px] text-slate-500">Synced live with website</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Average Store Rating</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgRating}</span>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${s <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                />
              ))}
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Across all published jewellery</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Moderation Status</span>
          <div className="mt-1 flex items-center gap-1.5 text-emerald-600 font-bold text-base">
            <ShieldCheck className="h-5 w-5" />
            Text-Only Format (No Media Spam)
          </div>
          <span className="text-[10px] text-slate-500">Admins can instantly remove bad reviews</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search review content, author, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Rating:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
          >
            <option value="All">All Ratings (1-5 ★)</option>
            <option value="5">5 Stars (★★★★★)</option>
            <option value="4">4 Stars (★★★★)</option>
            <option value="3">3 Stars (★★★)</option>
            <option value="2">2 Stars (★★)</option>
            <option value="1">1 Star (★)</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading customer reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
            <div className="text-sm font-semibold text-slate-700">No customer reviews found</div>
            <p className="text-xs text-slate-400">No reviews match your current search query or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Review Content</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImage(r.productId)}
                          alt="Product"
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{getProductName(r.productId)}</div>
                          <div className="text-[10px] text-slate-400">ID: #{r.productId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{r.authorName}</div>
                      {r.authorEmail && <div className="text-[11px] text-slate-400">{r.authorEmail}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-0.5 inline-block">{r.rating}.0 / 5.0</span>
                    </td>

                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-bold text-slate-900 mb-0.5">{r.title}</div>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{r.comment}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {r.createdAt}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDeletingId(r.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                        title="Delete this review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Review Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-2xl border border-rose-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Customer Review?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              Removing this review will immediately erase it from disk storage and hide it from the storefront website.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const r = reviews.find((x) => x.id === deletingId);
                  if (r) handleDeleteReview(r.id, r.authorName);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition"
              >
                Yes, Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
