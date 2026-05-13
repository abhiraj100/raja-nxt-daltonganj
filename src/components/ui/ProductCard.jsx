// src/components/ui/ProductCard.jsx
import React, { useState } from "react";
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react";
import { useStore } from "../../context/StoreContext";

const BADGE_COLORS = {
  Bestseller: "bg-amber-100 text-amber-700 border-amber-200",
  New:        "bg-emerald-100 text-emerald-700 border-emerald-200",
  Premium:    "bg-purple-100 text-purple-700 border-purple-200",
  Trending:   "bg-sky-100 text-sky-700 border-sky-200",
  Sale:       "bg-rose-100 text-rose-700 border-rose-200",
};

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [adding, setAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock || adding) return;
    setAdding(true);
    addToCart(product, product.colors?.[0] || "", product.sizes?.[0] || "");
    setTimeout(() => setAdding(false), 1400);
  };

  return (
    <div className="card group relative flex flex-col bg-white">
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-stone-50 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
          loading="lazy"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=60"; }}
        />

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); onQuickView?.(product); }}
            className="flex items-center gap-1.5 bg-white text-stone-700 text-xs font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
          >
            <Eye size={13} /> Quick View
          </button>
        </div>

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${BADGE_COLORS[product.badge] || "bg-rose-100 text-rose-700 border-rose-200"}`}>
              {product.badge}
            </span>
          )}
          {discount >= 10 && product.inStock && (
            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist — top right */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            wishlisted
              ? "bg-rose-600 text-white scale-110"
              : "bg-white/90 text-stone-400 hover:text-rose-600 hover:scale-110"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={13} className={wishlisted ? "fill-white" : ""} />
        </button>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-xs font-semibold text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-rose-500 font-bold tracking-widest uppercase mb-1">{product.category}</p>
        <h3 className="font-display text-[14px] sm:text-[15px] font-semibold text-charcoal line-clamp-1 mb-1.5">{product.name}</h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={10} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"} />
              ))}
            </div>
            <span className="text-[10px] text-stone-400">{product.rating} ({product.reviews})</span>
          </div>
        )}

        {/* Price & Add to cart */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-display text-base sm:text-lg font-bold text-charcoal">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock || adding}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              !product.inStock
                ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                : adding
                ? "bg-emerald-500 text-white scale-90"
                : "bg-rose-600 text-white hover:bg-rose-700 active:scale-90 shadow-md hover:shadow-lg"
            }`}
            aria-label="Add to cart"
          >
            {adding ? <Zap size={14} className="fill-white" /> : <ShoppingBag size={14} />}
          </button>
        </div>

        {/* Color chips */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {product.colors.slice(0, 3).map((c) => (
              <span key={c} className="text-[10px] text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-100">
                {c}
              </span>
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-stone-400">+{product.colors.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
