import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { collectionInfo, products } from "@/data/store";
import type { Product } from "@/types/store";

export function CollectionPage({ collection = "shop" }: { collection?: string }) {
  const info = collectionInfo[collection] ?? collectionInfo.shop;
  const [sort, setSort] = useState("featured");
  const [material, setMaterial] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [limit, setLimit] = useState(8);
  const [quick, setQuick] = useState<Product | null>(null);
  const list = useMemo(() => {
    let value = ["shop", "new-arrivals", "bestsellers", "festive"].includes(collection)
      ? [...products]
      : products.filter((p) => p.category === collection);
    if (collection === "new-arrivals") value = value.filter((p) => p.badge === "NEW");
    if (collection === "bestsellers") value = value.filter((p) => p.badge === "BESTSELLER");
    if (material) value = value.filter((p) => `${p.material} ${p.finish}`.includes(material));
    if (sort === "low") value.sort((a, b) => a.price - b.price);
    if (sort === "high") value.sort((a, b) => b.price - a.price);
    if (sort === "newest") value.reverse();
    return value;
  }, [collection, material, sort]);
  return (
    <div>
      <section className="relative h-[42vh] min-h-80">
        <img src={info.image} alt={info.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-5 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[.16em]">Home / {info.title}</p>
            <h1 className="mt-5 text-6xl md:text-8xl">{info.title}</h1>
            <p className="mt-4 text-muted-foreground">{info.copy}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-10">
        <div className="mb-8 flex items-center justify-between border-b pb-5">
          <p className="text-sm">{list.length} pieces</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setFilterOpen(!filterOpen)}>
              <SlidersHorizontal /> Filters
            </Button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border bg-background px-3 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="low">Price Low to High</option>
              <option value="high">Price High to Low</option>
            </select>
          </div>
        </div>
        {filterOpen && (
          <div className="mb-8 flex flex-wrap gap-3 bg-secondary/45 p-5">
            {[
              "",
              "92.5 Silver",
              "Gold Plated",
              "Rhodium Plated",
              "Anti-Tarnish",
              "Hypoallergenic",
            ].map((label) => (
              <Button
                key={label || "all"}
                variant={material === label ? "default" : "outline"}
                onClick={() => setMaterial(label)}
              >
                {label || "All finishes"}
              </Button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {list.slice(0, limit).map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuick} />
          ))}
        </div>
        {limit < list.length && (
          <div className="mt-14 text-center">
            <Button variant="luxury-outline" size="lg" onClick={() => setLimit((n) => n + 8)}>
              Load More
            </Button>
          </div>
        )}
      </section>
      <Dialog open={Boolean(quick)} onOpenChange={() => setQuick(null)}>
        <DialogContent className="max-w-3xl rounded-none">
          <DialogHeader>
            <DialogTitle className="text-3xl">Quick View</DialogTitle>
          </DialogHeader>
          {quick && (
            <div className="grid gap-6 md:grid-cols-2">
              <img
                src={quick.image}
                alt={quick.name}
                className="aspect-square w-full object-cover"
              />
              <div className="self-center">
                <h3 className="text-4xl">{quick.name}</h3>
                <p className="mt-4 text-muted-foreground">{quick.description}</p>
                <Button asChild variant="luxury" size="lg" className="mt-8">
                  <a href={`/product/${quick.slug}`}>View Product</a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
