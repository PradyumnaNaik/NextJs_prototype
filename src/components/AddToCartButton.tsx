"use client";

import { useState } from "react";
import { addToCart } from "@/lib/actions";

/**
 * AddToCartButton - Client Component
 * Marked with "use client" because it uses React hooks (useState)
 * Demonstrates CLIENT COMPONENT with SERVER ACTION integration
 * 
 * Key Concepts:
 * - Uses useState for local UI state
 * - Calls Server Action (addToCart) without creating an API endpoint
 * - Server Actions bridge the gap between client and server seamlessly
 */
export function AddToCartButton({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleAddToCart() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await addToCart(productId, quantity);
      setMessage(result.message);
      setQuantity(1); // Reset quantity after successful add
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          disabled={loading}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {/* UI Diff Example: Conditional rendering based on state */}
      {message && (
        <div className="p-2 bg-green-50 text-green-700 rounded text-sm border border-green-200">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-50 text-red-700 rounded text-sm border border-red-200">
          ✗ {error}
        </div>
      )}
    </div>
  );
}
