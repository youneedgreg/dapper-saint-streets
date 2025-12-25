# Supabase Setup Guide

## Prerequisites
- A Supabase account (free tier works)
- Node.js and Bun installed
- Git for version control

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Click "New Project"
5. Fill in project details:
   - Project name: `dapper-saint-streets`
   - Database password: (generate a strong password and save it)
   - Region: Choose closest to your users
   - Pricing plan: Free tier is fine for development

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Run the schema from `supabase/schema.sql`:
   - Copy the entire contents of the file
   - Paste into a new query
   - Click "Run"

3. This creates:
   - `users` table (extended profile data)
   - `products` table
   - `orders` table
   - `order_items` table
   - `cart_items` table
   - `wishlist_items` table
   - `lookbooks` table
   - `lookbook_items` table
   - Row Level Security (RLS) policies
   - Storage buckets for images

## Step 3: Set Up Storage Buckets

The schema automatically creates storage buckets. To verify:

1. Go to Storage in your Supabase dashboard
2. You should see these buckets:
   - `product-images` (public)
   - `lookbook-images` (public)
   - `user-avatars` (public)

If not created automatically, run `supabase/migrations/002_create_storage_buckets.sql`

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. In your Supabase dashboard, go to Settings → API
3. Copy the following values to your `.env` file:
   - `VITE_SUPABASE_URL`: Your project URL (e.g., https://xxxxx.supabase.co)
   - `VITE_SUPABASE_ANON_KEY`: Your anon/public key

Example `.env`:
```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5: Configure Authentication

1. In Supabase dashboard, go to Authentication → Providers
2. Enable Email provider:
   - Toggle "Enable Email provider" ON
   - Configure email templates (optional):
     - Confirmation email
     - Password recovery email
     - Magic link email

3. Configure Auth settings:
   - Go to Authentication → Settings
   - Site URL: `http://localhost:5173` (for development)
   - Redirect URLs: Add `http://localhost:5173/**`

4. For production, update:
   - Site URL: Your production domain
   - Redirect URLs: Your production domain with wildcards

## Step 6: Seed Initial Data (Optional)

You can seed your database with initial products:

1. Go to SQL Editor
2. Run insert statements for products, or
3. Use the Admin panel in the app (after authentication is working)

Example product insert:
```sql
INSERT INTO products (name, description, price, category, images)
VALUES (
  'Classic T-Shirt',
  'Premium cotton t-shirt',
  29.99,
  'Shirts',
  ARRAY['https://example.com/image.jpg']
);
```

## Step 7: Test Authentication

1. Start your development server:
   ```bash
   bun run dev
   ```

2. Navigate to `/register` and create a test account
3. Check your email for confirmation (if email confirmation is enabled)
4. Log in with your test account
5. Verify that the user profile appears in the header

## Step 8: Set Up Admin User

To make a user an admin:

1. Go to Supabase dashboard → Authentication → Users
2. Find your user
3. Copy their UUID
4. Go to SQL Editor and run:
   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE id = 'user-uuid-here';
   ```

5. Now that user can access the Admin panel at `/admin`

## Step 9: Configure Storage Policies

Storage buckets should already have public access policies from the migration. To verify:

1. Go to Storage → Policies
2. Each bucket should have:
   - SELECT policy: Allow public reads
   - INSERT policy: Allow authenticated users to upload
   - UPDATE policy: Allow users to update their own files
   - DELETE policy: Allow users to delete their own files

## Step 10: Production Deployment

For production on Vercel/Netlify:

1. Add environment variables in your deployment platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Update Supabase Auth settings:
   - Site URL: Your production domain
   - Redirect URLs: Your production domain

3. Update CORS settings if needed (usually auto-configured)

## Troubleshooting

### Authentication Issues
- Check that environment variables are set correctly
- Verify email provider is enabled
- Check browser console for errors
- Ensure RLS policies are properly set

### Database Connection Issues
- Verify Supabase URL and anon key
- Check project status in Supabase dashboard
- Ensure project isn't paused (free tier pauses after inactivity)

### Storage Upload Issues
- Check bucket policies
- Verify bucket exists
- Check file size limits
- Ensure user is authenticated for uploads

### RLS Policy Issues
If users can't access their data:
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Disable temporarily for testing (NOT for production)
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

## Development Tips

1. **Use Supabase Local Development** (optional but recommended):
   ```bash
   npx supabase init
   npx supabase start
   ```

2. **Database Migrations**:
   - Keep all schema changes in migration files
   - Version control your migrations

3. **Type Safety**:
   - Generate TypeScript types from your schema:
     ```bash
     npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
     ```

4. **Testing**:
   - Use separate Supabase projects for dev/staging/production
   - Test RLS policies thoroughly

## Security Best Practices

1. **Never commit** `.env` files to version control
2. **Always use** Row Level Security policies
3. **Validate** user input on both client and database level
4. **Use** prepared statements (Supabase does this automatically)
5. **Rotate** API keys periodically
6. **Enable** MFA for Supabase dashboard access
7. **Monitor** usage and logs regularly

## Next Steps

- Set up email templates for authentication
- Configure OAuth providers (Google, GitHub, etc.)
- Set up database backups
- Configure monitoring and alerts
- Set up CI/CD pipeline
- Implement rate limiting
- Add logging and analytics

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
