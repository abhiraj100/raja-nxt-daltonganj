// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Toast from "./components/ui/Toast";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Location from "./pages/Location";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-cream">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/products"    element={<Products />} />
              <Route path="/contact"     element={<Contact />} />
              <Route path="/location"    element={<Location />} />
              <Route path="/admin"       element={<Admin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="*"            element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
