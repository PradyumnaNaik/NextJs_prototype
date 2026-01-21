import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { OrderCheckout } from "@/components/OrderCheckout";

/**
 * HOME PAGE - React Server Component (RSC) with Streaming
 * 
 * Key Learning Points:
 * 1. ROOT RSC: This page is a Server Component by default
 * 2. STREAMING: Suspense allows sections to load independently
 * 3. COMPOSITION: Mix of RSCs and Client Components working together
 * 4. NO WATERFALL: Different sections can fetch data in parallel
 * 
 * Architecture:
 * - CategoryBrowser: RSC that fetches products server-side
 * - SearchBar: Client Component with Server Actions
 * - OrderCheckout: Client Component with Server Action integration
 */
export default function Home() {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Welcome to EduShop
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn Next.js 15+ architecture patterns through an interactive e-commerce experience
          </p>

          {/* Learning Guide */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🖥️</div>
              <h3 className="font-bold text-gray-900 mb-2">React Server Components</h3>
              <p className="text-sm text-gray-700">
                Browse categories - data fetched on the server, sent as HTML
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">Server Actions</h3>
              <p className="text-sm text-gray-700">
                Search products and add to cart - mutations on the server
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-bold text-gray-900 mb-2">UI Diffs</h3>
              <p className="text-sm text-gray-700">
                Interactive updates show how state changes render UI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section - Client Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Products</h2>
          <SearchBar />
        </div>
      </section>

      {/* Categories Section - RSC with Streaming */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        
        {/* 
          Suspense enables streaming: The CategoryBrowser will load and stream its content
          separately, allowing faster page interactivity
        */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          }
        >
          <CategoryBrowser />
        </Suspense>
      </section>

      {/* Checkout Section - Client Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>
            <OrderCheckout />
          </div>

          {/* Implementation Guide */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Learn from Code</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>1. Check src/lib/products.ts</strong><br />
                React Server Component functions for data fetching
              </p>
              <p>
                <strong>2. Check src/lib/actions.ts</strong><br />
                "use server" Server Actions for mutations
              </p>
              <p>
                <strong>3. Check src/components/CategoryBrowser.tsx</strong><br />
                RSC that renders HTML on server
              </p>
              <p>
                <strong>4. Check src/components/SearchBar.tsx</strong><br />
                Client Component that calls Server Actions
              </p>
              <p>
                <strong>5. Check src/components/AddToCartButton.tsx</strong><br />
                Client Component with useState & Server Action integration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Explanation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-indigo-50 rounded-lg p-8 border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🏗️ Architecture Explanation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">React Server Components (RSC)</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Run exclusively on the server</li>
              <li>✓ Have direct database access</li>
              <li>✓ Keep secrets safe (API keys, tokens)</li>
              <li>✓ Send only HTML to the browser</li>
              <li>✓ Zero JavaScript for data fetching</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Server Actions</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Defined with "use server" directive</li>
              <li>✓ Can be called from Client Components</li>
              <li>✓ Execute mutations on the server</li>
              <li>✓ No API endpoints needed</li>
              <li>✓ Automatic serialization (works with forms)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">UI Diffs & Streaming</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Suspense enables streaming</li>
              <li>✓ Components load independently</li>
              <li>✓ User sees content progressively</li>
              <li>✓ No waiting for slowest data</li>
              <li>✓ Better perceived performance</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Client Components</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Use "use client" directive</li>
              <li>✓ Can use React hooks (useState, etc)</li>
              <li>✓ Handle interactivity & forms</li>
              <li>✓ Can call Server Actions directly</li>
              <li>✓ Sent as JavaScript to browser</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
