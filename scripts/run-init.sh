#!/bin/bash

# JobPilot Database Initialization Script
# This script initializes the Supabase database for JobPilot

echo "🚀 JobPilot Database Initialization"
echo "===================================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed"
    echo "Install it with: npm install -g @supabase/cli"
    exit 1
fi

# Check if we're in a supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "⚠️  Not in a Supabase project directory"
    echo "Make sure you have supabase/ folder in your project"
    echo ""
    echo "To initialize Supabase:"
    echo "  supabase init"
    exit 1
fi

echo "✅ Found Supabase project"
echo ""

# Run the database migration
echo "Applying migrations..."
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database initialized successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run dev"
    echo "2. Visit: http://localhost:3000/auth/signup"
    echo "3. Sign up with your email"
    echo "4. You'll be guided through database setup"
else
    echo ""
    echo "❌ Migration failed"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure you have supabase/migrations/ folder"
    echo "2. Check supabase/config.toml for correct project ID"
    echo "3. Ensure SUPABASE_ACCESS_TOKEN is set if using remote"
fi
