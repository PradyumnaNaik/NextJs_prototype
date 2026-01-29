# Compliance Checklist

> **BINARY PASS/FAIL** | All checks must pass | ~300 tokens

---

## PRE-COMMIT CHECKLIST

### Server/Client Boundary
- [ ] Server Component by default (no 'use client' unless required)
- [ ] 'use client' ONLY for: hooks, events, browser APIs
- [ ] error.tsx files are 'use client'
- [ ] Interactivity pushed to leaf components

### TypeScript
- [ ] All props have explicit interfaces
- [ ] No `any` type
- [ ] PageProps/LayoutProps properly typed
- [ ] Server Actions return typed responses

### Data & Caching
- [ ] Server Components fetch directly (no useEffect)
- [ ] Server Actions for mutations
- [ ] Explicit cache strategy (revalidate/tags/no-store)
- [ ] revalidateTag/revalidatePath after mutations

### Security
- [ ] No secrets in client code
- [ ] Zod validation in Server Actions
- [ ] Auth check in Server Component/Action
- [ ] No dangerouslySetInnerHTML with user data
- [ ] External links have rel="noopener noreferrer"

### Accessibility
- [ ] Semantic HTML (button, a, nav, main)
- [ ] All inputs have labels
- [ ] Icon buttons have aria-label
- [ ] Focus states visible
- [ ] Images have alt text

### CSS & Tokens
- [ ] CSS Modules used
- [ ] BEM naming convention
- [ ] Design tokens only (no hardcoded values)
- [ ] No inline styles

### Testing
- [ ] Test file exists
- [ ] Render test present
- [ ] Interaction test (if interactive)
- [ ] Accessibility test present
- [ ] Coverage ≥ 70%

---

## SEVERITY LEVELS

| Level | Action | Examples |
|-------|--------|----------|
| **BLOCKING** | PR cannot merge | Security, type errors, missing tests |
| **HIGH** | Must fix before release | A11y violations, token violations |
| **MEDIUM** | Fix in next sprint | Performance, minor coverage gaps |

---

## QUICK DECISION TREE

```
New Component?
├── Needs useState/useEffect/onClick? → 'use client'
├── Fetches data? → Server Component (async)
├── Pure display? → Server Component
└── error.tsx? → MUST be 'use client'

New API call?
├── In Server Component? → Direct fetch with cache options
├── Mutation? → Server Action with Zod
└── Client needs data? → Pass from Server via props

Styling?
├── Use CSS Modules (.module.css)
├── BEM naming (.block__element--modifier)
└── Design tokens only (var(--token-name))
```

---

## FILE OUTPUT CHECKLIST

Every component delivery includes:
```
ComponentName/
├── ComponentName.tsx      ✓ TypeScript, props interface
├── ComponentName.module.css  ✓ BEM, tokens only
├── ComponentName.test.tsx ✓ Render, interaction, a11y
└── index.ts               ✓ Barrel export
```

---

**0 violations = PASS | 1+ violations = FAIL**
