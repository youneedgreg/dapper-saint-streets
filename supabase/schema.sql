-- =============================================
-- DAPPER SAINT E-Commerce Database Schema
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

create type public.app_role as enum ('admin', 'moderator', 'user');
create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- =============================================
-- USER PROFILES
-- =============================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- USER ROLES (Separate table for security)
-- =============================================

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles (prevents RLS recursion)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create policy "Users can view own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can manage roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- CATEGORIES
-- =============================================

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamp with time zone default now()
);

alter table public.categories enable row level security;

create policy "Anyone can view categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Admins can manage categories"
  on public.categories for all
  using (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PRODUCTS
-- =============================================

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price integer not null,
  original_price integer,
  category_id uuid references public.categories(id) on delete set null,
  images text[] default '{}',
  images_360 text[] default '{}',  -- 360° view images
  colors text[] default '{}',
  sizes text[] default '{}',
  tags text[] default '{}',
  stock integer default 0,
  is_new boolean default false,
  is_bestseller boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.products enable row level security;

create policy "Anyone can view active products"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

create policy "Admins can manage products"
  on public.products for all
  using (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- STYLED LOOKS (Admin-uploaded inspiration photos)
-- =============================================

create table public.styled_looks (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null,
  description text,
  product_ids uuid[] default '{}',
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.styled_looks enable row level security;

create policy "Anyone can view active styled looks"
  on public.styled_looks for select
  to anon, authenticated
  using (is_active = true);

create policy "Admins can manage styled looks"
  on public.styled_looks for all
  using (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- ADDRESSES
-- =============================================

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  label text default 'Home',
  street text not null,
  city text not null,
  county text,
  postal_code text,
  country text default 'Kenya',
  is_default boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.addresses enable row level security;

create policy "Users can manage own addresses"
  on public.addresses for all
  using (auth.uid() = user_id);

-- =============================================
-- ORDERS
-- =============================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  status order_status default 'pending',
  subtotal integer not null,
  shipping_cost integer default 0,
  total integer not null,
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage all orders"
  on public.orders for all
  using (public.has_role(auth.uid(), 'admin'));

-- Generate order number
create or replace function public.generate_order_number()
returns trigger
language plpgsql
as $$
begin
  new.order_number := 'DS-' || to_char(now(), 'YYYYMMDD') || '-' || 
    lpad(floor(random() * 10000)::text, 4, '0');
  return new;
end;
$$;

create trigger set_order_number
  before insert on public.orders
  for each row execute procedure public.generate_order_number();

-- =============================================
-- ORDER ITEMS
-- =============================================

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  quantity integer not null default 1,
  price integer not null,
  color text,
  size text,
  created_at timestamp with time zone default now()
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can create order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can manage all order items"
  on public.order_items for all
  using (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- WISHLIST
-- =============================================

create table public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique (user_id, product_id)
);

alter table public.wishlist enable row level security;

create policy "Users can manage own wishlist"
  on public.wishlist for all
  using (auth.uid() = user_id);

-- =============================================
-- REVIEWS
-- =============================================

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  content text,
  is_verified boolean default false,
  created_at timestamp with time zone default now(),
  unique (user_id, product_id)
);

alter table public.reviews enable row level security;

create policy "Anyone can view reviews"
  on public.reviews for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- =============================================
-- INDEXES
-- =============================================

create index idx_products_category on public.products(category_id);
create index idx_products_is_active on public.products(is_active);
create index idx_products_is_new on public.products(is_new);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order on public.order_items(order_id);
create index idx_wishlist_user on public.wishlist(user_id);
create index idx_reviews_product on public.reviews(product_id);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_products_updated_at
  before update on public.products
  for each row execute procedure public.update_updated_at();

create trigger update_orders_updated_at
  before update on public.orders
  for each row execute procedure public.update_updated_at();

-- =============================================
-- SEED CATEGORIES
-- =============================================

insert into public.categories (name, slug, description) values
  ('Shirts', 'shirts', 'Premium quality shirts'),
  ('Jackets', 'jackets', 'Stylish outerwear'),
  ('Pants', 'pants', 'Comfortable trousers'),
  ('Accessories', 'accessories', 'Complete your look'),
  ('Footwear', 'footwear', 'Quality shoes and boots');
