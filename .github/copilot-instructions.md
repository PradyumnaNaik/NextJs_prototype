# GitHub Copilot Instructions

## Context
**Enterprise Next.js 14+ App Router** project with strict governance. **100% compliance required.**

> **Code Review:** These rules also apply during code review. See `copilot-code-review-instructions.md` for review-specific guidance.

---

## 🚨 CRITICAL: Next.js App Router Rules

### Server Components by Default
```typescript
// ✅ DEFAULT: Server Component (no directive)
export default async function Page() {
  const data = await fetchData(); // Direct async
  return <div>{data.title}</div>;
}

// ⚠️ ONLY when needed: Client Component
'use client'; // REQUIRES: useState, useEffect, onClick, browser APIs
```

### Decision Tree
```
New Component?
├── Needs hooks/events/browser APIs? → 'use client' (leaf only)
├── Fetches data? → Server Component (async)
├── error.tsx? → MUST be 'use client'
└── Everything else → Server Component
```

---

## 📁 Governance Files (~2,500 tokens total)

**Read before generating code:**

| File | Purpose | Tokens |
|------|---------|--------|
| `01_NEXTJS_CORE_RULES.md` | Server/Client, data fetching, caching | ~800 |
| `02_SECURITY_RULES.md` | Auth, validation, XSS prevention | ~600 |
| `03_ACCESSIBILITY_RULES.md` | Semantic HTML, ARIA, keyboard | ~500 |
| `04_CSS_TOKENS_RULES.md` | CSS Modules, BEM, design tokens | ~400 |
| `05_TESTING_RULES.md` | Component, Server Action tests | ~500 |
| `06_COMPLIANCE_CHECKLIST.md` | Binary pass/fail checklist | ~300 |

**Location:** `docs/governance_framework/rules/`

---

## ⚡ Quick Reference (Embedded)

### TypeScript
```typescript
// Props interface REQUIRED
interface ComponentProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

// Page props
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}

// ❌ FORBIDDEN: any, untyped props
```

### Server Actions
```typescript
'use server';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';

const schema = z.object({ name: z.string().min(1) });

export async function createItem(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };
  
  await db.item.create({ data: parsed.data });
  revalidateTag('items');
  return { success: true };
}
```

### Data Fetching
```typescript
// ✅ Server Component
export default async function Page() {
  const data = await fetch(url, {
    next: { revalidate: 3600, tags: ['data'] }
  });
  return <Component data={data} />;
}

// ❌ FORBIDDEN in Server Components
useEffect(() => { fetch(...) }, []);
```

### CSS & Tokens
```css
/* ✅ CSS Modules + BEM + Tokens */
.card { background: var(--color-bg-surface); }
.card__title { font-size: var(--font-size-lg); }
.card--featured { border: 2px solid var(--color-primary); }

/* ❌ FORBIDDEN */
.card { background: #ffffff; padding: 16px; }
```

### Accessibility
```tsx
// ✅ Semantic HTML
<button type="button" onClick={handle}>Action</button>
<a href="/page">Link</a>
<nav aria-label="Main">...</nav>

// ✅ Icon buttons
<button aria-label="Close"><XIcon aria-hidden="true" /></button>

// ❌ FORBIDDEN
<div onClick={handle}>Click</div>
```

### Security
```typescript
// ✅ Auth in Server Component
export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect('/login');
  return <DashboardContent user={session.user} />;
}

// ✅ Validation in Server Action
const parsed = schema.safeParse(data);
if (!parsed.success) return { error: ... };

// ❌ FORBIDDEN
console.log(user.password, token);
dangerouslySetInnerHTML={{ __html: userInput }};
```

---

## 📦 Component Output Structure

Every component must include:
```
ComponentName/
├── ComponentName.tsx        # Typed props, Server or 'use client'
├── ComponentName.module.css # BEM, tokens only
├── ComponentName.test.tsx   # Render, interaction, a11y tests
└── index.ts                 # export { ComponentName } from './ComponentName';
```

---

## 🚫 Absolute Prohibitions

| Category | Forbidden | Use Instead |
|----------|-----------|-------------|
| Types | `any`, implicit types | Explicit interfaces |
| Components | Class components | Functional components |
| Styling | Inline styles, hardcoded values | CSS Modules, tokens |
| HTML | `<div onClick>`, missing labels | Semantic elements |
| Security | Secrets in client, no validation | Server-only, Zod |
| Data | useEffect for fetching | Server Component async |
| Errors | Swallowed catches | Proper error handling |

---

## ✅ Compliance Checklist (Every PR)

- [ ] Server Component unless hooks/events required
- [ ] error.tsx is 'use client'
- [ ] Props have explicit TypeScript interfaces
- [ ] Server Actions use Zod validation
- [ ] CSS uses modules + BEM + tokens only
- [ ] Semantic HTML, ARIA labels on icons
- [ ] Tests exist with ≥70% coverage
- [ ] No secrets in client code

---

## 🎯 Governance Compliance Output

After generating code, report:

```
### Governance Compliance: [PASSED/FAILED]
| Rule | Status |
|------|--------|
| Server/Client Boundary | ✅/❌ |
| TypeScript Types | ✅/❌ |
| Security (Auth/Validation) | ✅/❌ |
| Accessibility | ✅/❌ |
| CSS Tokens | ✅/❌ |
| Testing | ✅/❌ |

**Violations:** [0] or [List specific violations]
```

---

**Version:** 2.0 | Next.js App Router Governance
**Last Updated:** January 2026

