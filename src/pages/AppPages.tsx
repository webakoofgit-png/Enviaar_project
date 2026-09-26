import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductCard } from "@/components/store/ProductCard";
import { CollectionPage } from "./CollectionPage";
import { CustomerProfilePage } from "./CustomerProfilePage";
import { useStore } from "@/context/StoreContext";
import { collectionInfo, images, money } from "@/data/store";
import type { MediaItem, Product } from "@/types/store";
import { saveOrder, type CustomerOrder } from "@/lib/orderStorage";

const collectionPaths = new Set([
  "shop",
  "earrings",
  "bracelets",
  "necklaces",
  "rings",
  "kada",
  "mangalsutra",
  "mens",
  "brooches",
  "baby",
  "festive",
  "new-arrivals",
  "bestsellers",
]);

export function AppPage({ path }: { path: string }) {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const parts = clean.split("/");
  const sub = parts[1] ?? "";
  if (clean.startsWith("product/")) return <ProductPage slug={sub} />;
  if (clean.startsWith("collections/") && collectionPaths.has(sub))
    return <CollectionPage collection={sub} />;
  if (clean === "collections") return <Collections />;
  if (collectionPaths.has(clean)) return <CollectionPage collection={clean} />;
  if (clean === "cart") return <CartPage />;
  if (clean === "checkout") return <CheckoutPage />;
  if (clean === "wishlist") return <WishlistPage />;
  if (clean === "search") return <SearchPage />;
  if (clean === "about") return <AboutPage />;
  if (clean === "contact") return <ContactPage />;
  if (clean === "account") return <AccountPage />;
  if (clean === "orders") return <OrdersPage />;
  if (clean.startsWith("order/")) return <OrderPage id={sub} />;
  const policy = policies[clean as keyof typeof policies];
  if (policy) return <PolicyPage title={policy.title} sections={policy.sections} />;
  return <NotFound />;
}

function PageHero({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy?: string }) {
  return (
    <header className="border-b bg-secondary/35 px-4 py-10 text-center sm:py-16 md:py-24">
      <p className="text-xs uppercase tracking-[.2em] text-muted-foreground">
        {eyebrow ?? "ENVIAAR"}
      </p>
      <h1 className="mt-3 text-3xl sm:text-5xl md:text-7xl">{title}</h1>
      {copy && <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-base text-muted-foreground px-2">{copy}</p>}
    </header>
  );
}

export function Collections() {
  const entries = Object.entries(collectionInfo).filter(
    ([key]) => !["shop", "festive", "new-arrivals", "bestsellers"].includes(key),
  );
  return (
    <>
      <PageHero
        title="Collections"
        copy="Distinct expressions for every day, every celebration and every version of you."
      />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2.5 sm:gap-4 px-4 py-10 sm:py-16 md:grid-cols-3 md:gap-6 md:px-10">
        {entries.map(([key, item], i) => (
          <Link
            key={key}
            to={`/collections/${key}`}
            className={`group relative overflow-hidden ${i % 5 === 0 ? "col-span-2 md:col-span-2" : ""}`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="aspect-[4/5] h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-0 p-3.5 sm:p-5 text-primary-foreground">
              <h2 className="text-2xl sm:text-3xl md:text-5xl">{item.title}</h2>
              <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-[.16em]">Explore collection</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export function ProductPage({ slug }: { slug: string }) {
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const product = products.find((p) => p.slug === slug || p.id === slug);
  const [finish, setFinish] = useState(product?.colors[0] ?? "Gold");
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!product) return;
    const current = JSON.parse(localStorage.getItem("enviaar-recent") ?? "[]") as string[];
    localStorage.setItem(
      "enviaar-recent",
      JSON.stringify([product.id, ...current.filter((id) => id !== product.id)].slice(0, 6)),
    );
  }, [product]);
  if (!product) return <NotFound />;
  const gallery = useMemo(() => {
    if (product.media && product.media.length > 0) {
      return product.media;
    }
    const items: MediaItem[] = [];
    if (product.image) items.push({ id: "1", url: product.image, type: "image" });
    if (product.alternateImage && product.alternateImage !== product.image) {
      items.push({ id: "2", url: product.alternateImage, type: "image" });
    }
    return items;
  }, [product]);

  const add = () => {
    for (let i = 0; i < quantity; i++) addToCart(product, finish, size);
  };
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:py-8 md:px-10">
      <p className="mb-5 sm:mb-7 text-xs text-muted-foreground truncate">
        <Link to="/shop">Shop</Link> / {product.name}
      </p>
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-[3fr_2fr]">
        <div className="grid gap-3 md:grid-cols-[90px_1fr]">
          <div className="order-2 flex gap-2 overflow-x-auto pb-2 md:order-1 md:block md:pb-0">
            {gallery.map((item, i) => (
              <button
                key={item.id || i}
                onClick={() => setSelected(i)}
                className={`mb-3 shrink-0 border overflow-hidden ${selected === i ? "border-primary" : "border-transparent"}`}
              >
                {item.type === "video" ? (
                  <video src={item.url} className="h-20 w-16 sm:h-24 sm:w-20 object-cover pointer-events-none" muted />
                ) : (
                  <img src={item.url} alt="" className="h-20 w-16 sm:h-24 sm:w-20 object-cover" />
                )}
              </button>
            ))}
          </div>
          <div className="order-1 cursor-pointer overflow-hidden bg-muted md:order-2 aspect-[4/5] w-full">
            {gallery[selected]?.type === "video" ? (
              <video
                src={gallery[selected]?.url}
                controls
                autoPlay
                loop
                muted
                className="aspect-[4/5] h-full w-full object-cover"
              />
            ) : (
              <img
                src={gallery[selected]?.url ?? product.image}
                alt={product.name}
                onClick={() => window.open(gallery[selected]?.url ?? product.image, "_blank")}
                className="aspect-[4/5] h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            )}
          </div>
        </div>
        <div className="lg:sticky lg:top-40 lg:self-start">
          <p className="text-xs uppercase tracking-[.16em]">{product.badge ?? product.category}</p>
          <h1 className="mt-2 sm:mt-3 text-3xl sm:text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-sm">
            <Star size={15} className="fill-current" /> {product.rating} · 128 reviews
          </div>
          <p className="mt-4 sm:mt-6 text-xl sm:text-2xl font-medium">{money(product.price)}</p>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-6 sm:leading-7 text-muted-foreground">{product.description}</p>
          <Option title="Finish" values={product.colors} value={finish} onChange={setFinish} />
          {product.sizes && (
            <Option title="Size" values={product.sizes} value={size ?? ""} onChange={setSize} />
          )}
          <div className="mt-6 sm:mt-7 flex w-32 items-center justify-between border">
            <button className="p-3" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus size={15} />
            </button>
            {quantity}
            <button className="p-3" onClick={() => setQuantity(quantity + 1)}>
              <Plus size={15} />
            </button>
          </div>
          <Button variant="luxury" size="lg" className="mt-4 w-full" onClick={add}>
            Add to Bag
          </Button>
          <Button variant="luxury-outline" size="lg" className="mt-3 w-full" asChild>
            <Link to="/checkout">Buy It Now</Link>
          </Button>
          <button
            className="mt-5 flex items-center gap-2 text-sm"
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart size={17} className={wishlist.includes(product.id) ? "fill-current" : ""} />{" "}
            {wishlist.includes(product.id) ? "Saved to wishlist" : "Add to wishlist"}
          </button>
          <div className="mt-6 sm:mt-8 grid grid-cols-3 border-y py-4 sm:py-5 text-center text-[10px] sm:text-[11px]">
            <span>
              <ShieldCheck className="mx-auto mb-2" />
              Secure Payments
            </span>
            <span>
              <Truck className="mx-auto mb-2" />
              Easy Support
            </span>
            <span>
              <Check className="mx-auto mb-2" />
              Quality Checked
            </span>
          </div>
          {["Product Details", "Materials & Finish", "Jewellery Care", "Shipping & Returns"].map(
            (x) => (
              <details key={x} className="border-b py-4 sm:py-5">
                <summary className="flex cursor-pointer list-none justify-between text-sm sm:text-base">
                  {x}
                  <ChevronDown size={16} />
                </summary>
                <p className="pt-3 text-xs sm:text-sm leading-6 text-muted-foreground">
                  Thoughtfully finished, quality checked and packed with care. Store separately and
                  keep away from perfumes and moisture.
                </p>
              </details>
            ),
          )}
        </div>
      </div>
      <ProductRail
        title="You May Also Like"
        list={products.filter((p) => p.id !== product.id).slice(0, 4)}
      />
    </div>
  );
}

function Option({
  title,
  values,
  value,
  onChange,
}: {
  title: string;
  values: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-6 sm:mt-7">
      <p className="mb-2.5 text-xs uppercase tracking-[.14em]">
        {title}: {value}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`border px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm ${value === v ? "border-primary bg-primary text-primary-foreground font-medium" : ""}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
function ProductRail({ title, list }: { title: string; list: Product[] }) {
  return (
    <section className="py-14 sm:py-20">
      <h2 className="mb-8 sm:mb-10 text-center text-3xl sm:text-5xl">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

export function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);
  const subtotal = cart.reduce((s, x) => s + x.product.price * x.quantity, 0);
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  return (
    <>
      <PageHero title="Shopping Cart" />
      <div className="mx-auto grid max-w-6xl gap-8 sm:gap-12 px-4 sm:px-5 py-10 sm:py-14 lg:grid-cols-[1fr_380px]">
        <div>
          {cart.length === 0 ? (
            <Empty title="Your bag is empty" />
          ) : (
            cart.map(({ product, quantity, finish, size }) => (
              <div
                key={`${product.id}-${finish}-${size}`}
                className="grid grid-cols-[75px_1fr_auto] sm:grid-cols-[90px_1fr_auto] gap-3 sm:gap-4 border-b py-4 sm:py-5"
              >
                <img src={product.image} alt={product.name} className="h-24 w-20 sm:h-28 sm:w-24 object-cover" />
                <div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="font-display text-base sm:text-xl line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {finish}
                    {size ? ` · ${size}` : ""}
                  </p>
                  <div className="mt-3 flex w-24 sm:w-28 items-center justify-between border">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 sm:p-2"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-xs sm:text-sm">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 sm:p-2"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <p className="text-sm font-medium">{money(product.price * quantity)}</p>
                  <button onClick={() => removeFromCart(product.id)} className="self-end text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <aside className="h-fit bg-secondary/35 p-5 sm:p-7">
          <h2 className="text-2xl sm:text-3xl">Order Summary</h2>
          <form
            className="mt-5 sm:mt-6 flex"
            onSubmit={(e) => {
              e.preventDefault();
              setApplied(coupon.trim().toUpperCase() === "ENVIAAR10");
            }}
          >
            <Input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon code"
            />
            <Button>Apply</Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">Try ENVIAAR10</p>
          <SummaryRow label="Subtotal" value={subtotal} />
          <SummaryRow label="Discount" value={-discount} />
          <SummaryRow
            label="Shipping"
            text={subtotal >= 5000 ? "Complimentary" : "Calculated at checkout"}
          />
          <div className="mt-5 flex justify-between border-t pt-5 text-base sm:text-lg">
            <strong>Total</strong>
            <strong>{money(subtotal - discount)}</strong>
          </div>
          <Button asChild variant="luxury" size="lg" className="mt-6 sm:mt-7 w-full">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
function SummaryRow({ label, value, text }: { label: string; value?: number; text?: string }) {
  return (
    <div className="mt-4 sm:mt-5 flex justify-between text-xs sm:text-sm">
      <span>{label}</span>
      <span>{text ?? money(value ?? 0)}</span>
    </div>
  );
}

export function CheckoutPage() {
  const { cart, user } = useStore();
  const [step, setStep] = useState(0);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("");

  const [email, setEmail] = useState(user?.email || "customer@enviaar.com");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [fullName, setFullName] = useState(user?.name || "Customer User");
  const [address, setAddress] = useState("402 Royal Palms, Bandra West");
  const [apartment, setApartment] = useState("Landmark: Near St. Theresa");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("400050");
  const [paymentMethod, setPaymentMethod] = useState("UPI (Google Pay)");

  const total = cart.reduce((s, x) => s + x.product.price * x.quantity, 0);

  const handlePlaceOrder = async () => {
    const generatedOrderNum = `ENV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullShippingAddr = `${address}${apartment ? `, ${apartment}` : ""}, ${city}, ${state} - ${pincode}`;

    const orderObj: CustomerOrder = {
      id: `ord_${Date.now()}`,
      orderNumber: generatedOrderNum,
      customerName: fullName || "Valued Customer",
      customerEmail: email || "customer@enviaar.com",
      customerPhone: phone || "",
      shippingAddress: fullShippingAddr,
      paymentMethod: paymentMethod,
      paymentStatus: (paymentMethod === "Cash on Delivery" || paymentMethod.toLowerCase().includes("cod") || paymentMethod.toLowerCase().includes("cash")) ? "Unpaid" : "Paid",
      status: "Processing",
      totalAmount: total > 0 ? total : 7980,
      items: cart.map((c) => ({
        id: c.product.id,
        name: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        image: c.product.image,
        finish: c.finish,
        ...(c.size ? { size: c.size } : {}),
      })),
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    // Save to localStorage orderStorage
    saveOrder(orderObj);

    // Save to Express Backend API
    try {
      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderObj),
      });
    } catch (err) {
      console.warn("Backend API offline during order submit, saved to local storage");
    }

    setPlacedOrderNumber(generatedOrderNum);
  };

  if (placedOrderNumber)
    return (
      <Success
        title="Order confirmed!"
        copy={`Thank you for choosing ENVIAAR. Your order number is ${placedOrderNumber}. Your order is now visible in the Admin Panel and your Customer Account page.`}
      />
    );

  return (
    <>
      <PageHero title="Checkout" eyebrow="SECURE CHECKOUT" />
      <div className="mx-auto grid max-w-6xl gap-8 sm:gap-10 px-4 sm:px-5 py-10 sm:py-14 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-8 sm:mb-10 flex flex-wrap gap-3 text-xs sm:text-sm">
            {["Information", "Shipping", "Payment"].map((x, i) => (
              <span key={x} className={step === i ? "font-bold text-foreground" : "text-muted-foreground"}>
                {i + 1}. {x}
              </span>
            ))}
          </div>

          {step === 0 && (
            <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email Address</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Mobile Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Mobile Number" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Full Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Full Name" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Street Address</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Address" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Apartment / Landmark</label>
                <Input value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Apartment / Suite / Landmark" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">City</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="City" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">State</label>
                <Input value={state} onChange={(e) => setState(e.target.value)} required placeholder="State" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-muted-foreground">PIN Code</label>
                <Input value={pincode} onChange={(e) => setPincode(e.target.value)} required placeholder="PIN Code" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {["UPI (Google Pay / PhonePe)", "Credit / Debit Card", "Net Banking", "Store Wallet Credit", "Cash on Delivery"].map(
                (x) => (
                  <label key={x} className="flex items-center gap-3 border p-3.5 sm:p-4 text-sm cursor-pointer hover:bg-muted/30 transition">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === x}
                      onChange={() => setPaymentMethod(x)}
                    />
                    {x}
                  </label>
                ),
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button
              variant="luxury"
              onClick={() => {
                if (step < 2) {
                  setStep(step + 1);
                } else {
                  handlePlaceOrder();
                }
              }}
            >
              {step < 2 ? "Continue" : "Place Order"}
            </Button>
          </div>
        </div>

        <aside className="h-fit bg-secondary/35 p-5 sm:p-6">
          <h2 className="text-2xl sm:text-3xl">Your Order</h2>
          {cart.map((x) => (
            <div key={`${x.product.id}-${x.finish}-${x.size}`} className="mt-4 sm:mt-5 flex gap-3">
              <img src={x.product.image} className="h-14 w-12 sm:h-16 sm:w-14 object-cover" />
              <div className="flex-1 text-xs sm:text-sm">
                <p className="font-medium line-clamp-1">{x.product.name}</p>
                <p className="text-xs text-muted-foreground">Qty {x.quantity} {x.finish ? `· ${x.finish}` : ""}</p>
              </div>
              <span className="text-xs sm:text-sm font-medium">{money(x.product.price * x.quantity)}</span>
            </div>
          ))}
          <div className="mt-6 flex justify-between border-t pt-4 sm:pt-5 text-sm sm:text-base">
            <strong>Total</strong>
            <strong>{money(total)}</strong>
          </div>
        </aside>
      </div>
    </>
  );
}
function FormGrid({ fields }: { fields: string[] }) {
  return (
    <form className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
      {fields.map((x, i) => (
        <Input
          key={x}
          required
          placeholder={x}
          className={i === 1 && fields.length > 2 ? "sm:col-span-2" : ""}
        />
      ))}
    </form>
  );
}

export function WishlistPage() {
  const { products, wishlist } = useStore();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <>
      <PageHero title="Wishlist" copy="The pieces you would love to return to." />
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-10 sm:py-16">
        {list.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <Empty title="Your wishlist is waiting" />
        )}
      </div>
    </>
  );
}
export function SearchPage() {
  const { products } = useStore();
  const [searchParams] = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const list = useMemo(
    () =>
      products.filter((p) =>
        `${p.name} ${p.category} ${p.material} ${p.finish}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [q, products],
  );
  return (
    <>
      <PageHero title="Search ENVIAAR" />
      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-10 sm:py-12">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search jewellery, collections and materials"
          className="mx-auto h-12 sm:h-14 max-w-2xl text-base sm:text-lg"
        />
        <p className="my-6 sm:my-8 text-xs sm:text-sm text-center sm:text-left">
          {list.length} results {q && `for “${q}”`}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR STORY"
        title="Jewellery for Every Version of You."
        copy="An independent jewellery label creating modern keepsakes for the everyday and the unforgettable."
      />
      {[
        [
          images.hero,
          "Our Story",
          "ENVIAAR began with a simple idea: jewellery should move with your life—not wait for an occasion.",
        ],
        [
          images.productsEditorial,
          "Materials & Craft",
          "From selected sterling silver to thoughtful gold and rhodium finishes, every detail is considered.",
        ],
        [
          images.festive,
          "Everyday to Occasion",
          "Quiet essentials and expressive statements, designed to feel naturally yours.",
        ],
      ].map(([img, title, copy], i) => (
        <section key={title} className="grid md:grid-cols-2">
          <img
            src={img}
            className={`h-[280px] sm:h-[420px] md:h-[520px] w-full object-cover ${i % 2 ? "md:order-2" : ""}`}
            alt={title}
          />
          <div className="flex items-center px-5 py-10 sm:px-8 sm:py-16 md:px-20">
            <div>
              <p className="text-xs tracking-[.18em]">THE ENVIAAR PHILOSOPHY</p>
              <h2 className="mt-3 sm:mt-5 text-3xl sm:text-5xl">{title}</h2>
              <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base leading-6 sm:leading-7 text-muted-foreground">{copy}</p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
export function ContactPage() {
  const [done, setDone] = useState(false);
  return (
    <>
      <PageHero
        title="We’d Love to Hear From You"
        copy="Questions about a piece, an order or jewellery care? Our team is here to help."
      />
      <div className="mx-auto grid max-w-5xl gap-8 sm:gap-12 px-4 sm:px-5 py-10 sm:py-16 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-2xl sm:text-3xl">Contact</h2>
          <p className="mt-4 sm:mt-5 text-xs sm:text-sm leading-6 sm:leading-7">
            care@enviaar.com
            <br />
            Monday–Saturday, 10am–6pm IST
          </p>
          <a
            className="mt-4 sm:mt-5 inline-block text-xs sm:text-sm underline"
            href="https://www.instagram.com/enviaar"
            target="_blank"
            rel="noreferrer"
          >
            Instagram @enviaar
          </a>
        </div>
        {done ? (
          <SuccessBlock />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="grid gap-3.5 sm:gap-4 md:grid-cols-2"
          >
            <Input required placeholder="Name" />
            <Input required type="email" placeholder="Email" />
            <Input required placeholder="Phone" />
            <Input required placeholder="Subject" />
            <Textarea required placeholder="Message" className="min-h-32 sm:min-h-40 md:col-span-2" />
            <Button variant="luxury" size="lg" className="md:col-span-2 w-full">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </>
  );
}

export function AccountPage() {
  return <CustomerProfilePage />;
}
export function OrdersPage() {
  return (
    <>
      <PageHero title="My Orders" />
      <div className="mx-auto max-w-4xl px-5 py-16">
        <Link
          to="/order/ENV-2026-1042"
          className="grid gap-4 border p-6 sm:grid-cols-4"
        >
          <span>
            <small>Order</small>
            <br />
            ENV-2026-1042
          </span>
          <span>
            <small>Date</small>
            <br />
            17 Sep 2026
          </span>
          <span>
            <small>Status</small>
            <br />
            Processing
          </span>
          <span>
            <small>Total</small>
            <br />
            ₹7,980
          </span>
        </Link>
      </div>
    </>
  );
}
export function OrderPage({ id }: { id: string }) {
  return (
    <>
      <PageHero title={`Order ${id}`} />
      <div className="mx-auto max-w-3xl px-5 py-16">
        <div className="border p-7">
          <p className="text-xs tracking-[.16em]">STATUS</p>
          <h2 className="mt-3 text-4xl">Processing</h2>
          <p className="mt-4 text-muted-foreground">
            Your order is being quality checked and prepared with care.
          </p>
          <div className="mt-8 h-1 bg-muted">
            <div className="h-full w-1/2 bg-primary" />
          </div>
        </div>
      </div>
    </>
  );
}

export function PolicyPage({ title, sections }: { title: string; sections: string[] }) {
  return (
    <>
      <PageHero title={title} />
      <article className="mx-auto max-w-3xl px-5 py-16">
        {sections.map((x, i) => (
          <section key={x} className="mb-10">
            <h2 className="text-3xl">
              {i + 1}. {x}
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              We keep our policies clear and considered. For assistance, contact care@enviaar.com
              with your order details and our support team will guide you through the applicable
              process.
            </p>
          </section>
        ))}
      </article>
    </>
  );
}
export const policies = {
  privacy: {
    title: "Privacy Policy",
    sections: ["Information We Collect", "How We Use Information", "Your Choices"],
  },
  terms: { title: "Terms & Conditions", sections: ["Website Use", "Products & Pricing", "Orders"] },
  "shipping-policy": { title: "Shipping Policy", sections: ["Processing", "Delivery", "Tracking"] },
  returns: {
    title: "Return / Exchange Policy",
    sections: ["Eligibility", "Exchange Process", "Refunds"],
  },
  "care-guide": {
    title: "Jewellery Care Guide",
    sections: ["Everyday Care", "Storage", "Cleaning"],
  },
};
function Empty({ title }: { title: string }) {
  return (
    <div className="py-24 text-center">
      <h2 className="text-4xl">{title}</h2>
      <Button asChild variant="luxury-outline" className="mt-7">
        <Link to="/shop">Explore Jewellery</Link>
      </Button>
    </div>
  );
}
function Success({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div>
        <Check className="mx-auto mb-6" size={40} />
        <h1 className="text-6xl">{title}</h1>
        <p className="mt-5 text-muted-foreground">{copy}</p>
        <Button asChild className="mt-8" variant="luxury">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
function SuccessBlock() {
  return (
    <div className="grid min-h-64 place-items-center border text-center">
      <div>
        <Check className="mx-auto" />
        <h2 className="mt-4 text-4xl">Message Sent</h2>
        <p className="mt-2 text-muted-foreground">We’ll be in touch shortly.</p>
      </div>
    </div>
  );
}
export function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-xs tracking-[.2em]">404</p>
        <h1 className="mt-4 text-6xl">Page not found</h1>
        <Button asChild className="mt-8" variant="luxury">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
