import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  UploadCloud,
  Image as ImageIcon,
  Video,
  Film,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import { getSavedOrders } from "@/lib/orderStorage";
import {
  getCustomProducts,
  removeCustomProducts,
  saveCustomProduct,
  markProductsAsDeleted,
  filterDeletedProducts,
  unmarkProductAsDeleted,
} from "@/lib/productStorage";
import { normalizeCategory } from "@/context/StoreContext";
import type { Product as StoreProduct } from "@/types/store";
import { API_BASE_URL } from "@/config/api";

interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  description?: string;
  details?: string;
  materialsFinish?: string;
  createdAt: string;
  regularPrice: number;
  sellPrice: number;
  priceUSD?: number | undefined;
  priceAED?: number | undefined;
  stock: number;
  status: "Published" | "Inactive" | "out Stock" | "Draft" | "Archived";
  image: string;
  media?: MediaItem[] | undefined;
}

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  name?: string;
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">(() => {
    try {
      return (localStorage.getItem("enviaar_admin_product_view") as "grid" | "table") || "table";
    } catch {
      return "table";
    }
  });

  const handleViewModeChange = (mode: "grid" | "table") => {
    setViewMode(mode);
    try {
      localStorage.setItem("enviaar_admin_product_view", mode);
    } catch {}
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageMode, setImageMode] = useState<"file" | "url">("file");

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const orders = getSavedOrders();
    const localRev = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    setStats({
      totalProducts: products.length,
      totalRevenue: localRev,
      totalOrders: orders.length,
      totalCustomers: 0,
    });

    fetch(`${API_BASE_URL}/api/dashboard/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setStats({
            totalProducts: data.totalProducts ?? products.length,
            totalRevenue: Math.max(data.totalRevenue || 0, localRev),
            totalOrders: Math.max(data.totalOrders || 0, orders.length),
            totalCustomers: data.totalCustomers || 0,
          });
        }
      })
      .catch(() => {});
  }, [products.length]);

  // Form state for adding/editing jewellery product
  const [formData, setFormData] = useState({
    name: "",
    category: "Earrings",
    sku: "",
    description: "",
    details: "",
    materialsFinish: "",
    regularPrice: "4990.00",
    sellPrice: "4290.00",
    priceUSD: "",
    priceAED: "",
    stock: "35",
    status: "Published",
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Earrings",
      sku: "",
      description: "",
      details: "",
      materialsFinish: "",
      regularPrice: "4990.00",
      sellPrice: "4290.00",
      priceUSD: "",
      priceAED: "",
      stock: "35",
      status: "Published",
    });
    setMediaItems([]);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category || "Earrings",
      sku: product.sku || "",
      description: product.description || "",
      details: product.details || "",
      materialsFinish: product.materialsFinish || "",
      regularPrice: String(product.regularPrice || 0),
      sellPrice: String(product.sellPrice || 0),
      priceUSD: product.priceUSD ? String(product.priceUSD) : "",
      priceAED: product.priceAED ? String(product.priceAED) : "",
      stock: String(product.stock || 0),
      status: product.status || "Published",
    });

    if (product.media && product.media.length > 0) {
      setMediaItems(product.media);
    } else if (product.image) {
      setMediaItems([
        {
          id: "1",
          type: "image",
          url: product.image,
          name: product.name,
        },
      ]);
    } else {
      setMediaItems([]);
    }

    setIsAddModalOpen(true);
  };

  // Handle local multiple media files upload (Images + Videos)
  const handleMediaFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let addedCount = 0;
    files.forEach((file) => {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 50MB)`);
        return;
      }

      const reader = new FileReader();
      const isVideo = file.type.startsWith("video/");

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const newItem: MediaItem = {
            id: Math.random().toString(36).substring(2, 9),
            type: isVideo ? "video" : "image",
            url: reader.result,
            name: file.name,
          };
          setMediaItems((prev) => [...prev, newItem]);
          addedCount++;
        }
      };
      reader.readAsDataURL(file);
    });

    toast.success(`Processing ${files.length} media file(s)`);
  };

  // Add media via URL
  const handleAddMediaUrl = () => {
    if (!urlInput.trim()) return;
    const isVideo =
      urlInput.includes("youtube.com") ||
      urlInput.includes("vimeo.com") ||
      urlInput.endsWith(".mp4") ||
      urlInput.endsWith(".webm");

    const newItem: MediaItem = {
      id: Math.random().toString(36).substring(2, 9),
      type: isVideo ? "video" : "image",
      url: urlInput.trim(),
    };

    setMediaItems((prev) => [...prev, newItem]);
    setUrlInput("");
    toast.success("Media URL added");
  };

  const handleRemoveMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Fetch products from Express API or real ENVIAAR dataset
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const customItems: Product[] = getCustomProducts().map((cp) => ({
        id: Number(cp.id) || Date.now(),
        name: cp.name,
        category: cp.subcategory || cp.category,
        sku: `#ENV-JWL${cp.id}`,
        createdAt: "Just now",
        regularPrice: Math.round(cp.price * 1.15),
        sellPrice: cp.price,
        priceUSD: cp.priceUSD,
        priceAED: cp.priceAED,
        stock: 35,
        status: "Published",
        image: cp.image,
        media: cp.media,
      }));

      try {
        const baseEndpoint = API_BASE_URL ? `${API_BASE_URL}/api/products` : '/api/products';
        const url = new URL(baseEndpoint, window.location.origin);
        if (activeTab !== "All") url.searchParams.append("status", activeTab);
        if (searchQuery) url.searchParams.append("q", searchQuery);

        const res = await fetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            let filtered = data;
            if (activeTab === "Active") {
              filtered = data.filter((p) => !p.status || p.status.toLowerCase() === "published" || p.status.toLowerCase() === "active");
            } else if (activeTab === "Drafts") {
              filtered = data.filter((p) => p.status && (p.status.toLowerCase() === "draft" || p.status.toLowerCase() === "drafts"));
            } else if (activeTab === "Archived") {
              filtered = data.filter((p) => p.status && p.status.toLowerCase() === "archived");
            }
            setProducts(filtered);
            return;
          }
        }
      } catch (e) {
        // API offline fallback below
      }

      console.warn("Backend API not reachable, loading custom products");
      setProducts(filterDeletedProducts(customItems));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.removeItem("enviaar_deleted_product_keys");
    } catch (e) {}
    fetchProducts();
  }, [activeTab, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Add Product Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = !!editingProduct;
    const productId = isEdit ? editingProduct.id : Date.now();
    const rawName = formData.name || "Jewellery Piece";
    const categorySlug = normalizeCategory(formData.category);
    const slug = isEdit && (editingProduct as any).slug
      ? (editingProduct as any).slug
      : rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${productId}`;

    const primaryImage =
      mediaItems.find((m) => m.type === "image")?.url ||
      mediaItems[0]?.url ||
      (isEdit ? editingProduct.image : "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80");

    const storeProduct: StoreProduct = {
      id: String(productId),
      slug,
      name: rawName,
      category: categorySlug,
      subcategory: formData.category || "Necklaces",
      material: "92.5 Silver",
      finish: "18K Gold Plated",
      details: formData.details || undefined,
      materialsFinish: formData.materialsFinish || undefined,
      price: parseFloat(formData.sellPrice) || parseFloat(formData.regularPrice) || 0,
      priceUSD: formData.priceUSD ? parseFloat(formData.priceUSD) : undefined,
      priceAED: formData.priceAED ? parseFloat(formData.priceAED) : undefined,
      image: primaryImage,
      alternateImage: mediaItems[1]?.url || primaryImage,
      media: mediaItems,
      badge: isEdit ? (editingProduct as any).badge || "BESTSELLER" : "NEW",
      colors: ["Gold", "Silver"],
      description:
        formData.description ||
        (isEdit ? (editingProduct as any).description : "A refined ENVIAAR piece made for effortless transitions from everyday moments to occasions worth remembering."),
      rating: 4.8,
    };

    // Save to local persistence immediately
    saveCustomProduct(storeProduct);

    const productPayload = {
      id: productId,
      name: formData.name,
      category: formData.category,
      sku: formData.sku || (isEdit ? editingProduct.sku : `#ENV-JWL${Math.floor(100 + Math.random() * 900)}`),
      description: formData.description,
      details: formData.details,
      materialsFinish: formData.materialsFinish,
      regularPrice: parseFloat(formData.regularPrice) || 0,
      sellPrice: parseFloat(formData.sellPrice) || 0,
      priceUSD: formData.priceUSD ? parseFloat(formData.priceUSD) : undefined,
      priceAED: formData.priceAED ? parseFloat(formData.priceAED) : undefined,
      stock: parseInt(formData.stock) || 0,
      status: formData.status,
      image: primaryImage,
      media: mediaItems,
    };

    try {
      if (isEdit) {
        await fetch(`${API_BASE_URL}/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });
        toast.success("Jewellery details updated successfully!");
      } else {
        await fetch(`${API_BASE_URL}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });
        toast.success("Jewellery piece created successfully!");
      }
    } catch (err) {
      toast.success(isEdit ? "Product catalogue updated!" : "Jewellery piece added to catalogue!");
    } finally {
      setIsAddModalOpen(false);
      setEditingProduct(null);
      setMediaItems([]);
      fetchProducts();
      window.dispatchEvent(new Event("enviaar_products_updated"));
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const itemsToDelete = products.filter((p) => selectedIds.includes(p.id));
    markProductsAsDeleted(itemsToDelete);
    removeCustomProducts(selectedIds);
    try {
      await fetch(`${API_BASE_URL}/api/products`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      toast.success(`${selectedIds.length} items removed permanently`);
    } catch (err) {
      toast.success("Removed permanently");
    } finally {
      setProducts((current) => filterDeletedProducts(current.filter((p) => !selectedIds.includes(p.id))));
      setSelectedIds([]);
      window.dispatchEvent(new Event("enviaar_products_updated"));
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100/80 text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Published
          </span>
        );
      case "Inactive":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-100/80 text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            Inactive
          </span>
        );
      case "out Stock":
      case "Out of Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            out Stock
          </span>
        );
      case "Draft":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 relative pb-16">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage ENVIAAR jewellery pieces, pricing, stock, and multi-media assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs">
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4 text-amber-300" />
            Add product
          </button>
        </div>
      </div>

      {/* TOP 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Products</span>
            <MoreVertical className="h-4 w-4 text-slate-300 cursor-pointer" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">{products.length}</div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-700">
              <TrendingUp className="h-3 w-3" />
              Live
            </span>
            <span className="text-[11px] text-slate-400">Store Catalog</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Revenue</span>
            <MoreVertical className="h-4 w-4 text-slate-300 cursor-pointer" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">
            ₹{stats.totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-700">
              <TrendingUp className="h-3 w-3" />
              Live
            </span>
            <span className="text-[11px] text-slate-400">Recorded Sales</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Orders</span>
            <MoreVertical className="h-4 w-4 text-slate-300 cursor-pointer" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">{stats.totalOrders}</div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
              Live
            </span>
            <span className="text-[11px] text-slate-400">Customer Orders</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Customers</span>
            <MoreVertical className="h-4 w-4 text-slate-300 cursor-pointer" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">{stats.totalCustomers}</div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
              Live
            </span>
            <span className="text-[11px] text-slate-400">Registered Accounts</span>
          </div>
        </div>
      </div>

      {/* FILTER & TABS ROW */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product name or SKU"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-slate-900 transition"
              />
            </div>

            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              Filter
            </button>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-slate-500">
              <button
                type="button"
                onClick={() => handleViewModeChange("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-xs text-slate-900 font-semibold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("table")}
                title="Table View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "table"
                    ? "bg-white shadow-xs text-slate-900 font-semibold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-medium text-slate-600 self-start sm:self-auto">
            {["All", "Active", "Drafts", "Archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS VIEW: GRID OR TABLE */}
        {viewMode === "grid" ? (
          <div className="border-t border-slate-100 pt-3">
            {products.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <LayoutGrid className="h-10 w-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                <p className="font-semibold text-slate-700 text-sm">No products found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => toggleSelectRow(product.id)}
                      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer ${
                        isSelected
                          ? "border-amber-400 ring-2 ring-amber-400/20 shadow-md bg-amber-50/20"
                          : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      {/* Image & Badges */}
                      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                        <img
                          src={product.image || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top overlay: Checkbox + Status */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          <div
                            className="pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(product.id)}
                              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer bg-white/95 shadow-xs"
                            />
                          </div>
                          <div className="pointer-events-auto shadow-xs">
                            {renderStatusBadge(product.status)}
                          </div>
                        </div>

                        {/* Stock Tag on Bottom */}
                        <div className="absolute bottom-2 left-2 pointer-events-none">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/75 text-white backdrop-blur-xs">
                            Stock: {product.stock}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="uppercase font-semibold tracking-wider truncate max-w-[120px]">{product.category}</span>
                            <span className="font-mono text-[10px] text-slate-400">{product.sku}</span>
                          </div>
                          <h3
                            className="font-bold text-slate-900 text-xs sm:text-sm mt-1 line-clamp-1 group-hover:text-amber-600 transition-colors"
                            title={product.name}
                          >
                            {product.name}
                          </h3>
                        </div>

                        {/* Pricing & Edit Action */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              ₹{product.sellPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </div>
                            {product.regularPrice > product.sellPrice && (
                              <div className="text-[10px] text-slate-400 line-through">
                                MRP ₹{product.regularPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(product);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 rounded-lg transition cursor-pointer shadow-xs"
                          >
                            <Edit2 className="h-3 w-3 text-amber-600" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* PRODUCTS DATA TABLE */
          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                  </th>
                  <th className="p-3 font-semibold">Product Name</th>
                  <th className="p-3 font-semibold">SKU & Create Date</th>
                  <th className="p-3 font-semibold">Price</th>
                  <th className="p-3 font-semibold">Stock</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      <List className="h-8 w-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="font-semibold text-slate-700 text-sm">No products found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const isSelected = selectedIds.includes(product.id);
                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? "bg-amber-50/40" : ""
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(product.id)}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                          />
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-xl object-cover bg-slate-100 border border-slate-200/60 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{product.name}</div>
                              <div className="text-[11px] text-slate-400">{product.category}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 text-slate-600 font-mono">
                          <div className="font-bold text-slate-900">{product.sku}</div>
                          <div className="text-[11px] text-slate-400 font-sans">{product.createdAt}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-slate-900">
                            ₹{product.sellPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            MRP ₹{product.regularPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </div>
                        </td>

                        <td className="p-3 text-slate-700 font-semibold">
                          {product.stock.toLocaleString()}
                        </td>

                        <td className="p-3">{renderStatusBadge(product.status)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(product);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 rounded-xl transition cursor-pointer shadow-xs"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-amber-600" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FLOATING BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded-lg text-amber-300">
            {selectedIds.length} Selected
          </span>

          <div className="h-4 w-px bg-slate-800"></div>

          <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-amber-300 transition">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>

          <button
            onClick={() => {
              const selectedProduct = products.find((p) => selectedIds.includes(p.id));
              if (selectedProduct) {
                handleOpenEditModal(selectedProduct);
              } else {
                toast.error("Please select a product to edit");
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-amber-300 transition cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Info
          </button>

          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>

          <button
            onClick={() => setSelectedIds([])}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition ml-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ADD PRODUCT MODAL WITH MULTI-MEDIA (IMAGES & VIDEOS) UPLOADER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingProduct ? "Edit Jewellery Details" : "Add New Jewellery Piece"}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingProduct
                    ? "Update details, prices, stock, images, and showcase videos"
                    : "Add details, multiple images, and product showcase videos"}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aurelia Drop Earrings"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                  >
                    <option value="Earrings">Earrings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Rings">Rings</option>
                    <option value="Kada & Bangles">Kada & Bangles</option>
                    <option value="Mangalsutra">Mangalsutra</option>
                    <option value="Men’s Jewellery">Men’s Jewellery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="#ENV-EAR001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellPrice}
                    onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                    International Custom Pricing (Optional)
                  </span>
                  <span className="text-[10px] text-amber-700">Auto-converted if blank</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">USA Price ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Auto (0.012 rate)"
                      value={formData.priceUSD}
                      onChange={(e) => setFormData({ ...formData, priceUSD: e.target.value })}
                      className="w-full h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Dubai/UAE Price (AED)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Auto (0.044 rate)"
                      value={formData.priceAED}
                      onChange={(e) => setFormData({ ...formData, priceAED: e.target.value })}
                      className="w-full h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                  >
                    <option value="Published">Published</option>
                    <option value="Inactive">Inactive</option>
                    <option value="out Stock">out Stock</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter main product summary shown under the price..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Details (Accordion Content)
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter custom text for Product Details accordion (defaults to Product Description if empty)..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Materials & Finish (Accordion Content)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Crafted with 92.5 Sterling Silver, finished in 18K Gold Plating. Anti-tarnish coated..."
                  value={formData.materialsFinish}
                  onChange={(e) => setFormData({ ...formData, materialsFinish: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 leading-relaxed font-sans"
                />
              </div>

              {/* MULTI-MEDIA SELECTION & UPLOADER (Images + Videos) */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Product Media Gallery <span className="text-[10px] font-normal text-slate-400">(Images & Videos)</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageMode("file")}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        imageMode === "file"
                          ? "bg-slate-900 text-white font-semibold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Upload Files
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        imageMode === "url"
                          ? "bg-slate-900 text-white font-semibold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {imageMode === "file" ? (
                  <div className="space-y-3">
                    {/* Hidden Multiple File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaFilesChange}
                      className="hidden"
                    />

                    {/* Media Gallery Grid Preview */}
                    {mediaItems.length > 0 ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                          {mediaItems.map((item, index) => (
                            <div
                              key={item.id}
                              className="relative group rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square flex items-center justify-center shadow-xs"
                            >
                              {item.type === "video" ? (
                                <div className="relative w-full h-full flex items-center justify-center bg-slate-900 text-white">
                                  <video
                                    src={item.url}
                                    className="w-full h-full object-cover opacity-80"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div className="p-1.5 rounded-full bg-amber-400 text-slate-950">
                                      <Play className="h-3.5 w-3.5 fill-current" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={item.url}
                                  alt={`Media ${index}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                />
                              )}

                              {/* Primary cover badge on 1st item */}
                              {index === 0 && (
                                <span className="absolute bottom-1 left-1 bg-slate-900/90 text-amber-300 font-bold text-[9px] px-1.5 py-0.5 rounded-md shadow-xs">
                                  Cover
                                </span>
                              )}

                              {/* Video badge */}
                              {item.type === "video" && index !== 0 && (
                                <span className="absolute bottom-1 left-1 bg-purple-600/90 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                                  <Film className="h-2.5 w-2.5" /> Video
                                </span>
                              )}

                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveMedia(item.id)}
                                className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full shadow-md opacity-90 hover:opacity-100 transition hover:scale-110"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}

                          {/* Add More Media Button inside Grid */}
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 hover:border-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer transition text-slate-500 hover:text-slate-900"
                          >
                            <Plus className="h-5 w-5" />
                            <span className="text-[10px] font-bold">Add More</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {mediaItems.length} item(s) selected. The first item will be used as the main product thumbnail.
                        </p>
                      </div>
                    ) : (
                      /* Dropzone Area */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 hover:border-slate-900 bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="h-12 w-12 rounded-full bg-slate-200/80 group-hover:bg-slate-900 group-hover:text-amber-300 text-slate-600 flex items-center justify-center transition">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            Click to upload multiple images or product videos
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Supports Images (PNG, JPG, WEBP) & Showcase Videos (MP4, WEBM, MOV)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* URL Input Mode */
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image or video URL (e.g. .jpg, .png, .mp4)"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddMediaUrl}
                        className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition shrink-0"
                      >
                        Add URL
                      </button>
                    </div>

                    {mediaItems.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {mediaItems.map((item) => (
                          <div
                            key={item.id}
                            className="relative group rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square flex items-center justify-center shadow-xs"
                          >
                            <img src={item.url} alt="Media preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveMedia(item.id)}
                              className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full shadow-md"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm cursor-pointer"
                >
                  {editingProduct ? "Save & Update Product" : "Publish to Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
