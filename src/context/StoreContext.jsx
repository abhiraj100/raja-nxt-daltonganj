// src/context/StoreContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_PRODUCTS } from "../data/products";

const StoreContext = createContext(null);

const LS_KEYS = {
  products: "rn_products_v2",
  admin: "rn_admin_v2",
  wishlist: "rn_wishlist_v2",
};

function loadFromLS(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => loadFromLS(LS_KEYS.products, INITIAL_PRODUCTS));
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(() => loadFromLS(LS_KEYS.wishlist, []));
  const [toast, setToast] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => localStorage.getItem(LS_KEYS.admin) === "true"
  );

  // Persist products & wishlist
  useEffect(() => {
    localStorage.setItem(LS_KEYS.products, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.wishlist, JSON.stringify(wishlist));
  }, [wishlist]);

  // ── Toast ──────────────────────────────────────────────
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Products ──────────────────────────────────────────
  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      rating: parseFloat(product.rating) || 0,
      reviews: parseInt(product.reviews) || 0,
      inStock: product.inStock !== undefined ? product.inStock : true,
      featured: product.featured || false,
      badge: product.badge || null,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      createdAt: new Date().toISOString(),
    };
    setProducts((p) => [newProduct, ...p]);
    showToast(`"${product.name}" added successfully!`);
    return newProduct;
  }, [showToast]);

  const updateProduct = useCallback((id, data) => {
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
    showToast("Product updated!");
  }, [showToast]);

  const deleteProduct = useCallback((id) => {
    setProducts((p) => p.filter((x) => x.id !== id));
    showToast("Product deleted.", "error");
  }, [showToast]);

  const toggleStock = useCallback((id) => {
    setProducts((p) =>
      p.map((x) => (x.id === id ? { ...x, inStock: !x.inStock } : x))
    );
  }, []);

  // Bulk remove all out-of-stock products
  const removeOutOfStockProducts = useCallback(() => {
    const count = products.filter((p) => !p.inStock).length;
    setProducts((p) => p.filter((x) => x.inStock));
    showToast(`${count} out-of-stock product${count !== 1 ? "s" : ""} removed.`, "error");
  }, [products, showToast]);

  // Mark product as back in stock
  const markInStock = useCallback((id) => {
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, inStock: true } : x)));
    showToast("Product marked as in stock!", "success");
  }, [showToast]);

  // Bulk mark all as in stock
  const markAllInStock = useCallback(() => {
    setProducts((p) => p.map((x) => ({ ...x, inStock: true })));
    showToast("All products marked as in stock!", "success");
  }, [showToast]);

  // Export products as JSON
  const exportProducts = useCallback(() => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `raja-nxt-products-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Products exported as JSON!");
  }, [products, showToast]);

  // Import products from JSON
  const importProducts = useCallback((jsonData) => {
    try {
      const imported = JSON.parse(jsonData);
      if (!Array.isArray(imported)) throw new Error("Not an array");
      setProducts((p) => {
        const existingIds = new Set(p.map((x) => x.id));
        const newOnes = imported.filter((x) => !existingIds.has(x.id));
        showToast(`${newOnes.length} product(s) imported!`);
        return [...p, ...newOnes];
      });
    } catch {
      showToast("Invalid JSON file.", "error");
    }
  }, [showToast]);

  // Reset to default products
  const resetProducts = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    showToast("Products reset to defaults.", "success");
  }, [showToast]);

  // ── Cart ──────────────────────────────────────────────
  const addToCart = useCallback((product, selectedColor, selectedSize) => {
    setCart((prev) => {
      const key = `${product.id}-${selectedColor}-${selectedSize}`;
      const exists = prev.find((i) => i._key === key);
      if (exists) return prev.map((i) => i._key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, selectedColor, selectedSize, qty: 1, _key: key }];
    });
    showToast("Added to bag! 🛍️");
  }, [showToast]);

  const updateCartQty = useCallback((key, qty) => {
    if (qty < 1) { removeFromCart(key); return; }
    setCart((p) => p.map((i) => i._key === key ? { ...i, qty } : i));
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart((p) => p.filter((i) => i._key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ── Wishlist ──────────────────────────────────────────
  const toggleWishlist = useCallback((id) => {
    setWishlist((p) => {
      const isIn = p.includes(id);
      showToast(isIn ? "Removed from wishlist" : "Added to wishlist ❤️", isIn ? "info" : "success");
      return isIn ? p.filter((x) => x !== id) : [...p, id];
    });
  }, [showToast]);

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist]);

  // ── Admin Auth ────────────────────────────────────────
  const adminLogin = useCallback((pw) => {
    if (pw === "admin@raja123") {
      setIsAdminLoggedIn(true);
      localStorage.setItem(LS_KEYS.admin, "true");
      showToast("Welcome back, Admin! 👋");
      return true;
    }
    showToast("Invalid password.", "error");
    return false;
  }, [showToast]);

  const adminLogout = useCallback(() => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(LS_KEYS.admin);
  }, []);

  const value = {
    // Products
    products, addProduct, updateProduct, deleteProduct, toggleStock,
    removeOutOfStockProducts, markInStock, markAllInStock,
    exportProducts, importProducts, resetProducts,
    // Cart
    cart, addToCart, updateCartQty, removeFromCart, clearCart, cartTotal, cartCount,
    // Wishlist
    wishlist, toggleWishlist, isWishlisted,
    // Admin
    isAdminLoggedIn, adminLogin, adminLogout,
    // UI
    toast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
