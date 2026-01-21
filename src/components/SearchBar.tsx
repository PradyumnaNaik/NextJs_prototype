"use client";

import { useState } from "react";
import { searchProducts } from "@/lib/actions";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { AddToCartButton } from "./AddToCartButton";

/**
 * SearchBar - Client Component
 * Demonstrates CLIENT COMPONENT with dynamic Server Action calls
 * 
 * Key Learning Points:
 * - Real-time search using Server Actions
 * - UI Diffs: Results update as user types
 * - Loading states and error handling
 * - Seamless client-server integration
 */
export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.trim() === "") {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const searchResults = await searchProducts(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products... (e.g., 'headphones', 'watch')"
          value={query}
          onChange={handleSearch}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin text-indigo-600">⟳</div>
          </div>
        )}
      </div>

      {/* UI Diff: Conditional rendering of search results */}
      {searched && (
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="inline-block animate-spin text-2xl mb-2">⟳</div>
              <p>Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-4">
                Found {results.length} product{results.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product}>
                    <AddToCartButton productId={product.id} />
                  </ProductCard>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No products found for "{query}"</p>
              <p className="text-sm text-gray-400 mt-2">
                Try searching for "headphones", "watch", or "speaker"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
