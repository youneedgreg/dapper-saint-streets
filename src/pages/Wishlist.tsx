import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';




































































































































































































































































































































































































































































































































































































- [Storage](https://supabase.com/docs/guides/storage)- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)- [Supabase Auth](https://supabase.com/docs/guides/auth)- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)## Resources---10. **Batch operations** when possible to reduce round trips9. **Use indexes** for frequently queried columns8. **Monitor query performance** in Supabase dashboard7. **Test RLS policies** thoroughly6. **Use TypeScript types** for type safety5. **Validate input** before sending to database4. **Handle errors gracefully** with user-friendly messages3. **Cache results** when appropriate2. **Use optimistic updates** for better UX1. **Always authenticate before database operations** that require user context## Best Practices---```subscription.unsubscribe();// Unsubscribe when done  .subscribe();  )    }      console.log('Change received!', payload);    (payload) => {    { event: '*', schema: 'public', table: 'products' },  .on('postgres_changes',   .channel('products')const subscription = supabase// Subscribe to product changesimport { supabase } from '@/lib/supabase';```typescriptSubscribe to database changes:## Real-time Subscriptions---```const otherUserCart = await getCartItems('other-user-id');// This will fail if trying to access another user's data```typescriptTo test RLS:6. **Lookbooks**: Public read, admin write5. **Users**: Users can read/update their own profile, admins can read all4. **Orders**: Users can only access their own orders3. **Wishlist**: Users can only access their own wishlists2. **Cart**: Users can only access their own carts1. **Products**: Public read, admin writeAll tables have RLS enabled. Policies ensure:## Row Level Security (RLS)---```}  updated_at?: string;  created_at?: string;  featured?: boolean;  year?: number;  season?: string;  image_url: string;  description?: string;  title: string;  id: string;interface Lookbook {```typescript### Lookbook```}  updated_at?: string;  created_at?: string;  shipping_address: any;  total: number;  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';  user_id: string;  id: string;interface Order {```typescript### Order```}  product?: Product;  created_at?: string;  color?: string;  size?: string;  quantity: number;  product_id: string;  user_id: string;  id: string;interface CartItem {```typescript### CartItem```}  updated_at?: string;  created_at?: string;  featured?: boolean;  stock?: number;  colors?: string[];  sizes?: string[];  images: string[];  category: string;  price: number;  description: string;  name: string;  id: string;interface Product {```typescript### Product## TypeScript Types---- `23503` - Foreign key violation- `42501` - Insufficient privileges- `23505` - Unique constraint violation- `PGRST116` - Row not foundCommon error scenarios:```}  // Handle error appropriately  console.error('Error:', error.message);} catch (error: any) {  const products = await getProducts();try {```typescriptAll database functions can throw errors. Always wrap them in try-catch blocks:## Error Handling---```WHERE id = 'user-id';SET role = 'admin'UPDATE users-- Run in Supabase SQL Editor```sql### Update User Role (Admin only)```// Returns booleanconst admin = await isAdmin();import { isAdmin } from '@/lib/auth';```typescript### Check if User is Admin```  .eq('id', userId);  })    address: 'Nairobi, Kenya'    phone: '+254712345678',    last_name: 'Doe',    first_name: 'John',  .update({  .from('users')const { error } = await supabaseimport { supabase } from '@/lib/supabase';```typescript### Update User Profile```  .single();  .eq('id', userId)  .select('*')  .from('users')const { data, error } = await supabaseimport { supabase } from '@/lib/supabase';```typescript### Get User Profile## User Profile---- `user-avatars` - User profile pictures- `lookbook-images` - Lookbook photos- `product-images` - Product photos**Storage Buckets:**```await deleteImage('product-images', 'products/image-name.jpg');import { deleteImage } from '@/lib/database';```typescript### Delete Image```const avatarUrl = await uploadUserAvatar(file, 'user-id');const file = event.target.files[0];import { uploadUserAvatar } from '@/lib/database';```typescript### Upload User Avatar```const imageUrl = await uploadLookbookImage(file, 'lookbook-id');const file = event.target.files[0];import { uploadLookbookImage } from '@/lib/database';```typescript### Upload Lookbook Image```const imageUrl = await uploadProductImage(file, 'product-id');const file = event.target.files[0];import { uploadProductImage } from '@/lib/database';```typescript### Upload Product Image## Storage---```await removeLookbookItem('lookbook-item-id');import { removeLookbookItem } from '@/lib/database';```typescript### Remove Product from Lookbook```await addLookbookItem('lookbook-id', 'product-id', 1);import { addLookbookItem } from '@/lib/database';```typescript### Add Product to Lookbook```await deleteLookbook('lookbook-id');import { deleteLookbook } from '@/lib/database';```typescript### Delete Lookbook (Admin)```});  featured: falseawait updateLookbook('lookbook-id', {import { updateLookbook } from '@/lib/database';```typescript### Update Lookbook (Admin)```});  featured: true  year: 2024,  season: 'Summer',  image_url: 'https://example.com/lookbook.jpg',  description: 'Fresh styles for summer',  title: 'Summer 2024 Collection',const lookbook = await createLookbook({import { createLookbook } from '@/lib/database';```typescript### Create Lookbook (Admin)```// Returns lookbook with associated productsconst lookbook = await getLookbookById('lookbook-id');import { getLookbookById } from '@/lib/database';```typescript### Get Single Lookbook```const lookbooks = await getLookbooks(true);// Get only featuredconst lookbooks = await getLookbooks();// Get all lookbooksimport { getLookbooks } from '@/lib/database';```typescript### Get All Lookbooks## Lookbooks---- `cancelled` - Order cancelled- `delivered` - Order delivered- `shipped` - Order shipped- `processing` - Order being prepared- `pending` - Order placed, awaiting processing**Status options:**```await updateOrderStatus('order-id', 'shipped');import { updateOrderStatus } from '@/lib/database';```typescript### Update Order Status```const order = await getOrderById('order-id');import { getOrderById } from '@/lib/database';```typescript### Get Single Order```// Returns orders with order items and product detailsconst orders = await getOrders('user-id');import { getOrders } from '@/lib/database';```typescript### Get User Orders```);  ]    }      color: 'Black'      size: 'M',      price: 49.99,      quantity: 2,      product_id: 'product-id',    {  [  },    }      postal_code: '00100'      country: 'Kenya',      city: 'Nairobi',      street: '123 Main St',      name: 'John Doe',    shipping_address: {    total: 99.99,    status: 'pending',    user_id: 'user-id',  {const order = await createOrder(import { createOrder } from '@/lib/database';```typescript### Create Order## Orders---```await removeFromWishlist('wishlist-item-id');import { removeFromWishlist } from '@/lib/database';```typescript### Remove from Wishlist```await addToWishlist('user-id', 'product-id');import { addToWishlist } from '@/lib/database';```typescript### Add to Wishlist```// Returns array of wishlist items with product detailsconst wishlistItems = await getWishlistItems('user-id');import { getWishlistItems } from '@/lib/database';```typescript### Get Wishlist Items## Wishlist---```await clearCart('user-id');import { clearCart } from '@/lib/database';```typescript### Clear Cart```await removeFromCart('cart-item-id');import { removeFromCart } from '@/lib/database';```typescript### Remove from Cart```await updateCartItem('cart-item-id', 3);import { updateCartItem } from '@/lib/database';```typescript### Update Cart Item```// Automatically updates quantity if item already exists});  color: 'Black'  size: 'M',  quantity: 1,  product_id: 'product-id',  user_id: 'user-id',await addToCart({import { addToCart } from '@/lib/database';```typescript### Add to Cart```// Returns array of cart items with product detailsconst cartItems = await getCartItems('user-id');import { getCartItems } from '@/lib/database';```typescript### Get Cart Items## Cart---```await deleteProduct('product-id');import { deleteProduct } from '@/lib/database';```typescript### Delete Product (Admin)```});  stock: 150  price: 24.99,const product = await updateProduct('product-id', {import { updateProduct } from '@/lib/database';```typescript### Update Product (Admin)```});  featured: true  stock: 100,  colors: ['Black', 'White'],  sizes: ['S', 'M', 'L', 'XL'],  images: ['https://example.com/image.jpg'],  category: 'Shirts',  price: 29.99,  description: 'Premium cotton t-shirt',  name: 'Classic T-Shirt',const product = await createProduct({import { createProduct } from '@/lib/database';```typescript### Create Product (Admin)```const product = await getProductById('product-id');import { getProductById } from '@/lib/database';```typescript### Get Single Product- `limit?: number` - Limit number of results- `featured?: boolean` - Get only featured products- `category?: string` - Filter by category**Filters:**```});  limit: 10  featured: true,  category: 'Shirts',const products = await getProducts({// Get with filtersconst products = await getProducts();// Get all productsimport { getProducts } from '@/lib/database';```typescript### Get All Products## Products---```const { user, loading, signIn, signUp, signOut } = useAuth();import { useAuth } from '@/contexts/AuthContext';```typescript### Auth Context Hook```const { data: { user } } = await supabase.auth.getUser();import { supabase } from '@/lib/supabase';```typescript### Get Current User```await updatePassword('newPassword123');import { updatePassword } from '@/lib/auth';```typescript### Update Password```await resetPassword('user@example.com');import { resetPassword } from '@/lib/auth';```typescript### Reset Password```await signOut();import { signOut } from '@/lib/auth';```typescript### Sign Out```);  'password123'  'user@example.com',const { user, session, error } = await signIn(import { signIn } from '@/lib/auth';```typescript### Sign In```);  }    lastName: 'Doe'    firstName: 'John',  {  'password123',  'user@example.com',const { user, session, error } = await signUp(import { signUp } from '@/lib/auth';```typescript### Sign Up## Authentication---- [User Profile](#user-profile)- [Storage](#storage)- [Lookbooks](#lookbooks)- [Orders](#orders)- [Wishlist](#wishlist)- [Cart](#cart)- [Products](#products)- [Authentication](#authentication)## Table of ContentsThis document provides a complete reference for all Supabase database functions and authentication methods used in the Dapper Saint Streets application.import { Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/currency';
import { getWishlistItems, removeFromWishlist as removeFromWishlistDB } from '@/lib/database';

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { items: localItems, removeFromWishlist: removeLocalWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      // Use local wishlist items when not logged in
      setWishlistItems(localItems);
      setIsLoading(false);
    }
  }, [user, localItems]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      const data = await getWishlistItems(user.id);
      setWishlistItems(data.map(item => item.product));
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (user) {
      try {
        await removeFromWishlistDB(itemId);
        await loadWishlist();
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      removeLocalWishlist(itemId);
    }
  };

  const handleAddToCart = (product: any) => {
    const color = product.colors?.[0]?.name || product.color || 'Default';
    const size = product.sizes?.[0] || product.size || 'M';
    addToCart(product, color, size, 1);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const items = wishlistItems;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full mb-6">
              <Heart className="w-4 h-4 text-crimson fill-current" />
              <span className="text-sm font-medium uppercase tracking-wider">Your Wishlist</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Saved <span className="text-gradient-gold">Items</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {items.length > 0 
                ? `You have ${items.length} item${items.length > 1 ? 's' : ''} saved for later`
                : 'Your wishlist is empty'
              }
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <p className="text-muted-foreground mb-8">Start adding items to your wishlist</p>
              <Link to="/shop">
                <Button size="lg">Browse Products</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-lg overflow-hidden"
                >
                  <Link to={`/product/${product.id}`} className="block relative aspect-[3/4]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded">
                        New
                      </span>
                    )}
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 gap-2"
                        size="sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => removeFromWishlist(product.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
