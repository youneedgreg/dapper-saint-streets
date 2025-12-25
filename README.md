# Dapper Saint Streets - Premium Streetwear E-Commerce

A modern, luxury streetwear e-commerce platform with full authentication, database storage, and admin capabilities built with React, TypeScript, Supabase, and Tailwind CSS.

## 🌟 Features

### Customer Features
- **User Authentication**: Secure sign up, login, and password recovery
- **Product Catalog**: Browse premium streetwear with advanced filtering
- **360° Product View**: Interactive rotation view of products with zoom controls
- **Lookbook Gallery**: Curated style collections and inspiration
- **Shopping Cart**: Persistent cart with size and color selection
- **Wishlist**: Save favorite items across devices
- **Order History**: Track all orders and their status
- **User Profile**: Manage personal information and preferences
- **Responsive Design**: Seamless experience on mobile, tablet, and desktop

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel at `/admin`
- **Product Management**: Full CRUD operations for products
- **Lookbook Management**: Create and manage style collections
- **Order Management**: View and update order status
- **Image Upload**: Direct upload to Supabase storage
- **Real-time Updates**: Live inventory and order tracking
- **Analytics Dashboard**: Track sales and customer data

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context (Cart, Wishlist, Theme, Auth)
- **Routing**: React Router v6 with protected routes
- **Forms**: React Hook Form with Zod validation

## 📦 Database Schema

Supabase PostgreSQL database with Row Level Security (RLS) enabled:

### Core Tables
- **users** - Extended user profiles (linked to Supabase Auth)
- **products** - Product catalog with images, pricing, inventory
- **categories** - Product categories and subcategories
- **cart_items** - Persistent shopping cart
- **wishlist_items** - User wishlists
- **orders** - Order records with shipping info
- **order_items** - Order line items
- **lookbooks** - Style collections
- **lookbook_items** - Products in lookbooks

### Storage Buckets
- **product-images** - Product photos
- **lookbook-images** - Lookbook photos
- **user-avatars** - User profile pictures

All tables have RLS policies for secure data access. See [supabase/schema.sql](supabase/schema.sql) for details.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn/bun if you prefer)
- Supabase account (free tier works)
- Git

### Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd dapper-saint-streets

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npm run dev
```

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**:
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase/schema.sql`
   - Run the SQL

3. **Set up storage buckets**:
   - Run `supabase/migrations/002_create_storage_buckets.sql`
   - Or create manually in Storage section

4. **Configure authentication**:
   - Enable Email provider
   - Set Site URL to `http://localhost:5173`
   - Add redirect URLs

5. **Add environment variables** to `.env`:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

For detailed setup instructions, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## 📖 Documentation

- **[Supabase Setup Guide](SUPABASE_SETUP.md)** - Complete setup walkthrough
- **[Supabase API Reference](SUPABASE_API.md)** - All database functions and auth methods
- **[Supabase Quick Reference](SUPABASE_QUICK_REF.md)** - Common commands and snippets
- **[Supabase Integration](SUPABASE_INTEGRATION.md)** - Architecture and implementation details

## 📜 Scripts

Run these with `npm run <script>`:
- `dev` — start Vite dev server
- `build` — production build
- `preview` — preview the production build locally
- `lint` — lint the project

## 📁 Project Structure

```
dapper-saint-streets/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin panel components
│   │   │   ├── ProductFormModal.tsx
│   │   │   ├── LookbookFormModal.tsx
│   │   │   └── AnalyticsChat.tsx
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Main navigation
│   │   ├── CartDrawer.tsx  # Shopping cart
│   │   └── ...             # Feature components
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── data/               # Static data (fallback)
│   │   └── products.ts
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx     # Authentication hook
│   │   ├── useCart.tsx     # Shopping cart hook
│   │   └── useWishlist.tsx # Wishlist hook
│   ├── lib/                # Utilities and helpers
│   │   ├── supabase.ts     # Supabase client
│   │   ├── auth.ts         # Auth functions
│   │   ├── database.ts     # Database operations
│   │   ├── currency.ts     # Price formatting
│   │   └── utils.ts        # Misc utilities
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Home page
│   │   ├── Shop.tsx        # Product listing
│   │   ├── ProductDetail.tsx # Product page
│   │   ├── Login.tsx       # Authentication
│   │   ├── Register.tsx
│   │   ├── Profile.tsx     # User profile
│   │   ├── OrderHistory.tsx # Orders
│   │   ├── Admin.tsx       # Admin dashboard
│   │   └── ...
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── supabase/
│   ├── schema.sql          # Database schema
│   └── migrations/         # Database migrations
│       └── 002_create_storage_buckets.sql
├── public/                 # Static assets
├── .env.example            # Environment template
└── Documentation files (*.md)
```

## 🔐 Authentication Flow

1. **Sign Up**: User registers with email/password
2. **Email Verification**: Supabase sends confirmation email
3. **Login**: User authenticates and receives session
4. **Protected Routes**: Auth state guards sensitive pages
5. **Profile Management**: User can update their info
6. **Admin Access**: Special role for admin features

## 🛒 Shopping Flow

1. Browse products or lookbooks
2. View product details with 360° view
3. Select size, color, and quantity
4. Add to cart (persists in database if logged in)
5. Review cart and proceed to checkout
6. Enter shipping information
7. Place order
8. Track order status in Order History

## 👨‍💼 Admin Features

Access admin panel at `/admin` (requires admin role):

- **Product Management**: Add, edit, delete products
- **Lookbook Management**: Create style collections
- **Order Management**: View and update order status
- **Image Uploads**: Direct to Supabase storage
- **Analytics**: View sales data and trends

To make a user admin:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## 🧪 Testing

```bash
# Run in development mode
npm run dev

# Test authentication flow
# 1. Register new account
# 2. Verify email
# 3. Login
# 4. Access profile/orders

# Test shopping flow
# 1. Browse products
# 2. Add to cart
# 3. Update quantities
# 4. Checkout

# Test admin features
# 1. Make user admin (SQL)
# 2. Access /admin
# 3. Create/edit products
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

### Environment Variables

Production deployment requires:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

Update Supabase auth settings:
- Site URL: Your production domain
- Redirect URLs: `https://yourdomain.com/**`

## 🔧 Configuration

### Supabase
- [Dashboard](https://app.supabase.com)
- [Documentation](https://supabase.com/docs)
- Row Level Security enabled on all tables
- Storage buckets configured for public access

### Environment
All config is in `.env` file (copy from `.env.example`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Private - Dapper Saint Streets © 2024-2025

## 🆘 Support

For issues or questions:
1. Check the [documentation files](.)
2. Review [Supabase docs](https://supabase.com/docs)
3. Create an issue in the repository

## 🎯 Roadmap

- [ ] Payment integration (Stripe/M-Pesa)
- [ ] Product reviews and ratings
- [ ] Email notifications for orders
- [ ] Advanced search and filters
- [ ] Multi-currency support
- [ ] Internationalization (i18n)
- [ ] PWA capabilities
- [ ] Social media integration

## ⚡ Performance

- Lazy loading for images
- Code splitting by route
- Optimized bundle size with Vite
- CDN delivery for static assets
- Database query optimization with indexes
- Image optimization in Supabase storage

---

Built with ❤️ using React, TypeScript, Supabase, and Tailwind CSS
