import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Gem, HeartHandshake, ShieldCheck, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/ProductCard";
import { PromoPopup } from "@/components/store/Overlays";
import { images, money } from "@/data/store";
import { useStore } from "@/context/StoreContext";
import type { Product } from "@/types/store";

const categories = [
  {
    name: "Earrings",
    key: "earrings",
    image: images.festive,
    className: "md:col-span-7 md:row-span-2",
  },
  { name: "Necklaces", key: "necklaces", image: images.hero, className: "md:col-span-5" },
  {
    name: "Bracelets",
    key: "bracelets",
    image: images.productsEditorial,
    className: "md:col-span-5",
  },
  { name: "Rings", key: "rings", image: images.productsEditorial, className: "md:col-span-4" },
  { name: "Mangalsutra", key: "mangalsutra", image: images.hero, className: "md:col-span-4" },
  { name: "Men’s", key: "mens", image: images.mens, className: "md:col-span-4" },
];

export function HomePage() {
  const { products } = useStore();
  const [look, setLook] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-5rem)] sm:min-h-[calc(100svh-7.75rem)] items-end overflow-hidden md:items-center">
        <motion.img
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8 }}
          src={images.hero}
          alt="ENVIAAR jewellery campaign"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/25 to-transparent sm:from-background/75 sm:via-background/10" />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pb-12 sm:pb-16 md:px-10 md:pb-0">
          <div className="max-w-xl">
            <p className="text-xs sm:text-sm tracking-[.25em]">ENVIAAR</p>
            <h1 className="mt-3 sm:mt-5 text-4xl sm:text-6xl md:text-7xl leading-[1.05] sm:leading-[.98]">
              Jewellery, Made to Stay With You.
            </h1>
            <p className="mt-4 sm:mt-6 max-w-lg text-xs sm:text-sm leading-6 md:text-base text-foreground/90">
              Contemporary jewellery designed for everyday elegance and memorable occasions.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="luxury" size="lg" className="w-full sm:w-auto">
                <Link to="/new-arrivals">Shop New Arrivals</Link>
              </Button>
              <Button asChild variant="luxury-outline" size="lg" className="w-full sm:w-auto">
                <Link to="/collections">Explore Collections</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-5 pt-12 sm:pt-20 md:pt-24 pb-6 sm:pb-10 md:pb-12 md:px-10">
        <SectionTitle eyebrow="A WORLD OF ENVIAAR" title="Shop by Category" />
        <div className="mt-8 sm:mt-12 grid auto-rows-[220px] sm:auto-rows-[280px] grid-cols-2 gap-2.5 sm:gap-3 md:auto-rows-[310px] md:grid-cols-12">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/collections/${cat.key}`}
              className={`group relative overflow-hidden ${cat.className}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 text-primary-foreground">
                <h3 className="text-2xl sm:text-3xl md:text-4xl">{cat.name}</h3>
                <span className="mt-1 inline-block translate-y-0 sm:translate-y-2 text-xs uppercase tracking-[.16em] opacity-100 sm:opacity-0 transition sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProductSection title="New Arrivals" products={products.slice(0, 4)} />

      <section className="grid bg-secondary/45 md:grid-cols-2">
        <img
          src={images.productsEditorial}
          alt="ENVIAAR jewellery on silk"
          loading="lazy"
          className="h-[340px] sm:h-[480px] md:h-[720px] w-full object-cover"
        />
        <div className="flex items-center px-5 py-12 sm:px-8 sm:py-16 md:px-20">
          <div>
            <p className="text-xs uppercase tracking-[.18em]">Our Story</p>
            <h2 className="mt-4 sm:mt-6 max-w-lg text-3xl sm:text-5xl md:text-7xl leading-tight md:leading-none">
              Jewellery for Every Version of You.
            </h2>
            <p className="mt-5 sm:mt-8 max-w-lg text-sm sm:text-base leading-6 sm:leading-7 text-muted-foreground">
              ENVIAAR creates modern jewellery that moves naturally between quiet mornings,
              important celebrations and gifts that become part of someone’s story.
            </p>
            <Button asChild variant="luxury-outline" size="lg" className="mt-7 sm:mt-9 w-full sm:w-auto">
              <Link to="/about">Discover ENVIAAR</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-14 sm:py-24 md:px-10 md:py-32">
        <SectionTitle eyebrow="CURATED FOR YOU" title="Shop the Look" />
        <div className="relative mt-8 sm:mt-12">
          <img
            src={images.hero}
            alt="ENVIAAR complete jewellery look"
            loading="lazy"
            className="h-[420px] sm:h-[600px] md:h-[760px] w-full object-cover"
          />
          {[0, 2].map((index, i) => {
            const item = products[index];
            if (!item) return null;
            return (
              <div
                key={index}
                className={`absolute ${i ? "left-[58%] top-[34%]" : "left-[68%] top-[20%]"}`}
              >
                <Button
                  size="icon"
                  className="size-8 sm:size-9 rounded-full border border-primary-foreground bg-background/90 text-foreground hover:bg-background shadow-md"
                  onClick={() => setLook(look === index ? null : index)}
                  aria-label={`View ${item.name}`}
                >
                  <span className="text-lg">+</span>
                </Button>
                {look === index && (
                  <div className="absolute left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 top-11 z-20 flex w-52 sm:w-64 gap-2.5 bg-background p-3 shadow-xl border">
                    <img src={item.image} alt="" className="h-16 sm:h-20 w-14 sm:w-16 object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm sm:text-lg truncate">{item.name}</p>
                      <p className="text-xs font-medium">{money(item.price)}</p>
                      <Link
                        to={`/product/${item.slug}`}
                        className="mt-1.5 inline-block text-xs underline"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative min-h-[460px] sm:min-h-[620px] overflow-hidden">
        <img
          src={images.festive}
          alt="The festive edit"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="relative flex min-h-[460px] sm:min-h-[620px] items-end px-5 py-12 sm:px-8 sm:py-16 text-primary-foreground md:px-16">
          <div>
            <p className="text-xs uppercase tracking-[.2em]">For every celebration</p>
            <h2 className="mt-3 sm:mt-4 text-4xl sm:text-6xl md:text-8xl">The Festive Edit</h2>
            <p className="mt-4 sm:mt-5 max-w-lg text-sm sm:text-base text-primary-foreground/90">
              Statement pieces created for celebrations, occasions and everything worth remembering.
            </p>
            <Button asChild variant="secondary" size="lg" className="mt-6 sm:mt-8 rounded-none w-full sm:w-auto">
              <Link to="/festive">Explore Festive Jewellery</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y px-4 sm:px-5 py-10 sm:py-14 md:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 gap-x-4 sm:gap-y-10 md:grid-cols-4">
          {([
            [Sparkles, "ANTI-TARNISH", "Designed for lasting shine."],
            [HeartHandshake, "HYPOALLERGENIC", "Made with comfort in mind."],
            [ShieldCheck, "PREMIUM FINISH", "Rhodium & gold-plated selections."],
            [Gem, "92.5 SILVER", "Selected sterling silver pieces."],
          ] as const).map(([Icon, title, copy]) => (
            <div
              key={title}
              className="border-border px-2 sm:px-4 text-center md:border-r last:border-r-0"
            >
              <Icon className="mx-auto mb-3 sm:mb-4" size={22} strokeWidth={1} />
              <p className="text-xs tracking-[.16em] font-medium">{title}</p>
              <p className="mt-1.5 sm:mt-2 text-xs text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <ProductSection title="Bestsellers" products={products.slice(2, 6)} />

      <section className="grid md:grid-cols-[55%_45%] border-y">
        <img
          src={images.mens}
          alt="ENVIAAR for him"
          loading="lazy"
          className="h-[360px] sm:h-[480px] md:h-[720px] w-full object-cover"
        />
        <div className="flex items-center bg-accent/40 px-5 py-12 sm:px-8 sm:py-16 md:px-20 border-t md:border-t-0 md:border-l border-border/60">
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-muted-foreground font-medium">MEN’S COLLECTION</p>
            <h2 className="mt-4 sm:mt-5 text-4xl sm:text-5xl md:text-6xl text-foreground font-display">ENVIAAR for Him</h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Bracelets, rings and quiet signatures for the modern man.
            </p>
            <Button asChild variant="luxury-outline" size="lg" className="mt-6 sm:mt-8 border-foreground/30 text-foreground hover:bg-foreground hover:text-background w-full sm:w-auto">
              <Link to="/collections/mens">Shop Men</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-5 py-14 sm:py-24 text-center md:px-10 md:py-32">
        <SectionTitle eyebrow="FOLLOW OUR WORLD OF JEWELLERY" title="@ENVIAAR" />
        <div className="mx-auto mt-8 sm:mt-12 grid max-w-7xl grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            images.productsEditorial,
            images.festive,
            images.hero,
            images.mens,
            products[0]?.image ?? "",
            products[5]?.image ?? "",
          ].map((image, i) => (
            <button
              key={i}
              className="group aspect-square overflow-hidden"
              onClick={() => setLightbox(image)}
              aria-label="Open Instagram image"
            >
              <img
                src={image}
                alt={`ENVIAAR journal ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
        <Button asChild variant="luxury-outline" size="lg" className="mt-8 sm:mt-10 w-full sm:w-auto">
          <a href="https://www.instagram.com/enviaar" target="_blank" rel="noreferrer">
            Follow on Instagram
          </a>
        </Button>
      </section>
      <section className="bg-secondary/45 px-4 sm:px-5 py-14 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-5xl">Stay in the ENVIAAR Circle.</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubscribed(true);
          }}
          className="mx-auto mt-6 sm:mt-8 flex flex-col sm:flex-row max-w-lg border-b border-primary gap-2 sm:gap-0 pb-2 sm:pb-0"
        >
          <input
            required
            type="email"
            placeholder="Your email address"
            className="h-11 sm:h-12 flex-1 bg-transparent text-sm sm:text-base outline-none px-2"
          />
          <Button type="submit" variant="ghost">
            {subscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </form>
      </section>
      <AnimateLightbox image={lightbox} onClose={() => setLightbox(null)} />
      <PromoPopup />
    </>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-xs tracking-[.18em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-4 text-5xl md:text-6xl">{title}</h2>
    </div>
  );
}
function ProductSection({ title, products: list }: { title: string; products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:py-14 md:px-10 md:py-16">
      <SectionTitle eyebrow="THE LATEST EDIT" title={title} />
      <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-6">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
function AnimateLightbox({ image, onClose }: { image: string | null; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  return image ? (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-foreground/80 p-5"
      onClick={onClose}
    >
      <Button variant="secondary" size="icon" className="absolute right-5 top-5" onClick={onClose}>
        <X />
      </Button>
      <img
        src={image}
        alt="ENVIAAR gallery preview"
        className="max-h-[90vh] max-w-full object-contain"
      />
    </div>
  ) : null;
}
