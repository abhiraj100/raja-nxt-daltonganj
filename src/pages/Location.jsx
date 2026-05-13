// src/pages/Location.jsx
import React from "react";
import { MapPin, Phone, Mail, Clock, Navigation, Bus, Car, Train } from "lucide-react";
import { STORE_INFO } from "../data/products";

const HOW_TO_REACH = [
  { icon: <Car size={20} />, title: "By Car / Auto", desc: "Take the Boring Road from Patna Junction. Ashiana Mall is on the right side after Boring Canal Road crossing. Ample parking available." },
  { icon: <Bus size={20} />, title: "By Bus", desc: "Buses 12, 18, and 23 stop directly at Boring Road crossing. Walk 2 minutes to Ashiana Mall entrance." },
  { icon: <Train size={20} />, title: "From Railway Station", desc: "Patna Junction is 4 km away. Take an auto-rickshaw or cab directly to Ashiana Mall, Boring Road — approx. 15 minutes." },
];

const NEARBY = [
  { name: "Near Alankar Jwellers", dist: "0 m" },
  { name: "Daltonganj Junction Railway Station", dist: "1.3 km" },
  { name: "Daltonganj Bus Stand", dist: "0.5 km" },
  { name: "Gandhi Maidan", dist: "1.1 km" },
  { name: "Sahar Thana", dist: "0.1 km" },
];

export default function Location() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-50 to-cream py-16 border-b border-rose-100">
        <div className="container-xl text-center">
          <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <MapPin size={28} className="text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-3">Find Our Store</h1>
          <p className="font-accent italic text-stone-500 text-xl">Come visit us — we'd love to meet you!</p>
          <div className="flex items-center justify-center gap-2 mt-5 text-stone-600 text-sm">
            <MapPin size={15} className="text-rose-500" />
            <span>{STORE_INFO.address}</span>
          </div>
        </div>
      </div>

      <div className="container-xl section-pad">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden shadow-sm border border-stone-100 h-80 sm:h-96 bg-stone-100 flex items-center justify-center relative">
              {/* Styled map placeholder — replace with real Google Maps embed if needed */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center gap-4 text-stone-400">
                <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <MapPin size={28} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="font-display text-lg font-semibold text-charcoal">Raja Nxt</p>
                  <p className="text-sm text-stone-500">Near Alankar Jwellers, Thana Road, Daltonganj</p>
                </div>
                <a
                  href={`https://maps.google.com/?q=Near+Alankar+Jwellers+Thana+Road+Daltonganj`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-rose-700 transition-colors shadow-md"
                >
                  <Navigation size={15} /> Open in Google Maps
                </a>
              </div>
            </div>

            {/* Embed note */}
            <p className="text-xs text-stone-400 mt-2 text-center">
              💡 Tip: Replace the map div above with a Google Maps iframe embed for your actual location.
            </p>
          </div>

          {/* Info panel */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="font-display text-xl font-semibold text-charcoal mb-5">Store Details</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Address</p>
                    <p className="text-sm text-stone-700 mt-0.5 leading-relaxed">{STORE_INFO.address}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Phone</p>
                    <a href={`tel:${STORE_INFO.phone}`} className="text-sm text-stone-700 mt-0.5 hover:text-rose-600 transition-colors">{STORE_INFO.phone}</a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Email</p>
                    <a href={`mailto:${STORE_INFO.email}`} className="text-sm text-stone-700 mt-0.5 hover:text-rose-600 transition-colors">{STORE_INFO.email}</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-rose-600" />
                <h3 className="font-display text-lg font-semibold text-charcoal">Store Hours</h3>
              </div>
              <ul className="space-y-2.5">
                {STORE_INFO.hours.map((h) => (
                  <li key={h.day} className="flex justify-between text-sm">
                    <span className="text-stone-600">{h.day}</span>
                    <span className="text-rose-600 font-semibold">{h.time}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-700 font-medium">Open Now · Closes at 8:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* How to reach */}
        <div className="mb-14">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-8">How to Reach Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_TO_REACH.map((h) => (
              <div key={h.title} className="card p-6 group hover:border-rose-200 border border-transparent">
                <div className="w-11 h-11 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  {h.icon}
                </div>
                <h3 className="font-display text-base font-semibold text-charcoal mb-2">{h.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby landmarks */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2 className="font-display text-2xl font-bold text-charcoal mb-6">Nearby Landmarks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NEARBY.map((n, i) => (
              <div key={n.name} className={`flex items-center justify-between p-4 rounded-2xl ${i === 0 ? "bg-rose-50 border border-rose-200" : "bg-stone-50"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-rose-600" : "bg-stone-300"}`} />
                  <span className={`text-sm ${i === 0 ? "font-semibold text-rose-700" : "text-stone-600"}`}>{n.name}</span>
                </div>
                <span className={`text-xs font-bold ${i === 0 ? "text-rose-600" : "text-stone-400"}`}>{n.dist}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
