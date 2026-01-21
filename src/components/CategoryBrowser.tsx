import { getCategories, getProductsByCategory } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { AddToCartButton } from "./AddToCartButton";

/**
 * CategoryBrowser - React Server Component (RSC)
 * This is a SERVER COMPONENT (default for .tsx files)
 * 
 * Key Learning Points:
 * - Directly fetches data on the server (no API calls needed)
 * - Markdown: The fetched data is automatically "serialized" and sent to client
 * - Security: Database queries never exposed to client
 * - Performance: Rendering happens on server, sending only HTML to browser
 */
export async function CategoryBrowser() {
  // This runs on the SERVER ONLY
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <CategorySection key={category} categoryName={category} />
      ))}
    </div>
  );
}

/**
 * CategorySection - Nested React Server Component
 * Demonstrates composition of RSCs
 * Each section is a separate RSC for better code organization
 */
async function CategorySection({ categoryName }: { categoryName: string }) {
  // Server-side data fetching
  const products = await getProductsByCategory(categoryName);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-lg">
          {getCategoryEmoji(categoryName)}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
        <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          {products.length} items
        </span>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product}>
              <AddToCartButton productId={product.id} />
            </ProductCard>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No products in this category
        </p>
      )}
    </section>
  );
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    Electronics: "🔌",
    Accessories: "🎁",
    Clothing: "👕",
    Books: "📚",
  };
  return emojiMap[category] || "📦";
}
