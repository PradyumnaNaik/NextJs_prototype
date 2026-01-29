# CSS & Design Token Rules

> **MISSION CRITICAL** | Design system compliance required | ~400 tokens

---

## §1 CSS MODULES (BLOCKING)

### RULE 1.1: CSS Modules for All Components
```typescript
// ✅ CORRECT: CSS Module
import styles from './Component.module.css';
<div className={styles.container}>

// ❌ VIOLATION: Inline styles
<div style={{ padding: '16px' }}>

// ❌ VIOLATION: Global class strings
<div className="container">
```

### RULE 1.2: BEM Naming in CSS Modules
```css
/* ✅ CORRECT: BEM structure */
.card { }                    /* Block */
.card__header { }            /* Element */
.card__title { }
.card--featured { }          /* Modifier */

/* ❌ VIOLATION: Inconsistent naming */
.Card { }                    /* PascalCase */
.card-header { }             /* Not BEM */
.cardTitle { }               /* camelCase */
```

---

## §2 DESIGN TOKENS (BLOCKING)

### RULE 2.1: No Hardcoded Values
```css
/* ✅ CORRECT: Design tokens */
.component {
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* ❌ VIOLATION: Hardcoded values */
.component {
  color: #333333;            /* Use token */
  background: white;         /* Use token */
  padding: 16px;             /* Use token */
  font-size: 14px;           /* Use token */
  border-radius: 4px;        /* Use token */
}
```

### RULE 2.2: States with Tokens
```css
/* ✅ CORRECT: Interactive states */
.button { background: var(--color-primary); }
.button:hover { background: var(--color-primary-hover); }
.button:focus-visible { 
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
.button:disabled { 
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
```

---

## §3 RESPONSIVE (BLOCKING)

### RULE 3.1: Mobile-First Breakpoints
```css
/* ✅ CORRECT: Mobile-first */
.container { padding: var(--spacing-sm); }

@media (min-width: 768px) {
  .container { padding: var(--spacing-md); }
}

@media (min-width: 1024px) {
  .container { padding: var(--spacing-lg); }
}
```

---

## VIOLATIONS = DESIGN DRIFT

| Rule | Violation | Impact |
|------|-----------|--------|
| 1.1 | Inline styles | Unmaintainable |
| 1.2 | Non-BEM naming | Inconsistent |
| 2.1 | Hardcoded colors | Brand drift |
| 2.1 | Hardcoded spacing | Layout inconsistency |
  href: string;
  children: React.ReactNode;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
  >
    {children}
    <span className="visually-hidden">(opens in new tab)</span>
  </a>
);
```

---

## 5. SENSITIVE DATA HANDLING

### Never Log Sensitive Data
```typescript
// ❌ Don't log sensitive information
console.log('User password:', password);
console.log('API response:', { ...user, ssn: user.ssn });

// ✅ Redact sensitive fields
const sanitizeForLogging = <T extends Record<string, unknown>>(
  obj: T, 
  sensitiveKeys: string[]
): T => {
  const copy = { ...obj };
  sensitiveKeys.forEach(key => {
    if (key in copy) copy[key] = '[REDACTED]' as T[keyof T];
  });
  return copy;
};

console.log('User:', sanitizeForLogging(user, ['password', 'ssn', 'token']));
```

### Clear Data on Logout
```typescript
// ✅ Clear all sensitive data on logout
const logout = () => {
  clearToken();
  sessionStorage.clear();
  // Clear any in-memory user data
  setUser(null);
  // Redirect to login
  navigate('/login');
};
```

---

## 6. RULES

### DO ✅
- Let React escape user content automatically
- Validate all inputs (client AND server)
- Use `rel="noopener noreferrer"` on external links
- Sanitize HTML if `dangerouslySetInnerHTML` is unavoidable
- Clear sensitive data on logout

### DON'T ❌
- Don't use `dangerouslySetInnerHTML` with user input
- Don't store sensitive data in localStorage for high-security apps
- Don't log passwords, tokens, or PII
- Don't trust client-side validation alone
- Don't construct URLs from unsanitized user input

---

## 7. SECURITY CHECKLIST

Before deploying, verify:
- [ ] No `dangerouslySetInnerHTML` with unsanitized input
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] Form inputs are validated
- [ ] Auth tokens are handled securely
- [ ] Sensitive data is never logged
- [ ] Logout clears all session data
