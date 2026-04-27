import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  MessageCircle,
  Instagram,
  PlayCircle,
  Star,
} from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard, { ProductCardData } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-lehenga.jpg";
import catLehenga from "@/assets/cat-lehenga.jpg";
import catSaree from "@/assets/cat-saree.jpg";
import bannerCraft from "@/assets/banner-craft.jpg";
import { BRAND_NAME } from "@/lib/brand";

const categories = [
  {
    slug: "lehenga",
    label: "Lehengas",
    subtitle: "Bridal · Festive · Designer",
    img: catLehenga,
  },
  {
    slug: "saree",
    label: "Sarees",
    subtitle: "Silk · Banarasi · Party Wear",
    img: catSaree,
  },
];

const customerFeedbackReels = [
  {
    title: "Customer Feedback",
    subtitle: "Real customer review from our Jindal Vastrakala family",
    url: "https://www.instagram.com/reel/DXoGXjUE1VT/",
  },
  {
    title: "Happy Customer Review",
    subtitle: "Loved by customers for sarees, lehengas, and festive wear",
    url: "https://www.instagram.com/reel/DWd3aackUX2/",
  },
  {
    title: "Customer Styling Moment",
    subtitle: "Real shopping experience from our Chandni Chowk collection",
    url: "https://www.instagram.com/reel/DW3pM3_EXiX/",
  },
  {
    title: "Customer Love",
    subtitle: "A beautiful moment shared by our customer",
    url: "https://www.instagram.com/p/DWh8aEPiAPX/",
  },
  {
    title: "Ethnicwear Review",
    subtitle: "Feedback from customers who trust Jindal Vastrakala",
    url: "https://www.instagram.com/reel/DWTmLGAEd_-/",
  },
  {
    title: "Real Customer Recording",
    subtitle: "Customer feedback for our Indian ethnicwear collection",
    url: "https://www.instagram.com/reel/DWGnBH7kdyM/",
  },
  {
    title: "Customer Experience",
    subtitle: "Trusted by women shopping for sarees and lehengas",
    url: "https://www.instagram.com/p/DV3CntDEXLX/",
  },
];

const getInstagramEmbedUrl = (url: string) => {
  const cleanUrl = url.split("?")[0].replace(/\/$/, "");
  return `${cleanUrl}/embed`;
};

export default function Home() {
  const [featured, setFeatured] = useState<ProductCardData[]>([]);

  useEffect(() => {
    document.title = `${BRAND_NAME} — Premium Sarees & Bridal Lehengas from Chandni Chowk`;

    const meta =
      document.querySelector('meta[name="description"]') ??
      document.head.appendChild(
        Object.assign(document.createElement("meta"), {
          name: "description",
        })
      );

    meta.setAttribute(
      "content",
      "Shop premium sarees, bridal lehengas, festive lehengas, and ethnic wear from Chandni Chowk, New Delhi. Curated for weddings, festivals, parties, and special occasions."
    );

    supabase
      .from("products")
      .select(
        "id,name,slug,price,original_price,category,in_stock,product_images(url,position)"
      )
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
        <img
          src={heroImg}
          alt="Premium bridal lehenga from Chandni Chowk"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/30 via-primary-deep/20 to-primary-deep/70" />

        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl animate-fade-up text-primary-foreground">
              <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold-light">
                <span className="h-px w-12 bg-gold-light" />
                Chandni Chowk Edit 2026
              </p>

              <h1 className="text-balance mb-6 font-serif text-5xl leading-[1.05] md:text-7xl">
                Threads of Heritage,
                <br />
                <span className="text-gradient-gold italic">
                  Woven for You
                </span>
              </h1>

              <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
                Shop premium sarees, bridal lehengas, festive lehengas, and
                ethnic wear from Chandni Chowk, New Delhi — curated for every
                wedding, festival, and celebration.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="gold">
                  <Link to="/shop">
                    Shop The Collection
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Link to="/shop/lehenga">Bridal Lehengas</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-6 text-center md:grid-cols-4">
          {[
            {
              icon: Sparkles,
              label: "Curated Pieces",
              sub: "From Chandni Chowk",
            },
            {
              icon: Truck,
              label: "Worldwide Shipping",
              sub: "Delivery available",
            },
            {
              icon: ShieldCheck,
              label: "Premium Fabric",
              sub: "Quality assured",
            },
            {
              icon: MessageCircle,
              label: "WhatsApp Shopping",
              sub: "Video consult available",
            },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-center gap-3">
              <f.icon className="shrink-0 text-gold-deep" size={22} />
              <div className="text-left">
                <p className="text-sm font-medium">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOMER FEEDBACK REELS */}
      <section className="bg-[#FBF7F0] px-4 py-20">
        <div className="container mx-auto">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-gold-deep">
              <Star size={14} />
              Customer Love
            </p>

            <h2 className="mb-4 font-serif text-4xl text-primary md:text-5xl">
              Real Customers. Real Reviews.
            </h2>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Watch real customer feedback, styling moments, and shopping
              experiences from women who chose Jindal Vastrakala for sarees,
              lehengas, and festive ethnic wear from Chandni Chowk.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {customerFeedbackReels.map((reel, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gold-light/30 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[9/16] w-full overflow-hidden bg-secondary">
                  {reel.url.includes("instagram.com") ? (
                    <iframe
                      src={getInstagramEmbedUrl(reel.url)}
                      title={reel.title}
                      className="h-full w-full"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-primary-deep/90 p-6 text-center text-primary-foreground">
                      <PlayCircle className="mb-4 text-gold-light" size={46} />
                      <p className="font-serif text-2xl">Instagram Reel</p>
                      <p className="mt-2 text-sm text-primary-foreground/70">
                        Customer feedback reel
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2 text-gold-deep">
                    <Instagram size={18} />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                      Customer Reel
                    </span>
                  </div>

                  <h3 className="mb-1 font-serif text-2xl text-primary">
                    {reel.title}
                  </h3>

                  <p className="mb-4 text-sm text-muted-foreground">
                    {reel.subtitle}
                  </p>

                  <a
                    href={reel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-gold-deep"
                  >
                    Watch on Instagram
                    <ArrowRight size={15} className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="gold" size="lg">
              <a
                href="https://www.instagram.com/jindalvastrakala?igsh=aWV4ZGl5M2lkOGll&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow Us on Instagram
                <Instagram className="ml-2" size={18} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold-deep">
            Our Edits
          </p>
          <h2 className="mb-4 font-serif text-4xl text-primary md:text-5xl">
            Shop by Category
          </h2>
          <div className="ornament-divider mx-auto max-w-xs">✦</div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/shop/${c.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden"
            >
              <img
                src={c.img}
                alt={c.label}
                loading="lazy"
                className="h-full w-full object-cover transition-smooth duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-primary-foreground">
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold-light">
                  {c.subtitle}
                </p>
                <h3 className="mb-3 font-serif text-3xl">{c.label}</h3>
                <span className="inline-flex items-center border-b border-gold-light/60 pb-1 text-sm transition-smooth group-hover:border-gold-light">
                  Explore
                  <ArrowRight size={14} className="ml-2" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold-deep">
              New Arrivals
            </p>
            <h2 className="mb-4 font-serif text-4xl text-primary md:text-5xl">
              Featured Pieces
            </h2>
            <div className="ornament-divider mx-auto max-w-xs">✦</div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">
                View All Products
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* CRAFT BANNER */}
      <section className="relative my-20 overflow-hidden">
        <img
          src={bannerCraft}
          alt="Indian textile craftsmanship"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-primary-deep/70" />

        <div className="relative z-10 container mx-auto px-4 py-24 text-center text-primary-foreground">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-light">
            Our Heritage
          </p>

          <h2 className="text-balance mx-auto mb-6 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            Every weave tells a story.{" "}
            <span className="text-gradient-gold italic">
              Yours begins here.
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Rooted in Chandni Chowk, every Jindal Vastrakala piece is curated
            with love — bringing elegant sarees and lehengas for weddings,
            festivals, and everyday celebrations.
          </p>

          <Button asChild variant="gold" size="lg">
            <Link to="/shop">Discover the Collection</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
