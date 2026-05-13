# Raja Nxt — Women's Fashion Store v2.0

Daltonganj's premier women's fashion store website — migrated from Create React App to **Vite** for a dramatically faster development experience.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔑 Admin Access

Navigate to `/admin-login` and enter:

**Password:** `admin@access123`

## ✨ What's New in v2.0

### ⚡ Vite Migration (from Create React App)
- `react-scripts` → `@vitejs/plugin-react` + `vite`
- `public/index.html` → `index.html` at root (Vite convention)
- `src/index.js` → `src/main.jsx`
- `postcss.config.js` uses ES module syntax
- `tailwind.config.js` uses ES module syntax
- Manual chunk splitting for vendor/icons
- Dev server opens on port 3000 automatically

### 🛡️ Enhanced Admin Panel
- **Add Product** — with image preview, rating & review count fields, MRP validation
- **Edit Product** — pre-filled form with all fields
- **Delete Product** — confirmation modal
- **Out of Stock Tab** — visual card view of all out-of-stock items
  - Restock individual products with one click
  - Mark All In Stock (bulk)
  - Remove All Out-of-Stock (bulk delete with confirmation)
- **Analytics Tab**
  - Category breakdown with visual bars
  - Stock health percentage
  - Inventory value
  - Export products as JSON
  - Import products from JSON
  - Reset to defaults
- Stock filter on product list (All / In Stock / Out of Stock)
- Sort by price (asc/desc) or name
- Live out-of-stock alert banner
- Clickable stat cards for quick filtering

### 🎨 UI Enhancements
- Improved Toast notifications (success / error / info / warning with icons)
- Enhanced ProductCard with better hover effects & wishlist animations
- Improved QuickViewModal with trust badges
- Better Admin Login with attempt limiting & loading state
- Refined color chips, badge styles
- Custom range input styling
- `scale-107` custom Tailwind extension for subtle image zoom

## 📁 Project Structure

```
raja-nxt/
├── index.html              # Vite entry (root level)
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind config (ESM)
├── postcss.config.js       # PostCSS config (ESM)
├── package.json
└── src/
    ├── main.jsx            # App entry (was index.js)
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   └── ui/
    │       ├── ProductCard.jsx
    │       ├── QuickViewModal.jsx
    │       └── Toast.jsx
    ├── context/
    │   └── StoreContext.jsx  # Global state + admin actions
    ├── data/
    │   └── products.js
    └── pages/
        ├── Home.jsx
        ├── Products.jsx
        ├── Contact.jsx
        ├── Location.jsx
        ├── Admin.jsx         # Enhanced admin panel
        ├── AdminLogin.jsx
        └── NotFound.jsx
```

## 🛒 Features

- Browse products by category
- Search & filter (price, availability, sort)
- Quick View modal for products
- Add to bag / wishlist
- Cart sidebar with quantity management
- WhatsApp-based checkout
- Admin panel for full product management
- Persistent state via localStorage
# raja-nxt-daltonganj
