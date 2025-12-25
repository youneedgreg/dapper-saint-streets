-- =============================================
-- DAPPER SAINTE Storage Configuration
-- =============================================
-- This migration sets up the storage buckets for images

-- Create product-images storage bucket
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do nothing;

-- Create lookbook-images storage bucket
insert into storage.buckets (id, name, public)
  values ('lookbook-images', 'lookbook-images', true)
  on conflict (id) do nothing;

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Product Images - Public read access
create policy "Public read product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Product Images - Admin write/delete
create policy "Admin upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and public.has_role(auth.uid(), 'admin')
  );

create policy "Admin delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and public.has_role(auth.uid(), 'admin')
  );

-- Lookbook Images - Public read access
create policy "Public read lookbook images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'lookbook-images');

-- Lookbook Images - Admin write/delete
create policy "Admin upload lookbook images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'lookbook-images'
    and public.has_role(auth.uid(), 'admin')
  );

create policy "Admin delete lookbook images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'lookbook-images'
    and public.has_role(auth.uid(), 'admin')
  );
