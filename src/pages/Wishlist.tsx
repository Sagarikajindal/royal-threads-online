import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard, { ProductCardData } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND_NAME } from "@/lib/brand";

export default function Wishlist() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = `Wishlist | ${BRAND_NAME}`;
    if (!user) return;
    supabase
      .from("wishlists")
      .select("product_id, products(id,name,slug,price,original_price,category,in_stock,product_images(url,position))")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const items = (data ?? []).map((d: any) => d.products).filter(Boolean);
        setProducts(items);
        setWishlistIds(new Set(items.map((p: any) => p.id)));
      });
  }, [user]);

  const toggleWishlist = async (id: string) => {
    if (!user) return;
    await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", id);
    setProducts((p) => p.filter((x) => x.id !== id));
    setWishlistIds((s) => { const n = new Set(s); n.delete(id); return n; });
  };

  if (loading) return <Layout><div className="container mx-auto px-4 py-20 text-center">Loading...</div></Layout>;

  if (!user) {
    return <Layout><div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-serif text-3xl text-primary mb-4">Sign in to view your wishlist</h1>
      <Button asChild><Link to="/auth">Sign In</Link></Button>
    </div></Layout>;
  }

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-gold-deep tracking-[0.3em] text-xs uppercase mb-3">Saved For You</p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary">My Wishlist</h1>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No saved pieces yet.</p>
            <Button asChild><Link to="/shop">Start exploring</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} isWishlisted={wishlistIds.has(p.id)} onToggleWishlist={toggleWishlist} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
