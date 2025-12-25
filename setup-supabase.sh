#!/bin/bash

# Supabase Integration Setup Script for Dapper Sainte
# This script helps you set up Supabase storage for image uploads

echo "======================================"
echo "Supabase Integration Setup"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✓ .env.local created"
else
    echo "✓ .env.local already exists"
fi

echo ""
echo "======================================"
echo "Setup Checklist"
echo "======================================"
echo ""
echo "1. Create Supabase Project:"
echo "   → Visit https://supabase.com"
echo "   → Create new project"
echo "   → Wait for initialization"
echo ""

echo "2. Get API Credentials:"
echo "   → Go to Settings > API in Supabase"
echo "   → Copy Project URL"
echo "   → Copy Anon Key"
echo ""

echo "3. Update .env.local:"
echo "   → Edit .env.local"
echo "   → Paste VITE_SUPABASE_URL"
echo "   → Paste VITE_SUPABASE_ANON_KEY"
echo ""

echo "4. Create Storage Buckets:"
echo "   → Go to Storage in Supabase"
echo "   → Create 'product-images' bucket (Public)"
echo "   → Create 'lookbook-images' bucket (Public)"
echo ""

echo "5. Run Migration:"
echo "   → Go to SQL Editor in Supabase"
echo "   → Copy contents from supabase/migrations/002_create_storage_buckets.sql"
echo "   → Paste and execute"
echo ""

echo "6. Set Admin Role:"
echo "   → Run this SQL in Supabase SQL Editor:"
echo "   INSERT INTO public.user_roles (user_id, role)"
echo "   VALUES (auth.uid(), 'admin')"
echo "   ON CONFLICT DO NOTHING;"
echo ""

echo "======================================"
echo "Testing"
echo "======================================"
echo ""
echo "After setup:"
echo "1. Run: npm run dev"
echo "2. Go to Admin > Products"
echo "3. Try dragging an image file"
echo "4. Image should upload to Supabase"
echo "5. Check .env.local has correct credentials"
echo ""

echo "======================================"
echo "Documentation"
echo "======================================"
echo "See SUPABASE_INTEGRATION.md for detailed guide"
echo ""
