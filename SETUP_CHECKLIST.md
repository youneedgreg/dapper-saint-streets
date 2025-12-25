# Setup Checklist - Image Upload Integration

## Pre-Implementation Checklist

- [x] Node.js and npm installed
- [x] Project dependencies installed (`npm install`)
- [x] React and TypeScript configured
- [x] Shadcn/ui components available

## Implementation Checklist

### Files Created
- [x] `src/lib/supabase.ts` - Image upload utilities
- [x] `supabase/migrations/002_create_storage_buckets.sql` - Database migration
- [x] `QUICK_START.md` - 5-minute quick reference
- [x] `SUPABASE_INTEGRATION.md` - Complete setup guide
- [x] `IMPLEMENTATION_SUMMARY.md` - Technical documentation
- [x] `.env.example` - Environment variable template
- [x] `setup-supabase.sh` - Setup helper script
- [x] `README_IMAGES.md` - Implementation overview

### Files Updated
- [x] `src/components/admin/ProductFormModal.tsx` - Added drag-drop
- [x] `src/components/admin/LookbookFormModal.tsx` - Added drag-drop
- [x] `package.json` - Added @supabase/supabase-js

### Features Implemented
- [x] Drag-and-drop image upload
- [x] Product image upload (multiple)
- [x] Color variant image upload
- [x] Lookbook image upload
- [x] File validation (type & size)
- [x] Automatic Supabase storage
- [x] URL generation and storage
- [x] Error handling
- [x] Loading states
- [x] Toast notifications
- [x] Image preview gallery
- [x] Remove image functionality

## Pre-Setup Checklist

Before you start setup, you'll need:
- [ ] Supabase account (free at supabase.com)
- [ ] GitHub or email to create Supabase account
- [ ] About 10 minutes for setup
- [ ] Access to Supabase dashboard
- [ ] Text editor to update .env.local

## Setup Checklist

### Step 1: Create Supabase Project
- [ ] Go to supabase.com
- [ ] Click "New Project"
- [ ] Enter project name
- [ ] Set region (choose closest to you)
- [ ] Set password
- [ ] Click "Create new project"
- [ ] Wait for initialization (2-3 minutes)

### Step 2: Get API Credentials
- [ ] In Supabase dashboard, go to "Settings"
- [ ] Click "API" in left sidebar
- [ ] Copy "Project URL"
- [ ] Copy "Anon Public" key
- [ ] Keep these safe (don't commit to git)

### Step 3: Configure Environment
- [ ] Copy `.env.example` to `.env.local`
- [ ] Paste Supabase Project URL as `VITE_SUPABASE_URL`
- [ ] Paste Supabase Anon Key as `VITE_SUPABASE_ANON_KEY`
- [ ] Save `.env.local`
- [ ] Do NOT commit `.env.local` to git

### Step 4: Create Storage Buckets
- [ ] In Supabase, go to "Storage" section
- [ ] Click "New Bucket"
- [ ] Name: `product-images`
- [ ] Set to Public
- [ ] Click "Create bucket"
- [ ] Repeat for `lookbook-images` bucket

### Step 5: Run Database Migration
- [ ] In Supabase, go to "SQL Editor"
- [ ] Click "New Query"
- [ ] Open file: `supabase/migrations/002_create_storage_buckets.sql`
- [ ] Copy entire contents
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Wait for success message

### Step 6: Set Admin Role
- [ ] In SQL Editor, create new query
- [ ] Paste this SQL:
```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES (auth.uid(), 'admin')
ON CONFLICT DO NOTHING;
```
- [ ] Click "Run"

### Step 7: Test Setup
- [ ] Run `npm run dev`
- [ ] Go to http://localhost:5173
- [ ] Navigate to Admin → Products
- [ ] Click "Add Product"
- [ ] Try dragging an image file
- [ ] Image should upload (check for success message)
- [ ] Verify image appears in preview
- [ ] Verify in Supabase Storage → product-images

### Step 8: Verify Database Integration
- [ ] Submit a product with images
- [ ] Go to Supabase → Table Editor
- [ ] Check `products` table
- [ ] Verify `images` column has URLs
- [ ] Image URLs should start with `https://`

## Testing Checklist

### Image Upload Tests
- [ ] Upload product image via drag-drop
- [ ] Upload multiple product images
- [ ] Upload color variant image via drag-drop
- [ ] Upload lookbook image via drag-drop
- [ ] Images appear in Supabase Storage
- [ ] Image URLs generated correctly
- [ ] Images display in preview
- [ ] Remove image functionality works

### Error Handling Tests
- [ ] Try uploading non-image file (should fail)
- [ ] Try uploading file > 5MB (should fail)
- [ ] Try uploading without auth (should fail if not public)
- [ ] Error messages display clearly
- [ ] Toast notifications show errors
- [ ] App recovers from failed upload

### Browser Compatibility Tests
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Drag-drop works in all
- [ ] Uploads work in all
- [ ] UI displays correctly in all

### Security Tests
- [ ] Only admin can upload (if RLS working)
- [ ] Non-admins can view images
- [ ] Images are publicly accessible
- [ ] Filenames are unique
- [ ] No directory traversal possible

## Deployment Checklist

### Before Deploying
- [ ] All tests pass
- [ ] .env.local file is NOT in git
- [ ] .env.local added to .gitignore
- [ ] Code reviewed
- [ ] No console errors
- [ ] No console warnings

### Deploy to Vercel/Production
- [ ] Add `VITE_SUPABASE_URL` to environment variables
- [ ] Add `VITE_SUPABASE_ANON_KEY` to environment variables
- [ ] Deploy application
- [ ] Verify environment variables are set
- [ ] Test image upload in production
- [ ] Monitor Supabase usage
- [ ] Check error logs

### Post-Deployment
- [ ] Monitor Supabase storage usage
- [ ] Check for any error messages
- [ ] Verify images load in production
- [ ] Test on multiple devices/browsers
- [ ] Monitor database performance
- [ ] Set up storage alerts in Supabase

## Documentation Checklist

- [x] README_IMAGES.md - Overview
- [x] QUICK_START.md - 5-minute reference
- [x] SUPABASE_INTEGRATION.md - Detailed guide
- [x] IMPLEMENTATION_SUMMARY.md - Technical docs
- [x] IMPLEMENTATION_COMPLETE.md - Completion summary
- [x] setup-supabase.sh - Setup script
- [x] Code comments in supabase.ts
- [ ] Team training (optional)
- [ ] Update main README.md (optional)

## Maintenance Checklist

Monthly:
- [ ] Check Supabase storage usage
- [ ] Review error logs
- [ ] Monitor performance metrics
- [ ] Verify backups are working
- [ ] Check for any deprecated features

Quarterly:
- [ ] Update dependencies
- [ ] Review security settings
- [ ] Audit user access
- [ ] Review storage optimization

Annually:
- [ ] Review and update documentation
- [ ] Plan for scaling needs
- [ ] Audit compliance requirements
- [ ] Update disaster recovery plan

## Common Issues Checklist

### Upload Fails
- [ ] Check .env.local has correct credentials
- [ ] Verify storage buckets exist
- [ ] Check buckets are set to public
- [ ] Verify file size < 5MB
- [ ] Check file is valid image format
- [ ] Look for browser console errors

### Images Don't Show
- [ ] Verify image URL in database
- [ ] Check image exists in Supabase Storage
- [ ] Verify bucket is public
- [ ] Try clearing browser cache
- [ ] Check image isn't deleted

### Authorization Issues
- [ ] Verify user has admin role
- [ ] Check RLS policies applied
- [ ] Verify auth.uid() returns value
- [ ] Check user_roles table populated

### Performance Issues
- [ ] Check image sizes (compress if needed)
- [ ] Monitor Supabase bandwidth
- [ ] Check for large uploads
- [ ] Verify CDN caching working
- [ ] Monitor database performance

## Support Resources

- [ ] README_IMAGES.md - Quick overview
- [ ] QUICK_START.md - Quick reference
- [ ] SUPABASE_INTEGRATION.md - Detailed guide
- [ ] Browser console - Error messages
- [ ] Supabase dashboard - Logs & metrics
- [ ] Code comments - Implementation details

---

## ✅ All Set!

Once you check off all the checklist items above, your image upload system is ready for use.

**Questions?** Check the documentation files:
- QUICK_START.md for quick answers
- SUPABASE_INTEGRATION.md for detailed guide
- Code comments in src/lib/supabase.ts

**Date Completed:** _______________
**Tested By:** _______________
**Notes:** _______________
