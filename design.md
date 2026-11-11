# Design: Stockify

> Temporary project doc. Delete the whole `docs/` folder once the project is complete.

The visual target is the supplied **UVentra inventory dashboard** screenshot: soft, airy, light UI, big rounded white cards on a pale grey-blue canvas, blue as the primary accent, small coloured status icons, and generous whitespace. Recreate the layout, spacing and feel. Do not copy the UVentra name or logo; the brand here is **Stockify**.

## 1. Design tokens

### Colour (light)
| Token | Value | Use |
|---|---|---|
| `--bg-canvas` | `#EEF1F4` | page background (subtle top-to-bottom grey-blue wash) |
| `--bg-frame` | `#F6F7F9` | inner app frame |
| `--surface` | `#FFFFFF` | cards |
| `--surface-soft` | `#F7F8FA` | list rows inside cards |
| `--border` | `#ECEEF2` | hairlines |
| `--text` | `#15171C` | headings, values |
| `--text-muted` | `#6B7280` | secondary text |
| `--primary` | `#2F8FE8` | active nav, main bars, links |
| `--primary-grad` | `linear-gradient(135deg,#4AA8F5,#2478D8)` | active icon, logo, gauge |
| `--purple` | `#8B5CF6` | stock out, total stock value icon |
| `--yellow` | `#F5B90A` | stock in |
| `--teal` | `#22B8CF` | low stock icon |
| `--success` | `#16A34A` | up trends, healthy |
| `--danger` | `#E5484D` | down trends, out of stock |
| `--warning` | `#F59E0B` | low stock |
| `--info-tint`, `--success-tint`, `--danger-tint`, `--warning-tint` | 8-10% tints of the above | alert row backgrounds |

### Colour (dark)
Canvas `#0E1116`, frame `#12161C`, surface `#171C24`, soft `#1D232C`, border `#262D38`, text `#F3F5F8`, muted `#98A2B3`. Accent colours stay the same, tints drop to ~14% alpha. Charts and gauge keep their hues.

### Shape, depth, space
- Radius: app frame 28px, cards 24px, inner rows 16px, buttons/inputs 12px, pills 999px.
- Card shadow: `0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.05)`. No heavy borders.
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40. Card padding 24px. Grid gap 20px.

### Typography
- Font: **Inter** (fallback `"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif`). Self-host the font in `assets/fonts/` if available; the stack must still look fine without it.
- Sizes: page greeting 32/38 medium; card title 22/28 medium; KPI value 32/38 medium; body 15/22; secondary 13/18; micro 12/16.
- Numbers use `font-variant-numeric: tabular-nums`.
- Weights: 400 body, 500 headings and values, 600 only for small labels. Avoid bold-heavy looks.

### Icons
Inline SVG, 24px grid, 1.75px stroke, rounded caps and joins, `currentColor`. Provide: dashboard grid, box/package, search-doc, clipboard, warehouse/bank, chart, users, settings gear, bell, sun, moon, help circle, logout, plus-circle, truck/shipment, receipt, return, alert triangle, clock, spinner, chevrons, more-vertical, close.

## 2. Page shell

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo Stockify] [Dashboard Overview] Inventory Allocations …  ⚙ 🔔 [avatar Good Morning / Name ˅] │  ← top bar pill
├──┬───────────────────────────────────────────────────────────┤
│☀ │  Welcome Back, <Name>!        [KPI] [KPI] [KPI]           │
│🌙│  scope subtitle                                            │
│  ├──────────────────────────────┬───────────────────────────┤
│▣ │  Inventory Statistics        │  Sales Overview           │
│… │                              │                           │
│  ├───────────────┬──────────────┼───────────────────────────┤
│? │ Recent        │ Alerts &     │ Top Selling Products      │
│⎋ │ Activities    │ Notifications│                           │
└──┴───────────────┴──────────────┴───────────────────────────┘
```

### Outer frame
Rounded frame (28px) on the canvas background with 20-24px inner padding. Desktop max-width 1600px, centred.

### Top bar
- One rounded white pill, height ~72px.
- Left: round gradient logo (36px) + wordmark "Stockify" (medium weight).
- Centre: nav tabs as plain text; the **active tab sits in a soft raised tab shape** (slightly lifted white background with curved inner corners, like the screenshot). Tabs: **Dashboard Overview, Inventory, Allocations, Network, Reports, Activity**. Items the role cannot access are hidden.
- Right: circular settings button, circular bell button with a red dot when unread, and a user chip (avatar, small "Good Morning/Afternoon/Evening", name in medium weight, chevron) with a dropdown for Profile, Switch user, Logout.

### Left rail
- Slim vertical white pill (~64px wide) to the left of the content.
- Top: separate small pill with the theme toggle (sun in a dark circle when light mode is active, moon below).
- Middle: vertical icon nav. The active item is a filled **blue gradient circle** with a white icon; others are grey outline icons. Tooltips on hover. Items: Dashboard, Inventory, Allocations, Stock-in/Stock, Network, Reports, Sales/Team as role allows.
- Bottom: separate pill with Help and Logout.

### Content grid
12-column grid, 20px gap.
- Row 1: welcome block (4 cols) + three KPI cards (8 cols, each ~2.67 cols).
- Row 2: Inventory Statistics (8 cols) + Sales Overview (4 cols).
- Row 3: Recent Activities (4) + Alerts and Notifications (4) + Top Selling Products (4).

## 3. Dashboard widgets

### Welcome block
"Welcome Back, {FirstName}!" at 32px, subtitle in muted 15px: scope sentence such as "Here's what's happening with your inventory today" and, for non-HO, the office name (e.g. "South Zone, 2 districts, 4 stores").

### KPI cards (Total Products, Total Stock Value, Low Stock Items)
- White card, 24px radius, ~176px tall.
- Top row: muted label left, **gradient circular icon** (blue, purple, teal respectively) right.
- Value 32px medium, then a small trend: green up-arrow + "35%" or red down-arrow + "50%". For Low Stock Items a decrease is good, so colour by meaning, not direction.
- Bottom: "From last month" in muted text.
- A faint large concentric-arc decoration in the bottom-right corner, using a 6-8% tint of the card's icon colour.
- Currency values formatted as ₹ with Indian grouping.

### Inventory Statistics
- Card with title left; legend in the header with coloured dots: **Stock in** (yellow), **Stock Out** (purple), **Stock Value** (blue); a **Monthly** select pill with chevron (options Daily, Weekly, Monthly).
- Y axis labels 0k to 40k in 10k steps (scale to data, label as k/L/Cr in INR), light dashed horizontal grid.
- X axis month labels (Jan to Dec, or last 9 to 12 periods).
- **Bars are made of thin vertical hairlines** (1-2px stripes with 2px gaps) in a very light grey, giving the textured column look from the screenshot. Each period has a column, and small horizontal tick markers in yellow, purple and blue show that period's Stock in / Stock Out / Stock Value level at the top of the relevant stripe.
- Hover or focus on a period: the stripes turn solid blue gradient, and a white tooltip with soft shadow appears above showing a coloured dot, "Stock value" and the amount (e.g. ₹37,53,400). Tooltip also lists Stock in and Stock Out for that period.
- Draw with SVG, responsive via `viewBox`; recompute stripe count on resize.

### Sales Overview
- Title left, more-vertical menu right (Export, View sales).
- Semi-circular (about 200 degree) **gauge made of radial tick lines**: filled portion in a blue gradient that fades lighter toward the start, unfilled portion in near-invisible light grey ticks.
- Centre: large percentage (e.g. **71.3%**) at 48px medium, and "Sales Goal" muted beneath.
- Bottom row: left "Number of sales" and value; right "Total Sales" and ₹ value.
- Animate the fill on load (600ms ease-out).

### Recent Activities
- Title + more menu. Four rows, each a soft grey rounded row (`--surface-soft`, 16px radius, 14-16px padding).
- Row: tinted round icon (28-36px) | title in medium weight + muted one-line detail | right-aligned time.
- Types: Stock Added (indigo plus-circle), Shipment Received (orange box), Order/Allocation Dispatched (blue clipboard), Return Processed (green receipt).
- Where a product is named, show its 28px thumbnail in place of the icon.

### Alerts and Notifications
- Four rows, each with its own **tint background and matching icon**, plus a right chevron:
  - Out of Stock Alert, red tint, bag-x icon: "{n} items are out of stock"
  - In Transit Too Long, green tint, timer icon: "{n} shipments overdue"
  - Low Stock Alert, amber tint, triangle icon: "{n} items are running low"
  - Pending Requests, blue tint, spinner icon: "{n} requests are pending"
- Click navigates to the filtered view.

### Top Selling Products
- Three soft rows. Each: **product photo** in a white rounded square (~64px) | name (medium) and "ID:{SKU short}" muted | right side price (22px medium) and "{n} Orders/Units" muted.
- Photos are always real product images (cut-out style on white).

## 4. Other screens (same language)

### Inventory
- Header with title, search, filter chips (category: All, Smartphones, Smartwatches, Tablets; status: All, Healthy, Low, Out), grid/table toggle, and a blue "Add Product" button (HO only).
- **Grid view**: cards with a large product photo on a soft square background, name, brand, price, stock pill (green/amber/red), variant chips.
- **Table view**: row = 48px photo thumbnail, name + SKU, category, variant, price, stock (user's subtree), status pill, actions.

### Add / Edit Product
- Two-column card form. Left: **image uploader** (dashed rounded drop zone, click or drag, 1:1 preview, "Replace" and "Remove" actions, required asterisk, helper text "JPG, PNG or WEBP, up to 5 MB"). Right: category segmented control, name, brand, SKU (auto-suggested), variant fields that change by category, cost price, selling price, reorder level, description.
- Save is disabled until required fields and the photo are valid. Inline error text under fields, red `--danger`.
- Live preview card at the bottom shows exactly how the product will appear in the grid.

### Allocations
- Status tabs (All, Requested, Approved, Dispatched, Received) as pills with counts.
- List rows: code, from > to with office-type badges, item count with up to 3 overlapping product thumbnails, status pill, date.
- Detail drawer: header, horizontal status timeline, line items with photo/name/qty (requested, dispatched, received), notes, action buttons by role (Approve, Reject, Dispatch, Confirm Receipt).
- New allocation: pick destination, then a product picker with photo cards showing available stock, qty steppers and a running summary panel.

### Network
- Indented tree cards: Head Office > Zones > Districts > Stores. Each node shows type badge, name, units and stock value, a mini health bar. Click opens the office detail page.

### Sales
- Quick-sale panel: product search with photos, qty, price, payment mode; today's sales list; returns tab.

### Reports, Activity, Settings
Table-first pages using the same cards, filter bar, "Export CSV" button and empty states.

## 5. Components
- **Buttons**: primary (blue gradient, white text, 44px height, 12px radius), secondary (white, border), ghost, destructive. Hover lift 1px with shadow, focus ring 3px `--primary` at 30% alpha.
- **Inputs**: 44px, 12px radius, `--surface-soft` fill, 1px border, focus ring as above.
- **Pills/badges**: 999px radius, tinted background with matching text: Healthy (green), Low (amber), Out (red), Dispatched (blue), Received (green), Requested (purple), Rejected (red).
- **Modal / Drawer**: white surface, 24px radius, backdrop `rgba(15,18,25,.45)` with blur 4px.
- **Toast**: bottom-right, white card with coloured left dot, auto-dismiss 4s.
- **Empty state**: soft illustration-style icon, one line of copy, one primary action.
- **Skeletons** for list and chart loading.

## 6. Product imagery rules
- Every product has a photo; nothing is displayed without one.
- Photos render in square boxes with `object-fit: contain` on a white or soft background, padded 8-12%, so differently shaped phones, watches and tablets all look tidy.
- Seed photos: clean product-on-white images, 600x600, stored in `assets/images/products/`. If real photos are unavailable, generate consistent illustrated product images (same angle, lighting and background) so the set looks cohesive.
- Alt text: "{Brand} {Name} {Colour}".

## 7. Motion
- 150-200ms ease for hovers, 250ms for drawers/modals, 600ms for the gauge and bar entrance (stagger bars by 10ms).
- Respect `prefers-reduced-motion`: disable entrance animations.

## 8. Responsive
- ≥1280px: full layout as above.
- 1024-1279px: KPI cards wrap beneath the welcome block; Row 3 becomes two columns plus one full-width.
- 768-1023px: side rail collapses to icons only at the bottom or a hamburger drawer; all cards single or two-column.
- <768px: single column, top bar tabs become a horizontally scrollable strip, charts keep aspect ratio, tables become stacked cards.

## 9. Accessibility
- Contrast AA in light and dark.
- Every icon-only button has `aria-label`; tooltips on focus too.
- Chart has an accessible text summary and a "View as table" toggle.
- Full keyboard navigation, logical tab order, visible focus, modals trap focus and close on Esc.
- Status is never communicated by colour alone (text label or icon accompanies it).
