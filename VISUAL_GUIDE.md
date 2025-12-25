# Visual Implementation Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Admin Dashboard                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Products → ProductFormModal                             │
│      ├─ Product Images (Drag-Drop)                       │
│      └─ Color Variant Images (Drag-Drop)                 │
│                                                           │
│  Lookbook → LookbookFormModal                            │
│      └─ Lookbook Images (Drag-Drop)                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │  File Validation & Processing  │
         │  (src/lib/supabase.ts)        │
         └───────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │  Supabase Storage Upload      │
         │  - product-images bucket      │
         │  - lookbook-images bucket     │
         └───────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │  CDN Caching (Cloudflare)     │
         │  + Public URL Generation      │
         └───────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │  Database Storage (URLs)      │
         │  - products.images[]          │
         │  - lookbook_items.image_url   │
         └───────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │  Frontend Display             │
         │  - Product pages              │
         │  - Lookbook pages             │
         └───────────────────────────────┘
```

## Upload Flow Diagram

```
User Action
    ↓
┌─ Drag File Over Zone → Visual Feedback (Border Change)
│
├─ File Drop
│    ↓
│   Validate File
│    ├─ Is Image? → YES ✓
│    ├─ Under 5MB? → YES ✓
│    └─ Continue...
│        ↓
│    Upload to Supabase
│        ├─ Generate Unique Filename
│        ├─ Upload to Storage Bucket
│        └─ Get Public URL
│            ↓
│        Update Form State
│            ├─ Show Preview
│            ├─ Update UI
│            └─ Show Success Toast
│                ↓
│            User Can Submit Form
│                ├─ URLs Saved to Database
│                └─ Done!
│
└─ If Error → Show Error Toast → User Can Retry
```

## Component Interaction

```
ProductFormModal.tsx
├─ Images Section
│  ├─ Drag-Drop Zone
│  │  ├─ handleImageDragOver()
│  │  ├─ handleImageDragLeave()
│  │  └─ handleImageDrop()
│  │     └─ uploadImage() → Supabase
│  ├─ Preview Gallery
│  │  └─ Show uploaded images with remove button
│  └─ URL Input (fallback)
│
└─ Colors Section
   └─ Color Variant
      ├─ Drag-Drop Zone for Color Image
      │  └─ handleColorImageDrop()
      │     └─ uploadImage() → Supabase
      ├─ Color Input (name, hex, image)
      └─ Preview of Color with Image

LookbookFormModal.tsx
├─ Image Preview
│  └─ Show image with Supabase badge if applicable
├─ Drag-Drop Zone
│  ├─ handleImageDragOver()
│  ├─ handleImageDragLeave()
│  └─ handleImageDrop()
│     └─ uploadImage() → Supabase
├─ URL Input (fallback)
└─ Other Fields (title, collection, etc.)
```

## Data Flow

```
Admin Uploads Image
       ↓
Frontend Validation
├─ File type check
└─ File size check
       ↓
uploadImage() in supabase.ts
├─ Generate unique filename
├─ Upload to Supabase bucket
└─ Get public URL
       ↓
URL returned to component
       ↓
Show in preview
       ↓
User submits form
       ↓
URLs saved to Supabase database
├─ products.images array
├─ products.colors[].image_url
└─ lookbook_items.image_url
       ↓
Frontend fetches data
       ↓
Images displayed from URLs
       ↓
CDN serves cached images
```

## File Structure

```
Project Root
├── src/
│   ├── lib/
│   │   └── supabase.ts              ← Image utilities
│   │       ├── uploadImage()
│   │       ├── uploadImages()
│   │       ├── deleteImage()
│   │       └── isSupabaseUrl()
│   │
│   ├── components/
│   │   └── admin/
│   │       ├── ProductFormModal.tsx  ← Updated with drag-drop
│   │       │   ├── handleImageDrop()
│   │       │   ├── handleColorImageDrop()
│   │       │   └── Image upload zones
│   │       │
│   │       └── LookbookFormModal.tsx ← Updated with drag-drop
│   │           ├── handleImageDrop()
│   │           └── Image upload zone
│   │
│   └── pages/
│       └── Admin.tsx                 (Uses form modals)
│
├── supabase/
│   ├── migrations/
│   │   └── 002_create_storage_buckets.sql
│   │       ├── Creates buckets
│   │       └── Sets RLS policies
│   │
│   └── schema.sql
│       ├── Products table
│       ├── Lookbook items table
│       └── Other tables
│
├── .env.example                      ← Copy to .env.local
│
├── Documentation/
│   ├── README_IMAGES.md              ← Start here!
│   ├── QUICK_START.md                ← 5-minute guide
│   ├── SUPABASE_INTEGRATION.md       ← Detailed guide
│   ├── IMPLEMENTATION_SUMMARY.md     ← Technical docs
│   ├── SETUP_CHECKLIST.md            ← Checklist
│   └── setup-supabase.sh             ← Setup script
│
└── package.json                      ← @supabase/supabase-js added
```

## Component State Management

```
ProductFormModal
├── formData
│   ├── name
│   ├── price
│   ├── images: string[]           ← URLs from Supabase
│   ├── colors: {..., image: string}[] ← URLs from Supabase
│   └── ... other fields
├── isDraggingImages: boolean      ← For UI feedback
├── isDraggingColors: boolean      ← For UI feedback
├── uploadingImages: boolean       ← Show loading state
├── uploadingColor: boolean        ← Show loading state
└── newImageUrl: string            ← Temporary input

LookbookFormModal
├── formData
│   ├── image_url: string          ← URL from Supabase
│   ├── title
│   ├── collection
│   └── ... other fields
├── isDragging: boolean            ← For UI feedback
├── isUploading: boolean           ← Show loading state
└── ... useEffect for form reset
```

## User Interactions

```
Scenario 1: Upload Product Image via Drag-Drop
────────────────────────────────────────────────
Admin clicks "Add Product"
    ↓
Dialog opens with ProductFormModal
    ↓
Admin drags image file over upload zone
    ↓
Zone highlights (isDraggingImages = true)
    ↓
Admin drops file
    ↓
handleImageDrop() called
    ↓
File validated (type & size)
    ↓
setUploadingImages(true) → Loading spinner shows
    ↓
uploadImage() called → File uploads to Supabase
    ↓
setUploadingImages(false) → Spinner removed
    ↓
Image URL returned and added to preview
    ↓
"Upload successful" toast shown
    ↓
Admin can see image thumbnail with remove button
    ↓
Admin can continue adding more images or submit

Scenario 2: Upload Fails
────────────────────────
Similar process, but error caught
    ↓
setUploadingImages(false)
    ↓
Error toast shown with message
    ↓
Admin can retry with different file

Scenario 3: Add Color with Image
─────────────────────────────────
Admin fills in color name, hex, and drags image
    ↓
handleColorImageDrop() called
    ↓
File validated
    ↓
uploadImage() uploads to Supabase
    ↓
URL set in newColor.image
    ↓
Color preview shows with actual image
    ↓
Admin clicks Add button
    ↓
Color added to formData.colors
    ↓
Preview shows color with thumbnail
```

## Database Schema (Relevant Parts)

```
products table
├── id: uuid
├── name: text
├── description: text
├── price: integer
├── images: text[]           ← Array of URLs from Supabase
├── colors: jsonb            ← [{name, hex, image_url}]
├── sizes: text[]
├── tags: text[]
└── ... other fields

lookbook_items table
├── id: uuid
├── image_url: text          ← URL from Supabase
├── title: text
├── collection: text
├── description: text
├── product_ids: uuid[]
├── display_order: integer
├── is_active: boolean
└── created_at, updated_at
```

## Security Model

```
User Action
    ↓
┌─ Frontend Validation
│  ├─ File type check
│  └─ File size check
│
├─ Upload to Supabase
│  └─ Supabase RLS Policies Check:
│     ├─ Is user authenticated? (YES)
│     ├─ Does user have admin role? (REQUIRED)
│     └─ Upload only to correct bucket? (YES)
│
└─ Save URL to Database
   └─ Database RLS Policies Check:
      ├─ Can user write to this table? (REQUIRED)
      └─ Is user owner? (If applicable)

Public Access
├─ Anyone can READ images
├─ Anyone can READ products
├─ Anyone can READ lookbook items
└─ Only ADMIN can WRITE/DELETE
```

## Deployment Architecture

```
Development
├── npm run dev
├── .env.local with dev Supabase project
└── LocalHost:5173

Production
├── npm run build
├── .env.local → Environment variables in host
├── Supabase project (separate)
├── Images in Supabase storage
├── URLs in production database
└── CDN caches images globally
```

## Performance Optimization

```
Image Upload Process
├─ Client-side compression (optional, not implemented)
├─ File validation (prevents invalid uploads)
├─ Parallel uploads (Promise.all for multiple files)
└─ CDN caching (Cloudflare via Supabase)
    └─ Images cached globally
    └─ Fast retrieval worldwide

Database Optimization
├─ URLs stored as text (fast lookup)
├─ Arrays indexed (fast JSON queries)
└─ RLS policies (scoped access)
```

## Error Handling Flow

```
Upload Error Occurs
    ↓
try/catch catches error
    ↓
Error analyzed
├─ File validation error?
│  └─ Message: "File must be an image"
├─ File too large?
│  └─ Message: "File size must be less than 5MB"
├─ Upload failed?
│  └─ Message: "Upload failed: {error}"
└─ Other error?
   └─ Generic message with details
       ↓
Toast notification shows to user
       ↓
setUploading(false) removes loading state
       ↓
User can retry or cancel
```

---

## Legend

```
──→    Data flow or progression
├─     Sub-item or branch
└─     Final item in branch
✓      Success
✗      Failure
↓      Next step
[  ]   Checkbox item
```

---

This visual guide shows how the drag-and-drop image upload system integrates with your Dapper Sainte platform from the UI down to the database.
