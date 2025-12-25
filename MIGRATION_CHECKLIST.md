# Migration Checklist: Local to Supabase

This checklist helps you migrate from local state management to Supabase backend.

## ✅ Pre-Migration

- [ ] Create Supabase account
- [ ] Create new Supabase project
- [ ] Note down Project URL and anon key
- [ ] Copy `.env.example` to `.env`
- [ ] Add Supabase credentials to `.env`

## ✅ Database Setup

- [ ] Open Supabase SQL Editor
- [ ] Run `supabase/schema.sql`
- [ ] Verify all tables created
- [ ] Run `supabase/migrations/002_create_storage_buckets.sql`
- [ ] Verify storage buckets exist
- [ ] Check RLS policies are enabled

## ✅ Authentication Configuration

- [ ] Go to Authentication → Providers
- [ ] Enable Email provider
- [ ] Configure email templates (optional)
- [ ] Go to Authentication → Settings
- [ ] Set Site URL: `http://localhost:5173`
- [ ] Add Redirect URLs: `http://localhost:5173/**`
- [ ] Save settings

## ✅ Storage Configuration

- [ ] Go to Storage
- [ ] Verify buckets exist:
  - [ ] product-images
  - [ ] lookbook-images
  - [ ] user-avatars
- [ ] Check bucket policies (should be public read)
- [ ] Test image upload

## ✅ Code Integration

### Authentication
- [x] Created `src/lib/auth.ts`
- [x] Created `src/contexts/AuthContext.tsx`
- [x] Created `src/components/ProtectedRoute.tsx`
- [x] Updated `src/pages/Login.tsx`
- [x] Updated `src/pages/Register.tsx`
- [x] Updated `src/pages/ForgotPassword.tsx`
- [x] Updated `src/components/Header.tsx`
- [x] Wrapped app with `AuthProvider` in `App.tsx`

### Database Operations
- [x] Created `src/lib/database.ts` with all functions
- [x] Updated `src/pages/Profile.tsx` to use Supabase
- [x] Updated `src/pages/OrderHistory.tsx` to use Supabase
- [x] Updated `src/pages/Wishlist.tsx` to use Supabase

### Protected Routes
- [x] Wrapped protected routes in `App.tsx`:
  - Profile
  - Order History
  - Checkout
  - Admin

## ✅ Testing

### Authentication
- [ ] Test user registration
  - [ ] Register new account
  - [ ] Check email confirmation
  - [ ] Verify user in Supabase dashboard
- [ ] Test login
  - [ ] Login with credentials
  - [ ] Check session persists on refresh
- [ ] Test logout
  - [ ] Logout
  - [ ] Verify redirected to home
- [ ] Test password reset
  - [ ] Request password reset
  - [ ] Check email received
  - [ ] Reset password
  - [ ] Login with new password

### Shopping Features
- [ ] Test cart (logged in)
  - [ ] Add items to cart
  - [ ] Verify persists in database
  - [ ] Update quantities
  - [ ] Remove items
  - [ ] Cart persists across sessions
- [ ] Test wishlist (logged in)
  - [ ] Add items to wishlist
  - [ ] Verify persists in database
  - [ ] Remove items
  - [ ] Wishlist persists across sessions

### Orders
- [ ] Test checkout flow
  - [ ] Add items to cart
  - [ ] Proceed to checkout
  - [ ] Enter shipping details
  - [ ] Place order
  - [ ] Verify order in database
  - [ ] Check order appears in Order History
- [ ] Test order history
  - [ ] View all orders
  - [ ] View order details
  - [ ] Check order status

### Profile
- [ ] Test profile management
  - [ ] View profile
  - [ ] Edit profile information
  - [ ] Save changes
  - [ ] Verify in database
  - [ ] Upload avatar (if implemented)

### Admin Features
- [ ] Make test user admin:
  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'your-email';
  ```
- [ ] Test admin access
  - [ ] Login as admin
  - [ ] Access `/admin`
  - [ ] Verify non-admins can't access
- [ ] Test product management
  - [ ] Create product
  - [ ] Upload product images
  - [ ] Edit product
  - [ ] Delete product
- [ ] Test lookbook management
  - [ ] Create lookbook
  - [ ] Upload lookbook image
  - [ ] Add products to lookbook
  - [ ] Edit lookbook
  - [ ] Delete lookbook
- [ ] Test order management
  - [ ] View all orders
  - [ ] Update order status
  - [ ] View order details

## ✅ Security Checks

- [ ] RLS enabled on all tables
- [ ] Test RLS policies:
  - [ ] Users can only see their own cart
  - [ ] Users can only see their own wishlist
  - [ ] Users can only see their own orders
  - [ ] Users can only edit their own profile
  - [ ] Only admins can create/edit products
- [ ] API keys in `.env` (not committed)
- [ ] `.env` in `.gitignore`
- [ ] No service role key in frontend code

## ✅ Performance Checks

- [ ] Database queries optimized
- [ ] Images loading efficiently
- [ ] Lazy loading implemented
- [ ] No unnecessary re-renders
- [ ] Error handling in place
- [ ] Loading states implemented

## ✅ Production Preparation

### Supabase Production Settings
- [ ] Update Site URL to production domain
- [ ] Update Redirect URLs to production domain
- [ ] Enable email confirmations (if desired)
- [ ] Customize email templates
- [ ] Set up SMTP (if using custom emails)
- [ ] Enable database backups
- [ ] Set up monitoring alerts

### Deployment
- [ ] Choose deployment platform (Vercel, Netlify, etc.)
- [ ] Add environment variables to deployment:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy application
- [ ] Test all features in production
- [ ] Monitor errors and logs

### Final Checks
- [ ] SSL/HTTPS enabled
- [ ] All auth flows working
- [ ] Database accessible
- [ ] Images uploading and displaying
- [ ] RLS policies working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SEO meta tags
- [ ] Analytics set up (optional)

## ✅ Documentation

- [x] Update README.md
- [x] Create SUPABASE_SETUP.md
- [x] Create SUPABASE_API.md
- [x] Create SUPABASE_QUICK_REF.md
- [x] Update SUPABASE_INTEGRATION.md
- [ ] Document custom business logic
- [ ] Create deployment guide
- [ ] Document admin procedures

## 📝 Post-Migration

### Cleanup
- [ ] Remove local state fallbacks (if desired)
- [ ] Remove mock data
- [ ] Remove unused imports
- [ ] Clean up commented code
- [ ] Update dependencies

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Monitor Supabase logs
- [ ] Check database performance
- [ ] Monitor storage usage
- [ ] Track API quota

### Optimization
- [ ] Add database indexes for frequent queries
- [ ] Implement caching strategy
- [ ] Optimize images in storage
- [ ] Review and optimize queries
- [ ] Implement pagination for large datasets

## 🐛 Troubleshooting

### Common Issues

**Authentication not working:**
- Check environment variables
- Verify email provider enabled
- Check redirect URLs
- Look for errors in browser console

**Can't access data:**
- Check RLS policies
- Verify user is authenticated
- Check table permissions
- Look at Supabase logs

**Images not uploading:**
- Check bucket exists
- Verify bucket policies
- Check file size limits
- Verify user authenticated

**Orders not creating:**
- Check foreign key constraints
- Verify all required fields
- Check RLS policies
- Look at database logs

### Getting Help
1. Check Supabase dashboard logs
2. Review error messages in console
3. Check documentation files
4. Visit Supabase Discord/GitHub
5. Review Supabase docs

## 🎉 Migration Complete

Once all checkboxes are checked:
- All features working with Supabase
- Authentication implemented
- Data persisting in database
- Admin features functional
- Ready for production deployment

## Next Steps
1. Add payment integration
2. Implement email notifications
3. Add analytics and tracking
4. Optimize performance
5. Enhance admin features
6. Add more products and lookbooks

---

**Remember**: Always test in development before deploying to production!
