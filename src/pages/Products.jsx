// src/pages/Products.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Search, ShoppingBag, Minus, Plus, Trash2, ChevronDown } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { CATEGORIES } from "../data/products";
import ProductCard from "../components/ui/ProductCard";
import QuickViewModal from "../components/ui/QuickViewModal";

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "newest",     label: "Newest First" },
];

export default function Products() {
  const { products, cart, updateCartQty, removeFromCart, cartTotal, cartCount, clearCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    const q = searchParams.get("search");
    if (cat) setCategory(cat);
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (inStockOnly) list = list.filter((p) => p.inStock);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating":     list.sort((a, b) => b.rating - a.rating); break;
      case "newest":     list.sort((a, b) => b.id - a.id); break;
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [products, category, search, sort, inStockOnly, priceRange]);

  const resetFilters = () => {
    setCategory("All"); setSearch(""); setInStockOnly(false); setPriceRange([0, 20000]); setSort("default");
    setSearchParams({});
  };

  const hasFilters = category !== "All" || search || inStockOnly || priceRange[0] > 0 || priceRange[1] < 20000;

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Page Header */}
      <div className="bg-white border-b border-stone-100 py-8">
        <div className="container-xl">
          <h1 className="font-display text-3xl font-bold text-charcoal">Our Collection</h1>
          <p className="font-accent italic text-stone-400 mt-1">Discover {products.length}+ women's fashion pieces</p>
        </div>
      </div>

      <div className="container-xl py-8">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…" className="input-field pl-9 py-2.5 text-sm" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"><X size={14} /></button>}
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="appearance-none input-field py-2.5 pr-8 text-sm cursor-pointer min-w-[160px]">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>

          {/* Filter toggle (mobile) */}
          <button onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:border-rose-300 hover:text-rose-600 transition-colors">
            <SlidersHorizontal size={15} /> Filters
            {hasFilters && <span className="w-2 h-2 bg-rose-600 rounded-full" />}
          </button>

          {hasFilters && (
            <button onClick={resetFilters} className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1">
              <X size={12} /> Clear all
            </button>
          )}

          <div className="ml-auto">
            <span className="text-sm text-stone-400">{filtered.length} products</span>
          </div>

          {/* Cart button */}
          <button onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 btn-primary py-2.5 text-sm">
            <ShoppingBag size={16} /> Bag
            {cartCount > 0 && <span className="w-5 h-5 bg-white text-rose-600 text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>

        {/* Filter bar */}
        {filterOpen && (
          <div className="bg-white rounded-2xl border border-stone-100 p-5 mb-6 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <p className="text-xs font-semibold text-stone-700 uppercase tracking-widest mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${category === c ? "bg-rose-600 text-white border-rose-600" : "border-stone-200 text-stone-600 hover:border-rose-300"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs font-semibold text-stone-700 uppercase tracking-widest mb-3">Max Price: ₹{priceRange[1].toLocaleString("en-IN")}</p>
                <input type="range" min={0} max={20000} step={500} value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-rose-600" />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹0</span><span>₹20,000</span>
                </div>
              </div>

              {/* Availability */}
              <div>
                <p className="text-xs font-semibold text-stone-700 uppercase tracking-widest mb-3">Availability</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-rose-600" />
                  <span className="text-sm text-stone-600">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Category pills (always visible on desktop) */}
        <div className="hidden lg:flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === c ? "bg-rose-600 text-white shadow-md" : "bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-rose-600"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-rose-300" />
            </div>
            <h3 className="font-display text-xl font-semibold text-charcoal mb-2">No products found</h3>
            <p className="text-stone-400 text-sm mb-6">Try adjusting your filters or search query</p>
            <button onClick={resetFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
            ))}
          </div>
        )}
      </div>

      {/* ── Cart Sidebar ──────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-[70] flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative ml-auto w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-slide-down">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h2 className="font-display text-xl font-semibold text-charcoal flex items-center gap-2">
                <ShoppingBag size={20} className="text-rose-600" /> My Bag
                {cartCount > 0 && <span className="text-sm text-stone-400">({cartCount})</span>}
              </h2>
              <button onClick={() => setCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag size={40} className="text-stone-200 mx-auto mb-4" />
                  <p className="font-display text-lg text-charcoal mb-1">Your bag is empty</p>
                  <p className="text-stone-400 text-sm">Add some amazing pieces!</p>
                </div>
              ) : cart.map((item) => (
                <div key={item._key} className="flex gap-3 bg-stone-50 rounded-2xl p-3">
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-charcoal line-clamp-1">{item.name}</p>
                    {item.selectedColor && <p className="text-xs text-stone-400 mt-0.5">{item.selectedColor} {item.selectedSize !== "Free Size" ? `· ${item.selectedSize}` : ""}</p>}
                    <p className="text-rose-600 font-bold text-sm mt-1">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateCartQty(item._key, item.qty - 1)} className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-rose-400 transition-colors">
                        <Minus size={11} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateCartQty(item._key, item.qty + 1)} className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-rose-400 transition-colors">
                        <Plus size={11} />
                      </button>
                      <button onClick={() => removeFromCart(item._key)} className="ml-auto w-6 h-6 flex items-center justify-center text-stone-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-display text-xl font-bold text-rose-600">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <button className="btn-primary w-full py-3.5 text-base">Checkout (WhatsApp)</button>
                <button onClick={clearCart} className="w-full text-xs text-stone-400 hover:text-rose-500 transition-colors">Clear bag</button>
              </div>
            )}
          </div>
        </div>
      )}

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}
