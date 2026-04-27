import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard, { ProductCardData } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-lehenga.jpg";
import catLehenga from "@/assets/cat-lehenga.jpg";
import catSaree from "@/assets/cat-saree.jpg";
import catSuit from "@/assets/cat-suit.jpg";
import bannerCraft from "@/assets/banner-craft.jpg";
import { BRAND_NAME } from "@/lib/brand";

const categories = [
  { slug: "lehenga", label: "Lehengas", subtitle: "Bridal & Festive", img: catLehenga },
  { slug: "saree", label: "Sarees", subtitle: "Banarasi · Silk · Designer", img: catSaree },
  { slug: "suit", label: "Unstitched Suits", subtitle: "Pure fabrics, your fit", img: catSuit },
];

export default function Home() {
  const [featured, setFeatured] = useState<ProductCardData[]>([]);

  useEffect(() => {
    document.title = `${BRAND_NAME} — Heritage Indian Couture | Lehengas, Sarees, Suits`;
    const meta = document.querySelector('meta[name="description"]') ?? document.head.appendChild(Object.assign(document.createElement("meta"), { name: "description" }));
    meta.setAttribute("content", "Shop premium sarees, bridal lehengas, festive lehengas, and ethnic suits from Chandni Chowk, New Delhi, curated for every wedding, festival, and celebration.");

    supabase
      .from("products")
      .select("id,name,slug,price,original_price,category,in_stock,product_images(url,position)")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data) setFeatured(data as any);
        else setFeatured([]);
      });
  }, []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden">
        <img src={heroImg} alt="Bridal lehenga" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/30 via-primary-deep/20 to-primary-deep/70" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-primary-foreground animate-fade-up">
              <p className="text-gold-light tracking-[0.3em] text-xs uppercase mb-6 flex items-center gap-3">
                <span className="w-12 h-px bg-gold-light" /> Bridal Edit 2026
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6 text-balance">
                Threads of Heritage,<br />
                <span className="text-gradient-gold italic">Woven for You</span>
              </h1>
              <p className="text-lg opacity-90 mb-8 max-w-lg leading-relaxed">
                <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8 leading-relaxed">
  Shop premium sarees, bridal lehengas, festive lehengas, and ethnic suits from Chandni Chowk, New Delhi — curated for every wedding, festival, and celebration.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="gold">
                  <Link to="/shop">Shop The Collection <ArrowRight className="ml-2" size={18} /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/shop/lehenga">Bridal Lehengas</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Sparkles, label: "Handcrafted", sub: "By Delhi artisans" },
            { icon: Truck, label: "Free Shipping", sub: "Across India" },
            { icon: ShieldCheck, label: "Premium Fabric", sub: "Quality assured" },
            { icon: MessageCircle, label: "WhatsApp Order", sub: "Personal service" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3 justify-center">
              <f.icon className="text-gold-deep shrink-0" size={22} />
              <div className="text-left">
                <p className="text-sm font-medium">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-gold-deep tracking-[0.3em] text-xs uppercase mb-3">Our Edits</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Shop by Category</h2>
          <div className="ornament-divider max-w-xs mx-auto">✦</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`} className="group relative aspect-[3/4] overflow-hidden block">
              <img src={c.img} alt={c.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-primary-foreground">
                <p className="text-gold-light text-xs tracking-[0.3em] uppercase mb-2">{c.subtitle}</p>
                <h3 className="font-serif text-3xl mb-3">{c.label}</h3>
                <span className="inline-flex items-center text-sm border-b border-gold-light/60 pb-1 group-hover:border-gold-light transition-smooth">
                  Explore <ArrowRight size={14} className="ml-2" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <p className="text-gold-deep tracking-[0.3em] text-xs uppercase mb-3">New Arrivals</p>
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Featured Pieces</h2>
            <div className="ornament-divider max-w-xs mx-auto">✦</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">View All Products <ArrowRight size={16} className="ml-2" /></Link>
            </Button>
          </div>
        </section>
      )}

      {/* CRAFT BANNER */}
      <section className="relative my-20 overflow-hidden">
        <img src={bannerCraft} alt="Indian craftsmanship" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary-deep/70" />
        <div className="relative z-10 container mx-auto px-4 py-24 text-center text-primary-foreground">
          <p className="text-gold-light tracking-[0.3em] text-xs uppercase mb-4">Our Heritage</p>
          <h2 className="font-serif text-4xl md:text-6xl mb-6 max-w-3xl mx-auto leading-tight text-balance">
            Every weave tells a story. <span className="italic text-gradient-gold">Yours begins here.</span>
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Rooted in Chandni Chowk, every Jindal Vastrakala piece is curated with love, bringing elegant sarees, and lehengas for weddings, festivals, and everyday celebrations.
          </p>
          <Button asChild variant="gold" size="lg">
            <Link to="/shop">Discover the Collection</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
