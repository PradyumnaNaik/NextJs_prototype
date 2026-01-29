## Description
<!-- Brief description of changes -->

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 🔧 Refactor
- [ ] 📚 Documentation
- [ ] 🧪 Tests

---

## 🚨 GOVERNANCE COMPLIANCE CHECKLIST

**All boxes must be checked before merge.**

### Next.js App Router
- [ ] Server Components by default (no directive = Server Component)
- [ ] `'use client'` ONLY for hooks, events, or browser APIs
- [ ] `error.tsx` files have `'use client'` directive
- [ ] Data fetching uses Server Components (not `useEffect`)
- [ ] Server Actions have `'use server'` directive

### TypeScript
- [ ] No `any` types (use `unknown` if type unknown)
- [ ] Props have explicit `interface` definitions
- [ ] Page components use `PageProps` pattern

### Security
- [ ] Server Actions use Zod validation
- [ ] Auth checks in Server Components, not middleware alone
- [ ] No secrets exposed to client code
- [ ] No `dangerouslySetInnerHTML` with user input

### Accessibility
- [ ] Interactive elements use semantic HTML (`<button>`, `<a>`)
- [ ] Images have `alt` text (or `alt=""` + `aria-hidden="true"` for decorative)
- [ ] Icon buttons have `aria-label`
- [ ] Form inputs have associated labels

### CSS & Styling
- [ ] CSS Modules only (`.module.css`)
- [ ] Design tokens only (no hardcoded colors/spacing)
- [ ] BEM naming convention (`.block__element--modifier`)

### Testing
- [ ] Tests exist for new/modified components
- [ ] Server Components tested with `render()` + assertions
- [ ] Server Actions tested with mock inputs
- [ ] Accessibility tested with `@testing-library/jest-dom`

---

## Related Issues
<!-- Link to related issues: Closes #123 -->

## Screenshots
<!-- If UI changes, add before/after screenshots -->

---

**Reviewer Notes:**
- CI must pass before review
- All checklist items are mandatory
- Request changes for any governance violations
