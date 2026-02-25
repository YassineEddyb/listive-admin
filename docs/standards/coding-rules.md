# Coding Rules

> TypeScript, React, and project conventions enforced across the Listive Admin codebase.

## TypeScript

### Strict Mode
`tsconfig.json` has `"strict": true`. This enables:
- `strictNullChecks`
- `noImplicitAny`
- `strictFunctionTypes`
- All other strict checks

### Path Aliases
Use `@/*` to reference files from `src/`:
```typescript
// ✅ Do this
import { Button } from '@/components/ui/button';

// ❌ Not this
import { Button } from '../../../components/ui/button';
```

### Type Definitions
- Use TypeScript interfaces for object shapes
- Use `type` for unions, intersections, and aliases
- Server Actions return `ActionResponse<T>` (from `src/types/action-response.ts`)
- Supabase types are auto-generated — do not manually edit `src/libs/supabase/types.ts`

### Type Assertions
- Admin-specific tables (`admin_users`, `admin_actions`, `support_tickets`, `feedback_submissions`, `ticket_replies`) are NOT in generated types
- When `as any` is necessary, add a comment explaining why:
  ```typescript
  // Table not in generated Supabase types (admin-specific)
  .from('admin_users' as any)
  ```

---

## React

### Component Types
- **Server Components** by default (no directive)
- **Client Components** only when needed (`'use client'` at top)
- **Server Actions** use `'use server'` directive

### Rules of Hooks
All hooks must be called before any early returns:
```typescript
// ✅ Correct
function Component({ isLoading }) {
  const handleClick = useCallback(() => {}, []);
  if (isLoading) return <Skeleton />;
  return <div onClick={handleClick} />;
}
```

### Performance
- Server Components for all pages (data fetching happens server-side)
- Client Components only for interactive elements (tables, forms, dropdowns)

---

## File Organization

### Feature Modules
Code organized by feature in `src/features/`:

```
src/features/[feature-name]/
├── controllers/      — Server-side data fetching
├── components/       — Feature-specific UI
└── actions/          — Server Actions (mutations)
```

Not every feature needs every subdirectory. Only create what's needed.

### Route Constants
**Never use string literals for routes.** Always import from `src/constants/routes.ts`:

```typescript
import { ROUTES } from '@/constants/routes';
redirect(ROUTES.users);
```

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Files | kebab-case | `get-users.ts` |
| Components | PascalCase | `UsersTable` |
| Variables | camelCase | `handleDelete` |
| Constants | UPPER_SNAKE | `ADMIN_STORAGE_KEY` |
| Types | PascalCase | `ActionResponse` |
| Server Actions | camelCase | `adjustCredits` |
| CSS classes | Tailwind utilities | `bg-brand-light` |

---

## Import Order

Enforced by `eslint-plugin-simple-import-sort`:

```typescript
// 1. React, Next.js, third-party packages
import React from 'react';
import { redirect } from 'next/navigation';

// 2. Internal aliases (@/*)
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

// 3. Relative imports
import { UsersTable } from './components/users-table';
```

---

## Formatting

**Config:** `prettier.config.js`

| Rule | Value |
|------|-------|
| Single quotes | `true` |
| Semicolons | `true` |
| Tab width | 2 |
| Tailwind plugin | Auto-sorts Tailwind classes |

---

## Error Handling

1. Server Actions return `ActionResponse<T>` — never throw to the client
2. User-facing errors shown via toast notifications
3. Missing tables handled gracefully (e.g., `image_edit_operations` returns empty array)
4. Admin-specific tables use `as any` casts with comments

---

*See [Git Workflow](git-workflow.md) for branching and deployment. See [Performance](performance.md) for optimization rules.*
