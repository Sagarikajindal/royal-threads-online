import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/brand";
import { cn } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  category: string;
  in_stock: boolean;
  product_images: { url: string; position: number }[];
}

interface Props {
  product: ProductCardData;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
}

export default function ProductCard({ product, isWishlisted, onToggleWishlist }: Props) {
  const img = product.product_images?.[0]?.url ?? "/placeholder.svg";
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group relative">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-none uppercase text-[10px] tracking-wider">
              {discount}% Off
            </Badge>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
              <span className="bg-background px-4 py-2 text-xs uppercase tracking-widest font-medium">Sold Out</span>
            </div>
          )}
        </div>
        <div className="text-center px-1">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-smooth line-clamp-1">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-primary font-medium">{formatINR(product.price)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-muted-foreground line-through">{formatINR(product.original_price)}</span>
            )}
          </div>
        </div>
      </Link>
      {onToggleWishlist && (
        <button
          onClick={(e) => { e.preventDefault(); onToggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-card hover:bg-background transition-smooth"
          aria-label="Toggle wishlist"
        >
          <Heart size={16} className={cn("transition-smooth", isWishlisted ? "fill-primary text-primary" : "text-foreground")} />
        </button>
      )}
    </div>
  );
}
