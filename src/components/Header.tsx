import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
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
import { BRAND_NAME, CATEGORIES } from "@/lib/brand";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-primary-deep text-primary-foreground text-xs py-2 text-center tracking-widest uppercase">
        Free shipping across India · Crafted in New Delhi
      </div>

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu */}
            <button
              className="lg:hidden text-primary"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 lg:flex-1">
              <img src={logo} alt={BRAND_NAME} className="h-12 w-12 object-contain" width={48} height={48} />
              <span className="hidden sm:block font-serif text-2xl font-semibold text-primary">
                {BRAND_NAME}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-10 flex-1 justify-center">
              <Link to="/" className={cn("text-sm tracking-wide uppercase font-medium transition-smooth hover:text-primary", isActive("/") ? "text-primary" : "text-foreground")}>
                Home
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/shop/${c.slug}`}
                  className={cn("text-sm tracking-wide uppercase font-medium transition-smooth hover:text-primary", isActive(`/shop/${c.slug}`) ? "text-primary" : "text-foreground")}
                >
                  {c.label}
                </Link>
              ))}
              <Link to="/shop" className="text-sm tracking-wide uppercase font-medium transition-smooth hover:text-primary">
                Shop All
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 lg:gap-2 lg:flex-1 justify-end">
              <Button variant="ghost" size="icon" onClick={() => navigate("/shop")} aria-label="Search">
                <Search size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate(user ? "/wishlist" : "/auth")} aria-label="Wishlist">
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
                      <p className="font-medium truncate">{user.email}</p>
                      {isAdmin && <p className="text-xs text-gold-deep mt-0.5">Admin</p>}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                      <Heart size={16} className="mr-2" /> My Wishlist
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard size={16} className="mr-2" /> Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut size={16} className="mr-2" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => navigate("/auth")} aria-label="Account">
                  <User size={20} />
                </Button>
              )}
              <Button variant="default" size="sm" className="hidden md:inline-flex ml-2" onClick={() => navigate("/shop")}>
                <ShoppingBag size={16} className="mr-2" />
                Shop
              </Button>
            </div>
          </div>

          {/* Mobile nav */}
          {open && (
            <nav className="lg:hidden py-4 border-t border-border space-y-1 animate-fade-in">
              <Link to="/" onClick={() => setOpen(false)} className="block px-2 py-3 text-sm uppercase tracking-wide">Home</Link>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/shop/${c.slug}`} onClick={() => setOpen(false)} className="block px-2 py-3 text-sm uppercase tracking-wide">
                  {c.label}
                </Link>
              ))}
              <Link to="/shop" onClick={() => setOpen(false)} className="block px-2 py-3 text-sm uppercase tracking-wide">Shop All</Link>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
