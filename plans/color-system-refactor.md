# Centralized Color System — Architecture & Implementation Plan

## Goal
Replace the current mixed color system (HSL tokens + 220+ hardcoded Tailwind
`violet`/`indigo`/`slate`/`zinc`/`amber` classes + raw hex) with a **single
centralized, HEX-based palette** that controls the entire site from one place,
and apply this palette:

| Purpose       | Color     |
| ------------- | --------- |
| Background    | `#FAFAFA` |
| Cards         | `#FFFFFF` |
| Primary       | `#187D97` |
| Primary Hover | `#0B4E63` |
| Accent        | `#D97A07` |
| Accent Hover  | `#A95C00` |
| Heading       | `#0F172A` |
| Body Text     | `#475569` |
| Border        | `#E5E7EB` |

---

## Architecture

### 1. Single Config Point
All colors live in **one `@theme` block** in `app/globals.css`. No `tailwind.config.ts`
exists (Tailwind v4, CSS-first config). We define a clearly labeled
`/* === BRAND PALETTE (edit here) === */` section at the top of `@theme` with
raw HEX values. Everything else derives from it.

### 2. Two layers
- **Layer A — Semantic tokens** (what components *should* use going forward):
  `--color-background`, `--color-card`, `--color-primary`,
  `--color-primary-hover`, `--color-accent`, `--color-accent-hover`,
  `--color-heading`, `--color-body`, `--color-border`, plus foreground/ring
  companions. These map 1:1 to the table above.
- **Layer B — Repointed Tailwind defaults**: we override the *default* Tailwind
  color scales (`violet`, `indigo`, `slate`, `zinc`, `amber`, `blue`, `green`,
  `red`) so existing hardcoded classes resolve to the brand palette. This is the
  mechanism that makes the 220 existing usages follow the central config
  **without touching component files**.

Example (conceptual, exact shades finalized in implementation):
```css
@theme {
  /* === BRAND PALETTE (single source of truth, HEX) === */
  --color-background: #FAFAFA;
  --color-card: #FFFFFF;
  --color-primary: #187D97;
  --color-primary-hover: #0B4E63;
  --color-accent: #D97A07;
  --color-accent-hover: #A95C00;
  --color-heading: #0F172A;
  --color-body: #475569;
  --color-border: #E5E7EB;

  /* Repoint defaults so legacy classes follow the palette */
  --color-violet-600: #187D97;   /* primary */
  --color-violet-500: #0B4E63;   /* primary-hover */
  --color-indigo-600: #D97A07;   /* accent */
  --color-slate-900: #0F172A;    /* heading */
  --color-slate-600: #475569;    /* body */
  --color-slate-200: #E5E7EB;    /* border */
  /* ...remaining shades derived as tints/shades */
}
```

### 3. Dark mode
The current `.dark` block (lines 118–138) and the checkout page's hardcoded
`bg-[#0a0a0f]` dark theme are out of scope for the *provided* palette (no dark
values given). Plan: keep `.dark` tokens but **rebase them on the same HEX
palette** (darker variants) OR convert checkout to the light palette. Decision
needed from user — default proposal: convert checkout to light palette and
drop the isolated dark theme for consistency, unless a dark palette is supplied.

### 4. Inline / raw usages to fix
- `components/HeroBanner.tsx:117` uses `hsl(var(--primary))` → switch to
  `var(--color-primary)` or a token class.
- `app/checkout/page.tsx` uses `bg-[#0a0a0f]`, `bg-white/[0.03]`, `text-zinc-*`
  → route through repointed tokens / dark decision above.
- Social brand hexes (`#4285F4`, `#1877F2`, `#34A853`, etc.) stay hardcoded —
  they are fixed brand colors, not theme colors.

---

## Implementation Steps (todo)

- [ ] **Step 1 — Central palette in `@theme`**
  Add the `BRAND PALETTE` HEX block + semantic tokens + repointed Tailwind
  defaults to `app/globals.css` `@theme`. This is the single edit point.

- [ ] **Step 2 — Rebase `:root` / `.dark` tokens to HEX**
  Convert the existing HSL-channel tokens (`--background`, `--primary`, etc.) to
  reference the new HEX palette so `bg-background`, `text-primary`,
  `border-border` (used by `button.tsx` variants) stay correct.

- [ ] **Step 3 — Fix inline color usages**
  Replace `hsl(var(--primary))` in HeroBanner and raw hex / `zinc-*` in checkout
  with token-based values per the dark-mode decision.

- [ ] **Step 4 — Contrast & accessibility pass**
  Verify text-on-primary (white on `#187D97` = OK), accent buttons
  (white on `#D97A07` = OK), and that repointed `slate` neutrals keep readable
  body/heading contrast. Adjust any shade that fails WCAG AA.

- [ ] **Step 5 — Visual QA across all routes**
  Walk through: home (incl. new sections), login, profile, book detail, cart
  drawer, checkout, orders, navbar, footer. Confirm cohesive teal/amber theme
  and no leftover violet/indigo/slate mismatches.

- [ ] **Step 6 — Document the config point**
  Add a short comment header in `globals.css` explaining: "Edit the BRAND
  PALETTE block to reskin the whole site."

---

## Notes / Trade-offs
- **Repointing Tailwind defaults** is the highest-leverage move: it achieves
  site-wide recolor from one file with ~0 component edits. Downside: `violet`
  no longer means "violet" semantically — acceptable since the user wants a full
  reset.
- If the user later prefers *semantic-only* classes, Step 1's Layer B can be
  removed after a follow-up refactor of the 220 usages. The plan keeps both
  layers so nothing breaks today.
- Fonts (Poppins) are unrelated to color and already fixed.
