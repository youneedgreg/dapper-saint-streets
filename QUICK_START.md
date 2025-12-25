# Quick Reference - Image Upload Integration

## 🚀 Quick Setup (5 minutes)

### 1. Install Packages
```bash
npm install
```

### 2. Add Environment Variables
Create `.env.local`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: Supabase → Settings → API

### 3. Create Storage Buckets
In Supabase console → Storage:
- Create `product-images` (public)
- Create `lookbook-images` (public)

### 4. Run Migration
In Supabase → SQL Editor, paste and run:
```sql
-- Copy from: supabase/migrations/002_create_storage_buckets.sql
```

### 5. Add Admin Role
In SQL Editor:
```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES (auth.uid(), 'admin');
```

### 6. Start Dev Server
```bash
npm run dev
```

## 📦 What Was Added

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Upload/delete image functions |
| `supabase/migrations/002_create_storage_buckets.sql` | Database migration |
| `SUPABASE_INTEGRATION.md` | Full setup guide |
| `IMPLEMENTATION_SUMMARY.md` | What was implemented |
| `.env.example` | Environment template |

## 🎯 Usage

### Upload Product Image
1. Go to Admin → Products → Add Product
2. Drag and drop image into the upload area
3. Image auto-uploads and URL is saved

### Upload Color Variant Image
1. In colors section, drag image into the color image area
2. Color image auto-uploads and preview shows

### Upload Lookbook Image
1. Go to Admin → Lookbook → Add Lookbook Item
2. Drag and drop image into the upload area
3. Image auto-uploads with preview

## 🔧 API Functions

```typescript
import { uploadImage, uploadImages, deleteImage, isSupabaseUrl } from '@/lib/supabase';

// Upload single image
const url = await uploadImage('product-images', file, 'folder/path');

// Upload multiple images
const urls = await uploadImages('product-images', files, 'folder/path');

// Delete image
await deleteImage('product-images', publicUrl);

// Check if URL is from Supabase
if (isSupabaseUrl(url)) { ... }
```

## 🎨 Features

✅ Drag-and-drop upload  
✅ Automatic Supabase storage  
✅ URL-based storage (not base64)  
✅ Image preview  
✅ Error handling  
✅ Admin-only access  
✅ Automatic file validation  
✅ Max 5MB per file  
✅ Toast notifications  
✅ Loading states  

## ⚡ Key Points

- Images stored in Supabase buckets (not database)
- URLs stored in database
- Public read access, admin-only write/delete
- Auto-organized by folder
- CDN-cached via Cloudflare
- Max 5MB per file, images only
- Requires admin role to upload

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Upload fails | Check .env.local has correct credentials |
| "Unauthorized" error | Ensure user has admin role in user_roles table |
| Images not showing | Verify buckets are public in Storage settings |
| File size error | Images max 5MB, compress if needed |
| CORS errors | Create buckets as public |

## 📚 Resources

- [Full Integration Guide](./SUPABASE_INTEGRATION.md)
- [Implementation Details](./IMPLEMENTATION_SUMMARY.md)
- [Setup Script](./setup-supabase.sh)
- [Supabase Docs](https://supabase.com/docs)

## 📋 Files Changed

### Created
- `src/lib/supabase.ts`
- `supabase/migrations/002_create_storage_buckets.sql`
- `SUPABASE_INTEGRATION.md`
- `IMPLEMENTATION_SUMMARY.md`
- `.env.example`
- `setup-supabase.sh`

### Updated
- `src/components/admin/ProductFormModal.tsx`
- `src/components/admin/LookbookFormModal.tsx`
- `package.json` (added @supabase/supabase-js)

## 💡 Tips

1. **Test locally first** - Set up on your dev machine before deploying
2. **Compress images** - Large images slow down loading
3. **Organize folders** - Use meaningful folder names in buckets
4. **Monitor storage** - Check Supabase Storage tab regularly
5. **Backup images** - Download important images periodically
6. **Set quotas** - Consider setting storage limits in Supabase

## 🔒 Security

- Only admins can upload/delete images
- Public can only read images
- File validation on client and RLS on server
- Unique filenames prevent overwriting
- Size limits prevent abuse

## 🎓 Next Steps

1. ✅ Read SUPABASE_INTEGRATION.md for detailed setup
2. ✅ Follow Quick Setup steps above
3. ✅ Test uploads in development
4. ✅ Deploy to production
5. ✅ Monitor Supabase usage

---

**Questions?** Check SUPABASE_INTEGRATION.md for detailed troubleshooting guide.
