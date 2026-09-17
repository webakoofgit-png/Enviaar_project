import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Gem, HeartHandshake, ShieldCheck, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/ProductCard";
import { PromoPopup } from "@/components/store/Overlays";
import { images, money, products } from "@/data/store";

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
  const [look, setLook] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-7.75rem)] items-end overflow-hidden md:items-center">
        <motion.img
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8 }}
          src={images.hero}
          alt="ENVIAAR jewellery campaign"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/10 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 md:px-10 md:pb-0">
          <div className="max-w-xl">
            <p className="text-sm tracking-[.25em]">ENVIAAR</p>
            <h1 className="mt-5 text-5xl leading-[.98] sm:text-7xl">
              Jewellery, Made to Stay With You.
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-6 md:text-base">
              Contemporary jewellery designed for everyday elegance and memorable occasions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="luxury" size="lg">
                <Link to="/new-arrivals">Shop New Arrivals</Link>
              </Button>
              <Button asChild variant="luxury-outline" size="lg">
                <Link to="/collections">Explore Collections</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <SectionTitle eyebrow="A WORLD OF ENVIAAR" title="Shop by Category" />
        <div className="mt-12 grid auto-rows-[260px] grid-cols-2 gap-3 md:auto-rows-[310px] md:grid-cols-12">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/collections/${cat.key}` as "/shop"}
              className={`group relative overflow-hidden ${cat.className}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <h3 className="text-3xl md:text-4xl">{cat.name}</h3>
                <span className="mt-1 inline-block translate-y-2 text-xs uppercase tracking-[.16em] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
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
          className="h-[520px] w-full object-cover md:h-[720px]"
        />
        <div className="flex items-center px-7 py-16 md:px-20">
          <div>
            <p className="text-xs uppercase tracking-[.18em]">Our Story</p>
            <h2 className="mt-6 max-w-lg text-5xl leading-none md:text-7xl">
              Jewellery for Every Version of You.
            </h2>
            <p className="mt-8 max-w-lg leading-7 text-muted-foreground">
              ENVIAAR creates modern jewellery that moves naturally between quiet mornings,
              important celebrations and gifts that become part of someone’s story.
            </p>
            <Button asChild variant="luxury-outline" size="lg" className="mt-9">
              <Link to="/about">Discover ENVIAAR</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <SectionTitle eyebrow="CURATED FOR YOU" title="Shop the Look" />
        <div className="relative mt-12">
          <img
            src={images.hero}
            alt="ENVIAAR complete jewellery look"
            loading="lazy"
            className="h-[600px] w-full object-cover md:h-[760px]"
          />
          {[0, 2].map((index, i) => (
            <div
              key={index}
              className={`absolute ${i ? "left-[62%] top-[34%]" : "left-[72%] top-[20%]"}`}
            >
              <Button
                size="icon"
                className="rounded-full border border-primary-foreground bg-background/85 text-foreground hover:bg-background"
                onClick={() => setLook(look === index ? null : index)}
                aria-label={`View ${products[index].name}`}
              >
                <span>+</span>
              </Button>
              {look === index && (
                <div className="absolute right-0 top-12 z-10 flex w-64 gap-3 bg-background p-3 shadow-xl">
                  <img src={products[index].image} alt="" className="h-20 w-16 object-cover" />
                  <div>
                    <p className="font-display text-lg">{products[index].name}</p>
                    <p className="text-xs">{money(products[index].price)}</p>
                    <Link
                      to="/product/$slug"
                      params={{ slug: products[index].slug }}
                      className="mt-2 inline-block text-xs underline"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="relative min-h-[620px] overflow-hidden">
        <img
          src={images.festive}
          alt="The festive edit"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/25" />
        <div className="relative flex min-h-[620px] items-end px-6 py-16 text-primary-foreground md:px-16">
          <div>
            <p className="text-xs uppercase tracking-[.2em]">For every celebration</p>
            <h2 className="mt-4 text-6xl md:text-8xl">The Festive Edit</h2>
            <p className="mt-5 max-w-lg">
              Statement pieces created for celebrations, occasions and everything worth remembering.
            </p>
            <Button asChild variant="secondary" size="lg" className="mt-8 rounded-none">
              <Link to="/festive">Explore Festive Jewellery</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y px-5 py-14 md:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 md:grid-cols-4">
          {[
            [Sparkles, "ANTI-TARNISH", "Designed for lasting shine."],
            [HeartHandshake, "HYPOALLERGENIC", "Made with comfort in mind."],
            [ShieldCheck, "PREMIUM FINISH", "Rhodium & gold-plated selections."],
            [Gem, "92.5 SILVER", "Selected sterling silver pieces."],
          ].map(([Icon, title, copy]) => (
            <div
              key={String(title)}
              className="border-border px-4 text-center md:border-r last:border-r-0"
            >
              <Icon className="mx-auto mb-4" size={22} strokeWidth={1} />
              <p className="text-xs tracking-[.16em]">{String(title)}</p>
              <p className="mt-2 text-xs text-muted-foreground">{String(copy)}</p>
            </div>
          ))}
        </div>
      </section>
      <ProductSection title="Bestsellers" products={products.slice(2, 6)} />

      <section className="grid md:grid-cols-[55%_45%]">
        <img
          src={images.mens}
          alt="ENVIAAR for him"
          loading="lazy"
          className="h-[560px] w-full object-cover md:h-[720px]"
        />
        <div className="flex items-center bg-primary px-8 py-16 text-primary-foreground md:px-20">
          <div>
            <p className="text-xs tracking-[.18em]">MEN’S COLLECTION</p>
            <h2 className="mt-5 text-6xl">ENVIAAR for Him</h2>
            <p className="mt-6 text-primary-foreground/75">
              Bracelets, rings and quiet signatures for the modern man.
            </p>
            <Button asChild variant="secondary" size="lg" className="mt-8 rounded-none">
              <Link to="/collections/mens">Shop Men</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 text-center md:px-10 md:py-32">
        <SectionTitle eyebrow="FOLLOW OUR WORLD OF JEWELLERY" title="@ENVIAAR" />
        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-2 md:grid-cols-6">
          {[
            images.productsEditorial,
            images.festive,
            images.hero,
            images.mens,
            products[0].image,
            products[5].image,
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
        <Button asChild variant="luxury-outline" size="lg" className="mt-10">
          <a href="https://www.instagram.com/enviaar" target="_blank" rel="noreferrer">
            Follow on Instagram
          </a>
        </Button>
      </section>
      <section className="bg-secondary/45 px-5 py-20 text-center">
        <h2 className="text-5xl">Stay in the ENVIAAR Circle.</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubscribed(true);
          }}
          className="mx-auto mt-8 flex max-w-lg border-b border-primary"
        >
          <input
            required
            type="email"
            placeholder="Your email address"
            className="h-12 flex-1 bg-transparent outline-none"
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
function ProductSection({ title, products: list }: { title: string; products: typeof products }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
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
