"use server";

import { Product } from "@/types";
import { getAllProducts } from "@/lib/products";

/**
 * SERVER ACTION - Dynamic Product Search
 * This is a Server Action that runs on the server when called from a client component
 * Benefits: Direct database access, secure, reduces client bundle size
 * Usage: Can be called from form actions or directly from client components
 */
export async function searchProducts(query: string): Promise<Product[]> {
  // Simulate database search delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allProducts = await getAllProducts();
  
  const searchTerm = query.toLowerCase();
  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );
}

/**
 * SERVER ACTION - Add to Cart (simulated)
 * Demonstrates server-side business logic
 * In a real app, this would update a database
 */
export async function addToCart(productId: string, quantity: number) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const allProducts = await getAllProducts();
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.inStock) {
    throw new Error("Product is out of stock");
  }

  // In a real app, this would save to database
  return {
    success: true,
    message: `Added ${quantity} x ${product.name} to cart`,
    product,
    quantity,
  };
}

/**
 * SERVER ACTION - Place Order
 * Demonstrates complex server-side operations
 */
export async function placeOrder(
  productIds: string[],
  quantities: number[]
) {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const allProducts = await getAllProducts();
  
  let total = 0;
  const orderItems = [];

  for (let i = 0; i < productIds.length; i++) {
    const product = allProducts.find((p) => p.id === productIds[i]);
    
    if (!product) {
      throw new Error(`Product ${productIds[i]} not found`);
    }

    const itemTotal = product.price * quantities[i];
    total += itemTotal;
    
    orderItems.push({
      productId: product.id,
      name: product.name,
      quantity: quantities[i],
      price: product.price,
      subtotal: itemTotal,
    });
  }

  // Simulate order creation
  const orderId = `ORD-${Date.now()}`;

  return {
    success: true,
    orderId,
    items: orderItems,
    total: parseFloat(total.toFixed(2)),
    message: `Order ${orderId} placed successfully!`,
  };
}

/**
 * SERVER ACTION - Update Product Rating
 * Demonstrates server mutation with revalidation
 */
export async function updateProductRating(
  productId: string,
  rating: number
) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // In a real app, this would update the database
  return {
    success: true,
    message: `Product ${productId} rating updated to ${rating}`,
  };
}
