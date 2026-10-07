import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, CountryOption, MediaItem, Product } from "@/types/store";
import { products as initialProducts, supportedCountries, formatPrice, getConvertedPrice } from "@/data/store";
import { getSavedUserProfile, saveUserProfile } from "@/lib/userStorage";

export type CustomerUser = {
  id?: string | number | undefined;
  name?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  gender?: string | undefined;
  birthday?: string | undefined;
  anniversary?: string | undefined;
};

type StoreState = {
  cart: CartItem[];
  wishlist: string[];
  products: Product[];
  loadingProducts: boolean;
  user: CustomerUser | null;
  selectedCountry: CountryOption;
  setSelectedCountry: (country: CountryOption) => void;
  formatProductPrice: (product: Product) => string;
  formatAmount: (amountInINR: number, customPrices?: { priceUSD?: number | undefined; priceAED?: number | undefined } | undefined) => string;
  getAmountNumber: (amountInINR: number, customPrices?: { priceUSD?: number | undefined; priceAED?: number | undefined } | undefined) => number;
  cartOpen: boolean;
  searchOpen: boolean;
  accountOpen: boolean;
  isLoggedIn: boolean;
  setCartOpen: (value: boolean) => void;
  setSearchOpen: (value: boolean) => void;
  setAccountOpen: (value: boolean) => void;
  addToCart: (product: Product, finish?: string, size?: string, qty?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  login: (userData?: CustomerUser) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<CustomerUser>) => void;
  registerCustomer: (data: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    password?: string;
  }) => Promise<{ success: boolean; error?: string; user?: CustomerUser }>;
  loginCustomer: (data: {
    email: string;
    password?: string;
  }) => Promise<{ success: boolean; error?: string; user?: CustomerUser }>;
  refreshProducts: () => Promise<void>;
};

const StoreContext = createContext<StoreState | null>(null);

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
}

export function normalizeCategory(cat: string): string {
  if (!cat) return "necklaces";
  const lower = cat.toLowerCase();
  if (lower.includes("earring")) return "earrings";
  if (lower.includes("necklace")) return "necklaces";
  if (lower.includes("bracelet")) return "bracelets";
  if (lower.includes("ring")) return "rings";
  if (lower.includes("kada") || lower.includes("bangle")) return "kada";
  if (lower.includes("mangalsutra")) return "mangalsutra";
  if (lower.includes("men")) return "mens";
  if (lower.includes("brooch")) return "brooches";
  if (lower.includes("baby")) return "baby";
  return lower;
}

export function apiProductToStoreProduct(item: any): Product {
  const categorySlug = normalizeCategory(item.category);
  const rawName = item.name || `Jewellery Piece ${item.id}`;
  const slug = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + `-${item.id}`;

  const defaultImage = "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80";

  let mediaItems: MediaItem[] = [];
  if (Array.isArray(item.media) && item.media.length > 0) {
    mediaItems = item.media.map((m: any, idx: number) => {
      if (typeof m === "string") {
        return {
          id: String(idx + 1),
          url: m,
          type: m.match(/\.(mp4|webm|mov)$/i) ? ("video" as const) : ("image" as const),
        };
      }
      return {
        id: m.id || String(idx + 1),
        url: m.url || item.image || defaultImage,
        type: (m.type === "video" || (m.url && m.url.match(/\.(mp4|webm|mov)$/i))) ? ("video" as const) : ("image" as const),
      };
    });
  } else if (item.image) {
    mediaItems = [{ id: "1", url: item.image, type: "image" as const }];
    if (item.alternateImage) {
      mediaItems.push({ id: "2", url: item.alternateImage, type: "image" as const });
    }
  }

  const primaryImage = mediaItems[0]?.url || item.image || item.image_url || defaultImage;
  const alternateImage = mediaItems[1]?.url || item.alternateImage || primaryImage;

  return {
    id: String(item.id),
    slug: slug,
    name: rawName,
    category: categorySlug,
    subcategory: item.subcategory || item.category || "Jewellery",
    material: item.material || "92.5 Silver",
    finish: item.finish || "18K Gold Plated",
    details: item.details || undefined,
    materialsFinish: item.materialsFinish || undefined,
    price: Number(item.sellPrice || item.regularPrice || item.price || 0),
    priceUSD: item.priceUSD ? Number(item.priceUSD) : undefined,
    priceAED: item.priceAED ? Number(item.priceAED) : undefined,
    image: primaryImage,
    alternateImage: alternateImage,
    media: mediaItems,
    badge: item.badge || (item.createdAt === "Just now" ? "NEW" : undefined),
    colors: item.colors || ["Gold", "Silver"],
    sizes: item.sizes || undefined,
    description:
      item.description ||
      "A refined ENVIAAR piece made for effortless transitions from everyday moments to occasions worth remembering.",
    rating: item.rating || 4.8,
  };
}

import { getCustomProducts, filterDeletedProducts } from "@/lib/productStorage";

export function deduplicateProducts(items: Product[]): Product[] {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const result: Product[] = [];

  for (const item of items) {
    if (!item || !item.name) continue;
    const idKey = String(item.id).trim();
    const nameKey = item.name.toLowerCase().trim();

    if (seenIds.has(idKey) || seenNames.has(nameKey)) {
      continue;
    }

    seenIds.add(idKey);
    seenNames.add(nameKey);
    result.push(item);
  }

  return result;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [productList, setProductList] = useState<Product[]>(() => {
    const custom = getCustomProducts();
    const merged = deduplicateProducts([...custom, ...initialProducts]);
    return filterDeletedProducts(merged);
  });
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  const fetchDynamicProducts = async () => {
    try {
      setLoadingProducts(true);
      const customProducts = getCustomProducts();
      let convertedApi: Product[] = [];

      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const publishedApi = data.filter(
              (p) => !p.status || p.status.toLowerCase() === "published" || p.status.toLowerCase() === "instock",
            );
            convertedApi = publishedApi.map(apiProductToStoreProduct);
          }
        }
      } catch (err) {
        console.warn("Backend API not reachable for storefront, using local custom products and fallback catalog");
      }

      // Combine API products, custom products created via Admin, and initial static products with strict deduplication & deletion filtering
      const allMerged = deduplicateProducts([...convertedApi, ...customProducts, ...initialProducts]);
      const cleanList = filterDeletedProducts(allMerged);
      setProductList(cleanList);
    } finally {
      setLoadingProducts(false);
    }
  };

  const [user, setUser] = useState<CustomerUser | null>(null);

  useEffect(() => {
    setCart(readLocal("enviaar-cart", []));
    setWishlist(readLocal("enviaar-wishlist", []));
    setIsLoggedIn(readLocal("enviaar-auth", false));
    setUser(readLocal("enviaar-customer-user", null));
    setReady(true);
    fetchDynamicProducts();

    const handleProductsUpdated = () => fetchDynamicProducts();
    window.addEventListener("enviaar_products_updated", handleProductsUpdated);
    return () => {
      window.removeEventListener("enviaar_products_updated", handleProductsUpdated);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      const lightweightCart = cart.map((item) => {
        if (!item || !item.product) return item;
        const p = item.product;
        return {
          ...item,
          product: {
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category,
            subcategory: p.subcategory,
            material: p.material,
            finish: p.finish,
            price: p.price,
            image: p.image && p.image.length > 5000 ? "" : p.image,
            alternateImage: p.alternateImage && p.alternateImage.length > 5000 ? "" : p.alternateImage,
            media: undefined,
            colors: p.colors,
            sizes: p.sizes,
            description: p.description,
            rating: p.rating,
          },
        };
      });

      try {
        localStorage.setItem("enviaar-cart", JSON.stringify(lightweightCart));
      } catch (quotaError) {
        const minimalCart = cart.map((item) => {
          if (!item || !item.product) return item;
          const p = item.product;
          return {
            ...item,
            product: {
              id: p.id,
              slug: p.slug,
              name: p.name,
              category: p.category,
              subcategory: p.subcategory,
              material: p.material,
              finish: p.finish,
              price: p.price,
              image: p.image && p.image.startsWith("data:") ? "" : p.image,
              alternateImage: "",
              colors: p.colors,
              sizes: p.sizes,
              description: p.description,
              rating: p.rating,
            },
          };
        });
        localStorage.setItem("enviaar-cart", JSON.stringify(minimalCart));
      }
    } catch (err) {
      console.warn("Unable to save cart to localStorage (storage full):", err);
    }
  }, [cart, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("enviaar-wishlist", JSON.stringify(wishlist));
    } catch (err) {
      console.warn("Unable to save wishlist to localStorage:", err);
    }
  }, [wishlist, ready]);

  useEffect(() => {
    if (!ready || productList.length === 0 || cart.length === 0) return;
    let needsUpdate = false;
    const rehydrated = cart.map((item) => {
      if (!item?.product) return item;
      const full = productList.find(
        (p) => String(p.id) === String(item.product.id) || p.slug === item.product.slug,
      );
      if (full && (!item.product.image || item.product.image === "")) {
        needsUpdate = true;
        return {
          ...item,
          product: {
            ...full,
            ...item.product,
            image: full.image || item.product.image,
          },
        };
      }
      return item;
    });
    if (needsUpdate) {
      setCart(rehydrated);
    }
  }, [productList, ready]);

  const addToCart = (
    product: Product,
    finish = product?.finish || "Gold",
    size?: string,
    qty = 1,
  ) => {
    if (!product || !product.id) return;
    const itemFinish = finish || product.finish || "Gold";
    const addQty = Math.max(1, qty || 1);
    setCart((current) => {
      const found = current.find(
        (item) =>
          item?.product?.id === product.id && item.finish === itemFinish && item.size === size,
      );
      if (found)
        return current.map((item) =>
          item === found ? { ...item, quantity: item.quantity + addQty } : item,
        );
      return [...current, { product, quantity: addQty, finish: itemFinish, size }];
    });
    setCartOpen(true);
  };
  const updateQuantity = (id: string, quantity: number) =>
    setCart((items) =>
      items.map((item) =>
        item.product?.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  const removeFromCart = (id: string) =>
    setCart((items) => items.filter((item) => item.product?.id !== id));
  const toggleWishlist = (id: string) =>
    setWishlist((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );

  const login = (userData?: CustomerUser) => {
    setIsLoggedIn(true);
    if (userData && userData.email) {
      const savedProfile = getSavedUserProfile(userData.email);
      const mergedUser: CustomerUser = {
        ...(savedProfile || {}),
        ...userData,
      };
      saveUserProfile(mergedUser);
      setUser(mergedUser);
      localStorage.setItem("enviaar-customer-user", JSON.stringify(mergedUser));
    } else if (userData) {
      setUser(userData);
      localStorage.setItem("enviaar-customer-user", JSON.stringify(userData));
    }
    localStorage.setItem("enviaar-auth", "true");
    setAccountOpen(false);
  };
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("enviaar-auth");
    localStorage.removeItem("enviaar-customer-user");
  };

  const updateUserProfile = (data: Partial<CustomerUser>) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...data };
      if (updated.email) {
        saveUserProfile(updated);
      }
      localStorage.setItem("enviaar-customer-user", JSON.stringify(updated));

      // Sync to Express backend API
      fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).catch((err) => console.warn("Backend profile sync notice:", err.message));

      return updated;
    });
  };

  const registerCustomer = async (data: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    password?: string;
  }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (res.ok && body.success) {
        login(body.user);
        return { success: true, user: body.user };
      }
      return { success: false, error: body.error || "Failed to create account" };
    } catch (err: any) {
      const mockUser = {
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Customer',
        email: data.email,
        phone: data.phone || '',
      };
      login(mockUser);
      return { success: true, user: mockUser };
    }
  };

  const loginCustomer = async (data: { email: string; password?: string }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (res.ok && body.success) {
        login(body.user);
        return { success: true, user: body.user };
      }
      return { success: false, error: body.error || "Invalid credentials" };
    } catch (err: any) {
      const mockUser = { name: data.email.split("@")[0] || "Customer", email: data.email };
      login(mockUser);
      return { success: true, user: mockUser };
    }
  };

  const [selectedCountry, setSelectedCountryState] = useState<CountryOption>(() => {
    const saved = readLocal<CountryOption | null>("enviaar-country", null);
    return saved || supportedCountries[0]!;
  });

  const setSelectedCountry = (country: CountryOption) => {
    setSelectedCountryState(country);
    if (typeof window !== "undefined") {
      localStorage.setItem("enviaar-country", JSON.stringify(country));
    }
  };

  const formatProductPrice = (product: Product) => {
    if (!product) return formatPrice(0, selectedCountry);
    return formatPrice(product.price, selectedCountry, {
      priceUSD: product.priceUSD,
      priceAED: product.priceAED,
    });
  };

  const formatAmount = (
    amountInINR: number,
    customPrices?: { priceUSD?: number | undefined; priceAED?: number | undefined } | undefined
  ) => {
    return formatPrice(amountInINR, selectedCountry, customPrices);
  };

  const getAmountNumber = (
    amountInINR: number,
    customPrices?: { priceUSD?: number | undefined; priceAED?: number | undefined } | undefined
  ) => {
    return getConvertedPrice(amountInINR, selectedCountry, customPrices);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        products: productList,
        loadingProducts,
        user,
        selectedCountry,
        setSelectedCountry,
        formatProductPrice,
        formatAmount,
        getAmountNumber,
        cartOpen,
        searchOpen,
        accountOpen,
        isLoggedIn,
        setCartOpen,
        setSearchOpen,
        setAccountOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        login,
        logout,
        updateUserProfile,
        registerCustomer,
        loginCustomer,
        refreshProducts: fetchDynamicProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
};

export const CartContext = StoreContext;
export const WishlistContext = StoreContext;
export const AuthContext = StoreContext;

