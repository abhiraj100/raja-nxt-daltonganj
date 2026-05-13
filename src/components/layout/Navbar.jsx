// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, Search, Shield, Sparkles } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function Navbar() {
  const { cartCount, wishlist, isAdminLoggedIn } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [navigate]);

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/products", label: "Shop" },
    { to: "/contact", label: "Contact" },
    { to: "/location", label: "Visit Us" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
      setMobileOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        {/* Announcement bar */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-500 text-white text-center py-2 text-[11px] font-medium tracking-wide">
          <span className="hidden sm:inline">✨ FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; EASY 7-DAY RETURNS &nbsp;|&nbsp; SHOP NOW ✨</span>
          <span className="sm:hidden">✨ Free Shipping above ₹999 ✨</span>
        </div>

        <div className="container-xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow group-hover:shadow-md transition-shadow">
                <span className="text-white font-display font-bold text-base">R</span>
              </div>
              <div className="leading-none">
                <p className="font-display text-xl font-bold text-charcoal">
                  Raja<span className="text-rose-600"> Nxt</span>
                </p>
                <p className="font-accent italic text-[10px] text-stone-400 tracking-widest">Women's Fashion</p>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `text-sm font-medium relative group transition-colors duration-200 pb-1 ${
                      isActive ? "text-rose-600" : "text-stone-700 hover:text-rose-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-0.5 bg-rose-600 rounded-full transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <button
                onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false); }}
                className="p-2 rounded-full text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-all"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              {/* Wishlist */}
              <Link
                to="/products"
                className="hidden sm:flex relative p-2 rounded-full text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-all"
                aria-label="Wishlist"
              >
                <Heart size={19} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {wishlist.length > 9 ? "9+" : wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/products"
                className="relative p-2 rounded-full text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-all"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold animate-scale-in">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Admin badge */}
              {isAdminLoggedIn && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-1.5 ml-1 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-xs font-semibold hover:bg-rose-100 transition-colors border border-rose-100"
                >
                  <Shield size={12} /> Admin
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false); }}
                className="md:hidden p-2 rounded-full text-stone-600 hover:bg-rose-50 transition-all ml-1"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-slide-down">
              <form onSubmit={handleSearch} className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sarees, kurtis, lehengas…"
                  className="input-field pl-10 pr-24"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 animate-slide-down shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-rose-50 text-rose-600" : "text-stone-700 hover:bg-stone-50"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {isAdminLoggedIn && (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-rose-50 text-rose-600" : "text-stone-500 hover:bg-stone-50"
                    }`
                  }
                >
                  <Shield size={14} /> Admin Panel
                </NavLink>
              )}
              {!isAdminLoggedIn && (
                <Link
                  to="/admin-login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-stone-400 hover:bg-stone-50 transition-colors"
                >
                  <Shield size={14} /> Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-[calc(4rem+28px)]" />
    </>
  );
}
