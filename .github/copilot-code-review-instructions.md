# GitHub Copilot Code Review Instructions

## Context
**Enterprise Next.js 14+ App Router** with strict governance.

> **IMPORTANT:** This file extends the main governance framework. Do NOT duplicate rules here.

---

## 📚 Governance Source Files (READ THESE)

**All rules are defined in:** `docs/governance_framework/rules/`

| File | Review Focus |
|------|--------------|
| `01_NEXTJS_CORE_RULES.md` | Server/Client boundary, data fetching |
| `02_SECURITY_RULES.md` | Auth, Zod validation, XSS |
| `03_ACCESSIBILITY_RULES.md` | Semantic HTML, ARIA |
| `04_CSS_TOKENS_RULES.md` | Design tokens, BEM |
| `05_TESTING_RULES.md` | Test patterns, coverage |
| `06_COMPLIANCE_CHECKLIST.md` | Quick pass/fail checklist |

**Quick Reference:** `.github/copilot-instructions.md` (embedded summary)

---

## 🎯 Review-Specific Guidance

### Enforcement Levels

| Level | Action | Rules |
|-------|--------|-------|
| ❌ **BLOCKING** | Must reject PR | Server/Client boundary, TypeScript `any`, Security, Accessibility |
| ⚠️ **WARNING** | Request changes | CSS tokens, Testing coverage |
| 💡 **SUGGESTION** | Optional improvement | Performance, code style |

### Review Output Format

For each file with issues:

```
### [filename]

**Verdict:** ✅ APPROVE | ⚠️ CHANGES REQUESTED | ❌ BLOCKING

**Violations:**
- [Rule from governance docs]: [Specific issue with line reference]

**Suggestions:**
- [Optional improvements]
```

---

## 🔍 Quick Decision Trees

### Component File Review
```
1. Uses useState/useEffect/onClick? 
   → YES: Must have 'use client' (see 01_NEXTJS_CORE_RULES.md)
   → NO: Must NOT have 'use client'
   
2. Is error.tsx?
   → Must have 'use client' (ALWAYS)
   
3. Has props?
   → Must have TypeScript interface (see copilot-instructions.md)
   
4. Has <div onClick>?
   → ❌ BLOCKING: Use <button> (see 03_ACCESSIBILITY_RULES.md)
```

### Server Action Review
```
1. Has 'use server'? → Required
2. Has Zod schema? → Required (see 02_SECURITY_RULES.md)
3. Has auth check? → Required before mutation
4. Has revalidateTag/Path? → Required after mutation
```

### CSS File Review
```
1. Has #fff or rgb()? → ❌ Use var(--color-*)
2. Has 16px or 1rem? → ⚠️ Use var(--spacing-*)
3. Class names BEM? → Required (see 04_CSS_TOKENS_RULES.md)
```

---

## ✅ Compliance Checklist (Per PR)

Reference: `docs/governance_framework/rules/06_COMPLIANCE_CHECKLIST.md`

**Blocking (all must pass):**
- [ ] Server Components by default
- [ ] `'use client'` only where justified
- [ ] `error.tsx` has `'use client'`
- [ ] No `any` types
- [ ] Props have interfaces
- [ ] Server Actions use Zod
- [ ] Semantic HTML for interactivity
- [ ] Images have alt text
- [ ] Icon buttons have aria-label

**Warnings (should pass):**
- [ ] CSS uses design tokens
- [ ] Tests exist for new code
- [ ] No hardcoded colors/spacing

---

**Version:** 1.1 | References main governance framework
**Enforcement Level:** STRICT
