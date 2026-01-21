# E-Commerce Learning App - Next.js 15+ Features

A comprehensive learning project demonstrating React Server Components, Server Actions, and UI patterns in Next.js 15+.

## 🎯 Learning Objectives

This project teaches three core Next.js concepts:

### 1. **React Server Components (RSC)** 🖥️
- **What**: Components that run exclusively on the server
- **Where**: See `src/lib/products.ts` and `src/components/CategoryBrowser.tsx`
- **Why**: 
  - Direct database access without API calls
  - Keep sensitive logic and keys on the server
  - Send only the HTML needed to the browser
  - Zero JavaScript overhead for data fetching

### 2. **Server Actions** ⚡
- **What**: Functions that run on the server, callable from client components
- **Where**: See `src/lib/actions.ts` and buttons in components
- **Why**:
  - No need to create API endpoints
  - Automatic serialization of data
  - Works seamlessly with forms
  - Type-safe communication between client and server

### 3. **UI Diffs & Streaming** 🎨
- **What**: Progressive rendering and state-based UI updates
- **Where**: See `src/components/SearchBar.tsx` and `src/components/OrderCheckout.tsx`
- **Why**:
  - Suspense enables streaming of content
  - Components load independently
  - Better perceived performance
  - User sees content progressively, not all at once

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Server Component)
│   ├── page.tsx            # Home page (RSC + Client Components)
│   └── globals.css         # Tailwind CSS styles
├── components/
│   ├── ProductCard.tsx     # Product display component
│   ├── AddToCartButton.tsx # Client Component with Server Action
│   ├── SearchBar.tsx       # Search with real-time results
│   ├── CategoryBrowser.tsx # RSC that fetches products
│   └── OrderCheckout.tsx   # Order placement flow
├── lib/
│   ├── products.ts         # RSC functions for data fetching
│   └── actions.ts          # Server Actions with "use server"
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm, yarn, or pnpm

### Installation

```bash
# Navigate to project directory
cd c:\Projects\NextJs_prototype

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 📚 Code Examples by Feature

### Example 1: React Server Components
**File**: `src/lib/products.ts`
```typescript
// This function runs on the SERVER ONLY
export async function getAllProducts(): Promise<Product[]> {
  await delay(500); // Simulate DB query
  return PRODUCTS;
}
```

**Usage in RSC** (`src/components/CategoryBrowser.tsx`):
```typescript
// RSC component - no "use client" needed
export async function CategoryBrowser() {
  const categories = await getCategories(); // Runs on server
  return <div>{/* render categories */}</div>;
}
```

### Example 2: Server Actions
**File**: `src/lib/actions.ts`
```typescript
"use server"; // Declares this file contains Server Actions

export async function addToCart(productId: string, quantity: number) {
  // This runs on the server when called from client
  const product = await getProductById(productId);
  return { success: true, product, quantity };
}
```

**Usage from Client Component** (`src/components/AddToCartButton.tsx`):
```typescript
"use client"; // Client Component

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const result = await addToCart(productId, 1); // Direct call!
    // Server Action executes on server, result comes back to client
  }

  return <button onClick={handleClick}>Add to Cart</button>;
}
```

### Example 3: UI Diffs with State
**File**: `src/components/SearchBar.tsx`
```typescript
"use client";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);
    const results = await searchProducts(searchQuery); // Server Action
    setResults(results);
    setLoading(false);
  }

  // UI DIFFS: Different rendering based on state
  return (
    <div>
      <input onChange={handleSearch} />
      {loading && <p>Loading...</p>}
      {results.length > 0 && (
        <div>Found {results.length} products</div>
      )}
      {results.length === 0 && query && (
        <p>No products found</p>
      )}
    </div>
  );
}
```

## 🔄 Data Flow Examples

### Flow 1: RSC Data Fetching
```
User visits home page
    ↓
Home page (RSC) renders
    ↓
CategoryBrowser calls getCategories() (RSC function)
    ↓
Data fetched on SERVER (no network request from browser)
    ↓
React renders categories to HTML on server
    ↓
HTML sent to browser (no JavaScript needed)
    ↓
Browser displays categories instantly
```

### Flow 2: Server Action Mutation
```
User clicks "Add to Cart" button
    ↓
AddToCartButton (Client Component) calls addToCart()
    ↓
Server Action runs on SERVER
    ↓
Product validation happens (safely on server)
    ↓
Response sent back to client component
    ↓
Client component updates UI with result (toast/message)
```

### Flow 3: Streaming with Suspense
```
Page starts loading
    ↓
Layout loads immediately
    ↓
SearchBar appears (Client Component, interactive fast)
    ↓
CategoryBrowser shows loading skeleton (Suspense fallback)
    ↓
Categories fetch in parallel on server
    ↓
When ready, categories HTML streams to browser
    ↓
Suspense fallback replaced with actual content
```

## 🎓 Key Concepts to Understand

### Why RSCs matter:
- **Zero JavaScript**: Data fetching logic doesn't ship to browser
- **Database Security**: Query logic never exposed to client
- **Smaller Bundles**: Less code the browser needs to download
- **Always Fresh**: Each page request gets latest data from server

### Why Server Actions matter:
- **Simplified API**: No need to create `/api/` endpoints
- **Type Safety**: Full TypeScript support end-to-end
- **Progressive Enhancement**: Works with HTML forms
- **Automatic Serialization**: Complex data structures work automatically

### Why UI Diffs matter:
- **Responsive UI**: Updates happen instantly on client
- **Better UX**: Loading states, errors, and success messages
- **Efficient**: Only changed parts re-render
- **Streaming**: Content arrives progressively, not all at once

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (watch mode)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other platforms
- Docker
- Traditional Node.js hosting
- Serverless functions

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/use-server)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-mutation/server-actions)
- [Vercel Blog - Streaming](https://vercel.com/blog/streaming-ssr-with-suspense)

## 🎯 Next Steps for Learning

1. **Modify CategoryBrowser**: Try adding filters or sorting
2. **Create a new Server Action**: Add a "wishlist" feature
3. **Add a form**: Use Server Actions with `<form>` action
4. **Implement caching**: Use `unstable_cache` from Next.js
5. **Add revalidation**: Use `revalidatePath()` to update UI after mutations

## 💡 Common Patterns

### Accessing query parameters in RSC
```typescript
export default async function Page({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const products = await getProductsByCategory(searchParams.category);
  return <div>{/* render products */}</div>;
}
```

### Using Server Actions with forms
```typescript
export default function MyForm() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const name = formData.get("name");
    // Process data
  }

  return (
    <form action={handleSubmit}>
      <input name="name" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Revalidating data after mutation
```typescript
"use server";

export async function updateProduct(id: string) {
  // Update database
  revalidatePath("/products");
  revalidateTag("products");
}
```

## 📝 Notes

- This is a learning project with mock data
- In production, replace `PRODUCTS` array with real database calls
- Add proper error handling, validation, and authentication
- Implement proper caching strategies
- Add security measures (CSRF tokens, rate limiting, etc.)

## 🤝 Contributing

Feel free to modify and experiment with this project to deepen your understanding!

## 📄 License

Educational use - feel free to modify and learn!

---

**Happy Learning!** 🚀 Remember: The best way to learn is by doing. Modify the code, break things, and see what happens!
