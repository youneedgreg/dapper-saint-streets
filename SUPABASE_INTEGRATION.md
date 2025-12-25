# Supabase Integration Guide

This guide explains how to set up and use the Supabase integration for image uploads in the Dapper Sainte e-commerce platform.

## Overview

The system now includes:
- **Drag-and-drop image uploads** for products and lookbook items
- **Automatic Supabase storage integration** for image persistence
- **Image URL storage** in the database instead of local files
- **Admin-only access control** for image management

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Wait for the project to initialize

### 2. Set Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. In your Supabase project, go to **Settings > API**
3. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`

4. Update `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Create Storage Buckets

1. In Supabase console, go to **Storage**
2. Create two new buckets:
   - **Name:** `product-images` (Public)
   - **Name:** `lookbook-images` (Public)

3. Or run the migration:
   ```bash
   # In Supabase SQL Editor, run the migration from:
   # supabase/migrations/002_create_storage_buckets.sql
   ```

### 4. Set Up User Roles

Make sure you have admin role setup:
```sql
-- Add admin role for your user
INSERT INTO public.user_roles (user_id, role)
VALUES (auth.uid(), 'admin')
ON CONFLICT DO NOTHING;
```

## Usage

### For Product Images

In the Admin panel → Products:

1. **Drag and drop images** directly into the product form
2. Images automatically upload to Supabase storage
3. URLs are stored in the database
4. Or paste image URLs manually

**Features:**
- Multiple image upload
- Automatic validation (images only, max 5MB)
- Preview thumbnails
- Remove images with one click
- Green indicator for Supabase storage URLs

### For Color Variant Images

In the Admin panel → Products → Color section:

1. **Drag and drop color image** into the color section
2. Image automatically uploads to Supabase
3. Color variant displays with image preview
4. Or paste image URL manually

### For Lookbook Items

In the Admin panel → Lookbook:

1. **Drag and drop image** into the lookbook form
2. Image automatically uploads to Supabase storage
3. Full preview shown after upload
4. Or paste image URL manually

**Features:**
- Single image per lookbook item
- Automatic Supabase storage detection
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
