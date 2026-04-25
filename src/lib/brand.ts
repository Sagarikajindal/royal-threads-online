// WhatsApp business contact — change this number anytime
export const WHATSAPP_NUMBER = "918368319092"; // WhatsApp business number, country code, no +
export const BRAND_NAME = "Jindal Vastrakala";
export const BRAND_TAGLINE = "Timeless Sarees. Woven Traditions.";
export const BRAND_PHONE = "+91 83683 19092";
export const BRAND_EMAIL = "jindalvastrakala@gmail.com";
export const BRAND_ADDRESS = "4235, Ram Ram Ji Complex, Nai Sarak, Jogiwara, Delhi – 110006";

export const buildWhatsAppLink = (productName: string, productUrl: string) => {
  const text = `Hello ${BRAND_NAME}! 🙏 I'm interested in: *${productName}*\n${productUrl}\n\nCould you share more details, price & availability?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const buildWhatsAppChatLink = () => {
  const text = `Hello ${BRAND_NAME}! 🙏 I'd like to know more about your collection.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const buildVideoConsultLink = () => {
  const text = `Hello ${BRAND_NAME}! 🎥 I'd like to book a *video consultation* to view your collection live. Please share available time slots.`;
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
