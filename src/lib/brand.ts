// WhatsApp business contact — change this number anytime
export const WHATSAPP_NUMBER = "919999999999"; // your brother's number with country code, no +
export const BRAND_NAME = "Saanvi Couture";
export const BRAND_TAGLINE = "Heritage Indian Couture";

export const buildWhatsAppLink = (productName: string, productUrl: string) => {
  const text = `Hello ${BRAND_NAME}! 🙏 I'm interested in: *${productName}*\n${productUrl}\n\nCould you share more details, price & availability?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);

export const CATEGORIES = [
  { slug: "lehenga", label: "Lehengas" },
  { slug: "saree", label: "Sarees" },
  { slug: "suit", label: "Unstitched Suits" },
] as const;
