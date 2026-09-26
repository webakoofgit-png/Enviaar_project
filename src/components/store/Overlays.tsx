import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCircle2, ChevronRight, Minus, Plus, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/context/StoreContext";
import { money, products } from "@/data/store";
import { toast } from "sonner";

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
    navigate(`/search?q=${encodeURIComponent(query)}`);
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
                        to={`/product/${p.slug}`}
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
  const { accountOpen, setAccountOpen, registerCustomer, loginCustomer } = useStore();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successModal, setSuccessModal] = useState<{
    type: "register" | "login";
    name: string;
    email: string;
  } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMsg("");

    if (mode === "register") {
      if (password && confirmPassword && password !== confirmPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }
      setLoading(true);
      const res = await registerCustomer({ firstName, lastName, email, phone, password });
      setLoading(false);
      if (res.success) {
        toast.success("Account created successfully! Welcome to ENVIAAR.");
        setSuccessModal({
          type: "register",
          name: res.user?.name || `${firstName} ${lastName}`.trim() || "Valued Customer",
          email: res.user?.email || email,
        });
      } else {
        setErrorMsg(res.error || "Failed to create account");
      }
    } else if (mode === "login") {
      setLoading(true);
      const res = await loginCustomer({ email, password });
      setLoading(false);
      if (res.success) {
        toast.success("Welcome back to ENVIAAR!");
        setSuccessModal({
          type: "login",
          name: res.user?.name || email.split("@")[0] || "Valued Customer",
          email: res.user?.email || email,
        });
      } else {
        setErrorMsg(res.error || "Invalid login credentials");
      }
    } else {
      setDone(true);
    }
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

            {errorMsg && (
              <div className="mt-4 rounded border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            {done ? (
              <div className="mt-12 flex gap-3">
                <Check /> <p>Thank you. Check your email for the next step.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-10 space-y-5">
                {mode === "register" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      required
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      required
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                )}
                <Input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {mode === "register" && (
                  <Input
                    type="tel"
                    required
                    placeholder="Mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                )}
                {mode !== "forgot" && (
                  <Input
                    type="password"
                    minLength={6}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
                {mode === "register" && (
                  <>
                    <Input
                      type="password"
                      minLength={6}
                      required
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label className="flex gap-3 text-sm">
                      <input type="checkbox" defaultChecked /> Receive new collection and offer updates.
                    </label>
                  </>
                )}
                <Button type="submit" variant="luxury" size="lg" className="w-full" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : mode === "login"
                      ? "Login"
                      : mode === "register"
                        ? "Create Account"
                        : "Send Reset Link"}
                </Button>
              </form>
            )}
            {mode === "login" && (
              <>
                <button
                  className="mt-5 text-sm underline"
                  onClick={() => {
                    setMode("forgot");
                    setErrorMsg("");
                  }}
                >
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
                  <button
                    className="underline"
                    onClick={() => {
                      setMode("register");
                      setErrorMsg("");
                    }}
                  >
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
                  setErrorMsg("");
                }}
              >
                Back to login
              </button>
            )}
          </motion.aside>
        </Backdrop>
      )}

      {successModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
          onClick={() => {
            setSuccessModal(null);
            setAccountOpen(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-background border border-primary/20 p-6 sm:p-8 rounded-none shadow-2xl text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSuccessModal(null);
                setAccountOpen(false);
              }}
            >
              <X className="size-5" />
            </Button>

            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/30 mb-5">
              <Sparkles className="size-8" />
            </div>

            <p className="text-[11px] uppercase tracking-[.25em] text-muted-foreground font-semibold">ENVIAAR MEMBER</p>
            <h3 className="mt-2 text-3xl font-display text-foreground">
              {successModal.type === "register" ? "Account Created!" : "Login Successful!"}
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {successModal.type === "register"
                ? `Welcome to ENVIAAR, ${successModal.name}! Your account has been created successfully.`
                : `Welcome back, ${successModal.name}! You are now logged in.`}
            </p>

            <div className="mt-6 rounded-md bg-secondary/40 p-4 text-left text-xs space-y-2 border border-border/60">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account Holder:</span>
                <span className="font-semibold text-foreground">{successModal.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email Address:</span>
                <span className="font-semibold text-foreground truncate max-w-[200px]">{successModal.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Session Status:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> Active & Verified
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 w-full">
              <Button
                asChild
                variant="luxury"
                size="lg"
                className="w-full text-xs uppercase tracking-wider"
                onClick={() => {
                  setSuccessModal(null);
                  setAccountOpen(false);
                }}
              >
                <Link to="/account">Go to My Profile</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-xs uppercase tracking-wider"
                onClick={() => {
                  setSuccessModal(null);
                  setAccountOpen(false);
                }}
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("enviaar-promo") === "dismissed") return;
    const timer = window.setTimeout(() => setOpen(true), 4000);
    return () => window.clearTimeout(timer);
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
              src={products[2]?.image ?? ""}
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
              <img src="/image-copy.png" alt="ENVIAAR" className="h-8 w-auto mx-auto object-contain" />
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
