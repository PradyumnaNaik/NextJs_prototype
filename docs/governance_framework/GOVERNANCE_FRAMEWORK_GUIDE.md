# Next.js Enterprise Governance Framework

> **Version:** 1.0 | **Status:** Ready for EA Review | **Last Updated:** January 2026

---

## Executive Summary

This framework ensures **consistent, secure, and accessible code** across 50+ developers building Next.js 14+ applications with AI-assisted development (GitHub Copilot).

**Key Outcomes:**
- ~95% automated compliance (before human review)
- Zero impact on developer velocity (works parallel to coding)
- Token-efficient AI instructions (~2,500 tokens vs industry average of 6,000+)
- Phased rollout that doesn't overwhelm teams new to Next.js

---

## 1. Problem Statement

### Without Governance
| Risk | Impact |
|------|--------|
| Inconsistent AI output | 50 developers = 50 different patterns |
| Security vulnerabilities | Unvalidated inputs, exposed secrets |
| Accessibility lawsuits | WCAG non-compliance (ADA/Section 508) |
| Performance degradation | Incorrect Server/Client boundaries |
| Unmaintainable codebase | No shared conventions |

### With This Framework
| Outcome | How |
|---------|-----|
| Consistent patterns | AI generates same structure every time |
| Security by default | Zod validation, auth checks enforced |
| Accessible by default | Semantic HTML, ARIA enforced |
| Optimal performance | Server Components by default |
| Maintainable code | BEM, TypeScript interfaces, tests |

---

## 2. Framework Architecture

### Multi-Layer Defense (No Single Point of Failure)

```
Developer writes code
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: AI Generation (Copilot Chat)                      │
│  • Reads: .github/copilot-instructions.md                   │
│  • Generates compliant code from the start                  │
│  • Token cost: ~2,500 tokens per session                    │
│  • Catch rate: ~50%                                         │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: IDE Real-time (ESLint + TypeScript)               │
│  • Reads: config/.eslintrc.js, tsconfig.json                │
│  • Red squiggles as developer types                         │
│  • Zero token cost (local tooling)                          │
│  • Catch rate: +25%                                         │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Pre-Review (Copilot Code Review)                  │
│  • Reads: .github/copilot-code-review-instructions.md       │
│  • Developer runs "Review Unstaged Changes"                 │
│  • Catches violations BEFORE commit                         │
│  • Token cost: ~1,000 tokens per review                     │
│  • Catch rate: +10%                                         │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 4: Pre-commit (Husky + lint-staged)                  │
│  • Auto-fixes minor issues on commit                        │
│  • Does NOT block WIP commits (Phase 1)                     │
│  • Zero token cost (local tooling)                          │
│  • Catch rate: +5%                                          │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 5: CI/CD Gates (GitHub Actions)                      │
│  • 4 parallel jobs (Quality, Tests, Build, Next.js Rules)   │
│  • Blocks merge if violations found                         │
│  • Zero token cost (GitHub runners)                         │
│  • Catch rate: +5%                                          │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
   ✅ ~95% Compliant Code (before human review)
```

---

## 3. Token Economics

### AI Token Usage (Per Developer Per Day)

| Activity | Tokens | Frequency | Daily Total |
|----------|--------|-----------|-------------|
| Copilot Chat (with instructions) | ~2,500 | 3-5 sessions | ~10,000 |
| Copilot Code Review | ~1,000 | 2-3 reviews | ~2,500 |
| **Total** | | | **~12,500** |

### Why Our Instructions Are Token-Efficient

| Approach | Token Count | Trade-off |
|----------|-------------|-----------|
| Verbose (full examples) | 6,000-8,000 | Complete but expensive |
| **Our approach** | **~2,500** | Embedded summary + references |
| Minimal | 500-1,000 | Cheap but ineffective |

**Strategy:** Embed critical rules directly (Server/Client, TypeScript, Security), reference detailed docs for edge cases.

### Cost Comparison (50 Developers)

| Scenario | Daily Tokens | Monthly Cost* |
|----------|--------------|---------------|
| No governance (random prompts) | Variable | Inconsistent output |
| Verbose instructions | ~25,000/dev | Higher |
| **This framework** | **~12,500/dev** | **Optimized** |

*Actual costs depend on enterprise Copilot licensing model.

---

## 4. Developer Experience Considerations

### What We Deliberately Avoided

| Anti-Pattern | Why We Avoided It | Our Approach |
|--------------|-------------------|--------------|
| Blocking pre-commit hooks | Frustrates WIP commits | Auto-fix only (Phase 1) |
| 70% coverage immediately | Team is learning Next.js | 50% → 60% → 70% phased |
| Strict spacing tokens | Too many false positives | Colors only (Phase 1) |
| 8 CI jobs | Long feedback loops | 4 consolidated jobs |
| BEM errors | Learning curve | Warnings only |

### How It Works Parallel to Code

```
Developer Experience                 Governance (Background)
─────────────────────                ────────────────────────
Write code                     →     Copilot follows instructions
See red squiggle               →     ESLint catches issue
Fix or ignore                  →     (No interruption)
"Review my changes"            →     Copilot reviews against rules
Stage & commit                 →     Auto-fix runs (doesn't block)
Push & create PR               →     CI runs 4 parallel checks
                                     ↓
                               95% issues caught before review
```

**Key Principle:** Governance works IN THE BACKGROUND. Developers focus on features, not compliance.

---

## 5. What Gets Enforced (Phase 1)

### Blocking (Non-Negotiable)

| Rule | Why | Enforced By |
|------|-----|-------------|
| No `any` types | Type safety, maintainability | ESLint, CI |
| Server/Client boundary | Core Next.js pattern | CI scanner |
| `error.tsx` has `'use client'` | Framework requirement | CI scanner |
| Semantic HTML | ADA/WCAG compliance | ESLint (jsx-a11y) |
| No hardcoded colors | Brand consistency | Stylelint |
| Zod validation | Security | Code review |

### Warning Only (Phase 1)

| Rule | Why Warning | Tighten In |
|------|-------------|------------|
| BEM class naming | Learning curve | Phase 3 |
| Spacing tokens | Design system not mature | Phase 2 |
| 70% coverage | Team building skills | Phase 3 |

---

## 6. Phased Rollout

| Phase | Timeline | Coverage | CSS Tokens | BEM | Pre-commit |
|-------|----------|----------|------------|-----|------------|
| **Phase 1** | Now | 50% | Colors only | Warning | Auto-fix |
| **Phase 2** | Q2 | 60% | + Spacing | Warning | Auto-fix |
| **Phase 3** | Q3 | 70% | + Typography | Error | Blocking |

**Rationale:** Team is learning Next.js App Router patterns. Strict enforcement on day 1 leads to workarounds (`// @ts-ignore`, `git commit --no-verify`).

---

## 7. File Structure

```
.github/
├── copilot-instructions.md           # AI generation rules (~2,500 tokens)
├── copilot-code-review-instructions.md  # Code review rules (references main)
├── PULL_REQUEST_TEMPLATE.md          # Human review checklist
└── workflows/
    └── governance-check.yml          # CI/CD gates (4 jobs)

config/
├── .eslintrc.js                      # TypeScript + a11y + security
├── .stylelintrc.js                   # CSS tokens (colors Phase 1)
├── jest.config.js                    # 50% coverage threshold
└── jest.setup.js

docs/governance_framework/
├── GOVERNANCE_FRAMEWORK_GUIDE.md     # This document (EA review)
├── GOVERNANCE_NEXTJS_RSC.md          # High-level RSC guidance
└── rules/                            # Detailed rule definitions
    ├── 01_NEXTJS_CORE_RULES.md
    ├── 02_SECURITY_RULES.md
    ├── 03_ACCESSIBILITY_RULES.md
    ├── 04_CSS_TOKENS_RULES.md
    ├── 05_TESTING_RULES.md
    └── 06_COMPLIANCE_CHECKLIST.md
```

---

## 8. Expected Outcomes

### Compliance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| PRs passing CI first try | >80% | GitHub Actions data |
| Security violations in prod | 0 | Security scans |
| Accessibility score | 100% | Lighthouse/axe |
| Code coverage | 50% → 70% | Jest reports |

### Developer Satisfaction

| Concern | Mitigation |
|---------|------------|
| "Too many rules" | Phased, warnings before errors |
| "Slows me down" | Auto-fix, parallel to coding |
| "Copilot ignores rules" | Multi-layer catches what AI misses |
| "Can't commit WIP" | Pre-commit auto-fixes, doesn't block |

---

## 9. Governance Champions (Recommended)

For 50+ developers, designate **5-6 champions** (2-4 hrs/week each):

| Role | Responsibility |
|------|----------------|
| Next.js Lead | Architecture decisions, Server/Client boundary |
| Accessibility Champion | ARIA patterns, WCAG compliance |
| Security Champion | Auth patterns, validation reviews |
| CSS Lead | Design tokens, BEM adoption |
| Testing Lead | Coverage strategy, test patterns |

---

## 10. Implementation Checklist

### Week 1: Setup
- [ ] Run `npm install` (all dependencies included)
- [ ] Verify ESLint/Stylelint work in IDE
- [ ] Test pre-commit hooks (`git commit`)
- [ ] Enable GitHub Actions on `develop` branch

### Week 2: Team Onboarding
- [ ] 2-hour governance overview session
- [ ] Each developer creates 1 component following rules
- [ ] Champions review first PRs together

### Week 3+: Production
- [ ] Enable CI blocking on `main` branch
- [ ] Monitor first-try pass rate
- [ ] Weekly review of common violations
- [ ] Adjust rules based on feedback

---

## Appendix: Quick Reference

### Server Component (Default)
```typescript
// No directive = Server Component
export default async function Page() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}
```

### Client Component (Only When Needed)
```typescript
'use client';
// ONLY for: useState, useEffect, onClick, browser APIs
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Server Action
```typescript
'use server';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1) });

export async function createItem(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };
  // ... auth check, mutation, revalidation
}
```

---

**Document Owner:** [Your Team] | **Review Cycle:** Quarterly | **Next Review:** Q2 2026
