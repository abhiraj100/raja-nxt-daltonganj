// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle, Heart } from "lucide-react";
import { STORE_INFO } from "../../data/products";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-auto">
      <div className="container-xl py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">
              Raja <span className="text-rose-400">Nxt</span>
            </h2>
            <p className="font-accent italic text-stone-400 text-sm mb-4">{STORE_INFO.tagline}</p>
            <p className="text-stone-400 text-sm leading-relaxed">{STORE_INFO.description}</p>
            <div className="flex gap-3 mt-6">
              {[
                { href: STORE_INFO.social.instagram, icon: <Instagram size={16} />, hover: "hover:bg-rose-500", label: "Instagram" },
                { href: STORE_INFO.social.facebook,  icon: <Facebook size={16} />,  hover: "hover:bg-blue-600", label: "Facebook" },
                { href: STORE_INFO.social.whatsapp,  icon: <MessageCircle size={16} />, hover: "hover:bg-green-500", label: "WhatsApp" },
              ].map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className={`w-9 h-9 bg-white/10 rounded-full flex items-center justify-center ${s.hover} transition-colors`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-300 mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Shop All" },
                { to: "/products?category=Sarees", label: "Sarees" },
                { to: "/products?category=Kurtis", label: "Kurtis" },
                { to: "/products?category=Lehengas", label: "Lehengas" },
                { to: "/contact", label: "Contact Us" },
                { to: "/location", label: "Visit Store" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-stone-400 text-sm hover:text-rose-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-300 mb-5">Categories</h3>
            <ul className="space-y-2.5">
              {["Salwar Suits", "Western Wear", "Accessories", "Footwear", "New Arrivals", "Sale Items"].map((c) => (
                <li key={c}>
                  <Link to={`/products?category=${encodeURIComponent(c)}`}
                    className="text-stone-400 text-sm hover:text-rose-400 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-300 mb-5">Store Info</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="text-stone-400 text-sm leading-relaxed">{STORE_INFO.address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={15} className="text-rose-400 flex-shrink-0" />
                <a href={`tel:${STORE_INFO.phone}`} className="text-stone-400 text-sm hover:text-rose-400 transition-colors">{STORE_INFO.phone}</a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={15} className="text-rose-400 flex-shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="text-stone-400 text-sm hover:text-rose-400 transition-colors">{STORE_INFO.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-stone-500 text-xs">© {new Date().getFullYear()} Raja Nxt. All rights reserved.</p>
          <p className="text-stone-500 text-xs flex items-center gap-1.5">
            Made with <Heart size={11} className="text-rose-400 fill-rose-400" /> for women of Jharkhand
          </p>
        </div>
      </div>
    </footer>
  );
}
