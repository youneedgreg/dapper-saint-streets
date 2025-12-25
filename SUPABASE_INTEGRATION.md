# Supabase Integration Guide

This guide explains how to set up and use the complete Supabase integration for the Dapper Sainte e-commerce platform, including authentication, database, and storage.

## Overview

The system includes:
- **Authentication** - User signup, login, password reset, and session management
- **Database Storage** - Products, orders, cart, wishlist, reviews, and more
- **Image Storage** - Supabase Storage for product and lookbook images
- **Row Level Security (RLS)** - Secure access control for all data
- **Admin Panel** - Full admin controls with role-based access

## Features

### Authentication
- Email/Password authentication
- Password reset functionality
- Protected routes (login required)
- Admin-only routes
- User profile management
- Session persistence

### Database Tables
- **profiles** - User profile data (synced with auth.users)
- **user_roles** - Role-based access control (admin, moderator, user)
- **products** - Product catalog with images, colors, sizes, pricing
- **categories** - Product categories
- **orders** - Customer orders with auto-generated order numbers
- **order_items** - Individual items in orders
- **cart** - Persistent shopping cart (per user)
- **wishlist** - User wishlist
- **addresses** - Shipping/billing addresses
- **lookbook_items** - Editorial lookbook content
- **styled_looks** - Styled product combinations
- **reviews** - Product reviews and ratings
- **newsletter_subscriptions** - Email newsletter signups
- **contact_messages** - Contact form submissions
- **notifications** - User notifications
- **coupons** - Discount codes
- **payment_transactions** - Payment tracking
- **product_views** - Analytics for product views

### Storage Buckets
- **product-images** - Product photos (public)
- **lookbook-images** - Lookbook/editorial photos (public)

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Choose a database password and region
4. Wait for the project to initialize (2-3 minutes)

### 2. Set Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. In your Supabase project dashboard:
   - Go to **Settings** → **API**
   - Copy **Project URL** → `VITE_SUPABASE_URL`
   - Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

3. Update `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the migration
5. Verify tables are created in **Database** → **Tables**

### 4. Create Storage Buckets

1. In Supabase dashboard, go to **Storage**
2. Create two new public buckets:
   - **Name:** `product-images`, **Public:** ✓
   - **Name:** `lookbook-images`, **Public:** ✓

Or run the SQL from `supabase/migrations/002_create_storage_buckets.sql`:

```sql
-- In SQL Editor
insert into storage.buckets (id, name, public)
values 
  ('product-images', 'product-images', true),
  ('lookbook-images', 'lookbook-images', true)
on conflict (id) do nothing;
```

### 5. Create Admin User

After signing up your first user through the app:

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Copy your user's UUID
3. In **SQL Editor**, run:

```sql
-- Replace 'your-user-id-here' with your actual user UUID
INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin')
ON CONFLICT DO NOTHING;
```

### 6. Configure Email Templates (Optional)

For better user experience, customize email templates:

1. Go to **Authentication** → **Email Templates**
2. Customize the following templates:
   - **Confirm signup** - Welcome email with email verification
   - **Reset password** - Password reset instructions
   - **Magic Link** - Passwordless login (if enabled)

## Usage

### Authentication

#### Sign Up
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { signUp } = useAuth();

await signUp(email, password, {
  first_name: 'John',
  last_name: 'Doe'
});
```

#### Sign In
```typescript
const { signIn } = useAuth();
await signIn(email, password);
```

#### Sign Out
```typescript
const { signOut } = useAuth();
await signOut();
```

#### Password Reset
```typescript
const { resetPassword } = useAuth();
await resetPassword(email); // Sends reset email
```

#### Check Auth Status
```typescript
const { user, loading, isAdmin } = useAuth();

if (loading) return <LoadingScreen />;
if (!user) return <LoginPrompt />;
if (isAdmin) return <AdminPanel />;
```

### Protected Routes

Use the `ProtectedRoute` component to secure pages:

```typescript
// Require login
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } 
/>

// Require admin
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requireAdmin>
      <Admin />
    </ProtectedRoute>
  } 
/>
```

### Database Operations

The app includes helper functions in `src/lib/database.ts`:

```typescript
import { 
  getProducts, 
  createOrder, 
  addToWishlist,
  getCart 
} from '@/lib/database';

// Get products
const products = await getProducts({ categoryId: 'uuid', isNew: true });

// Create order
const order = await createOrder({
  userId: user.id,
  items: cartItems,
  total: 5000,
  // ...
});

// Add to wishlist
await addToWishlist(user.id, productId);

// Get user cart
const cart = await getCart(user.id);
```

### Image Uploads

Use the upload functions from `src/lib/supabase.ts`:

```typescript
import { uploadImage, uploadImages } from '@/lib/supabase';

// Single image
const url = await uploadImage('product-images', file, 'products');

// Multiple images
const urls = await uploadImages('product-images', files, 'products');
```

**Features:**
- Drag-and-drop support in admin forms
- Automatic validation (images only, max 5MB)
- Preview thumbnails
- Unique filenames with timestamps
- Public URLs automatically generated

### Admin Panel

Access at `/admin` (admin role required):

1. **Products Management**
   - Create/edit/delete products
   - Upload multiple product images
   - Manage color variants with images
   - Set pricing, sizes, tags
   - Mark as new/bestseller/featured

2. **Lookbook Management**
   - Create/edit/delete lookbook items
   - Upload lookbook images
   - Link products to lookbook items
   - Set display order

3. **Analytics** (Coming soon)
   - View sales data
   - Track product views
   - Monitor popular products

## Architecture

### File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx         # Auth provider and hooks
├── components/
│   ├── ProtectedRoute.tsx     # Route protection component
│   └── Header.tsx             # Updated with auth dropdown
├── lib/
│   ├── supabase.ts           # Supabase client + image uploads
│   ├── auth.ts               # Auth utility functions
│   └── database.ts           # Database helper functions
├── pages/
│   ├── Login.tsx             # Login page (Supabase auth)
│   ├── Register.tsx          # Registration (Supabase auth)
│   ├── ForgotPassword.tsx    # Password reset request
│   ├── ResetPassword.tsx     # Password reset form
│   ├── Profile.tsx           # User profile (protected)
│   ├── OrderHistory.tsx      # Order history (protected)
│   └── Admin.tsx             # Admin panel (admin only)
└── App.tsx                   # Updated with AuthProvider

supabase/
├── schema.sql                # Complete database schema
└── migrations/
    └── 002_create_storage_buckets.sql
```

### Security

**Row Level Security (RLS)** is enabled on all tables:

- Users can only view/edit their own data
- Admins have full access to all data
- Anonymous users can view public products/categories
- Cart, wishlist, orders are user-specific
- Admin functions use security definer functions to prevent RLS recursion

### Data Flow

1. **User signs up** → Profile auto-created via trigger
2. **User adds to cart** → Stored in Supabase (persistent)
3. **User checks out** → Order created, cart cleared
4. **Admin uploads image** → Stored in Supabase Storage
5. **Admin creates product** → Stored in products table with image URLs

## Troubleshooting

### Authentication Issues

**"Invalid login credentials"**
- Check email/password are correct
- Verify user exists in Authentication → Users
- Check email is confirmed

**"User not authorized"**
- Ensure RLS policies are set up correctly
- Check user has proper role in `user_roles` table

### Database Issues

**"permission denied for table..."**
- RLS policies may be too restrictive
- Check user authentication status
- Verify admin role if accessing admin features

**Orders not creating**
- Check user is authenticated
- Verify cart items exist
- Check RLS policies on orders/order_items tables

### Storage Issues

**"Storage bucket not found"**
- Create buckets in Supabase dashboard
- Ensure they're marked as public
- Run storage bucket migration SQL

**"Upload failed"**
- Check file size (max 5MB)
- Verify file is an image
- Check Supabase storage quota

## Best Practices

1. **Always use RLS policies** - Never disable RLS in production
2. **Validate data client-side** - But also use database constraints
3. **Use transactions** - For operations spanning multiple tables
4. **Handle errors gracefully** - Show user-friendly messages
5. **Keep anon key public** - It's safe with RLS enabled
6. **Never expose service_role key** - Use only in secure backend
7. **Use indexes** - Already included for common queries
8. **Monitor usage** - Check Supabase dashboard for limits

## Next Steps

- [ ] Set up email templates
- [ ] Configure OAuth providers (Google, GitHub)
- [ ] Set up webhooks for payments
- [ ] Implement real-time subscriptions
- [ ] Add more analytics
- [ ] Set up automated backups
- [ ] Configure custom domain

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Project GitHub Issues](your-repo-url)

---

**Last Updated:** December 26, 2025
- Upload status indicator

## File Structure

```
src/
├── lib/
│   └── supabase.ts              # Image upload utilities
├── components/admin/
│   ├── ProductFormModal.tsx      # Updated with drag-drop
│   └── LookbookFormModal.tsx     # Updated with drag-drop
supabase/
├── migrations/
│   └── 002_create_storage_buckets.sql  # Storage setup
└── schema.sql                   # Main schema
```

## API Functions

### `uploadImage(bucket, file, folder?)`

Upload a single image file to Supabase storage.

```typescript
import { uploadImage } from '@/lib/supabase';

try {
  const url = await uploadImage(
    'product-images',
    file,
    'products/my-product'
  );
  console.log('Uploaded:', url);
} catch (error) {
  console.error('Upload failed:', error);
}
```

**Parameters:**
- `bucket`: `'product-images' | 'lookbook-images'`
- `file`: File object
- `folder`: Optional folder path

**Returns:** Public URL of the uploaded image

### `uploadImages(bucket, files, folder?)`

Upload multiple image files.

```typescript
const urls = await uploadImages('product-images', fileArray);
```

### `deleteImage(bucket, imageUrl)`

Delete an image from storage.

```typescript
await deleteImage('product-images', publicUrl);
```

### `isSupabaseUrl(url)`

Check if a URL is from Supabase storage.

```typescript
if (isSupabaseUrl(url)) {
  console.log('Image is in Supabase storage');
}
```

## Database Integration

Images are stored as URLs in the database:

```typescript
// Products table
products.images = ['https://...supabase.co/...', '...']

// Lookbook items
lookbook_items.image_url = 'https://...supabase.co/...'

// Colors
products.colors = [
  { name: 'Red', hex: '#FF0000', image_url: 'https://...supabase.co/...' }
]
```

## Security

- **Public read access** - Images are publicly readable
- **Admin-only uploads** - Only admins can upload images
- **Admin-only deletes** - Only admins can delete images
- **RLS policies** - Database-level security via Row Level Security
- **File validation** - Images only, max 5MB per file

## Troubleshooting

### Images not uploading
- Check browser console for errors
- Verify Supabase URL and Anon Key are correct in `.env.local`
- Ensure buckets exist in Supabase
- Check network tab in DevTools

### "Upload failed" error
- Verify file is an image (PNG, JPG, GIF, etc.)
- Check file size (max 5MB)
- Ensure you have admin role
- Check Supabase project is active

### Images showing as broken
- Verify bucket is public in Supabase Storage settings
- Check image URL is correct
- Try uploading again
- Check bucket policies in migration

### Can't see newly uploaded images
- Refresh the page
- Clear browser cache
- Check in Supabase Storage browser
- Verify file was actually uploaded

## Performance Tips

1. **Optimize images before upload**
   - Compress large images before uploading
   - Use appropriate formats (JPG for photos, PNG for graphics)

2. **CDN caching**
   - Supabase automatically caches via Cloudflare CDN
   - No additional setup needed

3. **Batch uploads**
   - Multiple images upload in parallel
   - Use `uploadImages()` for better performance

## Next Steps

1. Test image uploads in development
2. Run migration to create buckets
3. Set admin role for your user
4. Test drag-and-drop functionality
5. Deploy to production

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review error messages in browser console
3. Check Supabase project logs
