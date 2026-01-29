# Accessibility Rules

> **MISSION CRITICAL** | WCAG 2.1 AA compliance required | ~500 tokens

---

## §1 SEMANTIC HTML (BLOCKING)

### RULE 1.1: Interactive Elements
```tsx
// ✅ CORRECT: Native elements
<button type="button" onClick={handle}>Action</button>
<a href="/page">Navigate</a>
<Link href="/page">Navigate</Link>

// ❌ VIOLATION: Div as button
<div onClick={handle}>Click</div>
<span onClick={handle} role="button">Click</span>
```

### RULE 1.2: Form Elements
```tsx
// ✅ CORRECT: Labeled inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-describedby="email-error" />
{error && <p id="email-error" role="alert">{error}</p>}

// ❌ VIOLATION: Missing label
<input type="text" placeholder="Email" />
```

### RULE 1.3: Landmarks
```tsx
// ✅ CORRECT: Semantic structure
<header><nav aria-label="Main">...</nav></header>
<main>...</main>
<aside aria-label="Sidebar">...</aside>
<footer>...</footer>

// ❌ VIOLATION: Div soup
<div className="header"><div className="nav">...</div></div>
```

---

## §2 ARIA (BLOCKING)

### RULE 2.1: Icon Buttons MUST Have Labels
```tsx
// ✅ CORRECT
<button aria-label="Close dialog" type="button">
  <XIcon aria-hidden="true" />
</button>

// ❌ VIOLATION: No accessible name
<button><XIcon /></button>
```

### RULE 2.2: Dynamic Content Regions
```tsx
// ✅ CORRECT: Live regions for updates
<div role="status" aria-live="polite">{statusMessage}</div>
<div role="alert" aria-live="assertive">{errorMessage}</div>

// ✅ CORRECT: Loading states
<div aria-busy={isLoading}>{isLoading ? 'Loading...' : content}</div>
```

### RULE 2.3: Expandable/Toggle States
```tsx
// ✅ CORRECT: State attributes
<button 
  aria-expanded={isOpen} 
  aria-controls="panel-id"
  onClick={toggle}
>
  Toggle
</button>
<div id="panel-id" hidden={!isOpen}>Content</div>
```

---

## §3 KEYBOARD (BLOCKING)

### RULE 3.1: Focus Management
```tsx
// ✅ CORRECT: Visible focus
.component:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

// ❌ VIOLATION: Removing focus
:focus { outline: none; }
```

### RULE 3.2: Keyboard Navigation
```tsx
// ✅ CORRECT: Tab + Enter/Space for actions
// ✅ CORRECT: Escape to close modals/dropdowns
// ✅ CORRECT: Arrow keys for menus/lists

// Modal close on Escape
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, [onClose]);
```

---

## §4 IMAGES (BLOCKING)

### RULE 4.1: Alt Text
```tsx
// ✅ CORRECT: Informative
<Image src={chart} alt="Q4 sales up 25%" />

// ✅ CORRECT: Decorative
<Image src={decoration} alt="" role="presentation" />

// ❌ VIOLATION: Missing alt
<Image src={photo} />
<img src={photo} />
```

---

## §5 COLOR (BLOCKING)

### RULE 5.1: Contrast Ratios
```css
/* ✅ CORRECT: WCAG AA minimum */
/* Normal text: 4.5:1 contrast */
/* Large text (18px+): 3:1 contrast */

/* ❌ VIOLATION: Insufficient contrast */
color: #999; /* on white background = 2.8:1 */
```

### RULE 5.2: Not Color Alone
```tsx
// ✅ CORRECT: Color + icon/text
<span className="error">
  <ErrorIcon /> Error message
</span>

// ❌ VIOLATION: Color only
<span style={{ color: 'red' }}>Required</span>
```

---

## VIOLATIONS = COMPLIANCE FAILURE

| Rule | Violation | Impact |
|------|-----------|--------|
| 1.1 | Div as button | Screen reader unusable |
| 1.2 | Missing label | Form inaccessible |
| 2.1 | Icon button no label | Button purpose unknown |
| 3.1 | Focus removed | Keyboard users blocked |
| 4.1 | Missing alt | Image content lost |
| 5.1 | Low contrast | Content unreadable |

### ARIA States
```tsx
// ✅ Toggle Button
<button 
  aria-pressed={isActive}
  onClick={() => setIsActive(!isActive)}
>
  {isActive ? 'Active' : 'Inactive'}
</button>

// ✅ Expandable Section
<button
  aria-expanded={isOpen}
  aria-controls="panel-content"
  onClick={() => setIsOpen(!isOpen)}
>
  Toggle Panel
</button>
<div id="panel-content" hidden={!isOpen}>
  Content
</div>

// ✅ Disabled Elements
<button disabled aria-disabled="true">
  Cannot Click
</button>
```

### Live Regions
```tsx
// ✅ Announcements
<div role="status" aria-live="polite">
  {successMessage}
</div>

// ✅ Urgent Alerts
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// ✅ Loading States
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>
```

---

## 3. KEYBOARD NAVIGATION

### Focus Management
```tsx
// ✅ Focus Visible Styles
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

// ❌ Remove All Outlines
button:focus {
  outline: none; /* NEVER do this without replacement */
}

// ✅ Focus Trap in Modal
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;
    
    firstElement?.focus();
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);
  
  return isOpen ? <div ref={modalRef} role="dialog">{children}</div> : null;
};
```

### Keyboard Shortcuts
```tsx
// ✅ Standard Keyboard Interactions
const Menu = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelect(items[activeIndex]);
        break;
      case 'Escape':
        handleClose();
        break;
    }
  };
  
  return (
    <ul role="menu" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <li 
          key={item.id}
          role="menuitem"
          tabIndex={index === activeIndex ? 0 : -1}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};
```

### Skip Links
```tsx
// ✅ Skip to Main Content
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Content */}
</main>

/* CSS */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## 4. SCREEN READER SUPPORT

### Visually Hidden Content
```css
/* ✅ Screen Reader Only Text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```tsx
// ✅ Usage
<button>
  <IconTrash />
  <span className="sr-only">Delete item</span>
</button>
```

### ARIA Descriptions
```tsx
// ✅ Complex Controls
<button
  aria-label="Increase volume"
  aria-describedby="volume-desc"
>
  +
</button>
<div id="volume-desc" className="sr-only">
  Current volume is 50%. Press to increase by 10%.
</div>
```

---

## 5. COLOR & CONTRAST

### Contrast Ratios (WCAG AA)
```css
/* ✅ Sufficient Contrast */
.text-normal {
  color: #292929; /* 14.42:1 on white */
}

.text-large {
  font-size: 18px;
  color: #666666; /* 4.54:1 - OK for large text */
}

/* ❌ Insufficient Contrast */
.text-bad {
  color: #AAAAAA; /* 2.32:1 - FAILS */
}
```

### Color Independence
```tsx
// ✅ Don't Rely Solely on Color
<div className="error-message" role="alert">
  <ErrorIcon aria-hidden="true" />
  <span>Error: Invalid input</span>
</div>

// ❌ Color Only
<div style={{ color: 'red' }}>
  Invalid input
</div>
```

---

## 6. RESPONSIVE & MOBILE

### Touch Targets
```css
/* ✅ Minimum 44x44px Touch Target */
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
}

/* ✅ Spacing Between Targets */
.nav-item {
  margin: 8px;
}
```

### Zoom & Reflow
```css
/* ✅ Responsive Typography */
body {
  font-size: 16px; /* Never below 16px */
}

/* ✅ Allow Text Zoom */
/* Don't use: */
html {
  font-size: 16px; /* Fixed - bad */
}

/* Use: */
html {
  font-size: 100%; /* Respects user preferences */
}
```

---

## 7. TESTING CHECKLIST

### Manual Testing
- [ ] Tab through entire page (logical order)
- [ ] Test with keyboard only (no mouse)
- [ ] Screen reader test (NVDA, JAWS, VoiceOver)
- [ ] Zoom to 200% (no horizontal scroll)
- [ ] Check color contrast (Chrome DevTools)
- [ ] Test on mobile (touch targets, gestures)

### Automated Tools
```bash
# ✅ Axe DevTools (Chrome Extension)
# ✅ Lighthouse (Chrome DevTools)
# ✅ WAVE (Browser Extension)

# ✅ eslint-plugin-jsx-a11y
npm install --save-dev eslint-plugin-jsx-a11y
```

### ESLint Configuration
```json
{
  "extends": [
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["jsx-a11y"]
}
```

---

## 8. WCAG COMPLIANCE LEVELS

### Level A (Minimum)
- ✅ Text alternatives for non-text content
- ✅ Keyboard accessible
- ✅ No keyboard traps
- ✅ Page titled

### Level AA (Target)
- ✅ Contrast ratio 4.5:1 (normal text)
- ✅ Contrast ratio 3:1 (large text)
- ✅ Text can be resized 200%
- ✅ Multiple ways to navigate
- ✅ Focus visible

### Level AAA (Enhanced)
- ✅ Contrast ratio 7:1 (normal text)
- ✅ Contrast ratio 4.5:1 (large text)
- ✅ No images of text

**Project Target:** WCAG 2.1 Level AA

---

**Last Updated:** 2025-12-01  
**Version:** 1.0.0
