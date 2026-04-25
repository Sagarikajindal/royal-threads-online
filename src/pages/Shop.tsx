import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard, { ProductCardData } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, BRAND_NAME } from "@/lib/brand";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Shop() {
  const { category } = useParams();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const cat = CATEGORIES.find((c) => c.slug === category);
  const title = cat ? cat.label : "All Collections";

  useEffect(() => {
    document.title = `${title} | ${BRAND_NAME}`;
    setLoading(true);
    const q = supabase
      .from("products")
      .select("id,name,slug,price,original_price,category,in_stock,product_images(url,position)")
      .order("created_at", { ascending: false });
    const query = category ? q.eq("category", category) : q;
    query.then(({ data }) => {
      setProducts((data as any) ?? []);
      setLoading(false);
    });
  }, [category, title]);

  useEffect(() => {
    if (!user) return;
    supabase.from("wishlists").select("product_id").eq("user_id", user.id).then(({ data }) => {
      if (data) setWishlist(new Set(data.map((d: any) => d.product_id)));
    });
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast({ title: "Please sign in", description: "Create an account to save your favorites." });
      return;
    }
    if (wishlist.has(productId)) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId);
      setWishlist((s) => { const n = new Set(s); n.delete(productId); return n; });
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
      setWishlist((s) => new Set(s).add(productId));
      toast({ title: "Added to wishlist ❤" });
    }
  };

  return (
    <Layout>
      <section className="bg-secondary/40 border-b border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold-deep tracking-[0.3em] text-xs uppercase mb-3">Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-3">{title}</h1>
          <p className="text-muted-foreground text-sm">{products.length} pieces</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <Link to="/shop" className={`px-4 py-2 text-xs uppercase tracking-widest border transition-smooth ${!category ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}>All</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`} className={`px-4 py-2 text-xs uppercase tracking-widest border transition-smooth ${category === c.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}>
              {c.label}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}><Skeleton className="aspect-[3/4] mb-4" /><Skeleton className="h-4 w-3/4 mx-auto mb-2" /><Skeleton className="h-4 w-1/2 mx-auto" /></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-primary mb-2">No pieces yet</p>
            <p className="text-muted-foreground">New arrivals are being curated. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} isWishlisted={wishlist.has(p.id)} onToggleWishlist={toggleWishlist} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
