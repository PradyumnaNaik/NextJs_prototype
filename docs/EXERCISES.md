# Learning Exercises: RSC, Server Actions & UI Diffs

Practice these exercises to deepen your understanding of Next.js 15+ concepts.

## Exercise 1: Modify RSC Data Fetching

### Objective
Add a new Server Component function that filters products by price range.

### Steps

1. **Open** `src/lib/products.ts`

2. **Add this function** after `getProductsByCategory()`:

```typescript
/**
 * Get products within a price range
 */
export async function getProductsByPrice(
  minPrice: number,
  maxPrice: number
): Promise<Product[]> {
  await delay(300);
  return PRODUCTS.filter(
    (p) => p.price >= minPrice && p.price <= maxPrice
  );
}
```

3. **Use it in a new component**. Create `src/components/PriceRangeFilter.tsx`:

```typescript
import { getProductsByPrice } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { AddToCartButton } from "./AddToCartButton";

export async function PriceRangeFilter({
  minPrice = 0,
  maxPrice = 500,
}: {
  minPrice?: number;
  maxPrice?: number;
}) {
  const products = await getProductsByPrice(minPrice, maxPrice);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">
        Products: ${minPrice} - ${maxPrice}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}>
            <AddToCartButton productId={product.id} />
          </ProductCard>
        ))}
      </div>
    </div>
  );
}
```

4. **Add to home page** (`src/app/page.tsx`), inside the CategoryBrowser section:

```typescript
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget-Friendly</h2>
  <Suspense fallback={<div>Loading...</div>}>
    <PriceRangeFilter minPrice={0} maxPrice={100} />
  </Suspense>
</section>
```

**Learning Points:**
- RSC functions can be called from other RSCs
- Suspense allows each section to load independently
- Server-side filtering is more efficient than client-side

---

## Exercise 2: Create a New Server Action

### Objective
Create a Server Action that "favorites" a product and learn mutation patterns.

### Steps

1. **Open** `src/lib/actions.ts`

2. **Add this Server Action** at the end:

```typescript
// Keep track of favorites (in-memory for this demo)
const favorites = new Set<string>();

/**
 * SERVER ACTION - Toggle Favorite
 * Demonstrates toggling state on server
 */
export async function toggleFavorite(productId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (favorites.has(productId)) {
    favorites.delete(productId);
    return { favorited: false, message: "Removed from favorites" };
  } else {
    favorites.add(productId);
    return { favorited: true, message: "Added to favorites" };
  }
}

/**
 * Get favorite status
 */
export function isFavorited(productId: string): boolean {
  return favorites.has(productId);
}
```

3. **Create a FavoriteButton component** (`src/components/FavoriteButton.tsx`):

```typescript
"use client";

import { useState } from "react";
import { toggleFavorite } from "@/lib/actions";

export function FavoriteButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [message, setMessage] = useState("");

  async function handleToggleFavorite() {
    setLoading(true);
    
    try {
      const result = await toggleFavorite(productId);
      setFavorited(result.favorited);
      setMessage(result.message);
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleToggleFavorite}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
          favorited
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
        } disabled:opacity-50`}
      >
        {loading ? "..." : favorited ? "❤️ Favorited" : "🤍 Favorite"}
      </button>
      {message && <p className="text-sm text-center mt-2">{message}</p>}
    </div>
  );
}
```

4. **Update ProductCard** (`src/components/ProductCard.tsx`) to show both buttons:

Replace the children section with:

```typescript
<div className="space-y-2">
  {children}
  <FavoriteButton productId={product.id} />
</div>
```

And import at the top:
```typescript
import { FavoriteButton } from "./FavoriteButton";
```

**Learning Points:**
- Server Actions can maintain state (in real app: database)
- Client Components manage UI state (loading, message)
- Server and client state can work together

---

## Exercise 3: UI Diffs - Build a Product Filter

### Objective
Create a client-side filter showing UI diffs in real-time.

### Steps

1. **Create** `src/components/ProductFilter.tsx`:

```typescript
"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { AddToCartButton } from "./AddToCartButton";

export function ProductFilter({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Calculate filtered products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (p.rating < minRating) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });
  }, [products, selectedCategory, minRating, inStockOnly]);

  // Get unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-bold mb-4">Filters</h3>

        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={selectedCategory || ""}
            onChange={(e) =>
              setSelectedCategory(e.target.value || null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Minimum Rating: {minRating.toFixed(1)}★
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Stock Filter */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="inStock" className="ml-2 text-sm font-medium">
            In Stock Only
          </label>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Showing {filtered.length} of {products.length} products
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product}>
                <AddToCartButton productId={product.id} />
              </ProductCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No products match your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

2. **Modify** `src/components/CategoryBrowser.tsx` to use the filter:

At the end, after CategorySection, add:

```typescript
import { getAllProducts } from "@/lib/products";
import { ProductFilter } from "./ProductFilter";

// Add this at the bottom of the file
export async function FilteredProductBrowser() {
  const products = await getAllProducts();
  return <ProductFilter products={products} />;
}
```

3. **Add to home page** (`src/app/page.tsx`):

```typescript
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Filter</h2>
  <Suspense fallback={<div>Loading products...</div>}>
    <FilteredProductBrowser />
  </Suspense>
</section>
```

**Learning Points:**
- `useMemo` prevents unnecessary filtering calculations
- State changes trigger UI re-renders (diffs)
- Conditional rendering shows/hides UI elements
- Multiple filters work together seamlessly

---

## Exercise 4: Form with Server Action

### Objective
Learn how Server Actions work with HTML forms.

### Steps

1. **Create** `src/components/ContactForm.tsx`:

```typescript
"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      // Call Server Action
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setSubmitted(true);
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Your email"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded"
      />
      <textarea
        name="message"
        placeholder="Your message"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>
      {submitted && (
        <p className="text-green-600">Thanks for contacting us!</p>
      )}
    </form>
  );
}
```

2. **Add Server Action** in `src/lib/actions.ts`:

```typescript
export async function handleContactSubmit(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // Validate
  if (!name || !email || !message) {
    throw new Error("All fields are required");
  }

  // Simulate email sending
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Contact received:", { name, email, message });

  return { success: true };
}
```

**Learning Points:**
- Forms can use Server Actions as the `action` prop
- FormData is automatically serialized
- No need for API routes or fetch calls

---

## Exercise 5: Performance Investigation

### Objective
Understand how RSCs affect performance and bundle size.

### Steps

1. **Build the project**:
```bash
npm run build
```

2. **Look at the build output**. Notice:
   - Which components are Server Components (no JS in bundle)
   - Which are Client Components (included in bundle)

3. **Open DevTools** (F12) → Network tab → Filter for documents

4. **Observe**:
   - HTML size (includes server-rendered content)
   - JS file sizes
   - Which components need JavaScript

5. **Create a comparison**. Modify `src/components/CategoryBrowser.tsx`:
   - Comment out one category section
   - Build again
   - Compare bundle size difference

**Learning Points:**
- Less Client Components = smaller bundle
- RSCs send only HTML (serialized data)
- Fewer JavaScript requests = faster page loads

---

## Challenge Exercise: Build a Wishlist Feature

### Objective
Combine all concepts to build a complete feature.

### Requirements

1. ✅ Server Action to add/remove from wishlist
2. ✅ Client Component to display wishlist button
3. ✅ RSC to fetch wishlist items
4. ✅ UI that updates when wishlist changes
5. ✅ Show count of wishlist items in header

### Tips

- Use a Set or array to store wishlist IDs
- Create a Server Action: `toggleWishlist(productId)`
- Create a Client Component: `WishlistButton`
- Display wishlist count in the header

---

## Solutions

Solutions for these exercises are available by:
1. Creating the files as described
2. Testing in the browser
3. Checking the console for any errors
4. Experimenting further

Remember: **The best learning comes from doing, not reading!**

---

## Debugging Tips

### Issue: "use server" not working
- Make sure the file imports are correct
- Check that the function is `export`ed
- Verify the `"use server"` directive is at the top

### Issue: State not updating
- Check that you're calling `setState`
- Verify the component has `"use client"`
- Open DevTools to see errors

### Issue: Data not showing
- Check Network tab to see API calls
- Open Server logs (terminal running `npm run dev`)
- Add `console.log()` to debug

---

**Happy Learning!** 🚀
