# Testing Rules

> **MISSION CRITICAL** | Required coverage for merge | ~500 tokens

---

## §1 TEST FILE REQUIREMENTS (BLOCKING)

### RULE 1.1: Co-located Test Files
```
components/Button/
├── Button.tsx
├── Button.module.css
├── Button.test.tsx     ← REQUIRED
└── index.ts
```

### RULE 1.2: Minimum Test Cases
```typescript
// REQUIRED for every component:
describe('ComponentName', () => {
  it('renders without crashing', () => {});        // ← REQUIRED
  it('renders with required props', () => {});     // ← REQUIRED
  it('handles user interaction', async () => {});  // ← If interactive
  it('displays loading state', () => {});          // ← If async
  it('displays error state', () => {});            // ← If async
  it('is accessible', async () => {});             // ← REQUIRED
});
```

---

## §2 COMPONENT TESTING (BLOCKING)

### RULE 2.1: Test Behavior, Not Implementation
```typescript
// ✅ CORRECT: Test user behavior
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Counter', () => {
  it('increments when button clicked', async () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: /increment/i });
    
    await userEvent.click(button);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

// ❌ VIOLATION: Testing implementation
it('calls setState', () => {
  const setState = vi.fn();
  vi.spyOn(React, 'useState').mockReturnValue([0, setState]);
  // Testing internal state management
});
```

### RULE 2.2: Accessibility Tests Required
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## §3 SERVER COMPONENT TESTING (BLOCKING)

### RULE 3.1: Test as Async Functions
```typescript
// Server Component
export default async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId);
  return <div>{user.name}</div>;
}

// Test
vi.mock('@/lib/db', () => ({
  getUser: vi.fn(),
}));

describe('UserProfile', () => {
  it('renders user data', async () => {
    vi.mocked(getUser).mockResolvedValue({ id: '1', name: 'John' });
    
    const Component = await UserProfile({ userId: '1' });
    render(Component);
    
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

---

## §4 SERVER ACTION TESTING (BLOCKING)

### RULE 4.1: Test Validation and Side Effects
```typescript
import { createUser } from '@/actions/users';
import { db } from '@/lib/db';
import { revalidateTag } from 'next/cache';

vi.mock('@/lib/db');
vi.mock('next/cache');

describe('createUser', () => {
  it('validates input', async () => {
    const formData = new FormData();
    formData.set('email', 'invalid');
    
    const result = await createUser(formData);
    
    expect(result.error).toBeDefined();
    expect(db.user.create).not.toHaveBeenCalled();
  });
  
  it('creates user and revalidates', async () => {
    const formData = new FormData();
    formData.set('email', 'test@example.com');
    formData.set('name', 'Test');
    
    await createUser(formData);
    
    expect(db.user.create).toHaveBeenCalled();
    expect(revalidateTag).toHaveBeenCalledWith('users');
  });
});
```

---

## §5 COVERAGE REQUIREMENTS (BLOCKING)

| Type | Minimum | Target |
|------|---------|--------|
| Statements | 70% | 80% |
| Branches | 70% | 80% |
| Functions | 70% | 80% |
| Lines | 70% | 80% |

**PR blocked if coverage drops below minimum.**

---

## VIOLATIONS = PR BLOCKED

| Rule | Violation | Impact |
|------|-----------|--------|
| 1.1 | Missing test file | PR blocked |
| 1.2 | Missing required tests | PR blocked |
| 2.2 | No a11y test | PR blocked |
| 5 | Coverage below 70% | PR blocked |
    // After load, shows users
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });

  it('displays error on fetch failure', async () => {
    vi.mocked(api).mockRejectedValueOnce(new Error('Network error'));
    
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
    });
  });
});
```

---

## 5. ACCESSIBILITY TESTING

### Basic A11y Tests
```typescript
describe('Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ComponentName />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    render(<Menu items={menuItems} />);
    
    const firstItem = screen.getByRole('menuitem', { name: /first/i });
    firstItem.focus();
    
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /second/i })).toHaveFocus();
    
    await userEvent.keyboard('{Enter}');
    expect(handleSelect).toHaveBeenCalled();
  });

  it('has proper ARIA attributes', () => {
    render(<Dialog isOpen title="Confirm" />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
```

---

## 6. TEST FILE STRUCTURE

### Organization
```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.css
│   ├── Button.test.tsx    # Co-located tests
│   └── index.ts
hooks/
├── useAuth.ts
├── useAuth.test.ts        # Co-located tests
utils/
├── validation.ts
├── validation.test.ts     # Co-located tests
```

### Test Template
```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // Setup
  const defaultProps = {
    title: 'Test',
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {});
    it('renders variants correctly', () => {});
  });

  describe('Interactions', () => {
    it('handles click', async () => {});
    it('handles keyboard events', async () => {});
  });

  describe('States', () => {
    it('shows loading state', () => {});
    it('shows error state', () => {});
    it('shows empty state', () => {});
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {});
    it('supports keyboard navigation', async () => {});
  });
});
```

---

## 7. RULES

### DO ✅
- Test user-visible behavior
- Use `screen.getByRole` for accessibility
- Test loading, error, and empty states
- Mock at the API boundary, not implementation
- Use `userEvent` over `fireEvent`

### DON'T ❌
- Don't test implementation details (state, methods)
- Don't snapshot test entire components
- Don't test third-party library behavior
- Don't mock React hooks directly
- Don't write tests after bugs (write with the fix)

---

## 8. MINIMUM TEST CHECKLIST

Before merging, verify component has tests for:
- [ ] Renders without crashing
- [ ] Props affect output correctly
- [ ] User interactions work (click, type, etc.)
- [ ] Loading state renders
- [ ] Error state renders
- [ ] Keyboard accessible (if interactive)
