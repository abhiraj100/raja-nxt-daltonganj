// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center">
        <p className="font-display text-8xl sm:text-9xl font-bold text-rose-100 leading-none">404</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal -mt-4 mb-3">Page Not Found</h1>
        <p className="text-stone-400 text-sm mb-8 max-w-xs mx-auto">Looks like this page took a day off. Let's get you back to the good stuff.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/" className="btn-primary"><Home size={16} /> Go Home</Link>
          <Link to="/products" className="btn-outline"><ShoppingBag size={16} /> Shop Now</Link>
        </div>
      </div>
    </div>
  );
}
