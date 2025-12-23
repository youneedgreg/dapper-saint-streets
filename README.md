# DAPPER SAINT - Premium Streetwear E-Commerce

A modern, luxury streetwear e-commerce platform built with React, TypeScript, and Tailwind CSS.

## Features

### Customer Features
- **Product Catalog**: Browse premium streetwear with filtering by category
- **360° Product View**: Interactive rotation view of products with zoom controls
- **See It Styled**: Inspiration gallery showing products on models (clickable lightbox)
- **Shopping Cart**: Add/remove items with size and color selection
- **Wishlist**: Save favorite items for later
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Admin Features
- **Full Product CRUD**: Create, read, update, and delete products
- **360° Image Management**: Upload multiple angles for 360° viewer
- **Styled Looks Management**: Upload inspiration photos linking to products
- **Order Management**: View and manage customer orders
- **Customer Analytics**: Track sales and customer data

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context (Cart, Wishlist, Theme)
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL) - see schema.sql

## Database Schema

Key tables include:
- `products` - Product catalog with images, 360° images, pricing
- `styled_looks` - Admin-uploaded inspiration photos
- `categories` - Product categories
- `orders` / `order_items` - Order management
- `profiles` / `user_roles` - User authentication and roles
- `wishlist` / `reviews` - Customer engagement

## Getting Started

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── data/               # Static product data (before Supabase)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── assets/             # Static assets
supabase/
└── schema.sql          # Database schema
```

## Deployment

Deploy via Lovable: Open the project and click Share → Publish.

## License

Private - DAPPER SAINT © 2024
