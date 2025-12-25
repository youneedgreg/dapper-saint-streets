# Supabase Quick Reference

Quick commands and snippets for working with Supabase in the Dapper Saint Streets application.

## Setup

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Add your Supabase credentials to .env
# Get them from: https://app.supabase.com/project/_/settings/api

# 3. Install dependencies
bun install

# 4. Run database migrations
# In Supabase dashboard: SQL Editor → Run supabase/schema.sql
```

## Authentication

### Sign Up
```typescript
const { signUp } = useAuth();
await signUp('email@example.com', 'password', { 
  firstName: 'John', 
  lastName: 'Doe' 
});
```

### Sign In
```typescript
const { signIn } = useAuth();
await signIn('email@example.com', 'password');
```

### Sign Out
```typescript
const { signOut } = useAuth();
await signOut();
```

### Check Auth State
```typescript
const { user, loading } = useAuth();

if (loading) return <Spinner />;
if (!user) return <Navigate to="/login" />;
```

### Protected Routes
```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/profile" element={<Profile />} />
  <Route path="/orders" element={<OrderHistory />} />
</Route>
```

## Products

```typescript
// Get all products
const products = await getProducts();

// Get featured products
const featured = await getProducts({ featured: true, limit: 6 });

// Get by category
const shirts = await getProducts({ category: 'Shirts' });

// Get single product
const product = await getProductById(id);
```

## Cart

```typescript
// Get cart items
const items = await getCartItems(user.id);

// Add to cart
await addToCart({
  user_id: user.id,
  product_id: productId,
  quantity: 1,
  size: 'M',
  color: 'Black'
});

// Update quantity
await updateCartItem(cartItemId, newQuantity);

// Remove item
await removeFromCart(cartItemId);

// Clear cart
await clearCart(user.id);
```

## Wishlist

```typescript
// Get wishlist
const items = await getWishlistItems(user.id);

// Add to wishlist
await addToWishlist(user.id, productId);

// Remove from wishlist
await removeFromWishlist(wishlistItemId);
```

## Orders

```typescript
// Create order
const order = await createOrder(
  {
    user_id: user.id,
    status: 'pending',
    total: 99.99,
    shipping_address: { /* address object */ }
  },
  [
    { product_id: 'id', quantity: 1, price: 99.99 }
  ]
);

// Get user orders
const orders = await getOrders(user.id);

// Update order status
await updateOrderStatus(orderId, 'shipped');
```

## Admin

### Check Admin Access
```typescript
const { user } = useAuth();
const admin = await isAdmin();

if (!admin) {
  return <Navigate to="/" />;
}
```

### Make User Admin (SQL)
```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### Admin Operations
```typescript
// Create product
await createProduct({
  name: 'Product Name',
  description: 'Description',
  price: 99.99,
  category: 'Category',
  images: ['url'],
  featured: true
});

// Update product
await updateProduct(id, { price: 89.99 });

// Delete product
await deleteProduct(id);
```

## File Uploads

```typescript
// Product image
const url = await uploadProductImage(file, productId);

// Lookbook image
const url = await uploadLookbookImage(file, lookbookId);

// User avatar
const url = await uploadUserAvatar(file, userId);
```

## Common Patterns

### Loading State
```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData();
}, []);

async function loadData() {
  try {
    const data = await getProducts();
    setProducts(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

if (loading) return <Spinner />;
```

### Error Handling
```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

try {
  await createProduct(data);
  toast({
    title: 'Success',
    description: 'Product created',
  });
} catch (error: any) {
  toast({
    variant: 'destructive',
    title: 'Error',
    description: error.message,
  });
}
```

### Real-time Updates
```typescript
useEffect(() => {
  const channel = supabase
    .channel('products')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        console.log('Change:', payload);
        loadProducts(); // Refresh data
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}, []);
```

## Debugging

### Check RLS Policies
```sql
-- See all policies
SELECT * FROM pg_policies;

-- Test as specific user
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO 'user-id';
SELECT * FROM products;
```

### View Logs
- Supabase Dashboard → Logs
- Filter by: Database, Auth, Storage
- Check for RLS violations

### Common Issues

**Can't access data:**
```typescript
// Check auth state
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Check RLS policies in dashboard
```

**Upload fails:**
```typescript
// Check bucket exists and policies allow upload
const { data: buckets } = await supabase.storage.listBuckets();
console.log('Buckets:', buckets);
```

**Query fails:**
```typescript
// Log the full error
catch (error: any) {
  console.error('Full error:', error);
  console.error('Details:', error.details);
  console.error('Hint:', error.hint);
}
```

## SQL Snippets

### Seed Products
```sql
INSERT INTO products (name, description, price, category, images, featured)
VALUES 
  ('Classic T-Shirt', 'Premium cotton', 29.99, 'Shirts', ARRAY['url'], true),
  ('Slim Jeans', 'Modern fit', 79.99, 'Pants', ARRAY['url'], false);
```

### View Cart with Products
```sql
SELECT 
  ci.*,
  p.name,
  p.price,
  p.images[1] as image
FROM cart_items ci
JOIN products p ON p.id = ci.product_id
WHERE ci.user_id = 'user-id';
```

### Order Statistics
```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(total) as revenue
FROM orders
GROUP BY status;
```

### Popular Products
```sql
SELECT 
  p.name,
  COUNT(oi.id) as orders,
  SUM(oi.quantity) as units_sold
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY units_sold DESC
LIMIT 10;
```

## Testing

### Test Auth Flow
```bash
# 1. Register new user
# 2. Check email for confirmation
# 3. Login
# 4. Access protected route
# 5. Logout
```

### Test Cart Flow
```bash
# 1. Add items to cart
# 2. Update quantities
# 3. Remove items
# 4. Checkout
# 5. Verify order created
```

### Test Admin Flow
```bash
# 1. Make user admin (SQL)
# 2. Login as admin
# 3. Access /admin
# 4. Create product
# 5. Update product
# 6. Delete product
```

## Production Checklist

- [ ] Environment variables set in deployment platform
- [ ] Auth redirect URLs updated for production domain
- [ ] RLS policies tested thoroughly
- [ ] Storage buckets configured
- [ ] Database backups enabled
- [ ] Email templates customized
- [ ] Rate limiting configured
- [ ] Monitoring enabled
- [ ] SSL/HTTPS enforced
- [ ] API keys rotated

## Resources

- [Full API Docs](./SUPABASE_API.md)
- [Setup Guide](./SUPABASE_SETUP.md)
- [Integration Guide](./SUPABASE_INTEGRATION.md)
- [Supabase Docs](https://supabase.com/docs)
