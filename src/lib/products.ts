import { Product } from "@/types";

// Mock database of products
// In a real app, this would come from a database
const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with active noise cancellation",
    price: 199.99,
    image: "🎧",
    inStock: true,
    category: "Electronics",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Advanced fitness tracking and notifications",
    price: 299.99,
    image: "⌚",
    inStock: true,
    category: "Electronics",
    rating: 4.3,
  },
  {
    id: "3",
    name: "Laptop Backpack",
    description: "Durable backpack with multiple compartments",
    price: 79.99,
    image: "🎒",
    inStock: true,
    category: "Accessories",
    rating: 4.7,
  },
  {
    id: "4",
    name: "USB-C Cable",
    description: "Fast charging USB-C cable, 2 meters",
    price: 19.99,
    image: "🔌",
    inStock: false,
    category: "Accessories",
    rating: 4.2,
  },
  {
    id: "5",
    name: "Portable Speaker",
    description: "Waterproof Bluetooth speaker with 12-hour battery",
    price: 89.99,
    image: "🔊",
    inStock: true,
    category: "Electronics",
    rating: 4.6,
  },
  {
    id: "6",
    name: "Phone Mount",
    description: "Universal car phone mount",
    price: 24.99,
    image: "📱",
    inStock: true,
    category: "Accessories",
    rating: 4.4,
  },
];

// Simulating a database delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * REACT SERVER COMPONENT (RSC) - Data Fetching
 * This function fetches products on the SERVER SIDE
 * It cannot be used in client components
 * Benefits: No JavaScript sent to browser for this logic, secure database access
 */
export async function getAllProducts(): Promise<Product[]> {
  // Simulate database query delay
  await delay(500);
  return PRODUCTS;
}

/**
 * REACT SERVER COMPONENT (RSC) - Data Fetching with Filter
 * Server-side filtering reduces data sent to client
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  await delay(300);
  return PRODUCTS.filter((p) => p.category === category);
}

/**
 * REACT SERVER COMPONENT (RSC) - Single Product Fetch
 * Fetches a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  await delay(200);
  return PRODUCTS.find((p) => p.id === id) || null;
}

/**
 * Get all unique categories
 */
export async function getCategories(): Promise<string[]> {
  await delay(100);
  const categories = [...new Set(PRODUCTS.map((p) => p.category))];
  return categories.sort();
}

/**
 * Calculate total price for cart items
 * Server-side calculation ensures accuracy
 */
export async function calculateCartTotal(productIds: string[], quantities: number[]): Promise<number> {
  await delay(200);
  let total = 0;
  productIds.forEach((id, index) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (product) {
      total += product.price * quantities[index];
    }
  });
  return total;
}
