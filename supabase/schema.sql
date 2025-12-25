-- =============================================
-- DAPPER SAINTE E-Commerce Database Schema
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
  colors jsonb default '[]',  -- Array of {name: string, hex: string, image_url: string}
  sizes text[] default '{}',
  tags text[] default '{}',
  stock integer default 0,
  is_new boolean default false,
  is_bestseller boolean default false,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.products
  add constraint colors_require_image_url
  check (
    jsonb_typeof(colors) = 'array'
    and (
      jsonb_array_length(colors) = 0
      or (
        select bool_and(
          coalesce(color ->> 'name', '') <> ''
          and coalesce(color ->> 'hex', '') <> ''
          and coalesce(color ->> 'image_url', '') <> ''
        )
        from jsonb_array_elements(colors) color
      )
    )
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
-- LOOKBOOK ITEMS (Admin-managed editorial/lookbook photos)
-- =============================================

create table public.lookbook_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null,
  collection text,
  description text,
  product_ids uuid[] default '{}',
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.lookbook_items enable row level security;

create policy "Anyone can view active lookbook items"
  on public.lookbook_items for select
  to anon, authenticated
  using (is_active = true);

create policy "Admins can manage lookbook items"
  on public.lookbook_items for all
  using (public.has_role(auth.uid(), 'admin'));

create index idx_lookbook_items_is_active on public.lookbook_items(is_active);
create index idx_lookbook_items_display_order on public.lookbook_items(display_order);

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
  tax integer default 0,
  total integer not null,
  payment_method text,  -- 'card', 'mpesa', etc.
  payment_status text default 'pending',  -- 'pending', 'completed', 'failed'
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
create index idx_products_is_bestseller on public.products(is_bestseller);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order on public.order_items(order_id);
create index idx_wishlist_user on public.wishlist(user_id);
create index idx_reviews_product on public.reviews(product_id);

-- =============================================
-- CART (Persistent shopping cart)
-- =============================================

create table public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0),
  selected_color text not null,
  selected_size text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (user_id, product_id, selected_color, selected_size)
);

alter table public.cart enable row level security;

create policy "Users can manage own cart"
  on public.cart for all
  using (auth.uid() = user_id);

create index idx_cart_user on public.cart(user_id);

-- =============================================
-- NEWSLETTER SUBSCRIPTIONS
-- =============================================

create table public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean default true,
  subscribed_at timestamp with time zone default now(),
  unsubscribed_at timestamp with time zone
);

alter table public.newsletter_subscriptions enable row level security;

create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscriptions for insert
  to anon, authenticated
  with check (true);

create policy "Admins can manage newsletter subscriptions"
  on public.newsletter_subscriptions for all
  using (public.has_role(auth.uid(), 'admin'));

create index idx_newsletter_email on public.newsletter_subscriptions(email);
create index idx_newsletter_active on public.newsletter_subscriptions(is_active);

-- =============================================
-- CONTACT MESSAGES
-- =============================================

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  is_archived boolean default false,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can send contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "Admins can manage contact messages"
  on public.contact_messages for all
  using (public.has_role(auth.uid(), 'admin'));

create index idx_contact_messages_is_read on public.contact_messages(is_read);
create index idx_contact_messages_created_at on public.contact_messages(created_at);

-- =============================================
-- NOTIFICATIONS
-- =============================================

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info',  -- info, success, warning, error
  is_read boolean default false,
  link text,
  created_at timestamp with time zone default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Admins can create notifications"
  on public.notifications for insert
  using (public.has_role(auth.uid(), 'admin'));

create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_is_read on public.notifications(is_read);
create index idx_notifications_created_at on public.notifications(created_at);

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

create trigger update_cart_updated_at
  before update on public.cart
  for each row execute procedure public.update_updated_at();

create trigger update_lookbook_items_updated_at
  before update on public.lookbook_items
  for each row execute procedure public.update_updated_at();

-- =============================================
-- SEED CATEGORIES
-- =============================================

insert into public.categories (name, slug, description) values
  ('Hoodies', 'hoodies', 'Premium hoodies and sweatshirts'),
  ('T-Shirts', 't-shirts', 'High-quality t-shirts'),
  ('Jackets', 'jackets', 'Stylish outerwear and jackets'),
  ('Pants', 'pants', 'Comfortable trousers and joggers'),
  ('Sweaters', 'sweaters', 'Cozy sweaters and knitwear'),
  ('Accessories', 'accessories', 'Complete your look with accessories')
on conflict (slug) do nothing;

-- =============================================
-- COUPON CODES
-- =============================================

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value integer not null check (discount_value > 0),
  min_purchase_amount integer default 0,
  max_uses integer,
  current_uses integer default 0,
  is_active boolean default true,
  valid_from timestamp with time zone default now(),
  valid_until timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table public.coupons enable row level security;

create policy "Anyone can view active coupons"
  on public.coupons for select
  to anon, authenticated
  using (is_active = true and (valid_until is null or valid_until > now()));

create policy "Admins can manage coupons"
  on public.coupons for all
  using (public.has_role(auth.uid(), 'admin'));

create index idx_coupons_code on public.coupons(code);
create index idx_coupons_is_active on public.coupons(is_active);

-- =============================================
-- COUPON USAGE TRACKING
-- =============================================

create table public.coupon_usage (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid references public.coupons(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  discount_amount integer not null,
  used_at timestamp with time zone default now()
);

alter table public.coupon_usage enable row level security;

create policy "Users can view own coupon usage"
  on public.coupon_usage for select
  using (auth.uid() = user_id);

create policy "Admins can manage coupon usage"
  on public.coupon_usage for all
  using (public.has_role(auth.uid(), 'admin'));

create index idx_coupon_usage_coupon on public.coupon_usage(coupon_id);
create index idx_coupon_usage_user on public.coupon_usage(user_id);

-- =============================================
-- PAYMENT TRANSACTIONS
-- =============================================

create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  payment_method text not null,
  amount integer not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'refunded')),
  transaction_id text,  -- External payment provider transaction ID
  provider_response jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.payment_transactions enable row level security;

create policy "Users can view own payment transactions"
  on public.payment_transactions for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = payment_transactions.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can manage payment transactions"
  on public.payment_transactions for all
  using (public.has_role(auth.uid(), 'admin'));

create index idx_payment_transactions_order on public.payment_transactions(order_id);
create index idx_payment_transactions_status on public.payment_transactions(status);

-- =============================================
-- PRODUCT VIEWS (Analytics)
-- =============================================

create table public.product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  viewed_at timestamp with time zone default now()
);

alter table public.product_views enable row level security;

create policy "Anyone can record product views"
  on public.product_views for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view analytics"
  on public.product_views for select
  using (public.has_role(auth.uid(), 'admin'));

create index idx_product_views_product on public.product_views(product_id);
create index idx_product_views_viewed_at on public.product_views(viewed_at);

-- =============================================
-- USEFUL VIEWS
-- =============================================

-- View for product details with category info
create or replace view public.products_with_category as
select 
  p.*,
  c.name as category_name,
  c.slug as category_slug
from public.products p
left join public.categories c on p.category_id = c.id;

-- View for order summaries
create or replace view public.order_summaries as
select 
  o.*,
  count(oi.id) as item_count,
  array_agg(
    jsonb_build_object(
      'product_name', oi.product_name,
      'quantity', oi.quantity,
      'price', oi.price,
      'color', oi.color,
      'size', oi.size
    )
  ) as items
from public.orders o
left join public.order_items oi on o.id = oi.order_id
group by o.id;
