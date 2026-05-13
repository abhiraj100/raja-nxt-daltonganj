// src/components/ui/QuickViewModal.jsx
import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Heart, Star, Truck, RotateCcw, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [adding, setAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleAdd = () => {
    if (!product.inStock || adding) return;
    setAdding(true);
    addToCart(product, selectedColor, selectedSize);
    setTimeout(() => setAdding(false), 1400);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[3/4] sm:aspect-auto sm:min-h-[420px] bg-stone-50 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-sm font-semibold text-stone-500 bg-white px-4 py-2 rounded-full border border-stone-200">
                  Out of Stock
                </span>
              </div>
            )}
            {discount >= 10 && (
              <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-7 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-rose-500 font-bold tracking-widest uppercase mb-1">{product.category}</p>
                <h2 className="font-display text-xl font-bold text-charcoal leading-tight">{product.name}</h2>
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                  wishlisted ? "border-rose-600 bg-rose-600 text-white" : "border-stone-200 text-stone-400 hover:border-rose-400"
                }`}
              >
                <Heart size={15} className={wishlisted ? "fill-white" : ""} />
              </button>
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"} />
                  ))}
                </div>
                <span className="text-sm text-stone-400">{product.rating} · {product.reviews} reviews</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-display text-2xl font-bold text-charcoal">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-stone-500 text-sm leading-relaxed mb-5 line-clamp-3">{product.description}</p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2">
                  Color: <span className="text-rose-600 normal-case font-bold">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedColor === c
                          ? "border-rose-600 bg-rose-50 text-rose-700"
                          : "border-stone-200 text-stone-600 hover:border-rose-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && product.sizes[0] !== "Free Size" && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === s
                          ? "border-rose-600 bg-rose-600 text-white"
                          : "border-stone-200 text-stone-600 hover:border-rose-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleAdd}
              disabled={!product.inStock || adding}
              className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                !product.inStock
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                  : adding
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-600 text-white hover:bg-rose-700 shadow-md hover:shadow-lg active:scale-98"
              }`}
            >
              <ShoppingBag size={16} />
              {!product.inStock ? "Out of Stock" : adding ? "Added!" : "Add to Bag"}
            </button>

            {/* Trust badges */}
            <div className="flex justify-between mt-4 pt-4 border-t border-stone-100">
              {[
                { icon: <Truck size={12} />, label: "Free Shipping" },
                { icon: <RotateCcw size={12} />, label: "7-Day Return" },
                { icon: <Shield size={12} />, label: "Secure Pay" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-1.5 text-stone-400">
                  {t.icon}
                  <span className="text-[10px] font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
