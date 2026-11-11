# Architecture: Stockify

> Temporary project doc. Delete the whole `docs/` folder once the project is complete.

## 1. Stack and constraints
- HTML5, CSS3 and plain JavaScript (ES2020 syntax) only, loaded as **classic scripts**
- LocalStorage for persistence (single source of truth)
- No frameworks, no UI kits, no chart libraries, no backend, no build step
- Charts are hand-drawn SVG
- Icons are inline SVG (line style)
- **Runs by double-clicking `index.html`.** No server, no build step. Therefore: no `<script type="module">`, no `import`/`export`, no `fetch()` of local files, no dynamic `import()`.
- **Module pattern:** every JS file is an IIFE that attaches to one global namespace, e.g. `window.Stockify.services.stock = (function () { ... return { adjust }; })();`. `js/namespace.js` creates `window.Stockify = { store:{}, services:{}, views:{}, components:{}, utils:{} }` and is always loaded first.
- **Load order** is controlled by plain `<script src="...">` tags at the end of `index.html`: namespace, utils, store, services, components, views, router, app. A file may only use namespaces loaded above it.

## 2. Pattern
Single-page app with a hash router, written as classic scripts sharing one `window.Stockify` namespace.

```
View (renders DOM)  →  Service (business rules)  →  Store (LocalStorage)
        ↑                       │
        └──── events / re-render ┘
```
- **Views** only build and update DOM and handle UI events. No business rules.
- **Services** enforce rules (permissions, stock maths, allocation state machine) and are the only code that calls the store.
- **Store** is the only code that touches `localStorage`.
- **Components** are small reusable functions that return DOM elements (card, modal, toast, table, image uploader, charts).
- A tiny pub/sub (`events.js`) lets views refresh when data changes (`stock:changed`, `allocation:changed`, `sale:recorded`).

## 3. Folder structure
```
Stockify/
├── index.html                  # app shell + ordered <script> tags (classic, no modules)
├── login.html                  # demo login (role/user picker)
├── css/
│   ├── tokens.css              # colours, radii, shadows, spacing, type (light + dark vars)
│   ├── base.css                # reset, typography, utilities
│   ├── layout.css              # shell: top bar, side rail, grid, responsive
│   ├── components.css          # cards, buttons, inputs, tables, badges, modal, toast
│   ├── dashboard.css           # dashboard-specific widgets
│   └── pages.css               # inventory, allocations, network, sales, reports
├── js/
│   ├── namespace.js            # creates window.Stockify (load first)
│   ├── app.js                  # bootstrap: seed check, session guard, router start
│   ├── router.js               # hash routes → views, guards by role
│   ├── events.js               # pub/sub
│   ├── store/
│   │   ├── storage.js          # get/set/remove with JSON, quota check, versioning
│   │   ├── seed.js             # demo offices, products, stock, history, users
│   │   └── selectors.js        # subtree, aggregates, scoped queries
│   ├── services/
│   │   ├── auth.js
│   │   ├── offices.js
│   │   ├── products.js
│   │   ├── stock.js            # adjust, movements, status calc
│   │   ├── allocations.js      # state machine
│   │   ├── sales.js
│   │   ├── alerts.js
│   │   ├── activity.js
│   │   └── reports.js
│   ├── views/
│   │   ├── dashboard.js
│   │   ├── inventory.js        # list/grid
│   │   ├── productDetail.js
│   │   ├── productForm.js      # add/edit with photo
│   │   ├── stockIn.js
│   │   ├── allocations.js      # list + detail
│   │   ├── allocationForm.js   # push + request
│   │   ├── network.js          # tree + office detail
│   │   ├── sales.js
│   │   ├── reports.js
│   │   ├── activity.js
│   │   └── settings.js
│   ├── components/
│   │   ├── topbar.js
│   │   ├── sidebar.js
│   │   ├── kpiCard.js
│   │   ├── barChart.js         # Inventory Statistics (SVG)
│   │   ├── gauge.js            # Sales Overview (SVG)
│   │   ├── activityList.js
│   │   ├── alertList.js
│   │   ├── productCard.js
│   │   ├── productThumb.js     # image with fallback, always used for product photos
│   │   ├── imageUploader.js    # pick, validate, resize, preview
│   │   ├── dataTable.js
│   │   ├── modal.js
│   │   ├── drawer.js
│   │   └── toast.js
│   └── utils/
│       ├── format.js           # INR, dates, numbers
│       ├── dom.js              # h(), qs(), mount()
│       ├── image.js            # canvas resize → JPEG data URL
│       ├── csv.js
│       ├── id.js               # sequential codes
│       └── validate.js
├── assets/
│   ├── images/products/        # seed product photos
│   ├── images/placeholder-product.svg
│   └── icons/                  # logo, sprite
└── docs/                       # prd, architecture, design, rules, memory (.md)
```

## 4. Routes (hash)
| Route | View | Roles |
|---|---|---|
| `#/login` | login | public |
| `#/dashboard` | dashboard | all |
| `#/inventory` | inventory list/grid | all |
| `#/inventory/new` | productForm | HO |
| `#/inventory/:id` | productDetail | all |
| `#/inventory/:id/edit` | productForm | HO |
| `#/stock-in` | stockIn | HO |
| `#/allocations` | allocations list | all |
| `#/allocations/new` | allocationForm (push) | HO, Zone, District |
| `#/allocations/request` | allocationForm (request) | Zone, District, Store |
| `#/allocations/:id` | allocation detail | all (scoped) |
| `#/network` | network tree | HO, Zone, District |
| `#/network/:id` | office detail | scoped |
| `#/sales` | sales + returns | Store (view for others) |
| `#/reports` | reports | all |
| `#/activity` | full activity log | all |
| `#/settings` | settings | all |

## 5. Data model (LocalStorage)
All keys are prefixed `stockify.` and the whole schema carries `stockify.schemaVersion`.

### offices
```js
{ id: "off_001", code: "HO-BLR", name: "Head Office", type: "head", // head | zone | district | store
  parentId: null, city: "Bengaluru", manager: "Name", active: true }
```
### users
```js
{ id: "usr_001", name: "Mohammed Faizal", role: "head", officeId: "off_001", avatar: "assets/images/users/u1.jpg" }
```
### products
```js
{ id: "prd_001", sku: "SP-APL-IP17P-256-BLK", name: "iPhone 17 Pro", brand: "Apple",
  category: "smartphone", // smartphone | smartwatch | tablet
  variant: { storage: "256GB", color: "Black", ram: "12GB" },
  costPrice: 112000, price: 134900, reorderLevel: 10,
  image: "assets/images/products/iphone-17-pro.jpg" /* or data:image/jpeg;base64,... */,
  description: "", active: true, createdAt: "ISO", createdBy: "usr_001" }
```
### stock (one row per office + product)
```js
{ officeId: "off_005", productId: "prd_001", qty: 24 }
```
In-transit quantity lives on the allocation, not in `stock`.
### allocations
```js
{ id: "alc_0001", code: "ALC-0001", type: "push", // push | request
  fromId: "off_001", toId: "off_002",
  status: "dispatched", // requested | approved | rejected | dispatched | received | cancelled
  items: [{ productId: "prd_001", qtyRequested: 50, qtyDispatched: 50, qtyReceived: 0 }],
  note: "", createdBy: "usr_001",
  timeline: [{ status: "dispatched", at: "ISO", by: "usr_001" }] }
```
### movements (append-only ledger)
```js
{ id: "mov_00001", at: "ISO", type: "stock_in", // stock_in | dispatch | receive | sale | return | adjustment | discrepancy
  productId: "prd_001", qty: 200, fromId: null, toId: "off_001",
  refType: "allocation", refId: "alc_0001", by: "usr_001" }
```
### sales
```js
{ id: "sal_0001", storeId: "off_011", productId: "prd_001", qty: 1, unitPrice: 134900,
  payment: "upi", customer: { name: "", phone: "" }, type: "sale", // sale | return
  at: "ISO", by: "usr_010" }
```
### targets
```js
{ storeId: "off_011", month: "2026-11", amount: 800000 }
```
### other keys
`stockify.session` (current user id), `stockify.settings`, `stockify.counters` (sequence numbers), `stockify.notifications` (read state).

## 6. Core logic

### Subtree and scoping
`selectors.subtreeIds(officeId)` returns the office id plus all descendants. Every list, KPI and chart is computed from `subtreeIds(currentUser.officeId)`. Services re-check scope before any write, so a view bug cannot leak data.

### Stock maths (only `services/stock.js` mutates `stock`)
- `adjust(officeId, productId, delta, movement)` rejects results below 0, updates the row, writes a movement, emits `stock:changed`.
- Status helper: `qty === 0 → out`, `qty <= reorderLevel → low`, else `healthy`.

### Allocation state machine
```
push:     (create) ─► dispatched ─► received
request:  requested ─► approved ─► dispatched ─► received
                  └─► rejected
any pre-dispatch ─► cancelled
```
- **Dispatch** (sender): validates parent→direct-child, validates sender qty, deducts sender stock, writes `dispatch` movement.
- **Receive** (receiver): adds to receiver stock for `qtyReceived`, writes `receive` movement; any shortfall writes a `discrepancy` movement and flags the allocation.
- Transitions are validated in `allocations.js`; illegal transitions throw.

### Alerts (computed, not stored)
`alerts.js` derives from live data for the user's subtree: out-of-stock count, low-stock count, requests awaiting this user's approval, allocations in transit longer than the settings threshold, discrepancies awaiting acknowledgement. Each alert carries a target route and filter.

### Dashboard aggregates
- KPI trend % = this month vs last month from movements and stock snapshots.
- Inventory Statistics series built from movements grouped by day/week/month: stock in, stock out (dispatch out of scope + sales), and stock value (qty x cost at period end).
- Sales gauge = sum of sales in current month for the subtree / sum of targets in the subtree.
- Top products = units sold in the last 30 days, top 3.

## 7. Image pipeline
1. `imageUploader` validates type (jpg/png/webp) and size (≤ 5 MB).
2. `utils/image.js` draws it to a canvas, scales to max 600 px on the long edge, exports JPEG at quality 0.8.
3. Result data URL is previewed immediately and saved in `product.image`.
4. `productThumb(product, size)` is the **only** way product images are rendered. It handles lazy loading, aspect-ratio box, `alt` text and `onerror` fallback to the placeholder.
5. `storage.js` checks the estimated usage before each write and shows a toast at 80% of the ~5 MB quota. Seed images are file paths, so they cost no quota.

## 8. Theming
Colour, radius and shadow values are CSS custom properties in `tokens.css`. The dark theme overrides them under `[data-theme="dark"]` on `<html>`. The toggle writes to `stockify.settings.theme`. Components never hard-code colours.

## 9. Error handling
- Services throw typed errors (`PermissionError`, `ValidationError`, `StockError`, `StateError`). Views catch and show a toast or inline message.
- `storage.js` wraps every read in try/catch and falls back to defaults; corrupted JSON triggers a "reset data?" prompt.
- Schema version mismatch runs a migration function or offers a reseed.

## 10. Future backend path
Services are the seam. Later, each service function can be swapped to call a REST API with the same signatures, and the store layer replaced, without touching views.
