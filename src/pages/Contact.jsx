// src/pages/Contact.jsx
import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from "lucide-react";
import { STORE_INFO } from "../data/products";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setSent(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactCards = [
    {
      icon: <Phone size={22} />,
      title: "Call Us",
      lines: [STORE_INFO.phone, "Mon–Sat, 10AM–8PM"],
      action: { label: "Call Now", href: `tel:${STORE_INFO.phone}` },
      color: "bg-green-50 text-green-600",
    },
    {
      icon: <Mail size={22} />,
      title: "Email Us",
      lines: [STORE_INFO.email, "We reply within 24 hours"],
      action: { label: "Send Email", href: `mailto:${STORE_INFO.email}` },
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <MessageCircle size={22} />,
      title: "WhatsApp",
      lines: [STORE_INFO.phone, "Quick responses guaranteed"],
      action: { label: "Chat Now", href: STORE_INFO.social.whatsapp },
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: <MapPin size={22} />,
      title: "Visit Store",
      lines: ["Thana Road, Daltonganj", "Come say hello!"],
      action: { label: "Get Directions", href: "/location" },
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 py-16 border-b border-rose-100">
        <div className="container-xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-3">Get in Touch</h1>
          <p className="font-accent italic text-stone-500 text-xl">We'd love to hear from you</p>
        </div>
      </div>

      <div className="container-xl section-pad">
        {/* Contact cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactCards.map((c) => (
            <div key={c.title} className="card p-5 text-center group">
              <div className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {c.icon}
              </div>
              <h3 className="font-display font-semibold text-charcoal mb-2">{c.title}</h3>
              {c.lines.map((l, i) => (
                <p key={i} className={`text-sm ${i === 0 ? "text-stone-700 font-medium" : "text-stone-400"}`}>{l}</p>
              ))}
              <a href={c.action.href}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors">
                {c.action.label} →
              </a>
            </div>
          ))}
        </div>

        {/* Form + Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">Send us a Message</h2>

              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-charcoal mb-2">Message Sent!</h3>
                  <p className="text-stone-500 text-sm mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-outline text-sm">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-widest">Full Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name" className={`input-field ${errors.name ? "border-red-300 ring-1 ring-red-200" : ""}`} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-widest">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com" className={`input-field ${errors.email ? "border-red-300 ring-1 ring-red-200" : ""}`} />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-widest">Phone</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-widest">Subject</label>
                      <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Order, Query, Feedback…" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-widest">Message *</label>
                    <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help you…"
                      className={`input-field resize-none ${errors.message ? "border-red-300 ring-1 ring-red-200" : ""}`} />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit" className="btn-primary w-full py-4 text-base">
                    <Send size={17} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Side info */}
          <div className="space-y-6">
            {/* Store hours */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Clock size={18} className="text-rose-600" />
                <h3 className="font-display text-lg font-semibold text-charcoal">Store Hours</h3>
              </div>
              <ul className="space-y-3">
                {STORE_INFO.hours.map((h) => (
                  <li key={h.day} className="flex justify-between items-center text-sm pb-3 border-b border-stone-50 last:border-0 last:pb-0">
                    <span className="text-stone-600 font-medium">{h.day}</span>
                    <span className="text-rose-600 font-semibold">{h.time}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-700 font-medium">Store is open now</span>
              </div>
            </div>

            {/* WhatsApp */}
            <a href={STORE_INFO.social.whatsapp} target="_blank" rel="noopener noreferrer"
              className="block bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white hover:shadow-lg transition-shadow">
              <MessageCircle size={28} className="mb-3" />
              <h3 className="font-display text-lg font-semibold mb-1">Chat on WhatsApp</h3>
              <p className="text-green-100 text-sm">For quick queries, order status & style advice</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                Open WhatsApp →
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
