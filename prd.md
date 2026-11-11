# PRD: Stockify (Smart Inventory Management System)

> Temporary project doc. Delete the whole `docs/` folder once the project is complete.

## 1. Overview
Stockify is a web-based inventory and allocation system for a retail chain that sells **smartphones, smartwatches and tablets**. Stock enters at the **Head Office** and is allocated downward through a fixed chain of command until it reaches the **Stores**, where it is sold. Every level can see its own stock and the stock of everything beneath it.

Frontend only for now: HTML5, CSS3, vanilla JavaScript (ES6+), LocalStorage. No backend, no database, no frameworks.

## 2. Problem
Head office has no live view of where phones are sitting. Allocations to zones, districts and stores are tracked in calls and spreadsheets, so stores run out of popular models while others hold dead stock.

## 3. Goals
1. One dashboard showing stock, value, sales and alerts for the logged-in user's part of the chain.
2. A strict, auditable allocation flow: Head Office > Zonal Office > District Office > Store.
3. Every product has its own photo, visible everywhere the product appears.
4. Early warning for low stock, out of stock, delayed shipments and pending requests.

### Non-goals (for now)
Real authentication, payments, invoicing/GST, multi-currency, barcode hardware, a backend or API, native mobile app.

## 4. Organisation hierarchy
```
Head Office (1)
 └── Zonal Office (many)
      └── District Office (many per zone)
           └── Store (many per district)
```
- Stock moves **only between a parent and its direct child** (HO to Zone, Zone to District, District to Store). No skipping levels, no sideways transfers.
- A user sees their own office plus all descendants. Nobody sees siblings or ancestors' other branches.

## 5. Roles and permissions
One role per level. Demo login is a role/user picker (no passwords).

| Capability | Head Office | Zonal | District | Store |
|---|---|---|---|---|
| Create / edit / deactivate products | Yes | No | No | No |
| Stock in from supplier | Yes | No | No | No |
| Allocate (push) stock to direct children | Yes | Yes | Yes | n/a |
| Request stock from parent | n/a | Yes | Yes | Yes |
| Approve / reject child requests | Yes | Yes | Yes | n/a |
| Receive incoming allocations | n/a | Yes | Yes | Yes |
| Record sales and returns | No | No | No | Yes |
| Create / edit offices in own subtree | Yes (all) | Districts, stores | Stores | No |
| View dashboard and reports | All | Own zone | Own district | Own store |

## 6. Product catalogue
Categories: **Smartphone**, **Smartwatch**, **Tablet**.

Product fields:
- SKU (unique, auto-suggested, e.g. `SP-APL-IP17P-256-BLK`)
- Name, brand, category
- Variant: storage, colour (RAM optional for phones/tablets, case size optional for watches)
- Cost price, selling price (MRP), reorder level
- Description (optional)
- **Photo (mandatory)**
- Active flag

### Photo rule
- A product cannot be saved without a photo. The form shows a live preview and the Save button stays disabled until a valid image is chosen.
- Accepted: JPG, PNG, WEBP. Input limit 5 MB. Image is resized client-side (max 600 px on the longest side) and stored as a compressed JPEG data URL.
- The photo appears in: product list/grid, product detail, allocation line items, stock tables, top products widget, recent activity (where a product is named), alerts, sales entry.
- Seed products ship with their own images in `assets/images/products/`. A neutral placeholder is used only if an image fails to load, never as a substitute for a missing upload.

## 7. Functional requirements

### 7.1 Login and session
- FR-1: Login screen lists demo users (one or more per level). Selecting one starts a session stored in LocalStorage.
- FR-2: Logout clears the session. All routes redirect to login without a session.
- FR-3: Navigation, data and actions are filtered by role and office subtree.

### 7.2 Dashboard (matches the reference screenshot)
- FR-4: Welcome header with greeting and user name, and a subtitle for the current scope.
- FR-5: Three KPI cards with trend vs last month: **Total Products** (active models), **Total Stock Value**, **Low Stock Items**.
- FR-6: **Inventory Statistics** bar chart with Stock In, Stock Out and Stock Value series, a Daily/Weekly/Monthly selector, hover tooltip, hover highlight on a bar.
- FR-7: **Sales Overview** gauge showing sales vs target (%), plus number of sales and total sales.
- FR-8: **Recent Activities** list: stock added, shipment received, allocation dispatched, request approved, sale recorded, return processed, each with time.
- FR-9: **Alerts and Notifications**: out of stock, low stock, shipments in transit too long, pending requests/allocations. Each row opens the relevant filtered view.
- FR-10: **Top Selling Products** (3 items) with photo, name, SKU, price and units sold.
- FR-11: Light/dark theme toggle, remembered across sessions.
- All figures are scoped to the logged-in user's subtree.

### 7.3 Inventory
- FR-12: Product list with grid and table views, search, filters (category, brand, stock status), and the product photo on every row/card.
- FR-13: Product detail: photo, specs, and a stock breakdown by office within the user's subtree.
- FR-14: Add product (Head Office): form with mandatory photo upload, preview, validation, duplicate SKU check.
- FR-15: Edit product, replace photo, deactivate (never hard delete a product that has stock or history).
- FR-16: Stock-in from supplier (Head Office): pick product, quantity, supplier name, reference; increases HO stock and logs a movement.

### 7.4 Allocations
- FR-17: **Push allocation**: a parent selects a direct child, adds product lines with quantity (photo shown per line), and dispatches. Status: Dispatched.
- FR-18: **Stock request**: a child requests products and quantities from its parent. Status: Requested, then Approved or Rejected by the parent.
- FR-19: Approved requests are dispatched by the parent (full or partial quantity).
- FR-20: The receiving office confirms receipt (full or with a short-received note). Status: Received.
- FR-21: Allocation list with status tabs, filters, detail drawer and printable allocation note.
- FR-22: Allocation codes are sequential and unique (`ALC-0001`).

### 7.5 Network (offices)
- FR-23: Tree view of the hierarchy with stock value and unit count per node.
- FR-24: Add/edit offices (within permission), with name, code, city, manager.
- FR-25: Office detail page showing stock, recent allocations and sales for that node.

### 7.6 Sales (stores)
- FR-26: Record a sale: product, quantity, price, optional customer name/phone, payment mode (cash/UPI/card). Reduces store stock.
- FR-27: Record a return: restores store stock and logs a movement.
- FR-28: Sales target per store per month, used by the dashboard gauge.

### 7.7 Reports
- FR-29: Stock by office and category; stock ageing; sales by product/store/period; allocation turnaround time; low-stock list.
- FR-30: Export any report table to CSV.

### 7.8 Settings
- FR-31: Theme, currency symbol display, default reorder level, in-transit delay threshold (days).
- FR-32: Reset demo data (re-seed) and export/import all data as JSON.

## 8. Business rules
1. Stock never goes negative. Any action that would do so is blocked with a clear message.
2. Dispatch deducts from the sender immediately and the stock is **in transit** (counted nowhere) until the receiver confirms. Receipt adds it to the receiver.
3. Short receipt: the difference stays logged as a discrepancy and returns to the sender after acknowledgement.
4. Only direct parent/child allocations are allowed.
5. Every change to stock writes a movement record (type, product, qty, from, to, user, time, reference).
6. Stock status: **Out** = 0, **Low** = at or below reorder level, **Healthy** otherwise.
7. Stock value = quantity x cost price. Sales value = quantity x selling price.
8. A product with stock or movement history can be deactivated but not deleted.
9. Currency is INR (₹), Indian digit grouping (e.g. ₹1,24,999).

## 9. Key user stories and acceptance
- *As Head Office, I add a new tablet with its photo and receive 200 units from the supplier.* Accept: cannot save without photo; product appears with photo in list and stock-in logged on dashboard activity.
- *As Head Office, I allocate 50 iPhones to the South Zone.* Accept: HO stock drops by 50 at dispatch; South Zone sees an incoming allocation with photos; after receipt its stock rises by 50.
- *As a Store manager, I request 10 smartwatches from my district.* Accept: district sees a pending request alert; approval and dispatch update statuses; store confirms receipt.
- *As a Store manager, I sell 2 phones.* Accept: store stock drops by 2, sales gauge and Top Products update.
- *As a Zonal manager, I open the dashboard.* Accept: I only see my zone's districts and stores, never another zone's data.

## 10. Non-functional requirements
- Works offline in a modern desktop browser (Chrome, Edge, Firefox). Fully usable at 1280 px and above; usable down to tablet width; sensible stacking on mobile.
- Dashboard renders in under 1 second with seed data.
- Keyboard accessible, visible focus states, WCAG AA contrast in both themes.
- LocalStorage budget handled: warn at 80% of quota; never silently fail on save.

## 11. Seed data (demo)
- 1 Head Office (Bengaluru), 3 Zones (South, West, North), 2 Districts per zone, 2 Stores per district (12 stores).
- 15 products: 5 smartphones, 5 smartwatches, 5 tablets, each with a seed image and realistic stock spread across the chain.
- 12 months of generated movements and sales so charts have shape.
- One demo user per level plus a second store user.

## 12. Delivery phases
1. **Foundation**: folder structure, tokens, theme, storage layer, seed data, login, app shell (top bar, side rail, router).
2. **Dashboard**: all widgets from section 7.2 with scoped data.
3. **Catalogue**: inventory list/grid, product detail, add/edit with photo upload, stock-in.
4. **Allocations**: push, request, approve, dispatch, receive, list and detail.
5. **Network and Sales**: office tree, office management, sales and returns, targets.
6. **Reports, Settings, Polish**: reports + CSV, settings, empty states, responsive pass, accessibility pass, testing checklist from `rules.md`.

## 13. Out of scope
Backend/API, real auth, accounting, tax, supplier portal, barcode scanning, push notifications.

## 14. Success criteria
- Every flow in section 9 works end to end with no console errors.
- No product anywhere in the UI is shown without its photo.
- Totals reconcile: sum of stock across all offices + in transit = HO stock-in minus sales plus returns.
