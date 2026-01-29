# Figma-to-React Prompt Template

## Purpose
Copy this prompt when asking GitHub Copilot to generate a component from Figma. This ensures all governance guardrails are followed.

---

## 🎯 Prompt Template

```
@workspace Generate a React TypeScript component from this Figma design:

**Figma URL:** [PASTE URL HERE]
**Component Name:** [e.g., NavigationBar, ProductCard, etc.]

Follow the governance framework in `docs/governance_framework/rules/`:

1. Extract Figma data:
   - Get screenshot (save to docs/figma-reference/)
   - Get design context (Figma MCP)
   - Get design variables

2. Component generation requirements:
   - Follow Next.js App Router patterns per `01_NEXTJS_CORE_RULES.md`
   - Convert Tailwind classes to CSS Modules with BEM naming
   - Map design tokens per `04_CSS_TOKENS_RULES.md`
   - Download all assets locally (CDN expires in 7 days)
   - Create modular structure (not monolithic)
   - Add TypeScript interfaces (see copilot-instructions.md)
   - Implement accessibility per `03_ACCESSIBILITY_RULES.md`
   - Apply security rules per `02_SECURITY_RULES.md`

3. Validation required:
   - Run compliance checklist per `06_COMPLIANCE_CHECKLIST.md`
   - Visual comparison with browser overlay
   - Document specifications in component README
   - Save Figma screenshot as reference

4. Create these files:
   - components/[ComponentName]/[ComponentName].tsx
   - components/[ComponentName]/[ComponentName].module.css
   - components/[ComponentName]/[ComponentName].test.tsx
   - components/[ComponentName]/README.md
   - components/[ComponentName]/index.ts

Ensure WCAG 2.1 Level AA compliance and designer approval before completion.
```

---

## 📝 Example Usage

### Example 1: Navigation Bar
```
@workspace Generate a React TypeScript component from this Figma design:

**Figma URL:** https://figma.com/design/[FILE_KEY]/[PROJECT_NAME]?node-id=[NODE_ID]
**Component Name:** NavigationBar

Follow the complete workflow in `docs/FIGMA_MCP_WORKFLOW.md`:
[... rest of template ...]
```

### Example 2: Product Card
```
@workspace Generate a React TypeScript component from this Figma design:

**Figma URL:** https://figma.com/design/abc123/MyProject?node-id=456-789
**Component Name:** ProductCard

Follow the complete workflow in `docs/FIGMA_MCP_WORKFLOW.md`:
[... rest of template ...]
```

---

## 🤖 What Copilot Will Do Automatically

With `.github/copilot-instructions.md` configured, Copilot will automatically:
- ✅ Reference all governance guidelines
- ✅ Use design tokens from `design-tokens.css`
- ✅ Follow component folder structure
- ✅ Add TypeScript interfaces
- ✅ Include accessibility attributes
- ✅ Use semantic HTML
- ✅ Follow BEM CSS naming
- ✅ Add performance optimizations

---

## 👨‍💻 What You Need to Do Manually

Even with the prompt, you must:
- ❗ Invoke Figma MCP tools explicitly (Copilot can't call MCP)
- ❗ Download assets from CDN before they expire
- ❗ Perform visual comparison validation
- ❗ Get designer approval
- ❗ Run quality gate checks

---

## 🚀 Alternative: Use as Chat Instructions

For repeated use, you can also:

1. **Save as snippet** in VS Code:
   - File → Preferences → User Snippets → markdown.json
   - Add snippet with prefix `figma-prompt`

2. **Create custom Copilot agent** (if available):
   - Configure agent with workflow steps
   - Auto-apply guardrails on invocation

3. **Use workspace instruction file**:
   - Already configured in `.github/copilot-instructions.md`
   - Copilot reads this on every suggestion

---

## 🔍 Verification Checklist

After generation, verify Copilot followed all guardrails:

### Structure ✓
- [ ] Component folder created with 5 files (tsx, css, test, README, index)
- [ ] Follows naming convention (PascalCase)
- [ ] Barrel export in index.ts

### TypeScript ✓
- [ ] Props interface defined and exported
- [ ] React.FC<Props> pattern used
- [ ] No `any` types
- [ ] Default values for optional props

### Styling ✓
- [ ] Uses CSS variables from design-tokens.css
- [ ] BEM naming convention
- [ ] No hardcoded colors/spacing
- [ ] Mobile-first responsive

### Accessibility ✓
- [ ] Semantic HTML elements
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation support
- [ ] Focus indicators visible

### Performance ✓
- [ ] React.memo if expensive
- [ ] useMemo/useCallback for computations
- [ ] Images optimized and lazy-loaded
- [ ] No unnecessary re-renders

### Figma Accuracy ✓
- [ ] Screenshot saved in docs/figma-reference/
- [ ] Design specs documented in README
- [ ] Assets downloaded locally (not CDN)
- [ ] Tailwind converted to standard CSS
- [ ] Visual comparison performed

---

## 💡 Pro Tips

### Tip 1: Be Specific in Prompt
```
❌ "Create a button from Figma"
✅ "Generate a PrimaryButton component from Figma [URL] with 3 variants (primary, secondary, destructive), following docs/FIGMA_MCP_WORKFLOW.md"
```

### Tip 2: Reference Existing Components
```
@workspace Generate a UserProfile component from Figma [URL], similar to the NavigationBar component structure
```

### Tip 3: Iterate with Validation
```
Generate component → Run validation checklist → Refine with Copilot → Validate again
```

### Tip 4: Use Copilot Chat for Each Step
Instead of one large prompt, break into steps:
1. "Extract Figma design variables from [URL]"
2. "Generate component structure following COMPONENT_GUIDELINES"
3. "Add accessibility per HTML_ACCESSIBILITY_STANDARDS"
4. "Optimize performance per PERFORMANCE_GUIDELINES"

---

## 🎓 Training New Team Members

For onboarding:
1. Read `docs/INDEX.md` (quick reference)
2. Read `docs/FIGMA_MCP_WORKFLOW.md` (step-by-step)
3. Copy this prompt template
4. Generate first component with supervision
5. Review against validation checklist
6. Get feedback from senior developer

---

**Last Updated:** 2025-12-01  
**Version:** 1.0.0
