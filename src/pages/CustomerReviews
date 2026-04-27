import { useEffect } from "react";
import { ArrowRight, Instagram, PlayCircle, Star } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";

const INSTAGRAM_URL =
  "https://www.instagram.com/jindalvastrakala?igsh=aWV4ZGl5M2lkOGll&utm_source=qr";

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

export default function CustomerReviews() {
  useEffect(() => {
    document.title = `${BRAND_NAME} — Customer Reviews & Feedback`;

    const meta =
      document.querySelector('meta[name="description"]') ??
      document.head.appendChild(
        Object.assign(document.createElement("meta"), {
          name: "description",
        })
      );

    meta.setAttribute(
      "content",
      "Watch real customer reviews, feedback reels, and shopping experiences from Jindal Vastrakala customers for sarees, lehengas, and ethnic wear from Chandni Chowk."
    );
  }, []);

  return (
    <Layout>
      <section className="bg-[#FBF7F0] px-4 py-20 md:py-24">
        <div className="container mx-auto">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-gold-deep">
              <Star size={14} />
              Customer Love
            </p>

            <h1 className="mb-5 font-serif text-4xl text-primary md:text-6xl">
              Real Customers. Real Reviews.
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Watch real customer feedback, styling moments, and shopping
              experiences from women who chose Jindal Vastrakala for sarees,
              lehengas, and festive ethnic wear from Chandni Chowk, New Delhi.
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
                      Customer Review
                    </span>
                  </div>

                  <h2 className="mb-1 font-serif text-2xl text-primary">
                    {reel.title}
                  </h2>

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

          <div className="mt-14 text-center">
            <Button asChild variant="gold" size="lg">
              <a
                href={INSTAGRAM_URL}
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
    </Layout>
  );
}
