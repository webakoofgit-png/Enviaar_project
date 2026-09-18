import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { money } from "@/data/store";
import type { Product } from "@/types/store";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] group-hover:opacity-0"
          />
          <img
            src={product.alternateImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] tracking-[0.12em]">
            {product.badge}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle wishlist"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-2 top-2 bg-background/80 hover:bg-background"
        >
          <Heart className={wishlist.includes(product.id) ? "fill-current" : ""} />
        </Button>
        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 flex gap-1.5 sm:gap-2 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition duration-300 focus-within:opacity-100 focus-within:translate-y-0">
          {onQuickView && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 rounded-none text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              onClick={() => onQuickView(product)}
            >
              Quick View
            </Button>
          )}
          <Button size="sm" className="flex-1 rounded-none text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9" onClick={() => addToCart(product)}>
            <ShoppingBag className="size-3.5 sm:size-4" /> Add
          </Button>
        </div>
      </div>
      <div className="pt-3 sm:pt-4 text-center">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="font-display text-base sm:text-xl line-clamp-1 hover:text-muted-foreground"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
          {product.material} · {product.finish}
        </p>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium">{money(product.price)}</p>
      </div>
    </article>
  );
}
