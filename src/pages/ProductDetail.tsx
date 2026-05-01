import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Star, ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { buildWhatsAppLink, formatINR, BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

// Shopify imports
import { ShopifyBuyButton } from "@/components/ShopifyBuyButton";
import { SHOPIFY_CONFIG } from "@/shopify.config";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  original_price: number | null;
  description: string | null;
  fabric: string | null;
  color: string | null;
  in_stock: boolean;
  reel_url: string | null;
  shopify_id: string | null;
  product_images: { url: string; position: number }[];
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
}

const toEmbed = (url: string | null): string | null => {
  if (!url) return null;

  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/
  );

  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  const ig = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/);

  if (ig) return `https://www.instagram.com/reel/${ig[1]}/embed`;

  return null;
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    supabase
      .from("products")
      .select("*, product_images(url,position)")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const p = data as any;

          p.product_images = (p.product_images ?? []).sort(
            (a: any, b: any) => a.position - b.position
          );

          setProduct(p);
          document.title = `${p.name} | ${BRAND_NAME}`;
        }

        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    supabase
      .from("reviews")
      .select("*")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews((data as any) ?? []));

    if (user) {
      supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle()
        .then(({ data }) => setIsWishlisted(!!data));
    }
  }, [product, user]);

  const toggleWishlist = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!product) return;

    if (isWishlisted) {
      await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      setIsWishlisted(false);
    } else {
      await supabase.from("wishlists").insert({
        user_id: user.id,
        product_id: product.id,
      });

      setIsWishlisted(true);

      toast({
        title: "Saved to wishlist ❤",
      });
    }
  };

  const submitReview = async () => {
    if (!user || !product) {
      navigate("/auth");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("reviews").upsert(
      {
        user_id: user.id,
        product_id: product.id,
        rating: myRating,
        comment: myComment.trim() || null,
      },
      {
        onConflict: "product_id,user_id",
      }
    );

    setSubmitting(false);

    if (error) {
      toast({
        title: "Could not save review",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    toast({
      title: "Review posted!",
    });

    setMyComment("");

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false });

    setReviews((data as any) ?? []);
  };

  const share = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);

      toast({
        title: "Link copied",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-[3/4]" />

          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl text-primary mb-4">
            Product not found
          </h1>

          <Button asChild>
            <Link to="/shop">Browse collection</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const embed = toEmbed(product.reel_url);

  const images = product.product_images.length
    ? product.product_images
    : [{ url: "/placeholder.svg", position: 0 }];

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) /
            product.original_price) *
            100
        )
      : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/shop"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-smooth"
        >
          <ChevronLeft size={16} />
          Back to collection
        </Link>
      </div>

      <section className="container mx-auto px-4 pb-12 grid lg:grid-cols-2 gap-12">
        {/* IMAGES */}
        <div>
          <div className="aspect-[3/4] bg-muted overflow-hidden mb-4">
            <img
              src={images[activeImg].url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "aspect-square overflow-hidden border-2 transition-smooth",
                    activeImg === i ? "border-primary" : "border-transparent"
                  )}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <p className="text-gold-deep tracking-[0.3em] text-xs uppercase mb-3">
            {product.category}
          </p>

          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4 leading-tight">
            {product.name}
          </h1>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(avgRating)
                        ? "fill-gold text-gold"
                        : "text-muted-foreground"
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-3xl text-primary">
              {formatINR(product.price)}
            </span>

            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatINR(product.original_price)}
                </span>

                <Badge className="bg-primary text-primary-foreground rounded-none">
                  {discount}% OFF
                </Badge>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-foreground/80 leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          <div className="border-t border-b border-border py-6 grid grid-cols-2 gap-4 mb-6 text-sm">
            {product.fabric && (
              <div>
                <span className="text-muted-foreground">Fabric:</span>{" "}
                <span className="font-medium">{product.fabric}</span>
              </div>
            )}

            {product.color && (
              <div>
                <span className="text-muted-foreground">Colour:</span>{" "}
                <span className="font-medium">{product.color}</span>
              </div>
            )}

            <div>
              <span className="text-muted-foreground">Status:</span>{" "}
              <span
                className={cn(
                  "font-medium",
                  product.in_stock ? "text-gold-deep" : "text-destructive"
                )}
              >
                {product.in_stock ? "In Stock" : "Sold Out"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground">Origin:</span>{" "}
              <span className="font-medium">New Delhi, India</span>
            </div>
          </div>

          {/* Shopify Buy Button */}
          {product.shopify_id && (
            <div className="mb-4">
              <ShopifyBuyButton
                productId={product.shopify_id}
                storefrontToken={SHOPIFY_CONFIG.storefrontToken}
                shopDomain={SHOPIFY_CONFIG.domain}
                buttonText="Buy Now — Pay with UPI / Card / COD"
                className="w-full"
              />
            </div>
          )}

          {/* WhatsApp, Wishlist and Share buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              asChild
              size="lg"
              className="flex-1"
              disabled={!product.in_stock}
            >
              <a
                href={buildWhatsAppLink(product.name, window.location.href)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="mr-2" size={18} />
                Inquire on WhatsApp
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={toggleWishlist}
              aria-label="Wishlist"
            >
              <Heart
                size={18}
                className={isWishlisted ? "fill-primary text-primary" : ""}
              />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={share}
              aria-label="Share"
            >
              <Share2 size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* REEL */}
      {embed && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-serif text-3xl text-primary text-center mb-8">
            See it in motion
          </h2>

          <div className="max-w-md mx-auto aspect-[9/16] bg-foreground overflow-hidden">
            <iframe
              src={embed}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${product.name} reel`}
            />
          </div>
        </section>
      )}

      {/* REVIEWS */}
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h2 className="font-serif text-3xl text-primary text-center mb-2">
          Customer Reviews
        </h2>

        <div className="ornament-divider max-w-xs mx-auto mb-10">✦</div>

        {user ? (
          <div className="bg-secondary/40 p-6 mb-8">
            <p className="text-sm font-medium mb-3">Share your experience</p>

            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMyRating(i + 1)}
                  aria-label={`${i + 1} stars`}
                >
                  <Star
                    size={24}
                    className={
                      i < myRating
                        ? "fill-gold text-gold"
                        : "text-muted-foreground"
                    }
                  />
                </button>
              ))}
            </div>

            <Textarea
              value={myComment}
              onChange={(e) => setMyComment(e.target.value.slice(0, 500))}
              placeholder="Tell others about the fabric, fit, craftsmanship..."
              rows={3}
              className="mb-3"
            />

            <Button onClick={submitReview} disabled={submitting}>
              {submitting ? "Posting..." : "Post Review"}
            </Button>
          </div>
        ) : (
          <div className="text-center bg-secondary/40 p-6 mb-8">
            <p className="text-sm mb-3">Sign in to leave a review</p>

            <Button asChild variant="outline">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Be the first to review this piece.
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-border pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < r.rating
                            ? "fill-gold text-gold"
                            : "text-muted-foreground"
                        }
                      />
                    ))}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                {r.comment && (
                  <p className="text-foreground/80">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
