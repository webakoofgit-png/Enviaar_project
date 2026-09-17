import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronRight, Minus, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/context/StoreContext";
import { money, products } from "@/data/store";

const Backdrop = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-[80] bg-foreground/25"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onMouseDown={onClose}
  >
    {children}
  </motion.div>
);

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const found = useMemo(
    () =>
      products
        .filter((p) =>
          `${p.name} ${p.category} ${p.material}`.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 4),
    [query],
  );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/search", search: { q: query } });
  };
  return (
    <AnimatePresence>
      {searchOpen && (
        <Backdrop onClose={() => setSearchOpen(false)}>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="bg-background px-5 py-8 md:px-12"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl">Search ENVIAAR</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X />
                </Button>
              </div>
              <form onSubmit={submit} className="mt-8 flex border-b border-primary">
                <Search className="my-auto mr-3" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jewellery, collections and materials"
                  className="h-14 flex-1 bg-transparent text-lg outline-none"
                />
                <Button type="submit" variant="ghost">
                  SEARCH
                </Button>
              </form>
              <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.14em]">Products</p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {found.map((p) => (
                      <Link
                        key={p.id}
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => setSearchOpen(false)}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="aspect-square w-full object-cover"
                        />
                        <p className="mt-2 text-sm">{p.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.14em]">Popular Searches</p>
                  {["Earrings", "Mangalsutra", "92.5 Silver", "Festive", "Bracelets"].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="block py-2 text-left hover:text-muted-foreground"
                      >
                        {term}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQuantity, removeFromCart } = useStore();
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const remaining = Math.max(0, 5000 - subtotal);
  return (
    <AnimatePresence>
      {cartOpen && (
        <Backdrop onClose={() => setCartOpen(false)}>
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35 }}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-background p-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl">Shopping Bag</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
              >
                <X />
              </Button>
            </div>
            <div className="mt-6 border-y py-4 text-center text-xs">
              {remaining
                ? `You’re ${money(remaining)} away from free shipping`
                : "Complimentary shipping unlocked"}
              <div className="mt-3 h-1 bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(100, subtotal / 50)}%` }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-5">
              {cart.length === 0 ? (
                <div className="grid h-full place-content-center text-center">
                  <p className="font-display text-2xl">Your bag is waiting.</p>
                  <Button asChild variant="link" onClick={() => setCartOpen(false)}>
                    <Link to="/shop">Discover jewellery</Link>
                  </Button>
                </div>
              ) : (
                cart.map(({ product, quantity, finish, size }) => (
                  <div key={`${product.id}-${finish}-${size}`} className="flex gap-4 border-b py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-28 w-24 object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-display text-lg">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {finish}
                        {size ? ` · ${size}` : ""}
                      </p>
                      <div className="mt-4 flex w-24 items-center justify-between border">
                        <button
                          className="p-2"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span>{quantity}</span>
                        <button
                          className="p-2"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p>{money(product.price * quantity)}</p>
                      <button
                        className="mt-12 text-xs underline"
                        onClick={() => removeFromCart(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t pt-5">
              <div className="mb-5 flex justify-between">
                <span>Subtotal</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="luxury-outline" onClick={() => setCartOpen(false)}>
                  <Link to="/cart">View Bag</Link>
                </Button>
                <Button asChild variant="luxury" onClick={() => setCartOpen(false)}>
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </motion.aside>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

export function AccountDrawer() {
  const { accountOpen, setAccountOpen, login } = useStore();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [done, setDone] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (mode === "login") login();
    else setDone(true);
  };
  return (
    <AnimatePresence>
      {accountOpen && (
        <Backdrop onClose={() => setAccountOpen(false)}>
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="ml-auto h-full w-full max-w-lg overflow-y-auto bg-background p-8 md:p-12"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <p className="text-xs uppercase tracking-[.18em]">{mode}</p>
              <Button variant="ghost" size="icon" onClick={() => setAccountOpen(false)}>
                <X />
              </Button>
            </div>
            <h2 className="mt-10 text-5xl">
              {mode === "login"
                ? "Welcome Back"
                : mode === "register"
                  ? "Join ENVIAAR"
                  : "Reset your password"}
            </h2>
            {done ? (
              <div className="mt-12 flex gap-3">
                <Check /> <p>Thank you. Check your email for the next step.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-10 space-y-5">
                {mode === "register" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input required placeholder="First name" />
                    <Input required placeholder="Last name" />
                  </div>
                )}
                <Input type="email" required placeholder="Email address" />
                {mode === "register" && (
                  <Input type="tel" required pattern="[0-9]{10}" placeholder="Mobile number" />
                )}
                {mode !== "forgot" && (
                  <Input type="password" minLength={8} required placeholder="Password" />
                )}
                {mode === "register" && (
                  <>
                    <Input type="password" minLength={8} required placeholder="Confirm password" />
                    <label className="flex gap-3 text-sm">
                      <input type="checkbox" /> Receive new collection and offer updates.
                    </label>
                  </>
                )}
                <Button type="submit" variant="luxury" size="lg" className="w-full">
                  {mode === "login"
                    ? "Login"
                    : mode === "register"
                      ? "Create Account"
                      : "Send Reset Link"}
                </Button>
              </form>
            )}
            {mode === "login" && (
              <>
                <button className="mt-5 text-sm underline" onClick={() => setMode("forgot")}>
                  Forgot password?
                </button>
                <div className="my-8 flex items-center gap-4 text-xs">
                  <span className="h-px flex-1 bg-border" />
                  OR
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Button variant="luxury-outline" className="w-full">
                  Continue with Google
                </Button>
                <p className="mt-10 text-center">
                  New to ENVIAAR?{" "}
                  <button className="underline" onClick={() => setMode("register")}>
                    Create account
                  </button>
                </p>
              </>
            )}
            {mode !== "login" && (
              <button
                className="mt-8 underline"
                onClick={() => {
                  setMode("login");
                  setDone(false);
                }}
              >
                Back to login
              </button>
            )}
          </motion.aside>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("enviaar-promo") !== "dismissed") {
      const timer = window.setTimeout(() => setOpen(true), 4000);
      return () => window.clearTimeout(timer);
    }
  }, []);
  const close = () => {
    localStorage.setItem("enviaar-promo", "dismissed");
    setOpen(false);
  };
  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={close}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="absolute left-1/2 top-1/2 grid w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-background md:grid-cols-2"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <img
              src={products[2].image}
              alt="ENVIAAR jewellery"
              className="hidden h-full min-h-96 w-full object-cover md:block"
            />
            <div className="relative p-8 text-center md:p-12">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3"
                onClick={close}
              >
                <X />
              </Button>
              <p className="text-xl tracking-[.22em]">ENVIAAR</p>
              <h2 className="mt-12 text-4xl">A Little Something For You</h2>
              <p className="mt-5 text-muted-foreground">
                Join the ENVIAAR circle and enjoy 10% off your first order.
              </p>
              <Input className="mt-8" type="email" placeholder="Email address" />
              <Button className="mt-3 w-full" variant="luxury" onClick={close}>
                Get My 10% Off
              </Button>
              <button className="mt-6 text-xs underline" onClick={close}>
                No thanks, I’ll continue browsing.
              </button>
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
