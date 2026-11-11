# Rules: Stockify

> Temporary project doc. Delete the whole `docs/` folder once the project is complete.
> These rules bind the AI agent (Antigravity) and any human editing the code.

## 1. Working agreement with the agent
1. **Read first.** At the start of every session read, in order: `docs/memory.md`, `docs/prd.md`, `docs/architecture.md`, `docs/design.md`, `docs/rules.md`.
2. **One phase at a time.** Build only the phase named in the prompt (phases are in `prd.md` section 12). Do not start the next phase.
3. **Plan, then build.** Before writing code for a phase, post a short plan listing the files to be created or changed.
4. **Do not deviate** from the stack, hierarchy, folder structure or design without asking. If a doc is wrong or incomplete, say so and propose a fix; do not silently improvise.
5. **Update `docs/memory.md` at the end of every task**: what was done, files touched, decisions, open issues, next step.
6. **Finish what you start.** No half-wired features, no `TODO` left in shipped code without an entry in `memory.md` under Known Issues.
7. **Report honestly.** If something is untested or failing, say so.

## 2. Hard constraints
- HTML5, CSS3 and plain JavaScript only. Classic `<script>` tags: **no ES modules, no `import`/`export`, no `type="module"`**. The app must work by double-clicking `index.html`.
- **Forbidden**: React/Vue/Angular, jQuery, Bootstrap/Tailwind, chart libraries, icon fonts/CDNs, any npm dependency, any backend or database, any network call at runtime.
- Persistence is LocalStorage only, accessed only through `js/store/storage.js`.
- No inline `onclick=""` attributes, no inline styles except for dynamic values (e.g. chart geometry), no `eval`, no `innerHTML` with unsanitised data (use `textContent` or the `h()` helper).
- No `var`; use `const` / `let`. The only global is `window.Stockify`; every file is an IIFE that registers itself on it.

## 3. Business invariants (never break)
1. Stock moves only parent ↔ direct child. Never skip a level or move sideways.
2. Stock never goes negative.
3. Every stock change goes through `services/stock.js` and writes a movement record.
4. Dispatch deducts from the sender; receipt adds to the receiver; in-transit stock belongs to the allocation.
5. A user sees only their own office and descendants. Services re-check scope on every read and write.
6. Only Head Office creates/edits products. Only stores record sales.
7. **A product cannot be created without a photo, and no product is ever rendered without its photo** (always use `productThumb`).
8. Products with stock or history are deactivated, never deleted.
9. Currency is INR with Indian digit grouping, formatted only via `utils/format.js`.

## 4. Code style
- 2-space indent, semicolons, single quotes in JS, double quotes in HTML, trailing commas in multiline literals.
- Files: `camelCase.js` for modules, `kebab-case.css` for styles, lowercase `kebab-case` for asset files.
- Functions: `camelCase`, verbs first (`createAllocation`, `getLowStockItems`). Constants: `UPPER_SNAKE_CASE`. DOM ids/classes: `kebab-case`, BEM-lite (`kpi-card`, `kpi-card__value`, `kpi-card--down`).
- One responsibility per module; aim for files under ~300 lines. Split when larger.
- Prefer small pure functions; keep DOM code out of services and business logic out of views.
- Comments explain **why**, not what. Each module gets a one-line header comment.
- JSDoc for every exported function (params, return, throws).

## 5. CSS rules
- All colours, radii, shadows and spacing come from tokens in `tokens.css`. No hard-coded hex values elsewhere.
- Mobile-aware but desktop-first as per `design.md`. Use CSS Grid for page layout and Flexbox for components.
- Dark theme only through `[data-theme="dark"]` token overrides.
- Class naming per section 4; no `!important` unless commented why.
- Honour `prefers-reduced-motion`.

## 6. JavaScript rules
- Use the `window.Stockify` namespace pattern. Script order in `index.html` is the dependency order; a file may only use things loaded before it (views > services > store, never the reverse).
- Services throw typed errors; views catch and show toast/inline messages. Never swallow errors silently.
- Validate all form input in `utils/validate.js` before calling services; services validate again.
- Use `Intl.NumberFormat('en-IN')` for numbers and currency, `Intl.DateTimeFormat` for dates.
- Debounce search inputs (250ms). Avoid layout thrash; batch DOM writes.
- IDs and codes come from `utils/id.js` counters only.

## 7. Storage rules
- Keys prefixed `stockify.`; include `schemaVersion`.
- Every read is wrapped in try/catch with a safe default.
- Check quota before writing; warn at 80%. Never lose data silently on a failed write.
- Provide Reset Demo Data and JSON export/import in Settings.

## 8. Images
- Accept JPG, PNG, WEBP, max 5 MB input; resize to max 600px and re-encode to JPEG (0.8).
- Always provide `alt` text and `loading="lazy"` (except above-the-fold dashboard items).
- Seed images live in `assets/images/products/`, named like `iphone-17-pro.jpg`. Keep each under ~80 KB.
- User-uploaded images are stored as data URLs in the product record.

## 9. Accessibility and UX
- Semantic HTML (`header`, `nav`, `main`, `section`, `button`, `table`). Buttons for actions, anchors for navigation.
- Labels on every input, `aria-label` on icon buttons, `aria-live` region for toasts.
- Provide loading, empty and error states on every list and widget.
- Confirm destructive or irreversible actions (dispatch, reject, deactivate, reset).

## 10. Git hygiene (if used)
- One commit per task, message format `phase-N: short description`.
- Never commit anything outside the project folder. `docs/` is committed during development and removed at the end.

## 11. Testing checklist (run before closing each phase)
- [ ] No console errors or warnings on every route
- [ ] Works after a hard refresh and after clearing and reseeding data
- [ ] Each role (HO, Zone, District, Store) sees only their own subtree
- [ ] Cannot add a product without a photo; photo shows in grid, table, detail, allocation lines, top products
- [ ] Stock totals reconcile after: stock-in, push allocation, request flow, short receipt, sale, return
- [ ] Negative stock is blocked everywhere
- [ ] Light and dark themes both look right
- [ ] Layout checked at 1440, 1280, 1024, 768 and 390 px
- [ ] Keyboard-only walkthrough of login, add product, create allocation
- [ ] LocalStorage quota warning appears when simulated near the limit
- [ ] `memory.md` updated

## 12. Definition of done (whole project)
All six phases complete, all flows in `prd.md` section 9 pass, the testing checklist is green, no `TODO` remains, and the app opens by double-clicking `index.html` with no errors.

## 13. Clean-up at completion
When the project is finished and accepted:
1. Copy anything worth keeping (a short README) into the project root.
2. **Delete the `docs/` folder** (prd, architecture, design, rules, memory).
3. Remove any leftover scratch or test files.
