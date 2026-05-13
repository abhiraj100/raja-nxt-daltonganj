// src/pages/Admin.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Edit2, Trash2, Package, TrendingUp, ShoppingBag, Star,
  LogOut, Search, ToggleLeft, ToggleRight, X, Save, Tag,
  ChevronDown, Shield, AlertTriangle, CheckCircle, Download,
  Upload, RefreshCw, Boxes, PackageX, PackageCheck, Eye,
  BarChart2, Filter, ArrowUpDown, Zap,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { CATEGORIES, BADGES } from "../data/products";

const EMPTY_FORM = {
  name: "", category: "Sarees", price: "", originalPrice: "",
  image: "", description: "", colors: "", sizes: "", badge: "",
  inStock: true, featured: false, rating: "", reviews: "",
};

const TABS = [
  { id: "products",  label: "All Products",    icon: <Package size={15} /> },
  { id: "add",       label: "Add Product",      icon: <Plus size={15} /> },
  { id: "outofstock",label: "Out of Stock",     icon: <PackageX size={15} /> },
  { id: "analytics", label: "Analytics",        icon: <BarChart2 size={15} /> },
];

export default function Admin() {
  const {
    products, addProduct, updateProduct, deleteProduct, toggleStock,
    removeOutOfStockProducts, markInStock, markAllInStock,
    exportProducts, importProducts, resetProducts,
    isAdminLoggedIn, adminLogout,
  } = useStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [tab, setTab] = useState("products");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("all"); // all | instock | outofstock
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // default | price-asc | price-desc | name

  // Guard
  if (!isAdminLoggedIn) {
    navigate("/admin-login");
    return null;
  }

  // ── Stats ─────────────────────────────────────────────
  const totalProducts   = products.length;
  const inStockCount    = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;
  const featuredCount   = products.filter((p) => p.featured).length;
  const totalValue      = products.reduce((s, p) => s + p.price, 0);
  const avgPrice        = totalProducts > 0 ? Math.round(totalValue / totalProducts) : 0;
  const categoryBreakdown = CATEGORIES.filter((c) => c !== "All").map((c) => ({
    name: c,
    count: products.filter((p) => p.category === c).length,
  })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

  // ── Filtered list ──────────────────────────────────────
  let filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || p.category === catFilter;
    const matchStock =
      stockFilter === "all" ? true :
      stockFilter === "instock" ? p.inStock :
      !p.inStock;
    return matchSearch && matchCat && matchStock;
  });

  if (sortBy === "price-asc")  filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sortBy === "name")       filtered.sort((a, b) => a.name.localeCompare(b.name));

  const outOfStockProducts = products.filter((p) => !p.inStock);

  // ── Form helpers ───────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setFormErrors({});
    setImagePreviewError(false);
    setTab("add");
  };

  const openEdit = (p) => {
    setForm({
      ...p,
      colors: p.colors?.join(", ") || "",
      sizes: p.sizes?.join(", ") || "",
      badge: p.badge || "",
      rating: p.rating?.toString() || "",
      reviews: p.reviews?.toString() || "",
    });
    setEditId(p.id);
    setFormErrors({});
    setImagePreviewError(false);
    setTab("add");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price required";
    if (!form.image.trim()) e.image = "Image URL is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.originalPrice && (isNaN(form.originalPrice) || Number(form.originalPrice) <= Number(form.price)))
      e.originalPrice = "MRP must be higher than selling price";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    const data = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      colors: form.colors ? form.colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      badge: form.badge || null,
      rating: form.rating ? parseFloat(form.rating) : 0,
      reviews: form.reviews ? parseInt(form.reviews) : 0,
    };
    if (editId) { updateProduct(editId, data); }
    else { addProduct(data); }
    setTab("products");
    setEditId(null);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleBulkDelete = () => {
    removeOutOfStockProducts();
    setBulkDeleteConfirm(false);
    setTab("products");
  };

  const handleLogout = () => { adminLogout(); navigate("/"); };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => importProducts(ev.target.result);
    reader.readAsText(file);
    e.target.value = "";
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => {
      setForm({ ...form, [key]: e.target.value });
      setFormErrors((p) => ({ ...p, [key]: "" }));
      if (key === "image") setImagePreviewError(false);
    },
  });

  const toggleFormCheck = (key) => (e) => setForm({ ...form, [key]: e.target.checked });

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin header */}
      <div className="bg-charcoal text-white shadow-lg sticky top-[calc(4rem+28px)] z-30">
        <div className="container-xl h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
              <Shield size={16} />
            </div>
            <div>
              <p className="font-display text-base font-bold leading-tight">
                Raja Nxt <span className="text-rose-400">Admin</span>
              </p>
              <p className="text-[10px] text-stone-400">Store Management Panel</p>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportProducts}
              className="hidden sm:flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
              title="Export products as JSON"
            >
              <Download size={13} /> Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="hidden sm:flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
              title="Import products from JSON"
            >
              <Upload size={13} /> Import
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-stone-300 hover:text-white transition-colors ml-2"
            >
              <LogOut size={15} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-xl py-8">
        {/* ── Stats ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Products", value: totalProducts,   icon: <Boxes size={18} />,        color: "text-blue-600 bg-blue-50",   onClick: () => { setTab("products"); setStockFilter("all"); } },
            { label: "In Stock",        value: inStockCount,   icon: <PackageCheck size={18} />,  color: "text-emerald-600 bg-emerald-50", onClick: () => { setTab("products"); setStockFilter("instock"); } },
            { label: "Out of Stock",    value: outOfStockCount, icon: <PackageX size={18} />,     color: outOfStockCount > 0 ? "text-red-600 bg-red-50" : "text-stone-400 bg-stone-50", onClick: () => setTab("outofstock") },
            { label: "Featured",        value: featuredCount,  icon: <Star size={18} />,          color: "text-amber-600 bg-amber-50",  onClick: null },
            { label: "Categories",      value: CATEGORIES.length - 1, icon: <Tag size={18} />,   color: "text-purple-600 bg-purple-50", onClick: null },
            { label: "Avg. Price",      value: `₹${avgPrice.toLocaleString("en-IN")}`, icon: <TrendingUp size={18} />, color: "text-rose-600 bg-rose-50", onClick: null },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 ${s.onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
              onClick={s.onClick || undefined}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
              <div>
                <p className="font-display text-xl font-bold text-charcoal">{s.value}</p>
                <p className="text-[10px] text-stone-400 leading-tight">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Out of stock alert */}
        {outOfStockCount > 0 && tab !== "outofstock" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                {outOfStockCount} product{outOfStockCount !== 1 ? "s" : ""} out of stock
              </p>
              <p className="text-xs text-amber-600 mt-0.5">Review and update stock status or remove these products.</p>
            </div>
            <button
              onClick={() => setTab("outofstock")}
              className="text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Manage →
            </button>
          </div>
        )}

        {/* ── Tabs ────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (t.id === "add" && editId) { setForm(EMPTY_FORM); setEditId(null); } }}
              className={`admin-tab-btn ${
                tab === t.id
                  ? t.id === "outofstock"
                    ? "bg-amber-600 text-white shadow-md"
                    : "bg-charcoal text-white shadow-md"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-rose-600"
              }`}
            >
              {t.icon} {t.label}
              {t.id === "outofstock" && outOfStockCount > 0 && (
                <span className={`ml-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${tab === "outofstock" ? "bg-white text-amber-600" : "bg-amber-500 text-white"}`}>
                  {outOfStockCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════════ PRODUCTS TAB ══════════════════════ */}
        {tab === "products" && (
          <div className="animate-fade-in">
            {/* Search & filter bar */}
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="input-field pl-9 py-2.5 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category filter */}
              <div className="relative">
                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  className="appearance-none input-field py-2.5 pr-8 text-sm cursor-pointer min-w-[140px]"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>

              {/* Stock filter */}
              <div className="relative">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="appearance-none input-field py-2.5 pr-8 text-sm cursor-pointer min-w-[140px]"
                >
                  <option value="all">All Stock</option>
                  <option value="instock">In Stock</option>
                  <option value="outofstock">Out of Stock</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none input-field py-2.5 pr-8 text-sm cursor-pointer min-w-[130px]"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="name">Name A-Z</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-stone-400">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
                <button onClick={openAdd} className="btn-primary py-2.5 text-sm">
                  <Plus size={15} /> Add Product
                </button>
              </div>
            </div>

            {/* Products table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/80">
                      <th className="text-left p-4 text-[11px] font-semibold text-stone-500 uppercase tracking-widest">Product</th>
                      <th className="text-left p-4 text-[11px] font-semibold text-stone-500 uppercase tracking-widest hidden sm:table-cell">Category</th>
                      <th className="text-left p-4 text-[11px] font-semibold text-stone-500 uppercase tracking-widest">Price</th>
                      <th className="text-center p-4 text-[11px] font-semibold text-stone-500 uppercase tracking-widest hidden md:table-cell">Stock</th>
                      <th className="text-center p-4 text-[11px] font-semibold text-stone-500 uppercase tracking-widest hidden lg:table-cell">Featured</th>
                      <th className="text-right p-4 text-[11px] font-semibold text-stone-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-stone-400 text-sm">
                          <Package size={32} className="mx-auto mb-3 text-stone-200" />
                          No products found
                        </td>
                      </tr>
                    ) : filtered.map((p) => (
                      <tr key={p.id} className={`border-b border-stone-50 hover:bg-stone-50/60 transition-colors last:border-0 ${!p.inStock ? "bg-red-50/30" : ""}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-12 object-cover rounded-lg flex-shrink-0 bg-stone-100"
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=60"; }}
                            />
                            <div>
                              <p className="font-semibold text-charcoal text-sm line-clamp-1">{p.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {p.badge && (
                                  <span className="text-[9px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-bold">{p.badge}</span>
                                )}
                                {!p.inStock && (
                                  <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">Out of Stock</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 hidden sm:table-cell">
                          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">{p.category}</span>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-charcoal">₹{p.price.toLocaleString("en-IN")}</p>
                          {p.originalPrice && (
                            <p className="text-[11px] text-stone-400 line-through">₹{p.originalPrice.toLocaleString("en-IN")}</p>
                          )}
                        </td>

                        <td className="p-4 hidden md:table-cell text-center">
                          <button
                            onClick={() => toggleStock(p.id)}
                            className="flex items-center gap-1.5 mx-auto hover:opacity-80 transition-opacity"
                            title="Toggle stock status"
                          >
                            {p.inStock
                              ? <><ToggleRight size={22} className="text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">In Stock</span></>
                              : <><ToggleLeft size={22} className="text-stone-300" /><span className="text-xs text-stone-400">Out of Stock</span></>
                            }
                          </button>
                        </td>

                        <td className="p-4 hidden lg:table-cell text-center">
                          <button
                            onClick={() => updateProduct(p.id, { featured: !p.featured })}
                            className="mx-auto flex items-center justify-center w-8 h-8 rounded-lg hover:bg-amber-50 transition-colors"
                            title={p.featured ? "Remove from featured" : "Mark as featured"}
                          >
                            <Star size={16} className={p.featured ? "text-amber-400 fill-amber-400" : "text-stone-200"} />
                          </button>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(p)}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                              title="Edit product"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ ADD / EDIT FORM ═══════════════════ */}
        {tab === "add" && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 max-w-3xl">
              <h2 className="font-display text-xl font-semibold text-charcoal mb-6 flex items-center gap-2">
                {editId ? <><Edit2 size={18} className="text-blue-500" /> Edit Product</> : <><Plus size={18} className="text-rose-500" /> Add New Product</>}
              </h2>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="label-style">Product Name *</label>
                  <input {...field("name")} placeholder="e.g. Banarasi Silk Saree"
                    className={`input-field ${formErrors.name ? "border-red-300 focus:ring-red-200" : ""}`} />
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>

                {/* Category + Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label-style">Category *</label>
                    <select {...field("category")} className="input-field">
                      {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-style">Badge</label>
                    <select {...field("badge")} className="input-field">
                      <option value="">None</option>
                      {BADGES.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label-style">Selling Price (₹) *</label>
                    <input {...field("price")} type="number" min={0} placeholder="2499"
                      className={`input-field ${formErrors.price ? "border-red-300" : ""}`} />
                    {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
                  </div>
                  <div>
                    <label className="label-style">Original / MRP (₹)</label>
                    <input {...field("originalPrice")} type="number" min={0} placeholder="3499 (optional)"
                      className={`input-field ${formErrors.originalPrice ? "border-red-300" : ""}`} />
                    {formErrors.originalPrice && <p className="text-xs text-red-500 mt-1">{formErrors.originalPrice}</p>}
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label-style">Rating (0–5)</label>
                    <input {...field("rating")} type="number" min={0} max={5} step={0.1} placeholder="4.5"
                      className="input-field" />
                  </div>
                  <div>
                    <label className="label-style">Number of Reviews</label>
                    <input {...field("reviews")} type="number" min={0} placeholder="120"
                      className="input-field" />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="label-style">Image URL *</label>
                  <input
                    {...field("image")}
                    placeholder="https://images.unsplash.com/…"
                    className={`input-field ${formErrors.image ? "border-red-300" : ""}`}
                  />
                  {formErrors.image && <p className="text-xs text-red-500 mt-1">{formErrors.image}</p>}
                  {form.image && (
                    <div className="mt-2 flex gap-3 items-center">
                      {!imagePreviewError ? (
                        <img
                          src={form.image}
                          alt="Preview"
                          className="w-16 h-20 object-cover rounded-xl border border-stone-200 shadow-sm"
                          onError={() => setImagePreviewError(true)}
                        />
                      ) : (
                        <div className="w-16 h-20 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center">
                          <X size={16} className="text-red-400" />
                        </div>
                      )}
                      <p className="text-xs text-stone-400">{imagePreviewError ? "Invalid image URL" : "Preview"}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="label-style">Description *</label>
                  <textarea {...field("description")} rows={3} placeholder="Describe the product…"
                    className={`input-field resize-none ${formErrors.description ? "border-red-300" : ""}`} />
                  {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
                </div>

                {/* Colors & Sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label-style">Colors (comma separated)</label>
                    <input {...field("colors")} placeholder="Red, Blue, Green" className="input-field" />
                    <p className="text-[10px] text-stone-400 mt-1">e.g. Red, Royal Blue, Emerald</p>
                  </div>
                  <div>
                    <label className="label-style">Sizes (comma separated)</label>
                    <input {...field("sizes")} placeholder="S, M, L, XL or Free Size" className="input-field" />
                    <p className="text-[10px] text-stone-400 mt-1">e.g. S, M, L, XL or Free Size</p>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6 flex-wrap p-4 bg-stone-50 rounded-xl">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.inStock} onChange={toggleFormCheck("inStock")}
                      className="w-4 h-4 accent-rose-600 rounded" />
                    <span className="text-sm font-medium text-stone-700">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={toggleFormCheck("featured")}
                      className="w-4 h-4 accent-rose-600 rounded" />
                    <span className="text-sm font-medium text-stone-700">Featured on Homepage</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="btn-primary flex-1 py-3.5 text-base">
                    <Save size={17} /> {editId ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    onClick={() => { setTab("products"); setEditId(null); }}
                    className="btn-outline px-6"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ OUT OF STOCK TAB ══════════════════ */}
        {tab === "outofstock" && (
          <div className="animate-fade-in">
            {outOfStockProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-emerald-500" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-2">All Products In Stock!</h3>
                <p className="text-stone-400 text-sm">No out-of-stock products at the moment.</p>
              </div>
            ) : (
              <>
                {/* Bulk actions */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-500" />
                      {outOfStockProducts.length} Out-of-Stock Product{outOfStockProducts.length !== 1 ? "s" : ""}
                    </h3>
                    <p className="text-xs text-amber-700 mt-0.5">You can restore stock individually or remove all out-of-stock items at once.</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={markAllInStock}
                      className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      <PackageCheck size={13} /> Mark All In Stock
                    </button>
                    <button
                      onClick={() => setBulkDeleteConfirm(true)}
                      className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={13} /> Remove All ({outOfStockProducts.length})
                    </button>
                  </div>
                </div>

                {/* Out of stock product cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {outOfStockProducts.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-red-100">
                      <div className="relative">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-40 object-cover opacity-60"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=60"; }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mb-1">{p.category}</p>
                        <h4 className="font-display text-sm font-semibold text-charcoal line-clamp-1 mb-1">{p.name}</h4>
                        <p className="font-bold text-rose-600 text-sm mb-3">₹{p.price.toLocaleString("en-IN")}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => markInStock(p.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold py-2 rounded-xl hover:bg-emerald-100 transition-colors"
                          >
                            <PackageCheck size={13} /> Restock
                          </button>
                          <button
                            onClick={() => openEdit(p)}
                            className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="flex items-center justify-center gap-1.5 bg-red-50 text-red-500 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════ ANALYTICS TAB ═════════════════════ */}
        {tab === "analytics" && (
          <div className="animate-fade-in space-y-6">
            {/* Category breakdown */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-display text-lg font-semibold text-charcoal mb-5">Products by Category</h3>
              <div className="space-y-3">
                {categoryBreakdown.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-stone-700">{c.name}</span>
                      <span className="text-stone-400">{c.count} products</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-500"
                        style={{ width: `${(c.count / totalProducts) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-2">Total Inventory Value</p>
                <p className="font-display text-2xl font-bold text-charcoal">₹{totalValue.toLocaleString("en-IN")}</p>
                <p className="text-xs text-stone-400 mt-1">At selling prices</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-2">Stock Health</p>
                <p className="font-display text-2xl font-bold text-emerald-600">{totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0}%</p>
                <p className="text-xs text-stone-400 mt-1">Products in stock</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-2">Featured Products</p>
                <p className="font-display text-2xl font-bold text-amber-600">{featuredCount}</p>
                <p className="text-xs text-stone-400 mt-1">Shown on homepage</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={exportProducts}
                  className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 transition-all text-left"
                >
                  <Download size={18} className="text-stone-400" />
                  <div>
                    <p className="text-sm font-semibold text-stone-700">Export Products</p>
                    <p className="text-xs text-stone-400">Download all products as JSON</p>
                  </div>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 transition-all text-left"
                >
                  <Upload size={18} className="text-stone-400" />
                  <div>
                    <p className="text-sm font-semibold text-stone-700">Import Products</p>
                    <p className="text-xs text-stone-400">Upload a JSON products file</p>
                  </div>
                </button>
                <button
                  onClick={markAllInStock}
                  className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left"
                >
                  <PackageCheck size={18} className="text-stone-400" />
                  <div>
                    <p className="text-sm font-semibold text-stone-700">Mark All In Stock</p>
                    <p className="text-xs text-stone-400">Restore all out-of-stock items</p>
                  </div>
                </button>
                <button
                  onClick={() => { if (window.confirm("Reset to default products? This cannot be undone.")) resetProducts(); }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-left"
                >
                  <RefreshCw size={18} className="text-stone-400" />
                  <div>
                    <p className="text-sm font-semibold text-stone-700">Reset to Defaults</p>
                    <p className="text-xs text-stone-400">Restore original product list</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ─────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full animate-scale-in">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-display text-xl font-semibold text-center text-charcoal mb-2">Delete Product?</h3>
            <p className="text-stone-400 text-sm text-center mb-6">
              This action cannot be undone. The product will be permanently removed from your store.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-red-700 transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border-2 border-stone-200 py-3 rounded-2xl font-semibold text-sm text-stone-600 hover:border-stone-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk delete confirmation ──────────────────────── */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setBulkDeleteConfirm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full animate-scale-in">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PackageX size={24} className="text-red-500" />
            </div>
            <h3 className="font-display text-xl font-semibold text-center text-charcoal mb-2">
              Remove All Out-of-Stock?
            </h3>
            <p className="text-stone-400 text-sm text-center mb-2">
              This will permanently delete <strong className="text-red-600">{outOfStockProducts.length} product{outOfStockProducts.length !== 1 ? "s" : ""}</strong> from your store.
            </p>
            <p className="text-xs text-stone-400 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleBulkDelete} className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-red-700 transition-colors">
                Remove All
              </button>
              <button onClick={() => setBulkDeleteConfirm(false)} className="flex-1 border-2 border-stone-200 py-3 rounded-2xl font-semibold text-sm text-stone-600 hover:border-stone-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
