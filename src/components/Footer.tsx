import { Link } from "react-router-dom";
import {
  Instagram,
  Youtube,
  MapPin,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_PHONE,
  BRAND_EMAIL,
  BRAND_ADDRESS,
} from "@/lib/brand";
import logo from "@/assets/logo.png";

const INSTAGRAM_URL =
  "https://www.instagram.com/jindalvastrakala?igsh=aWV4ZGl5M2lkOGll&utm_source=qr";

const YOUTUBE_URL = "https://www.youtube.com/@JindalVastrakala/shorts";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps/place/Jindal+Vastrakala/@28.6534025,77.228285,17z/data=!4m8!3m7!1s0x390cfd4a677d4e95:0x1301e84ab14a9b27!8m2!3d28.6534025!4d77.228285!9m1!1b1!16s%2Fg%2F11xny4bqlx?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D";

const FOOTER_SHOP_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Lehengas", href: "/shop/lehenga" },
  { label: "Sarees", href: "/shop/saree" },
  { label: "Customer Reviews", href: "/customer-reviews" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary-deep text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 flex items-center gap-3">
              <img
                src={logo}
                alt={BRAND_NAME}
                className="h-12 w-12 object-contain"
                width={48}
                height={48}
              />
              <span className="font-serif text-2xl font-semibold">
                {BRAND_NAME}
              </span>
            </Link>

            <p className="mb-3 text-sm text-primary-foreground/80">
              {BRAND_TAGLINE}
            </p>

            <p className="text-sm leading-relaxed text-primary-foreground/70">
              Premium sarees and lehengas curated from Chandni Chowk, New Delhi
              for weddings, festivals, and special occasions.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold-light">
              Shop
            </h3>

            <ul className="space-y-3">
              {FOOTER_SHOP_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-primary-foreground/75 transition-colors hover:text-gold-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold-light">
              Contact
            </h3>

            <ul className="space-y-4 text-sm text-primary-foreground/75">
              <li className="flex gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-gold-light"
                />
                <span>{BRAND_ADDRESS}</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-gold-light" />
                <a
                  href={`tel:${BRAND_PHONE.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-gold-light"
                >
                  {BRAND_PHONE}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-gold-light" />
                <a
                  href={`mailto:${BRAND_EMAIL}`}
                  className="transition-colors hover:text-gold-light"
                >
                  {BRAND_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold-light">
              Follow
            </h3>

            <div className="mb-5 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Jindal Vastrakala on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground transition-colors hover:border-gold-light hover:bg-gold-light hover:text-primary-deep"
              >
                <Instagram size={19} />
              </a>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch Jindal Vastrakala on YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground transition-colors hover:border-gold-light hover:bg-gold-light hover:text-primary-deep"
              >
                <Youtube size={21} />
              </a>
            </div>

            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold-light/50 px-4 py-2 text-sm font-medium text-gold-light transition-colors hover:bg-gold-light hover:text-primary-deep"
            >
              <Star size={16} />
              Read Google Reviews
            </a>

            <p className="mt-4 text-sm text-primary-foreground/70">
              7.2k+ YouTube subscribers · Daily new arrivals · Customer-loved
              ethnicwear.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/15 pt-6 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          Crafted with love in New Delhi.
        </div>
      </div>
    </footer>
  );
}
