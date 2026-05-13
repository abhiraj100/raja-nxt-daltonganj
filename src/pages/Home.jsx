// src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, RefreshCw, Shield, Headphones, Sparkles } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { CATEGORIES } from "../data/products";
import ProductCard from "../components/ui/ProductCard";
import QuickViewModal from "../components/ui/QuickViewModal";

const HERO_SLIDES = [
  {
    title: "New Arrivals",
    subtitle: "Festive Season 2025",
    desc: "Discover the finest ethnic wear — curated for the modern Indian woman.",
    cta: "Shop Now",
    bg: "from-rose-100 via-pink-50 to-cream",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80",
  },
  {
    title: "Bridal Collection",
    subtitle: "Look Stunning On Your Big Day",
    desc: "Handpicked lehengas and sarees for your most memorable moments.",
    cta: "Explore",
    bg: "from-purple-50 via-pink-50 to-cream",
    img: "https://images.unsplash.com/photo-1617627143233-a09de2e78041?w=700&q=80",
  },
];

const FEATURES = [
  { icon: <Truck size={22} />, title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: <RefreshCw size={22} />, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: <Shield size={22} />, title: "Secure Payments", desc: "100% safe & trusted" },
  { icon: <Headphones size={22} />, title: "24/7 Support", desc: "Always here to help you" },
];

const CATEGORY_CARDS = [
  { name: "Sarees", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80" },
  { name: "Kurtis", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&q=80" },
  { name: "Lehengas", img: "https://images.unsplash.com/photo-1617627143233-a09de2e78041?w=400&q=80" },
  { name: "Western Wear", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80" },
  { name: "Accessories", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80" },
  { name: "Footwear", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80" },
];

const TESTIMONIALS = [
  { name: "Priya Singh", city: "Patna", rating: 5, text: "Amazing collection! Got my wedding lehenga from here and everyone loved it. The quality is outstanding." },
  { name: "Aarti Kumari", city: "Muzaffarpur", rating: 5, text: "Best shop in Bihar for women's fashion. Staff is very helpful and prices are reasonable." },
  { name: "Neha Verma", city: "Gaya", rating: 4, text: "Ordered three kurtis online. All delivered on time and the fabric quality exceeded my expectations!" },
];

export default function Home() {
  const { products } = useStore();
  const [slideIdx, setSlideIdx] = useState(0);
  const [quickView, setQuickView] = useState(null);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const slide = HERO_SLIDES[slideIdx];

  return (
    <div className="animate-fade-in">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={`bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
        <div className="container-xl py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="animate-slide-up">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-100 px-3 py-1.5 rounded-full mb-5 tracking-widest uppercase">
                <Sparkles size={12} /> {slide.subtitle}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight mb-5">
                {slide.title}
              </h1>
              <p className="text-stone-500 text-base sm:text-lg leading-relaxed mb-8 max-w-md">{slide.desc}</p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/products" className="btn-primary">
                  {slide.cta} <ArrowRight size={16} />
                </Link>
                <Link to="/location" className="btn-outline">Visit Store</Link>
              </div>
              {/* Slide indicators */}
              <div className="flex gap-2 mt-10">
                {HERO_SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setSlideIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === slideIdx ? "bg-rose-600 w-8" : "bg-rose-200 w-4"}`}
                  />
                ))}
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-72 sm:w-80 lg:w-96">
                <div className="absolute inset-0 rounded-3xl bg-rose-200/40 rotate-6 scale-95" />
                <img src={slide.img} alt="Featured fashion" className="relative rounded-3xl w-full aspect-[3/4] object-cover shadow-2xl" />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <Star size={18} className="text-rose-600 fill-rose-600" />
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-charcoal">4.9★</p>
                    <p className="text-xs text-stone-400">2000+ Happy Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features strip ───────────────────────────────── */}
      <section className="bg-white border-y border-stone-100">
        <div className="container-xl py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-charcoal">{f.title}</p>
                  <p className="text-xs text-stone-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="section-pad">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal">Shop by Category</h2>
            <p className="font-accent italic text-stone-400 text-lg mt-2">Find what suits your style</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORY_CARDS.map((cat) => (
              <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-2xl aspect-square shadow-sm hover:shadow-lg transition-all duration-300">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <p className="absolute bottom-3 left-0 right-0 text-center text-white font-display text-sm font-semibold">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="section-pad bg-white">
        <div className="container-xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal">Featured Products</h2>
              <p className="font-accent italic text-stone-400 text-lg mt-2">Handpicked just for you</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-rose-600 font-semibold text-sm hover:gap-2.5 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary">
              See All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Banner ───────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-rose-600 to-rose-500">
        <div className="container-xl py-14 text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Summer Sale — Up to 50% Off!</h2>
          <p className="font-accent italic text-rose-200 text-lg mb-8">Limited time offer on selected ethnic wear collections</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-white text-rose-600 font-semibold px-8 py-3.5 rounded-full hover:bg-rose-50 active:scale-95 transition-all shadow-lg">
            Shop the Sale <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="section-pad">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal">What Our Customers Say</h2>
            <p className="font-accent italic text-stone-400 text-lg mt-2">Real stories from real women</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed italic mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center font-display font-bold text-rose-600">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-charcoal">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────── */}
      <section className="bg-rose-50 border-t border-rose-100">
        <div className="container-xl py-16 text-center">
          <h2 className="font-display text-3xl font-bold text-charcoal mb-3">Stay in the Loop</h2>
          <p className="text-stone-500 text-sm mb-8">Subscribe to get exclusive offers, new arrivals & style tips.</p>
          <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" className="input-field flex-1" />
            <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </section>

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}
