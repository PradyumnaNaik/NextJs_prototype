"use client";

import { useState } from "react";
import { placeOrder } from "@/lib/actions";

/**
 * OrderCheckout - Client Component
 * Demonstrates a complex Server Action workflow
 * Shows order processing with error handling and state management
 */
export function OrderCheckout() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  // Simulated cart data
  const cartItems = [
    { productId: "1", quantity: 1 },
    { productId: "3", quantity: 2 },
  ];

  async function handlePlaceOrder() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const productIds = cartItems.map((item) => item.productId);
      const quantities = cartItems.map((item) => item.quantity);

      const orderResult = await placeOrder(productIds, quantities);
      setResult(orderResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h3 className="text-xl font-bold">Order Summary</h3>
      </div>

      <div className="p-6 space-y-4">
        {/* UI Diff: Conditional order display */}
        {result ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">✓ {result.message}</p>
              <p className="text-sm text-green-600 mt-1">Order ID: {result.orderId}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-900">Order Details:</h4>
              {result.items.map(
                (item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </div>
                )
              )}
              <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-indigo-600">${result.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Items in cart: {cartItems.length}</p>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-semibold">✗ Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Processing Order..." : "Place Order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
