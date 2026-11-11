# Stockify — Smart Inventory & Allocation System

Stockify is a client-side inventory, allocation, and retail management platform built for a 4-tier retail electronics chain (**Head Office > Zonal Office > District Office > Retail Stores**).

---

## 🚀 Quick Start (No Server Needed)

Stockify is built strictly with plain HTML5, CSS3, and vanilla JavaScript. There are **no build steps, no npm packages, no bundlers, and no backend dependencies**.

1. **Double-click `index.html`** (or open it directly via `file:///` in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
2. If you are not signed in, you will be directed to `login.html`. Select any demo user to explore their role and scoped view.

---

## 👥 Demo User Accounts

| User Name | Role | Assigned Office | Access Scope |
|---|---|---|---|
| **Mohammed Faizal** | Head Office (`head`) | Head Office (HO-BLR), Bengaluru | Full visibility across all 22 offices. Can add/edit products, stock-in supplier inventory, and manage any office. |
| **Priya Rajan** | Zonal Manager (`zone`) | South Zone (ZN-SOUTH), Chennai | Manages 7 offices (South Zone, 2 Districts, 4 Stores). Can push/request stock and add/edit districts & stores. |
| **Kavitha Selvam** | District Manager (`district`) | Tamil Nadu District (DIS-TN), Chennai | Manages 3 offices (District + 2 Stores). Can push/request stock and add/edit stores in district. |
| **Ramesh Kumar** | Store Cashier (`store`) | Chennai Central Store (STR-CHN-01), Chennai | Scoped strictly to Chennai Central. Operates Point-of-Sale (POS) terminal, issues receipts, and processes returns. |

*Additional demo users for West Zone, North Zone, Maharashtra, Delhi, and other stores are selectable on the login screen or via the Top Bar **"Switch Demo User"** menu.*

---

## 📦 System Architecture & Features

- **Strict 4-Tier Command Chain**:
  - Stock moves **only** between a direct parent and child office (HO ↔ Zone, Zone ↔ District, District ↔ Store).
  - Cross-zone and level-skipping transfers are forbidden and rejected by the state machine.
- **Physical Reconciliation & In-Transit Invariant**:
  - Stock dispatched by a sender is immediately deducted from physical inventory and held **in transit** on the allocation until the destination confirms receipt.
  - Short receipt creates discrepancy records and returns unconfirmed units to the sender upon acknowledgment.
  - $\sum \text{Stock across all 22 offices} + \text{In-Transit Stock} = \text{Total HO Stock-In} - \text{Sales} + \text{Returns}$.
- **Hardware Catalog & Canvas Image Pipeline**:
  - 15 products with dedicated vector illustrations (Smartphones, Smartwatches, Tablets).
  - Every product is strictly rendered with its photo via `productThumb`.
  - Adding a product enforces photo upload, client-side downscaled to max 600px JPEG via HTML5 Canvas.
- **Interactive POS Terminal & Tax Invoice Receipts**:
  - Store cashiers record retail sales with non-negative stock verification, customer info, and payment modes (Cash, UPI, Card).
  - Generates printable receipts and supports customer returns with inventory restoration.
- **Reports & Business Intelligence**:
  - 5 real-time reports: Stock by Office & Category, Stock Ageing, Sales Performance, Allocation Turnaround, and Low/Out of Stock Audit.
  - One-click **CSV Export with UTF-8 BOM (`\uFEFF`)** for seamless opening in Microsoft Excel.
- **Live LocalStorage Telemetry & Backup**:
  - Real-time progress bar of browser Web Storage capacity with 80% quota warning alert.
  - Full JSON database backup export and schema-validated JSON import.

---

## 🧪 Automated Testing & Verification

Automated regression and reconciliation test suites run natively in Node.js (v18+) without requiring external dependencies:

```bash
# Run full system regression & reconciliation audit (all scenarios)
node tests/test_full_regression.js

# Run Phase 5 tests (Office hierarchy, POS sales & returns, targets)
node tests/test_phase5.js

# Run Phase 6 tests (Reports, CSV BOM, Settings, Topbar alerts)
node tests/test_phase6.js
```

---

## 🛠️ Tech Stack & Rules

- **Language**: Vanilla JavaScript (ES2020) registered on the `window.Stockify` namespace using IIFE modules.
- **Styling**: Vanilla CSS3 custom properties (`css/tokens.css`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/dashboard.css`, `css/pages.css`).
- **Icons & Graphics**: Pure inline handwritten SVG elements (no icon fonts or CDN requests).
- **Storage**: Persistent HTML5 LocalStorage with schema versioning (`stockify.*`).

