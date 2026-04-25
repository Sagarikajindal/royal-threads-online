import { Link } from "react-router-dom";
import { Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_PHONE, BRAND_EMAIL, BRAND_ADDRESS, CATEGORIES } from "@/lib/brand";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-primary-deep text-primary-foreground mt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt={BRAND_NAME} className="h-12 w-12 object-contain bg-background rounded-full p-1" width={48} height={48} loading="lazy" />
              <span className="font-serif text-xl">{BRAND_NAME}</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Heritage Indian couture handcrafted in New Delhi. Celebrating timeless elegance for the modern woman.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-gold-light">Shop</h3>
            <ul className="space-y-2 text-sm opacity-80">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link to={`/shop/${c.slug}`} className="hover:text-gold transition-smooth">{c.label}</Link>
                </li>
              ))}
              <li><Link to="/shop" className="hover:text-gold transition-smooth">All Collections</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-gold-light">Contact</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> New Delhi, India</li>
              <li className="flex items-start gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> +91 99999 99999</li>
              <li className="flex items-start gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> hello@saanvicouture.com</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-gold-light">Follow</h3>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition-smooth" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition-smooth" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
            <p className="text-xs opacity-70 mt-6">7,000+ subscribers · Daily new arrivals</p>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-12 pt-6 text-xs opacity-70 text-center">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved. Crafted with love in New Delhi.
        </div>
      </div>
    </footer>
  );
}
