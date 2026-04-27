import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND_NAME } from "@/lib/brand";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const TICKER_ITEMS = [
  "Shipping Worldwide",
  "Curated from Chandni Chowk",
  "Crafted in New Delhi",
  "Sarees, Lehengas & Suits",
  "Video Shopping Available on WhatsApp",
  "Bridal & Festive Collections",
];

const NAV_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Lehengas", href: "/shop/lehenga" },
  { label: "Sarees", href: "/shop/saree" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top announcement ticker */}
      <style>{`
        @keyframes jvTickerScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .jv-ticker-track {
          animation: jvTickerScroll 30s linear infinite;
        }

        .jv-ticker-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .jv-ticker-track {
            animation: none;
          }
        }
      `}</style>

      <div className="w-full overflow-hidden bg-primary-deep py-2 text-primary-foreground">
        <div className="jv-ticker-track flex w-max whitespace-nowrap">
          {[...Array(2)].map((_, groupIndex) => (
            <div
              key={groupIndex}
              className="flex shrink-0 items-center gap-6 px-4 text-[11px] font-medium uppercase tracking-[0.28em] md:gap-8 md:text-xs"
            >
              {TICKER_ITEMS.map((item) => (
                <div
                  key={`${groupIndex}-${item}`}
                  className="flex items-center gap-6 md:gap-8"
                >
                  <span>{item}</span>
                  <span className="opacity-50">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Mobile menu */}
            <button
              className="text-primary lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 lg:flex-1">
              <img
                src={logo}
                alt={BRAND_NAME}
                className="h-12 w-12 object-contain"
                width={48}
                height={48}
              />
              <span className="hidden font-serif text-2xl font-semibold text-primary sm:block">
                {BRAND_NAME}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative text-sm font-semibold uppercase tracking-[0.14em] transition-smooth after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:text-primary hover:after:w-full",
                    isActive(link.href)
                      ? "text-primary after:w-full"
                      : "text-foreground/80"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1 lg:flex-1 lg:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/shop")}
                aria-label="Search"
              >
                <Search size={20} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(user ? "/wishlist" : "/auth")}
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Account">
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2 text-sm">
                      <p className="truncate font-medium">{user.email}</p>
                      {isAdmin && (
                        <p className="mt-0.5 text-xs text-gold-deep">Admin</p>
                      )}
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                      <Heart size={16} className="mr-2" />
                      My Wishlist
                    </DropdownMenuItem>

                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard size={16} className="mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={signOut}>
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/auth")}
                  aria-label="Account"
                >
                  <User size={20} />
                </Button>
              )}

              <Button
                variant="default"
                size="sm"
                className="ml-2 hidden md:inline-flex"
                onClick={() => navigate("/shop")}
              >
                <ShoppingBag size={16} className="mr-2" />
                Shop
              </Button>
            </div>
          </div>

          {/* Mobile nav */}
          {open && (
            <nav className="animate-fade-in space-y-1 border-t border-border py-4 lg:hidden">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-2 py-3 text-sm font-medium uppercase tracking-wide",
                    isActive(link.href) ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
