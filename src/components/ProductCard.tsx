import { Product } from "@/types";

/**
 * ProductCard - Client Component
 * This is a CLIENT COMPONENT (no "use client" because it's used by server components)
 * Displays individual product information
 * Interactive elements like buttons are passed as children
 */
export function ProductCard({
  product,
  children,
}: {
  product: Product;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-center">
        <div className="text-5xl mb-2">{product.image}</div>
        <p className="text-xs text-gray-500">{product.category}</p>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xl font-bold text-indigo-600">${product.price}</p>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-medium ml-1">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div
            className={`flex-1 h-2 rounded-full ${
              product.inStock ? "bg-green-400" : "bg-gray-300"
            }`}
          />
          <span className="text-xs font-semibold text-gray-600">
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
