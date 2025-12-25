import { supabase } from './supabase';

// ==================== PRODUCTS ====================

/**
 * Get all active products
 */
export async function getProducts(filters?: {
  categoryId?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}) {
  let query = supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true);

  if (filters) {
    if (filters.categoryId) query = query.eq('category_id', filters.categoryId);
    if (filters.isNew) query = query.eq('is_new', true);
    if (filters.isBestseller) query = query.eq('is_bestseller', true);
    if (filters.isFeatured) query = query.eq('is_featured', true);
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get a single product by ID or slug
 */
export async function getProduct(idOrSlug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new product (admin only)
 */
export async function createProduct(product: any) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a product (admin only)
 */
export async function updateProduct(id: string, updates: any) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a product (admin only)
 */
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== CATEGORIES ====================

/**
 * Get all categories
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

// ==================== ORDERS ====================

/**
 * Create a new order
 */
export async function createOrder(orderData: {
  userId: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingAddress: any;
  billingAddress: any;
  items: Array<{
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
  }>;
}) {
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.userId,
      subtotal: orderData.subtotal,
      shipping_cost: orderData.shippingCost,
      tax: orderData.tax,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      shipping_address: orderData.shippingAddress,
      billing_address: orderData.billingAddress,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    product_image: item.productImage,
    quantity: item.quantity,
    price: item.price,
    color: item.color,
    size: item.size,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          images
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          images
        )
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
}

// ==================== WISHLIST ====================

/**
 * Get user's wishlist
 */
export async function getWishlist(userId: string) {
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      products (
        *,
        categories (
          name,
          slug
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(userId: string, productId: string) {
  const { data, error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(userId: string, productId: string) {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}

// ==================== CART ====================

/**
 * Get user's cart
 */
export async function getCart(userId: string) {
  const { data, error } = await supabase
    .from('cart')
    .select(`
      *,
      products (
        *,
        categories (
          name,
          slug
        )
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

/**
 * Add item to cart
 */
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  selectedColor: string,
  selectedSize: string
) {
  const { data, error } = await supabase
    .from('cart')
    .upsert({
      user_id: userId,
      product_id: productId,
      quantity,
      selected_color: selectedColor,
      selected_size: selectedSize,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(cartItemId: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId: string) {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartItemId);

  if (error) throw error;
}

/**
 * Clear user's cart
 */
export async function clearCart(userId: string) {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

// ==================== LOOKBOOK ====================

/**
 * Get all active lookbook items
 */
export async function getLookbookItems() {
  const { data, error } = await supabase
    .from('lookbook_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create lookbook item (admin only)
 */
export async function createLookbookItem(item: any) {
  const { data, error } = await supabase
    .from('lookbook_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update lookbook item (admin only)
 */
export async function updateLookbookItem(id: string, updates: any) {
  const { data, error } = await supabase
    .from('lookbook_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete lookbook item (admin only)
 */
export async function deleteLookbookItem(id: string) {
  const { error } = await supabase
    .from('lookbook_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== STYLED LOOKS ====================

/**
 * Get all active styled looks
 */
export async function getStyledLooks() {
  const { data, error } = await supabase
    .from('styled_looks')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ==================== NEWSLETTER ====================

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(email: string) {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .insert({ email })
    .select()
    .single();

  if (error) {
    // Check if already subscribed
    if (error.code === '23505') {
      throw new Error('This email is already subscribed');
    }
    throw error;
  }
  return data;
}

// ==================== CONTACT ====================

/**
 * Submit contact message
 */
export async function submitContactMessage(data: {
  name: string;
  email: string;
  message: string;
  userId?: string;
}) {
  const { data: result, error } = await supabase
    .from('contact_messages')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

// ==================== REVIEWS ====================

/**
 * Get product reviews
 */
export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create product review
 */
export async function createReview(review: {
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  content?: string;
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: review.userId,
      product_id: review.productId,
      rating: review.rating,
      title: review.title,
      content: review.content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ==================== ANALYTICS ====================

/**
 * Track product view
 */
export async function trackProductView(productId: string, userId?: string, sessionId?: string) {
  const { error } = await supabase
    .from('product_views')
    .insert({
      product_id: productId,
      user_id: userId,
      session_id: sessionId,
    });

  if (error) console.error('Error tracking product view:', error);
}
