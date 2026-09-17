import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
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
import { useStore } from "@/context/StoreContext";
import { collectionInfo, images, money, products } from "@/data/store";
import type { Product } from "@/types/store";

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
  if (clean.startsWith("product/")) return <ProductPage slug={clean.split("/")[1]} />;
  if (clean.startsWith("collections/") && collectionPaths.has(clean.split("/")[1]))
    return <CollectionPage collection={clean.split("/")[1]} />;
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
  if (clean.startsWith("order/")) return <OrderPage id={clean.split("/")[1]} />;
  const policy = policies[clean];
  if (policy) return <PolicyPage title={policy.title} sections={policy.sections} />;
  return <NotFound />;
}

function PageHero({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy?: string }) {
  return (
    <header className="border-b bg-secondary/35 px-5 py-16 text-center md:py-24">
      <p className="text-xs uppercase tracking-[.2em] text-muted-foreground">
        {eyebrow ?? "ENVIAAR"}
      </p>
      <h1 className="mt-4 text-5xl md:text-7xl">{title}</h1>
      {copy && <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">{copy}</p>}
    </header>
  );
}

function Collections() {
  const entries = Object.entries(collectionInfo).filter(
    ([key]) => !["shop", "festive", "new-arrivals", "bestsellers"].includes(key),
  );
  return (
    <>
      <PageHero
        title="Collections"
        copy="Distinct expressions for every day, every celebration and every version of you."
      />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-16 md:grid-cols-3 md:gap-6 md:px-10">
        {entries.map(([key, item], i) => (
          <Link
            key={key}
            to={`/collections/${key}` as "/shop"}
            className={`group relative overflow-hidden ${i % 5 === 0 ? "md:col-span-2" : ""}`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="aspect-[4/5] h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-0 p-5 text-primary-foreground">
              <h2 className="text-3xl md:text-5xl">{item.title}</h2>
              <p className="mt-2 text-xs uppercase tracking-[.16em]">Explore collection</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function ProductPage({ slug }: { slug: string }) {
  const product = products.find((p) => p.slug === slug);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [finish, setFinish] = useState(product?.colors[0] ?? "Gold");
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  const [pin, setPin] = useState("");
  const [delivery, setDelivery] = useState("");
  useEffect(() => {
    if (!product) return;
    const current = JSON.parse(localStorage.getItem("enviaar-recent") ?? "[]") as string[];
    localStorage.setItem(
      "enviaar-recent",
      JSON.stringify([product.id, ...current.filter((id) => id !== product.id)].slice(0, 6)),
    );
  }, [product]);
  if (!product) return <NotFound />;
  const gallery = [
    product.image,
    product.alternateImage,
    images.productsEditorial,
    product.category === "mens" ? images.mens : images.festive,
  ];
  const add = () => {
    for (let i = 0; i < quantity; i++) addToCart(product, finish, size);
  };
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-10">
      <p className="mb-7 text-xs text-muted-foreground">
        <Link to="/shop">Shop</Link> / {product.name}
      </p>
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
        <div className="grid gap-3 md:grid-cols-[90px_1fr]">
          <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:block">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`mb-3 shrink-0 border ${selected === i ? "border-primary" : "border-transparent"}`}
              >
                <img src={src} alt="" className="h-24 w-20 object-cover" />
              </button>
            ))}
          </div>
          <button
            className="order-1 cursor-zoom-in overflow-hidden bg-muted md:order-2"
            onClick={() => window.open(gallery[selected], "_blank")}
            title="Open full-size image"
          >
            <img
              src={gallery[selected]}
              alt={product.name}
              className="aspect-[4/5] h-full w-full object-cover transition duration-700 hover:scale-110"
            />
          </button>
        </div>
        <div className="lg:sticky lg:top-40 lg:self-start">
          <p className="text-xs uppercase tracking-[.16em]">{product.badge ?? product.category}</p>
          <h1 className="mt-3 text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Star size={15} className="fill-current" /> {product.rating} · 128 reviews
          </div>
          <p className="mt-6 text-xl">{money(product.price)}</p>
          <p className="mt-6 leading-7 text-muted-foreground">{product.description}</p>
          <Option title="Finish" values={product.colors} value={finish} onChange={setFinish} />
          {product.sizes && (
            <Option title="Size" values={product.sizes} value={size ?? ""} onChange={setSize} />
          )}
          <div className="mt-7 flex w-32 items-center justify-between border">
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
          <form
            className="mt-8 flex gap-2 border-t pt-7"
            onSubmit={(e) => {
              e.preventDefault();
              setDelivery(
                /^\d{6}$/.test(pin)
                  ? "Delivery available in 3–5 business days."
                  : "Enter a valid 6-digit PIN code.",
              );
            }}
          >
            <Input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              placeholder="Enter PIN Code"
            />
            <Button type="submit" variant="outline">
              Check
            </Button>
          </form>
          {delivery && <p className="mt-2 text-sm">{delivery}</p>}
          <div className="mt-8 grid grid-cols-3 border-y py-5 text-center text-[11px]">
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
              <details key={x} className="border-b py-5">
                <summary className="flex cursor-pointer list-none justify-between">
                  {x}
                  <ChevronDown size={16} />
                </summary>
                <p className="pt-4 text-sm leading-6 text-muted-foreground">
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
    <div className="mt-7">
      <p className="mb-3 text-xs uppercase tracking-[.14em]">
        {title}: {value}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`border px-4 py-2 text-sm ${value === v ? "border-primary bg-primary text-primary-foreground" : ""}`}
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
    <section className="py-20">
      <h2 className="mb-10 text-center text-5xl">{title}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);
  const subtotal = cart.reduce((s, x) => s + x.product.price * x.quantity, 0);
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  return (
    <>
      <PageHero title="Shopping Cart" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[1fr_380px]">
        {" "}
        <div>
          {cart.length === 0 ? (
            <Empty title="Your bag is empty" />
          ) : (
            cart.map(({ product, quantity, finish, size }) => (
              <div
                key={`${product.id}-${finish}-${size}`}
                className="grid grid-cols-[90px_1fr_auto] gap-4 border-b py-5"
              >
                <img src={product.image} alt={product.name} className="h-28 w-24 object-cover" />
                <div>
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    className="font-display text-xl"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {finish}
                    {size ? ` · ${size}` : ""}
                  </p>
                  <div className="mt-4 flex w-28 items-center justify-between border">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-2"
                    >
                      <Minus size={13} />
                    </button>
                    {quantity}
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-2"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p>{money(product.price * quantity)}</p>
                  <button onClick={() => removeFromCart(product.id)} className="mt-12">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <aside className="h-fit bg-secondary/35 p-7">
          <h2 className="text-3xl">Order Summary</h2>
          <form
            className="mt-6 flex"
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
          <div className="mt-5 flex justify-between border-t pt-5 text-lg">
            <strong>Total</strong>
            <strong>{money(subtotal - discount)}</strong>
          </div>
          <Button asChild variant="luxury" size="lg" className="mt-7 w-full">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
function SummaryRow({ label, value, text }: { label: string; value?: number; text?: string }) {
  return (
    <div className="mt-5 flex justify-between text-sm">
      <span>{label}</span>
      <span>{text ?? money(value ?? 0)}</span>
    </div>
  );
}

function CheckoutPage() {
  const { cart } = useStore();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const total = cart.reduce((s, x) => s + x.product.price * x.quantity, 0);
  if (placed)
    return (
      <Success
        title="Order confirmed"
        copy="Thank you for choosing ENVIAAR. Your order number is ENV-2026-1042."
      />
    );
  return (
    <>
      <PageHero title="Checkout" eyebrow="SECURE CHECKOUT" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-10 flex gap-3 text-sm">
            {["Information", "Shipping", "Payment"].map((x, i) => (
              <span key={x} className={step === i ? "font-bold" : "text-muted-foreground"}>
                {i + 1}. {x}
              </span>
            ))}
          </div>
          {step === 0 && <FormGrid fields={["Email Address", "Mobile Number"]} />}{" "}
          {step === 1 && (
            <FormGrid
              fields={["Full Name", "Address", "Apartment / Landmark", "City", "State", "PIN Code"]}
            />
          )}{" "}
          {step === 2 && (
            <div className="space-y-3">
              {["UPI", "Credit / Debit Card", "Net Banking", "Wallet", "Cash on Delivery"].map(
                (x, i) => (
                  <label key={x} className="flex gap-3 border p-4">
                    <input type="radio" name="payment" defaultChecked={i === 0} />
                    {x}
                  </label>
                ),
              )}
              <p className="text-xs text-muted-foreground">
                Payment options are UI placeholders for this frontend prototype.
              </p>
            </div>
          )}
          <div className="mt-8 flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button
              variant="luxury"
              onClick={() => (step < 2 ? setStep(step + 1) : setPlaced(true))}
            >
              {step < 2 ? "Continue" : "Place Order"}
            </Button>
          </div>
        </div>
        <aside className="h-fit bg-secondary/35 p-6">
          <h2 className="text-3xl">Your Order</h2>
          {cart.map((x) => (
            <div key={x.product.id} className="mt-5 flex gap-3">
              <img src={x.product.image} className="h-16 w-14 object-cover" />
              <div className="flex-1 text-sm">
                {x.product.name}
                <p className="text-xs text-muted-foreground">Qty {x.quantity}</p>
              </div>
              <span>{money(x.product.price * x.quantity)}</span>
            </div>
          ))}
          <div className="mt-6 flex justify-between border-t pt-5">
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
    <form className="grid gap-4 md:grid-cols-2">
      {fields.map((x, i) => (
        <Input
          key={x}
          required
          placeholder={x}
          className={i === 1 && fields.length > 2 ? "md:col-span-2" : ""}
        />
      ))}
    </form>
  );
}

function WishlistPage() {
  const { wishlist } = useStore();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <>
      <PageHero title="Wishlist" copy="The pieces you would love to return to." />
      <div className="mx-auto max-w-7xl px-5 py-16">
        {list.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
function SearchPage() {
  const initial =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("q") ?? "")
      : "";
  const [q, setQ] = useState(initial);
  const list = useMemo(
    () =>
      products.filter((p) =>
        `${p.name} ${p.category} ${p.material} ${p.finish}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );
  return (
    <>
      <PageHero title="Search ENVIAAR" />
      <div className="mx-auto max-w-7xl px-5 py-12">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search jewellery, collections and materials"
          className="mx-auto h-14 max-w-2xl text-lg"
        />
        <p className="my-8 text-sm">
          {list.length} results {q && `for “${q}”`}
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}

function AboutPage() {
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
            className={`h-[520px] w-full object-cover ${i % 2 ? "md:order-2" : ""}`}
            alt={title}
          />
          <div className="flex items-center px-8 py-16 md:px-20">
            <div>
              <p className="text-xs tracking-[.18em]">THE ENVIAAR PHILOSOPHY</p>
              <h2 className="mt-5 text-5xl">{title}</h2>
              <p className="mt-6 max-w-lg leading-7 text-muted-foreground">{copy}</p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
function ContactPage() {
  const [done, setDone] = useState(false);
  return (
    <>
      <PageHero
        title="We’d Love to Hear From You"
        copy="Questions about a piece, an order or jewellery care? Our team is here to help."
      />
      <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-3xl">Contact</h2>
          <p className="mt-5 text-sm leading-7">
            care@enviaar.com
            <br />
            Monday–Saturday, 10am–6pm IST
          </p>
          <a
            className="mt-5 inline-block underline"
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
            className="grid gap-4 md:grid-cols-2"
          >
            <Input required placeholder="Name" />
            <Input required type="email" placeholder="Email" />
            <Input required placeholder="Phone" />
            <Input required placeholder="Subject" />
            <Textarea required placeholder="Message" className="min-h-40 md:col-span-2" />
            <Button variant="luxury" size="lg" className="md:col-span-2">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </>
  );
}

function AccountPage() {
  const { isLoggedIn, setAccountOpen, logout } = useStore();
  if (!isLoggedIn)
    return (
      <>
        <PageHero title="Customer Account" />
        <div className="py-24 text-center">
          <p className="text-muted-foreground">
            Sign in to view your profile, addresses and orders.
          </p>
          <Button className="mt-6" variant="luxury" onClick={() => setAccountOpen(true)}>
            Login / Create Account
          </Button>
        </div>
      </>
    );
  return (
    <>
      <PageHero title="Welcome Back" />
      <div className="mx-auto grid max-w-5xl gap-4 px-5 py-16 md:grid-cols-4">
        {["Profile", "Addresses", "Orders", "Wishlist"].map((x) => (
          <Link
            key={x}
            to={x === "Orders" ? "/orders" : x === "Wishlist" ? "/wishlist" : "/account"}
            className="border p-8 text-center font-display text-2xl"
          >
            {x}
          </Link>
        ))}
      </div>
      <div className="pb-16 text-center">
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </>
  );
}
function OrdersPage() {
  return (
    <>
      <PageHero title="My Orders" />
      <div className="mx-auto max-w-4xl px-5 py-16">
        <Link
          to="/order/$id"
          params={{ id: "ENV-2026-1042" }}
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
function OrderPage({ id }: { id: string }) {
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

function PolicyPage({ title, sections }: { title: string; sections: string[] }) {
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
const policies: Record<string, { title: string; sections: string[] }> = {
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
function NotFound() {
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
