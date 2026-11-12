# Memory: Stockify

> Temporary project doc. Delete the whole `docs/` folder once the project is complete.
> This is the **living log**. The agent reads it first in every session and updates it at the end of every task.

## 1. Project snapshot
- **Name:** Stockify (Smart Inventory Management System)
- **Owner:** Mohammed Faizal
- **What it is:** Inventory and allocation system for a smartphone retail chain. Products: smartphones, smartwatches, tablets.
- **Chain of command:** Head Office > Zonal Office > District Office > Stores. Stock moves only between a parent and its direct child.
- **Stack:** HTML, CSS and plain JavaScript only (classic scripts, no modules), LocalStorage. No frameworks, no libraries, no backend.
- **Tool:** Google Antigravity
- **Project path:** `C:\Projects\Stockify`
- **Run with:** double-click `index.html` (no server needed).
- **Look:** follows the UVentra-style reference dashboard (light, rounded cards, blue accent, dark mode toggle). Currency INR.
- **Hard requirement:** every product has its own photo; adding a product requires uploading one.

## 2. Decisions (fixed unless the owner changes them)
| # | Decision | Reason |
|---|---|---|
| D1 | Single-page app with hash router | Works on any static server, simple |
| D2 | Services layer owns all business rules and all LocalStorage writes | Clean seam for a future backend |
| D9 | Classic scripts sharing one `window.Stockify` namespace (IIFE pattern), no ES modules | Must run from file:// with plain HTML/CSS/JS |
| D3 | Charts are hand-built SVG, no libraries | Stack restriction |
| D4 | Seed product photos are SVG files in assets/; uploaded photos are resized JPEG data URLs | Saves LocalStorage quota; SVGs load fine from file:// |
| D5 | Demo login is a user picker, no passwords | Frontend only |
| D6 | In-transit stock belongs to the allocation until received | Keeps totals reconcilable |
| D7 | Currency is INR with Indian grouping (₹1,24,999) | Indian retail chain |
| D8 | Reference screenshot branding (UVentra) is not reused; brand is Stockify | Originality |
| D10 | Helper functions in seed.js (ago, randInt, pick) declared at the top of the IIFE before data arrays | Avoids TDZ errors with const; data arrays call these functions at eval time |
| D11 | View stubs registered in stubs.js for all Phase 2+ views | Router never throws "view not found" in Phase 1 |
| D12 | Hairline-stripe SVG chart built with dynamic scale ticks and accessible table toggle | Matches UVentra visual styling while meeting WCAG AA requirements |
| D13 | Radial-tick gauge (~200 degrees) drawn with trigonometric tick geometry | Clean, responsive, and animated without canvas or library overhead |
| D14 | Client-side image upload pipeline resizes to max 600px JPEG (0.8 quality) | Ensures LocalStorage quota compliance while maintaining sharp product displays |
| D15 | Products with stock or transaction history are deactivated, never deleted | Maintains full audit integrity of stock movements and ledger |
| D16 | Allocations enforce strict direct parent-child routes and immediate sender deduction | Prevents double-counting and ensures physical stock + in transit always reconciles |

## 3. Phase tracker
Update the checkbox and date when a phase is complete and tested.

- [x] **Phase 1: Foundation.** Folder structure, tokens, theme, storage, seed data, login, shell (top bar, side rail, router) — **COMPLETE 2026-11-11, 37/37 tests pass**
- [x] **Phase 2: Dashboard.** Welcome, 3 KPI cards, Inventory Statistics, Sales Overview, Recent Activities, Alerts, Top Selling Products (all scoped by role) — **COMPLETE 2026-11-11, 44/44 tests pass**
- [x] **Phase 3: Catalogue.** Inventory grid/table, product detail, add/edit with photo upload, stock-in — **COMPLETE 2026-11-11, 25/25 tests pass**
- [x] **Phase 4: Allocations.** Push, request, approve, dispatch, receive, list and detail drawer — **COMPLETE 2026-11-11, 22/22 tests pass**
- [x] **Phase 5: Network and Sales.** Office tree, office management, sales and returns, targets — **COMPLETE 2026-11-11, 59/59 tests pass**
- [x] **Phase 6: Reports, Settings, Polish.** Reports + CSV, settings, empty states, responsive pass, accessibility pass, testing checklist — **COMPLETE 2026-11-11, 32/32 tests pass (Full Regression: 39/39 pass)**

**Current phase:** Phase 6 complete — All 6 phases delivered and verified!
**Last updated:** 2026-11-11

## 4. File map

| File | Purpose | Phase |
|---|---|---|
| `index.html` | App shell, ordered `<script>` tags, app-frame structure | 1, 2, 3, 4 |
| `login.html` | Demo login: role/user picker, theme toggle, sign-in | 1 |
| `css/tokens.css` | All CSS custom properties: colours (light + dark), radii, shadows, spacing, type | 1 |
| `css/base.css` | Reset, typography, utilities, skeleton animation | 1 |
| `css/layout.css` | App frame, top bar pill, left side rail, dashboard 12-col grid, responsive breakpoints | 1, 2 |
| `css/components.css` | Buttons, inputs, badges, KPI cards, table, modal/drawer, toast, empty-state, product-thumb | 1, 2, 4 |
| `css/dashboard.css` | Welcome block, inv-stats chart, gauge, activity rows, alert rows, top-prod rows | 1, 2 |
| `css/pages.css` | Inventory grid/table, uploader dropzone, dynamic forms, allocation tabs & timeline, print note | 1, 3, 4 |
| `js/namespace.js` | Creates `window.Stockify = { store, services, views, components, utils, state, events, router }` | 1 |
| `js/events.js` | Pub/sub event bus: on(), emit(), once() | 1 |
| `js/utils/format.js` | INR (Intl), num, pct, date, time, relative, datetime, greeting, initials | 1 |
| `js/utils/dom.js` | h(), qs(), qsa(), mount(), svgEl(), appendAll() | 1 |
| `js/utils/image.js` | validateFile(), resizeToDataUrl() — canvas JPEG pipeline | 1 |
| `js/utils/id.js` | Sequential ID generators: userId, officeId, productId, allocationId, movementId, saleId, suggestSku | 1 |
| `js/utils/validate.js` | required, positive, nonNegative, wholeNumber, maxLen, pattern, check, uniqueSku | 1 |
| `js/utils/csv.js` | toCSV(), download() | 1 |
| `js/store/storage.js` | All LocalStorage access: get/set/remove/clearAll, isSeeded/markSeeded, exportAll/importAll, quota check | 1 |
| `js/store/seed.js` | 22 offices, 13 users, 15 products, 330 stock rows, ~1981 sales, ~345 movements, 5 seed allocations | 1, 4 |
| `js/store/selectors.js` | subtreeIds, getOffice, getChildren, getStoresInSubtree, stock aggregates, sales aggregates, KPI/chart/alert queries | 1 |
| `js/services/auth.js` | getCurrentUser, isLoggedIn, login, logout, getDemoUsers, hasRole, canAccess | 1 |
| `js/services/products.js` | Product CRUD, search/filter queries, SKU validation, HO permission enforcement | 3 |
| `js/services/stock.js` | Stock adjustments, supplier stock-in, non-negative stock invariant, movement ledger | 3 |
| `js/services/allocations.js` | State machine for push & requests, direct child checks, transit stock, receipt & discrepancies | 4 |
| `js/services/activity.js` | Enriched activity history scoped by user subtree with icons & details | 2 |
| `js/services/alerts.js` | Live alerts (out of stock, overdue shipments, low stock, pending requests) & unread counter | 2 |
| `js/services/dashboard.js` | Dashboard aggregates: scope subtitle, 3 KPI cards with trends, inventory statistics, sales overview | 2 |
| `js/router.js` | Hash router: matchRoute, navigate, handleRoute, updateNavActive, start | 1 |
| `js/components/toast.js` | Toast system: show/success/error/warning/info, auto-dismiss, aria-live | 1 |
| `js/components/modal.js` | Accessible modal & confirmation dialogs (Esc key, focus control, backdrop dismiss) | 3 |
| `js/components/drawer.js` | Sliding side drawer panel with backdrop, close button, and focus trap | 4 |
| `js/components/topbar.js` | Top-bar pill: logo, nav tabs, settings btn, bell btn with unread dot, user chip + dropdown | 1, 2 |
| `js/components/sidebar.js` | Left rail: theme-toggle pill, nav icon pill, help/logout pill; applyTheme/toggleTheme | 1 |
| `js/components/productThumb.js` | Standardized product thumbnail element with lazy loading & placeholder fallback | 2 |
| `js/components/imageUploader.js` | Drag-and-drop / file picker dropzone with 1:1 preview, canvas resize, replace/remove | 3 |
| `js/components/kpiCard.js` | Individual KPI card with gradient icon, trend badge, and subtle corner arc decoration | 2 |
| `js/components/barChart.js` | Hand-crafted SVG hairline-stripe bar chart with tooltip & accessible data table toggle | 2 |
| `js/components/gauge.js` | Hand-crafted SVG radial-tick semi-circular gauge with % goal and sales metrics | 2 |
| `js/components/activityList.js` | Recent activities card showing latest movements with product thumbnails & relative time | 2 |
| `js/components/alertList.js` | Alerts & notifications card with tinted rows and click-to-route handling | 2 |
| `js/views/dashboard.js` | Full dashboard view assembling the 12-column grid layout with live scoped data | 1, 2 |
| `js/views/inventory.js` | Inventory catalogue page with Grid/Table views, search, category/status/brand filters, and HO Add button | 3 |
| `js/views/productDetail.js` | Product detail view with large photo, specs, subtree stock breakdown by office, and movement history | 3 |
| `js/views/productForm.js` | Add & Edit product form with mandatory image uploader, dynamic category variants, and live preview | 3 |
| `js/views/stockIn.js` | Supplier stock-in consignment entry for Head Office with live product stock preview | 3 |
| `js/views/allocations.js` | Allocations list with status tabs, counts, code search, and overlapping product thumbnails | 4 |
| `js/views/allocationForm.js` | Push allocation (direct child destination) and Stock request (parent destination) forms | 4 |
| `js/views/allocationDetail.js` | Detailed consignment view with timeline, line items, discrepancy handling, and delivery note print | 4 |
| `js/views/stubs.js` | Stub views for all Phase 5+ routes — prevents router errors | 1, 3, 4 |
| `js/app.js` | Bootstrap: seed check, applyTheme, build topbar+sidebar, start router, bell-dot sync | 1, 2 |
| `assets/images/placeholder-product.svg` | Fallback image for failed product photo loads | 1 |
| `assets/images/products/*.svg` | 15 product illustrations (5 phones, 5 watches, 5 tablets) | 1 |

## 5. Data and seed notes
- Offices: 1 HO (Bengaluru), 3 zones (South, West, North), 2 districts each, 2 stores each = 22 total offices.
- Products: 15 seed (5 phones, 5 watches, 5 tablets), each with a `.svg` in `assets/images/products/`.
- Stock: 330 rows (22 offices × 15 products).
- Seed Allocations: 5 distinct records (Received, Dispatched in transit, Overdue in transit, Pending Store Request, Received with discrepancy).
- Stock network total reconciliation: 3,010 physical units in offices + 21 units in transit = 3,031 total units.

## 6. Known issues and TODOs
| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | Direct automated browser control unavailable in sandbox (Chrome remote debugging port inactive) | Low | Comprehensive Node.js virtual DOM & data-flow verification suite used (all tests pass) |

## 7. Open questions for the owner
- None.

## 8. Session log
Newest first. One entry per task.

```
### 2026-11-11, Phase 4, Allocations
- Done:
  - Created js/services/allocations.js: Complete state machine (push, request, approve, reject with reason, dispatch, receive, acknowledge discrepancy, cancel). Enforced direct parent-child invariant, non-negative sender balances, in-transit state, sequential codes (ALC-0001+), and auditable timeline logs.
  - Created js/components/drawer.js: Slide-out side drawer with backdrop and close actions.
  - Created js/views/allocations.js: Allocations list with status tabs & counts (All, Requested, Approved, Dispatched, Received), code/office search, date filtering, and up to 3 overlapping product thumbnails.
  - Created js/views/allocationForm.js: Dual-mode form for Push (destination: direct children) and Stock Request (destination: locked to parent), available stock steppers, live running summary, and dispatch confirmation.
  - Created js/views/allocationDetail.js: Horizontal progress timeline (Requested -> Approved -> Dispatched -> Received), discrepancy banner and short-receipt adjustment, contextual actions (Approve, Reject, Dispatch, Confirm Receipt, Acknowledge Discrepancy), and clean printable delivery note stylesheet.
  - Updated js/store/seed.js: Seeded 5 allocations across all states (Received, Dispatched, Overdue, Requested, Discrepancy) with reconciled movement entries.
  - Updated css/pages.css: Added timeline styling, status tabs, and @media print rules.
  - Updated index.html: Registered all new scripts in order.
  - Updated js/views/stubs.js: Retired allocations stubs.

- Files created/changed:
  - Created: js/services/allocations.js, js/components/drawer.js, js/views/allocations.js, js/views/allocationForm.js, js/views/allocationDetail.js
  - Updated: js/store/seed.js, css/pages.css, index.html, js/views/stubs.js, memory.md

- Tests run / result:
  - Node.js syntax check: 40/40 JS files pass (0 syntax errors)
  - Phase 4 test suite: 22/22 PASS
    - Scenario A: HO pushes 25 units to Zone -> HO stock drops 45 -> 20; Zone stock remains 30 in transit; Zone receives -> rises to 55.
    - Scenario B: Store requests 10 watches from District -> District sees pending alert -> District approves & dispatches (drops -10) -> Store receives (+10).
    - Scenario C: Short receipt of 7 out of 10 -> flags discrepancy -> HO acknowledges discrepancy -> 3 units shortfall returned to HO stock.
    - Scenario D: Illegal transfers (HO -> Store level-skipping, Store push, and over-dispatch) blocked with PermissionError and ValidationError.
    - Scenario E: Scope isolation verified (West Zone cannot see South Zone child allocations).
    - Scenario F: DOM rendering verified for allocations, allocationForm, and allocationDetail.
    - Network stock reconciliation verified: 3,010 physical units + 21 units in transit = 3,031 network total.

- Issues found: None.

- Next step: Phase 5 — Network and Sales.

### Session: 2026-11-11 (Phase 5: Network and Sales)
- What was done:
  - Created js/services/offices.js: Hierarchy tree generation with recursive subtree metrics, office CRUD with strict hierarchy validation (Zone -> HO, District -> Zone, Store -> District), and 0-stock ledger row initialization.
  - Created js/services/sales.js: Retail sales recording for store cashiers with non-negative stock verification, ledger movement logging, customer return processing, and store monthly sales target quotas.
  - Created js/views/network.js: Multi-tier organizational hierarchy tree view with indentation, type badges, store counts, physical stock units, total stock value in INR, mini health bars, and Add/Edit office modal.
  - Created js/views/officeDetail.js: Comprehensive node dashboard with local and subtree KPI cards, subordinate offices cards, full local product inventory table with productThumb, recent allocations, and retail sales ledger.
  - Created js/views/sales.js: Dual-experience sales view. POS terminal with receipt modal for store users; sales analytics and targets quota manager for parent offices.
  - Updated js/utils/dom.js: Added inline SVG icon helper (`dom.icon`).
  - Updated js/utils/format.js: Added `format.currency`, `format.number`, and `format.dateTime` aliases.
  - Updated js/components/productThumb.js: Added flexible sizing and direct component invocation.
  - Updated css/pages.css: Added styles for tree indentation, level-colored cards, mini health bars, POS terminal grid, and target progress bars.
  - Updated index.html: Registered new services and views; added Sales tab to topbar navigation.
  - Tests run: 59/59 PASS.

### Session: 2026-11-11 (Phase 6: Reports, Settings, Polish — Final Phase)
- What was done:
  - Created js/services/reports.js: 5 comprehensive business reports (Stock by Office & Category, Stock Ageing, Sales Performance by Store/Product/Period, Allocation Turnaround with discrepancy rates, and Low/Out of Stock Deficit Audit).
  - Created js/views/reports.js: Tabbed report selector, multi-parameter filters (office, category, date range), product photos, summary KPI cards, and one-click UTF-8 BOM CSV export.
  - Created js/views/activity.js: Complete immutable ledger audit log with search, filters (movement type, product, office, date range), and 25-item pagination.
  - Created js/views/settings.js: Operational preferences (Theme switch, reorder level, transit delay threshold, currency format display), live LocalStorage quota progress bar with 80% warning, full JSON database backup export/import with schema validation, and demo data reset.
  - Updated js/utils/csv.js: Added UTF-8 Byte Order Mark (`\uFEFF`) to CSV exports ensuring perfect symbol and character rendering in Microsoft Excel.
  - Updated js/store/storage.js: Added `getStorageStats()` for live quota telemetry.
  - Updated js/components/topbar.js: Implemented live notification bell dropdown with real-time alert routing, interactive User Profile modal, and Switch Demo User account switcher.
  - Updated css/layout.css and css/components.css: Added notification dropdown styles, `.table-wrap` responsive horizontal scroll, and mobile accessibility styles.
  - Retired all stubs in js/views/stubs.js and registered all services and views in index.html.
  - Created README.md: Complete project overview, quick start guide, demo accounts list, and test runner instructions.

### Session: 2026-11-11 (Karnataka Hierarchy Expansion)
- What was done:
  - Scaled office network to full Karnataka administrative hierarchy based on `karnataka_districts_and_taluks.csv`:
    - 1 Head Office in Mangaluru (`off_001`, HO-MNG, Mohammed Faizal)
    - 4 Zonal Divisions: Bengaluru (`ZN-BLR`), Belagavi (`ZN-BGV`), Kalaburagi (`ZN-KLB`), Mysuru (`ZN-MYS`)
    - 31 District Offices (e.g., Dakshina Kannada, Mysuru, Udupi, Bengaluru Urban, etc.)
    - 240 Taluk Offices across all districts
    - 480 Retail Stores (exactly 2 stores per taluk)
    - Total offices: 756 offices across 5 tiers.

### Session: 2026-11-12 (Phones Dataset & Catalogue Integration)
- What was done:
  - Integrated 14 smartphone brand datasets from `Phones.zip` (`scratch_phones/`):
    - Apple (15 models), Asus (4 models), Google (17 models), Honor (8 models), iQOO (20 models), Motorola (37 models), Nothing / CMF (12 models), OnePlus (18 models), OPPO (39 models), POCO (29 models), Realme (48 models), Samsung (61 models), Vivo (48 models), Xiaomi / Redmi (38 models).
    - Preserved baseline products (`prd_001`..`prd_015`) to maintain full backward compatibility with allocations, sales, and tests.
    - Total catalogue now expanded to 399 products: 389 smartphones, 5 smartwatches, 5 tablets.
  - Generated 374 tailored brand SVG product images in `assets/images/products/` matching each phone model (389 SVG files total).
  - Built a sparse stock ledger architecture to keep database storage well within browser LocalStorage 5 MB limits (~2.6 MB / 52.4% capacity).
  - Balanced initial Head Office ingestion movements ($Q_{\text{in}} = Q_{\text{phys}} + Q_{\text{transit}} + Q_{\text{sales}}$) achieving exact 0 unit error network reconciliation ($154,942 \text{ physical} + 21 \text{ in-transit} = 154,963 \text{ total active units}$).
  - Updated `js/views/inventory.js` to dynamically generate brand filter options across all 19 unique brands in the catalogue.
  - Updated regression test suites (`test_full_regression.js`, `test_phase5.js`, `test_phase6.js`): All 134 automated tests pass 100%.

- Tests run / result:
  - Full Regression Audit (`tests/test_full_regression.js`): 42/42 PASS.
  - Phase 5 Verification (`tests/test_phase5.js`): 60/60 PASS.
  - Phase 6 Verification (`tests/test_phase6.js`): 32/32 PASS.
  - Total tests passing: 134 passed, 0 failed.

- Issues found: None. Storage usage safely within quota.

### Session: 2026-11-12 (Laptops & Tablets Ingestion & Multi-Category Support)
- What was done:
  - Ingested laptop dataset from `Laptop.zip` (`laptops_specifications_2020_to_2026_all_variants.csv`):
    - 79 distinct laptop models across 18 brands (Apple, HP, Lenovo, Asus, Acer, Dell, Alienware, Samsung, MSI, Microsoft, LG, Xiaomi, Realme, Infinix, Motorola, Gigabyte, Jio, Primebook).
  - Ingested tablet dataset from `Tablet.zip` (6 CSVs for Acer, Apple, Lenovo, OnePlus, Samsung, Xiaomi):
    - 88 new distinct tablet models across 6 brands, expanding the tablet section from 5 baseline models to 93 total tablets.
  - Generated 167 brand-styled SVG product image assets in `assets/images/products/` with realistic chassis, displays, keyboards, and camera layouts (553 SVG files total).
  - Total catalogue now expanded to 566 products (389 smartphones, 79 laptops, 93 tablets, 5 smartwatches).
  - Added new first-class category `'laptop'` across the entire application:
    - `js/utils/id.js`: added `LP` SKU prefix for laptops.
    - `js/views/inventory.js`: added `Laptops` category filter chip.
    - `js/views/productForm.js`: added `Laptop` segmented control button and mapped RAM/Storage/Color variant fields.
    - `js/services/reports.js` and `js/views/reports.js`: added Laptops column to Stock by Office and Category report and CSV export.
  - Re-seeded sparse stock ledger (19,871 stock rows) keeping total database storage at 3.33 MB (63.6% of LocalStorage quota).
  - Balanced initial Head Office ingestion movements ($Q_{\text{in}} = Q_{\text{phys}} + Q_{\text{transit}} + Q_{\text{sales}}$) achieving exact 0 unit error network reconciliation ($186,189 \text{ physical} + 21 \text{ in-transit} = 186,210 \text{ total active units}$).
  - All 137 automated tests pass 100%.

- Tests run / result:
  - Full Regression Audit (`tests/test_full_regression.js`): 45/45 PASS.
  - Phase 5 Verification (`tests/test_phase5.js`): 60/60 PASS.
  - Phase 6 Verification (`tests/test_phase6.js`): 32/32 PASS.
  - Total tests passing: 137 passed, 0 failed.

- Issues found: None.

## 9. Next step
Project fully updated with complete smartphones, laptops, and tablets datasets across all categories. Ready to stage and commit to Git.

## 10. Completion checklist (for the very end)
- [x] All 6 phases completed & verified
- [x] `rules.md` testing checklist fully green (all 11 items checked)
- [x] `prd.md` section 9 scenarios (all 13 flows pass)
- [x] Exact reconciliation formula verified ($\sum \text{Stock} + \text{In Transit} = \text{HO Stock-In} - \text{Sales} + \text{Returns}$)
- [x] Scope & permission checks verified for all 4 roles
- [x] CSV export with UTF-8 BOM verified
- [x] README.md added to project root
- [ ] **`docs/` folder deleted** *(Preserved for user to delete upon project acceptance)*
