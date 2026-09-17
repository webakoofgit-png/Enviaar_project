import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product } from "@/types/store";

type StoreState = {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  accountOpen: boolean;
  isLoggedIn: boolean;
  setCartOpen: (value: boolean) => void;
  setSearchOpen: (value: boolean) => void;
  setAccountOpen: (value: boolean) => void;
  addToCart: (product: Product, finish?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  login: () => void;
  logout: () => void;
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readLocal("enviaar-cart", []));
    setWishlist(readLocal("enviaar-wishlist", []));
    setIsLoggedIn(readLocal("enviaar-auth", false));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("enviaar-cart", JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem("enviaar-wishlist", JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const addToCart = (product: Product, finish = product.finish, size?: string) => {
    setCart((current) => {
      const found = current.find(
        (item) => item.product.id === product.id && item.finish === finish && item.size === size,
      );
      if (found)
        return current.map((item) =>
          item === found ? { ...item, quantity: item.quantity + 1 } : item,
        );
      return [...current, { product, quantity: 1, finish, size }];
    });
    setCartOpen(true);
  };
  const updateQuantity = (id: string, quantity: number) =>
    setCart((items) =>
      items.map((item) =>
        item.product.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  const removeFromCart = (id: string) =>
    setCart((items) => items.filter((item) => item.product.id !== id));
  const toggleWishlist = (id: string) =>
    setWishlist((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("enviaar-auth", "true");
    setAccountOpen(false);
  };
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("enviaar-auth");
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
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
