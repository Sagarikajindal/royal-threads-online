import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Package, ImageIcon, Star } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { formatINR, BRAND_NAME, CATEGORIES } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  product_images: { url: string }[];
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    document.title = `Admin Panel | ${BRAND_NAME}`;
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    if (!isAdmin) { toast({ title: "Access denied", description: "Admin only.", variant: "destructive" }); navigate("/"); return; }
    refresh();
  }, [user, isAdmin, loading, navigate]);

  const refresh = async () => {
    setBusy(true);
    const { data } = await supabase
      .from("products")
      .select("id,name,slug,category,price,in_stock,featured,created_at,product_images(url)")
      .order("created_at", { ascending: false });
    setProducts((data as any) ?? []);
    setBusy(false);
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Deleted" });
    refresh();
  };

  if (loading || !isAdmin) return <Layout><div className="container mx-auto px-4 py-20 text-center">Loading...</div></Layout>;

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.in_stock).length,
    featured: products.filter((p) => p.featured).length,
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-gold-deep tracking-[0.3em] text-xs uppercase mb-2">Inventory</p>
            <h1 className="font-serif text-4xl text-primary">Admin Panel</h1>
          </div>
          <Button asChild size="lg" variant="gold">
            <Link to="/admin/new"><Plus className="mr-2" size={18} /> Add New Product</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Card className="p-6 flex items-center gap-4"><Package className="text-gold-deep" /><div><p className="text-2xl font-serif text-primary">{stats.total}</p><p className="text-xs uppercase tracking-wider text-muted-foreground">Total Products</p></div></Card>
          <Card className="p-6 flex items-center gap-4"><ImageIcon className="text-gold-deep" /><div><p className="text-2xl font-serif text-primary">{stats.inStock}</p><p className="text-xs uppercase tracking-wider text-muted-foreground">In Stock</p></div></Card>
          <Card className="p-6 flex items-center gap-4"><Star className="text-gold-deep" /><div><p className="text-2xl font-serif text-primary">{stats.featured}</p><p className="text-xs uppercase tracking-wider text-muted-foreground">Featured</p></div></Card>
        </div>

        {busy ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="mx-auto text-gold-deep mb-4" size={40} />
            <h2 className="font-serif text-2xl text-primary mb-2">No products yet</h2>
            <p className="text-muted-foreground mb-6">Upload your first piece to get started.</p>
            <Button asChild variant="gold"><Link to="/admin/new"><Plus className="mr-2" size={18} /> Add First Product</Link></Button>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {products.map((p) => (
                <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-smooth">
                  <div className="w-16 h-20 bg-muted overflow-hidden shrink-0">
                    {p.product_images?.[0]?.url ? <img src={p.product_images[0].url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon size={20} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1 items-center">
                      <Badge variant="outline" className="text-[10px] uppercase">{CATEGORIES.find(c => c.slug === p.category)?.label ?? p.category}</Badge>
                      <span className="text-sm text-primary font-medium">{formatINR(p.price)}</span>
                      {!p.in_stock && <Badge variant="destructive" className="text-[10px]">Sold Out</Badge>}
                      {p.featured && <Badge className="text-[10px] bg-gold text-gold-foreground">Featured</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" size="icon"><Link to={`/admin/edit/${p.id}`}><Pencil size={16} /></Link></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id, p.name)}><Trash2 size={16} className="text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>
    </Layout>
  );
}
