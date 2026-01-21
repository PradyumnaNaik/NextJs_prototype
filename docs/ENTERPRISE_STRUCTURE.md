# Enterprise-Scale Project Structure Guide

A comprehensive guide for scaling your Next.js project from learning/startup stage to enterprise-ready architecture supporting multiple pods and teams.

---

## Quick Navigation

- [Current Structure (Learning Stage)](#current-structure-learning-stage)
- [Enterprise-Scale Structure](#enterprise-scale-structure)
- [Why This Structure Works](#why-this-structure-works)
- [Pod Organization](#pod-organization)
- [Scaling Rules](#scaling-rules)
- [Migration Path](#migration-path)
- [Real-World Examples](#real-world-examples)

---

## Current Structure (Learning Stage)

Your EduShop project currently uses a **simple, flat structure** ideal for learning:

```
src/
├── app/                    # Routes
├── components/             # All React components
├── lib/                    # All functions (products, actions, etc.)
└── types/                  # All TypeScript types
```

### Current Structure Problems at Scale

| Problem | Impact | When It Breaks |
|---------|--------|---|
| No team boundaries | Merge conflicts | 5+ developers |
| Mixed concerns | Hard to test | Complex features |
| One `components/` folder | Becomes 200+ files | 20+ features |
| Shared vs feature logic unclear | Code duplication | Multiple pods |
| No standardized error handling | Inconsistent patterns | 10+ error cases |
| Middleware/infrastructure mixed | Tight coupling | Need to swap databases |

**Bottom line:** Perfect for learning, but doesn't scale past 3-4 developers.

---

## Enterprise-Scale Structure

A **feature-based, pod-oriented architecture** optimized for large teams:

### Complete Directory Layout

```
src/
│
├── app/                                 # NextJS App Router (routes + layouts ONLY)
│   ├── (auth)/                          # Route group: authentication
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/                     # Route group: main app
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                             # External API routes
│   │   ├── webhooks/
│   │   │   ├── stripe/
│   │   │   │   └── route.ts
│   │   │   └── auth/
│   │   │       └── route.ts
│   │   └── external-services/
│   │       └── route.ts
│   │
│   ├── error.tsx                        # Global error boundary
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Home page
│   └── not-found.tsx                    # 404 page
│
├── features/                            # Feature-based pods (KEY CONCEPT!)
│   │
│   ├── products/                        # Pod 1: Products Team
│   │   ├── components/
│   │   │   ├── ProductCard.tsx          # ("use client") Client component
│   │   │   ├── ProductList.tsx          # Server component
│   │   │   ├── ProductFilter.tsx        # ("use client") Filter UI
│   │   │   └── __tests__/
│   │   │       ├── ProductCard.test.tsx
│   │   │       └── ProductFilter.test.tsx
│   │   │
│   │   ├── server-actions/              # Server-side mutations
│   │   │   ├── getProducts.ts
│   │   │   ├── searchProducts.ts
│   │   │   ├── updateProduct.ts
│   │   │   ├── deleteProduct.ts
│   │   │   └── __tests__/
│   │   │       └── getProducts.test.ts
│   │   │
│   │   ├── hooks/                       # Client-side React hooks
│   │   │   ├── useProductFilter.ts      # Filter logic
│   │   │   ├── useProductCart.ts        # Cart logic
│   │   │   └── useProductSearch.ts      # Search logic
│   │   │
│   │   ├── types/
│   │   │   ├── Product.ts
│   │   │   ├── ProductFilter.ts
│   │   │   └── ProductCategory.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── formatPrice.ts
│   │   │   ├── validateProduct.ts
│   │   │   ├── productHelpers.ts
│   │   │   └── __tests__/
│   │   │       └── formatPrice.test.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── categories.ts
│   │   │   ├── prices.ts
│   │   │   └── defaults.ts
│   │   │
│   │   ├── index.ts                     # PUBLIC API (what others import)
│   │   ├── README.md                    # Pod documentation
│   │   └── CHANGELOG.md                 # Version history
│   │
│   ├── orders/                          # Pod 2: Orders Team
│   │   ├── components/
│   │   ├── server-actions/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── index.ts
│   │   ├── README.md
│   │   └── CHANGELOG.md
│   │
│   └── auth/                            # Pod 3: Auth Team
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   └── ProtectedRoute.tsx
│       ├── server-actions/
│       │   ├── login.ts
│       │   ├── logout.ts
│       │   └── register.ts
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── types/
│       │   └── User.ts
│       ├── utils/
│       │   └── passwordValidation.ts
│       ├── index.ts
│       ├── README.md
│       └── CHANGELOG.md
│
├── shared/                              # Shared across all pods
│   │
│   ├── components/                      # Reusable UI components
│   │   ├── ui/                          # Primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Card.tsx
│   │   │
│   │   ├── layout/                      # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   │
│   │   ├── feedback/                    # User feedback
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   └── __tests__/
│   │       └── Button.test.tsx
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useQuery.ts
│   │   ├── useMutation.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   │
│   ├── types/                           # Global types
│   │   ├── index.ts
│   │   ├── api.ts                       # API response types
│   │   └── common.ts                    # Common types
│   │
│   ├── utils/                           # Utility functions
│   │   ├── formatting.ts
│   │   ├── validation.ts
│   │   ├── date-helpers.ts
│   │   ├── string-helpers.ts
│   │   └── __tests__/
│   │       └── formatting.test.ts
│   │
│   ├── constants/                       # Global constants
│   │   ├── api.ts                       # API endpoints
│   │   ├── env.ts                       # Environment variables
│   │   └── messages.ts                  # Error/success messages
│   │
│   └── styles/
│       ├── globals.css
│       ├── variables.css
│       └── themes/
│
├── core/                                # Core infrastructure (NOT feature-specific)
│   │
│   ├── database/                        # Database abstraction layer
│   │   ├── client.ts                    # Database client initialization
│   │   ├── products-db.ts               # Products database queries
│   │   ├── orders-db.ts                 # Orders database queries
│   │   ├── users-db.ts                  # Users database queries
│   │   ├── migrations/
│   │   │   ├── 001-initial.sql
│   │   │   └── 002-add-ratings.sql
│   │   └── seeders/
│   │       └── seed-products.ts
│   │
│   ├── auth/                            # Authentication infrastructure
│   │   ├── providers.ts                 # OAuth, JWT, etc.
│   │   ├── session.ts                   # Session management
│   │   ├── jwt.ts                       # JWT token handling
│   │   ├── roles.ts                     # Role-based access control
│   │   └── permissions.ts               # Permission definitions
│   │
│   ├── api-client/                      # External API integration
│   │   ├── client.ts                    # Base HTTP client
│   │   ├── interceptors.ts              # Request/response interceptors
│   │   ├── stripe.ts                    # Stripe client
│   │   ├── sendgrid.ts                  # Email service client
│   │   └── analytics.ts                 # Analytics client
│   │
│   ├── middleware/                      # Express-like middleware
│   │   ├── auth.ts                      # Authentication middleware
│   │   ├── logging.ts                   # Request logging
│   │   ├── rate-limit.ts                # Rate limiting
│   │   ├── error-handler.ts             # Global error handling
│   │   ├── cors.ts                      # CORS configuration
│   │   └── validation.ts                # Input validation
│   │
│   ├── exceptions/                      # Custom error classes
│   │   ├── AppError.ts                  # Base error class
│   │   ├── ValidationError.ts
│   │   ├── NotFoundError.ts
│   │   ├── UnauthorizedError.ts
│   │   ├── ForbiddenError.ts
│   │   └── ConflictError.ts
│   │
│   ├── config/                          # Configuration
│   │   ├── env.ts                       # Environment variables
│   │   ├── constants.ts                 # App constants
│   │   └── feature-flags.ts             # Feature toggles
│   │
│   └── logger/                          # Logging system
│       ├── logger.ts
│       ├── transports.ts
│       └── formatters.ts
│
├── lib/                                 # Legacy utilities (gradual migration)
│   ├── products.ts
│   └── actions.ts
│
└── types/                               # Legacy types (gradual migration)
    └── index.ts
```

---

## Why This Structure Works

### 1. Pod-Based Ownership: Multiple Teams in Parallel

```
Your Company Organization:
├── Products Team → owns features/products/
├── Orders Team   → owns features/orders/
├── Auth Team     → owns features/auth/
└── Platform Team → owns shared/ + core/
```

**Before (Current):**
- All code in `components/`, `lib/`, `types/`
- Pod 1 merges code → Pod 2 has conflicts
- Takes 30 mins to resolve merge conflicts
- Testing is coupled

**After (Enterprise):**
- Each pod has its own folder
- Pod 1 and Pod 2 work independently
- Zero merge conflicts
- Each pod tests independently
- Can deploy feature flags per pod

### 2. Feature-Based Imports (No Scattered Code)

**Before:**
```typescript
// Importing products from everywhere
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { Product } from "@/types";
import { formatPrice } from "@/lib/products"; // Wait, is this in lib or utils?
import { useFilter } from "@/components"; // Where is this?
```

**After:**
```typescript
// Single import, clean and organized
import {
  ProductCard,
  getProducts,
  useFilter,
} from "@/features/products";

import type { Product } from "@/features/products";
```

### 3. Clear Separation: Routes vs Business Logic

**Before:**
```typescript
// app/products/page.tsx - Mixed everything
import { getAllProducts } from "@/lib/products";
import { SearchBar } from "@/components/SearchBar";
import { useState } from "react";

export default function ProductsPage() {
  // Business logic, UI, server actions mixed here
  const [filter, setFilter] = useState("");
  const products = await getAllProducts();
  
  return (
    <div>
      {/* 200+ lines of JSX */}
    </div>
  );
}
```

**After:**
```typescript
// app/(dashboard)/products/page.tsx - Thin orchestration layer
import { ProductList } from "@/features/products";

export default function ProductsPage() {
  return <ProductList />;
}
```

Business logic lives in `features/products/` where it's testable and reusable.

### 4. Standardized Error Handling Across All Pods

**Before:**
```typescript
// lib/actions.ts - Pod 1
export async function getProducts() {
  try {
    return await db.products.findAll();
  } catch (error) {
    return { error: "Failed to fetch products" }; // Generic message
  }
}

// lib/orders.ts - Pod 2 (different approach)
export async function getOrders() {
  try {
    return await db.orders.findAll();
  } catch (error) {
    throw new Error("Orders service unavailable"); // Throws instead
  }
}
```

**After:**
```typescript
// features/products/server-actions/getProducts.ts
import { handleError } from "@/core/middleware/error-handler";

export async function getProducts() {
  try {
    return await db.products.findAll();
  } catch (error) {
    return handleError(error, "PRODUCTS_FETCH");
  }
}

// features/orders/server-actions/getOrders.ts
import { handleError } from "@/core/middleware/error-handler"; // SAME

export async function getOrders() {
  try {
    return await db.orders.findAll();
  } catch (error) {
    return handleError(error, "ORDERS_FETCH"); // Consistent pattern
  }
}
```

### 5. Infrastructure Isolated from Features

**Before:**
```typescript
// features/products/ has a copy of DB logic
import Database from "some-orm";
const db = new Database();

export async function getProducts() {
  return db.query("SELECT * FROM products");
}

// features/orders/ has its own copy
import Database from "some-orm";
const db = new Database(); // Duplicate!

export async function getOrders() {
  return db.query("SELECT * FROM orders");
}
```

**After:**
```typescript
// core/database/client.ts - Single source of truth
export const db = initializeDatabase();

// features/products/server-actions/getProducts.ts
import { db } from "@/core/database/client";
export async function getProducts() {
  return db.products.findAll();
}

// features/orders/server-actions/getOrders.ts
import { db } from "@/core/database/client"; // SAME
export async function getOrders() {
  return db.orders.findAll();
}
```

Want to switch from PostgreSQL to MongoDB? Change only `core/database/client.ts`. All pods work.

---

## Pod Organization

### Anatomy of a Feature Pod

Each pod (`features/products/`, `features/orders/`, etc.) follows this structure:

```
features/products/
├── components/                 # React components
│   ├── ProductCard.tsx        # "use client"
│   ├── ProductList.tsx        # Server component
│   └── __tests__/
│
├── server-actions/            # Server-side mutations
│   ├── getProducts.ts
│   ├── updateProduct.ts
│   └── __tests__/
│
├── hooks/                      # Custom React hooks
│   ├── useProductFilter.ts
│   └── useProductCart.ts
│
├── types/                      # Pod-specific types
│   ├── Product.ts
│   └── ProductFilter.ts
│
├── utils/                      # Pod-specific utilities
│   ├── formatPrice.ts
│   └── validateProduct.ts
│
├── constants/                  # Pod-specific constants
│   ├── categories.ts
│   └── defaults.ts
│
├── index.ts                    # PUBLIC API ⭐
├── README.md                   # Pod documentation
└── CHANGELOG.md                # Version history
```

### The Critical File: `index.ts` (Public API)

This file controls what other parts of the app can import:

```typescript
// features/products/index.ts

// ✅ EXPORT: Public API
export { ProductCard } from "./components/ProductCard";
export { ProductList } from "./components/ProductList";
export type { Product, ProductFilter } from "./types";
export { getProducts, searchProducts } from "./server-actions";

// ❌ DO NOT EXPORT: Internal implementation
// (useProductFilter, formatPrice, etc. stay private)
```

**Why this matters:**

```typescript
// ✅ Good: Using public API
import { ProductCard, getProducts } from "@/features/products";

// ❌ Bad: Reaching into internals
import { useProductFilter } from "@/features/products/hooks";
import { formatPrice } from "@/features/products/utils";
```

The `index.ts` is a **contract**. You can refactor internals without breaking other pods.

---

## Scaling Rules

### Rule 1: No Cross-Pod Direct Imports

**❌ Bad:**
```typescript
// features/orders/server-actions/createOrder.ts
import { formatPrice } from "@/features/products/utils/formatPrice";
```

**Why?** If products team refactors `utils/`, they break your code.

**✅ Good:**
```typescript
// features/orders/server-actions/createOrder.ts
import { formatPrice } from "@/features/products";
```

**Why?** Products team can refactor `utils/` as long as `index.ts` still exports `formatPrice`.

### Rule 2: Shared Code Goes to `shared/` or `core/`

**❌ Bad:** Duplicating across pods
```typescript
// features/products/utils/formatPrice.ts
export function formatPrice(price: number) { /* ... */ }

// features/orders/utils/formatPrice.ts
export function formatPrice(price: number) { /* ... */ } // Duplicate!
```

**✅ Good:** Single source of truth
```typescript
// shared/utils/formatPrice.ts
export function formatPrice(price: number) { /* ... */ }

// Both pods import from shared
import { formatPrice } from "@/shared/utils";
```

### Rule 3: Infrastructure in `core/`, Features in `features/`

**❌ Bad:**
```typescript
// features/products/database/productDB.ts
// features/orders/database/orderDB.ts
// Each pod manages its own database setup
```

**✅ Good:**
```typescript
// core/database/client.ts - Single source of truth
export const db = initializeDatabase();

// Both pods use the same client
import { db } from "@/core/database/client";
```

### Rule 4: Types Live With Features

**❌ Bad:**
```typescript
// types/Product.ts
// types/Order.ts
// types/User.ts
// Central types folder becomes a mess
```

**✅ Good:**
```typescript
// features/products/types/Product.ts
// features/orders/types/Order.ts
// features/auth/types/User.ts
// Each pod owns its types
```

**Exception:** Global types for cross-pod data
```typescript
// shared/types/api.ts
export type ApiResponse<T> = { data: T; error?: string };

// shared/types/common.ts
export type UUID = string & { readonly __brand: "UUID" };
```

### Rule 5: Server Actions in `server-actions/`, Not Mixed in Components

**❌ Bad:**
```typescript
// features/products/components/ProductCard.tsx
"use server";
export async function updateProduct() { /* ... */ }
```

**✅ Good:**
```typescript
// features/products/server-actions/updateProduct.ts
"use server";
export async function updateProduct() { /* ... */ }

// features/products/components/ProductCard.tsx
"use client";
import { updateProduct } from "../server-actions";
```

---

## Migration Path

### Phase 0: Current State (Now)
```
src/
├── app/
├── components/
├── lib/
└── types/
```

### Phase 1: Add `features/` Alongside (Month 1-2)
```
src/
├── app/
├── features/              # ← NEW: Start here
│   └── products/          # New features use this structure
├── components/            # Keep old code
├── lib/
└── types/
```

**What to do:**
- New features go into `features/`
- Old code stays in place (no rush to migrate)
- Both coexist peacefully

### Phase 2: Migrate First Pod (Month 2-3)
```
src/
├── app/
├── features/
│   ├── products/          # ← Migrated to new structure
│   └── wishlist/          # ← New features
├── components/            # Still has old ProductCard, etc.
├── lib/
└── types/
```

**What to do:**
- Pick **one pod** (e.g., products)
- Move `components/Product*.tsx` → `features/products/components/`
- Move `lib/products.ts` → `features/products/server-actions/`
- Update imports in `app/`

### Phase 3: Extract `shared/` and `core/` (Month 3-4)
```
src/
├── app/
├── features/
│   ├── products/
│   └── orders/
├── shared/                # ← NEW: Shared components, hooks, utils
├── core/                  # ← NEW: Infrastructure
├── components/            # Being phased out
├── lib/
└── types/
```

**What to do:**
- Move `components/Button`, `components/Header` → `shared/components/`
- Move `lib/formatPrice` → `shared/utils/`
- Create `core/database/`, `core/auth/`, etc.

### Phase 4: Migrate Remaining Code (Month 4+)
```
src/
├── app/
├── features/              # ← All features here
├── shared/
├── core/
└── lib/ (deleted)         # Fully migrated
```

**Result:** Enterprise-ready structure.

---

## Real-World Examples

### Example 1: Products Pod using Orders Pod

**Without Structure (Current):**
```typescript
// features/products/components/ProductCard.tsx
import { addToCart } from "@/lib/actions"; // Where is this from? orders? cart?
import { Product } from "@/types"; // Which Product type?
import { formatPrice } from "@/lib/products"; // Or is it here?

export function ProductCard({ product }: { product: Product }) {
  return (
    <button onClick={() => addToCart(product.id)}>
      ${formatPrice(product.price)}
    </button>
  );
}
```

**With Enterprise Structure:**
```typescript
// features/products/components/ProductCard.tsx
"use client";

import { addToCart } from "@/features/orders"; // Clear from orders pod
import type { Product } from "@/features/products"; // Clear which type

export function ProductCard({ product }: { product: Product }) {
  return (
    <button onClick={() => addToCart(product.id)}>
      {formatPrice(product.price)}
    </button>
  );
}
```

### Example 2: Adding Error Handling

**Without Structure (Current):**
```typescript
// lib/actions.ts
export async function getProducts() {
  try {
    return db.products.findAll();
  } catch (error) {
    console.error(error); // Generic logging
    throw error; // Propagate up
  }
}

// lib/orders.ts
export async function getOrders() {
  try {
    return db.orders.findAll();
  } catch (error) {
    return null; // Different approach!
  }
}
```

**With Enterprise Structure:**
```typescript
// core/exceptions/AppError.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    public context?: Record<string, any>
  ) {
    super();
  }
}

// core/middleware/error-handler.ts
export function handleError(error: unknown, context: string) {
  if (error instanceof AppError) {
    logger.error(error.code, { context, ...error.context });
    return { success: false, error: error.message };
  }
  
  logger.error("UNKNOWN_ERROR", { context, error });
  return { success: false, error: "Something went wrong" };
}

// features/products/server-actions/getProducts.ts
import { handleError } from "@/core/middleware/error-handler";

export async function getProducts() {
  try {
    return { success: true, data: await db.products.findAll() };
  } catch (error) {
    return handleError(error, "PRODUCTS_FETCH");
  }
}

// features/orders/server-actions/getOrders.ts
import { handleError } from "@/core/middleware/error-handler"; // SAME

export async function getOrders() {
  try {
    return { success: true, data: await db.orders.findAll() };
  } catch (error) {
    return handleError(error, "ORDERS_FETCH");
  }
}
```

All error handling is **consistent across all pods** ✅

---

## Deployment & Team Structure

### Recommended Team Organization

```
Your Company
├── Platform Team (2-3 people)
│   ├── Maintains core/
│   ├── Maintains shared/
│   ├── Reviews PRs to core/ and shared/
│   └── Manages infrastructure
│
├── Products Pod (3-5 people)
│   ├── Owns features/products/
│   ├── Deploys independently via feature flags
│   ├── Can push to production without others
│   └── Manage product-specific database migrations
│
├── Orders Pod (3-5 people)
│   ├── Owns features/orders/
│   ├── Can work in parallel with Products
│   └── Uses shared infrastructure from Platform
│
└── Auth Pod (2-3 people)
    ├── Owns features/auth/
    ├── Owns core/auth/
    └── Reviews auth-related changes
```

### Deployment Workflow

**Before (Current):**
```
1. Dev A makes changes to components/
2. Dev B makes changes to lib/
3. Conflict! Need to coordinate
4. Deploy all together
5. If something breaks, unclear who owns it
```

**After (Enterprise):**
```
1. Products team: Deploy features/products/ with feature flag
2. Orders team: Deploy features/orders/ with feature flag
3. Platform team: Deploy core/ (rarely changes)
4. If something breaks, clearly owned by that pod
5. Can rollback just that pod
```

---

## Benefits Comparison

| Aspect | Current Structure | Enterprise Structure |
|--------|-------------------|---------------------|
| **Team Size** | 1-3 devs | 20+ devs |
| **Parallel Work** | ❌ Constant conflicts | ✅ Zero conflicts |
| **Code Reuse** | 🤔 Hard to discover | ✅ `index.ts` exports clear |
| **Error Handling** | 🔀 Inconsistent | ✅ `core/middleware/` standard |
| **Testing** | 📦 Co-located | ✅ `__tests__/` per feature |
| **Onboarding** | 😕 "Where does X go?" | ✅ "X goes in features/X/" |
| **Maintenance** | ⚠️ Spaghetti code | ✅ Clear separation of concerns |
| **Deployment** | 🚀 All-or-nothing | ✅ Independent per pod |
| **Database Changes** | 🔗 Global impact | ✅ Pod-specific migrations |
| **Scale to 50 devs** | ❌ Not possible | ✅ Works great |

---

## When to Migrate

### Start Migration When:
- ✅ You have 5+ features
- ✅ You have 3+ people on the team
- ✅ You're planning features multiple teams will build in parallel
- ✅ You have standardized error handling across features

### Don't Migrate If:
- ❌ You have 1-2 developers
- ❌ You have 1-2 features
- ❌ It's a MVP/prototype project
- ❌ You're still validating the product

---

## Next Steps

### Option 1: Gradual Migration (Recommended)
1. Create `features/` folder
2. Build new features in `features/` structure
3. Migrate one old feature at a time
4. Extract `shared/` and `core/` as needed

### Option 2: Big Bang Migration (If Time)
1. Plan the full structure
2. Allocate 2-3 weeks
3. Migrate everything at once
4. High risk, but cleaner result

### Option 3: Start Fresh
If starting a new project:
1. Use enterprise structure from day 1
2. No migration needed
3. Team can scale from the start

---

## Resources

- [NextJS App Router Documentation](https://nextjs.org/docs/app)
- [TypeScript Path Aliases](https://nextjs.org/docs/app/building-your-application/configuring/typescript#path-aliases-and-baseurl)
- [Monorepo Patterns](https://turbo.build/repo) (for multiple projects)
- [Folder Structure Best Practices](https://www.epicweb.dev/how-to-structure-a-react-application)

---

## Questions to Consider

1. **How big is your team?** (Will determine urgency)
2. **How many features?** (More = faster payoff)
3. **How often do you deploy?** (More = more important)
4. **Do you have database migrations?** (Complex = worth organizing)
5. **Do teams work independently?** (Yes = definitely migrate)

**Start with the foundations:** Read [LEARNING_GUIDE.md](./LEARNING_GUIDE.md) first, then use this guide when you're ready to scale.
