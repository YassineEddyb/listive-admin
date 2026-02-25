# Design Tokens

> Colors, typography, shadows, and animations used across the admin panel.

## Color System

### Brand Palette

Defined in `tailwind.config.ts`:

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-dark` | `#374752` | Primary text, sidebar background |
| `brand-gray` | `#c3cdd5` | Secondary text, scrollbar |
| `brand-blue` | `#306491` | Accent color, active states |
| `brand-light` | `#edf3f7` | Page background |
| `brand-border` | `#e1e7ec` | Border color |
| `brand-surface` | `#f5f5f5` | Card surfaces |
| `brand-cta` | `#306491` | Action button background |

### CSS Variables (HSL)

Defined in `src/styles/globals.css` (`:root`):

| Variable | HSL Value | Purpose |
|----------|-----------|---------|
| `--background` | `210 20% 96%` | Page background |
| `--foreground` | `215 25% 27%` | Primary text |
| `--card` | `0 0% 100%` | Card background |
| `--primary` | `215 25% 27%` | Primary color |
| `--secondary` | `210 20% 96%` | Secondary color |
| `--muted` | `210 15% 93%` | Muted backgrounds |
| `--muted-foreground` | `215 15% 50%` | Muted text |
| `--destructive` | `0 84% 60%` | Error/destructive actions |
| `--border` | `210 20% 90%` | Borders |
| `--ring` | `215 25% 27%` | Focus ring |
| `--radius` | `1rem` | Base border radius |

> **Note:** Forced light mode. `.dark` class uses identical values — no dark mode implementation.

---

## Typography

| Setting | Value |
|---------|-------|
| **Font** | Inter (variable weight, `next/font/google`) |
| **CSS variable** | `--font-inter` |
| **Tailwind** | `fontFamily.sans` → `var(--font-inter)` |
| **Body** | `font-sans antialiased` on `<body>` |

---

## Shadows

Custom soft shadows in `tailwind.config.ts`:

| Token | Usage |
|-------|-------|
| `soft` | Cards, buttons (subtle drop shadow) |
| `soft-lg` | Elevated cards |
| `soft-xl` | Modals, popovers |
| `inner-soft` | Inset elements |

---

## Animations

### CSS Animations (`globals.css`)

| Animation | Lines | Purpose |
|-----------|-------|---------|
| `shimmer` | 140–150 | Skeleton loading shimmer |
| `widget-entrance` | 152–172 | Dashboard card fade-in |

### Stagger Delays

```css
.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
/* ... up to .stagger-8 */
```

Used on dashboard stat cards for sequential entrance animation.

### Plugin: `tailwindcss-animate`
Provides animation utilities for shadcn/ui component entrance/exit animations.

---

## Utility Classes

### Hover Lift
```css
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: /* elevated shadow */;
}
```

### Gradient Text
```css
.gradient-text { /* brand-colored gradient text */ }
```

### Custom Scrollbar
Thin scrollbar for webkit and Firefox:
- Width: 4px
- Track: transparent
- Thumb: `brand-gray` with rounded corners
- Hover thumb: darker shade

### Scrollbar None
```css
.scrollbar-none { /* hide scrollbar utility */ }
```

---

## Icons

| Library | Package | Usage |
|---------|---------|-------|
| **Lucide React** | `lucide-react` | Primary and only icon set |

Optimized via `optimizePackageImports` in `next.config.js` for tree-shaking.

---

*See [Components](components.md) for the full component inventory. See [Patterns](patterns.md) for how tokens are applied.*
