import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight,
  Facebook,
  Heart,
  Instagram,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { images } from "@/data/store";
import { AccountDrawer, CartDrawer, SearchOverlay } from "./Overlays";

const nav = [
  { label: "NEW IN", to: "/new-arrivals" },
  { label: "SHOP", to: "/shop" },
  { label: "COLLECTIONS", to: "/collections" },
  { label: "FESTIVE", to: "/festive" },
  { label: "MEN", to: "/collections/mens" },
  { label: "ABOUT", to: "/about" },
  { label: "CONTACT", to: "/contact" },
] as const;
const shopLinks = [
  "Earrings",
  "Necklaces",
  "Bracelets",
  "Rings",
  "Kada",
  "Mangalsutra",
  "Brooches",
  "Men’s Jewellery",
  "Baby Jewellery",
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [mobile, setMobile] = useState(false);
  const [mega, setMega] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const { cart, wishlist, setSearchOpen, setAccountOpen, setCartOpen } = useStore();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Loading Screen */}
      <div className={`loading-screen ${!loading ? 'hidden' : ''}`}>
        <div className="loading-brand">ENVIAAR</div>
        <div className="loading-bar" />
      </div>

      <div className="bg-secondary/70 border-b border-border/40 px-4 py-2 text-center text-[10px] uppercase tracking-[.15em] text-foreground">
        Complimentary Shipping <span className="mx-2">|</span> Easy Shopping{" "}
        <span className="mx-2">|</span> Premium Jewellery
      </div>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto grid h-16 sm:h-20 max-w-[1500px] grid-cols-[auto_1fr_auto] items-center px-3 sm:px-6 md:px-8 gap-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobile(true)}
              aria-label="Open menu"
            >
              <Menu />
            </Button>
            <span className="hidden text-xs uppercase tracking-[.15em] lg:block">
              Menu / Collections
            </span>
          </div>
          <Link to="/" className="text-center font-display text-xl sm:text-2xl md:text-3xl tracking-[.14em] sm:tracking-[.18em] truncate">
            ENVIAAR
          </Link>
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAccountOpen(true)}
              aria-label="Account"
            >
              <User />
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link to="/wishlist" aria-label="Wishlist">
                <Heart />
                <span className="sr-only">{wishlist.length}</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              aria-label="Shopping bag"
              className="relative"
            >
              <ShoppingBag />
              {count > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground font-medium">
                  {count}
                </span>
              )}
            </Button>
          </div>
        </div>
        <nav className="hidden h-11 items-center justify-center gap-9 border-t text-[11px] tracking-[.16em] lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onMouseEnter={() => item.label === "SHOP" && setMega(true)}
              className="py-4 hover:text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-full hidden border-t bg-background p-10 shadow-lg lg:block"
              onMouseLeave={() => setMega(false)}
            >
              <div className="mx-auto grid max-w-6xl grid-cols-[1fr_1fr_300px] gap-12">
                <div>
                  <p className="mb-5 text-xs uppercase tracking-[.16em]">Shop Jewellery</p>
                  {shopLinks.slice(0, 5).map((label) => (
                    <Link
                      key={label}
                      to={
                        label === "Men’s Jewellery"
                          ? "/collections/mens"
                          : (`/collections/${label.toLowerCase().replaceAll("’", "").replaceAll(" ", "-")}` as "/shop")
                      }
                      className="block py-1.5 text-sm"
                      onClick={() => setMega(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="pt-8">
                  {shopLinks.slice(5).map((label) => (
                    <Link
                      key={label}
                      to={
                        label === "Men’s Jewellery"
                          ? "/collections/mens"
                          : label === "Baby Jewellery"
                            ? "/collections/baby"
                            : (`/collections/${label.toLowerCase()}` as "/shop")
                      }
                      className="block py-1.5 text-sm"
                      onClick={() => setMega(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <img
                  src={images.productsEditorial}
                  alt="Jewellery curation"
                  className="h-52 w-full object-cover"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main>{children}</main>
      <footer className="border-t bg-secondary/45 px-5 py-10 sm:py-14 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <p className="font-display text-3xl tracking-[.16em]">ENVIAAR</p>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              Contemporary jewellery for everyday elegance and memorable occasions.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="https://www.instagram.com/enviaar" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          {[
            ["SHOP", "New Arrivals", "Earrings", "Necklaces", "Bracelets", "Rings", "Men’s"],
            ["HELP", "Contact", "Shipping", "Returns", "Jewellery Care", "FAQs"],
            ["ABOUT", "Our Story", "Instagram"],
            ["LEGAL", "Privacy", "Terms"],
          ].map(([title, ...links]) => (
            <div key={title}>
              <p className="mb-4 sm:mb-5 text-xs tracking-[.16em] font-medium">{title}</p>
              {links.map((label) => (
                <Link
                  key={label}
                  to={footerPath(label)}
                  className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 sm:mt-12 max-w-7xl border-t pt-6 text-xs text-muted-foreground">
          © 2026 ENVIAAR
        </div>
      </footer>
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 z-[90] flex flex-col bg-background p-6 overflow-y-auto max-h-screen lg:hidden"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl tracking-[.18em]">ENVIAAR</p>
              <Button variant="ghost" size="icon" onClick={() => setMobile(false)}>
                <X />
              </Button>
            </div>
            <nav className="mt-10 flex-1 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobile(false)}
                  className="flex items-center justify-between border-b py-4 font-display text-2xl sm:text-3xl"
                >
                  {item.label}
                  <ChevronRight size={18} />
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchOverlay />
      <CartDrawer />
      <AccountDrawer />
    </div>
  );
}

function footerPath(label: string) {
  const map: Record<string, string> = {
    "New Arrivals": "/new-arrivals",
    Earrings: "/collections/earrings",
    Necklaces: "/collections/necklaces",
    Bracelets: "/collections/bracelets",
    Rings: "/collections/rings",
    "Men’s": "/collections/mens",
    Contact: "/contact",
    Shipping: "/shipping-policy",
    Returns: "/returns",
    "Jewellery Care": "/care-guide",
    FAQs: "/contact",
    "Our Story": "/about",
    Instagram: "/",
    Privacy: "/privacy",
    Terms: "/terms",
  };
  return (map[label] ?? "/") as "/";
}
