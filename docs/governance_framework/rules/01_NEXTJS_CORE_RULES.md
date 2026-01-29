# Next.js App Router Core Rules

> **MISSION CRITICAL** | Zero tolerance for violations | ~800 tokens

---

## §1 SERVER VS CLIENT BOUNDARY (BLOCKING)

### RULE 1.1: Server Components by Default
```typescript
// ✅ CORRECT: No directive = Server Component
export default async function Page() {
  const data = await fetchData(); // Direct async
  return <div>{data.title}</div>;
}

// ❌ VIOLATION: 'use client' without justification
'use client'; // REQUIRES: hooks, events, or browser APIs
```

### RULE 1.2: 'use client' ONLY When Required
**MANDATORY justification - one of:**
- `useState`, `useEffect`, `useReducer`, `useContext`
- Event handlers: `onClick`, `onChange`, `onSubmit`
- Browser APIs: `window`, `document`, `localStorage`
- Third-party client libraries

```typescript
// ✅ CORRECT: Client with justification
'use client';
import { useState } from 'react';
export function Counter() {
  const [count, setCount] = useState(0); // Justifies 'use client'
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### RULE 1.3: Push Interactivity to Leaf Components
```typescript
// ✅ CORRECT: Server parent, client leaf
// app/products/page.tsx (Server)
export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div>
      {products.map(p => (
        <ProductCard key={p.id} product={p}>
          <AddToCartButton productId={p.id} /> {/* Client leaf */}
        </ProductCard>
      ))}
    </div>
  );
}

// ❌ VIOLATION: Entire page as client
'use client';
export default function ProductsPage() { /* ... */ }
```

---

## §2 FILE CONVENTIONS (BLOCKING)

### RULE 2.1: Special Files
| File | Type | Purpose |
|------|------|---------|
| `page.tsx` | Server | Route entry |
| `layout.tsx` | Server | Shared layout |
| `loading.tsx` | Server | Suspense fallback |
| `error.tsx` | **Client** | Error boundary (MUST be client) |
| `not-found.tsx` | Server | 404 page |

```typescript
// ✅ CORRECT: error.tsx MUST be client
// app/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={reset}>Retry</button>;
}
```

### RULE 2.2: Directory Structure
```
src/app/
├── (routes)/           # Route groups (no URL impact)
├── api/                # Route handlers
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── loading.tsx
├── error.tsx           # MUST be 'use client'
└── not-found.tsx

src/components/
├── server/             # Server Components (no 'use client')
├── client/             # Client Components ('use client')
└── shared/             # UI primitives (can be either)

src/lib/                # Utilities
src/actions/            # Server Actions ('use server')
src/types/              # TypeScript definitions
```

---

## §3 DATA FETCHING (BLOCKING)

### RULE 3.1: Server Components Fetch Directly
```typescript
// ✅ CORRECT: Direct fetch in Server Component
export default async function UsersPage() {
  const users = await db.user.findMany(); // Direct DB access
  // OR
  const data = await fetch('https://api.example.com/users', {
    next: { revalidate: 3600, tags: ['users'] }
  });
  return <UserList users={users} />;
}

// ❌ VIOLATION: useEffect in Server Component
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  useEffect(() => { fetch('/api/users')... }, []); // WRONG
}
```

### RULE 3.2: Server Actions for Mutations
```typescript
// ✅ CORRECT: Server Action
// src/actions/users.ts
'use server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1), email: z.string().email() });

export async function createUser(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };
  
  await db.user.create({ data: parsed.data });
  revalidateTag('users');
  return { success: true };
}

// Usage in Client Component
'use client';
import { createUser } from '@/actions/users';
export function CreateUserForm() {
  return <form action={createUser}>...</form>;
}
```

---

## §4 TYPESCRIPT (BLOCKING)

### RULE 4.1: Explicit Types for All Props
```typescript
// ✅ CORRECT: Explicit interface
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) { }

// ❌ VIOLATION: Implicit any
export default async function Page({ params }) { } // Missing types
```

### RULE 4.2: Server Action Types
```typescript
// ✅ CORRECT: Typed response
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createItem(fd: FormData): Promise<ActionResult<Item>> {
  // ...
}
```

---

## §5 CACHING & REVALIDATION (BLOCKING)

### RULE 5.1: Explicit Cache Strategy
```typescript
// ✅ CORRECT: Explicit caching
const data = await fetch(url, {
  next: { 
    revalidate: 3600,           // Time-based (seconds)
    tags: ['products']          // Tag-based invalidation
  }
});

// ✅ CORRECT: No cache for dynamic data
const data = await fetch(url, { cache: 'no-store' });

// ❌ VIOLATION: Implicit caching (no strategy defined)
const data = await fetch(url); // Unclear cache behavior
```

### RULE 5.2: Revalidation in Server Actions
```typescript
// ✅ CORRECT: Always revalidate after mutation
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateProduct(id: string, data: ProductData) {
  await db.product.update({ where: { id }, data });
  revalidateTag('products');      // Invalidate tag
  revalidatePath('/products');    // Invalidate path
}
```

---

## VIOLATIONS = BUILD FAILURE

| Rule | Violation | Consequence |
|------|-----------|-------------|
| 1.1 | Unjustified 'use client' | PR blocked |
| 1.3 | Client component at route level | PR blocked |
| 2.1 | error.tsx not client | Runtime error |
| 3.1 | useEffect in Server Component | Build error |
| 3.2 | Direct DB in Client Component | Security breach |
| 4.1 | Implicit any in props | Type error |
| 5.1 | No cache strategy | Performance degradation |
