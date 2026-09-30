# Supabase Setup Guide for AtmoCraft

This document outlines the exact manual steps required to configure your Supabase project for AtmoCraft. Since you already ran the initial schema (`00_init.sql`), you now need to apply the security policies, storage buckets, and configure Auth.

## 1. Apply the RLS & Storage Migration
1. Go to your Supabase Dashboard.
2. Click on **SQL Editor** in the left sidebar.
3. Open the file `supabase/migrations/01_rls_storage_setup.sql` from your codebase.
4. Copy all the contents and paste them into the SQL Editor.
5. Click **Run**.
*(This will enable Row Level Security on all tables, create the necessary database views for the admin dashboard, and set up your Storage Buckets for files.)*

## 2. Configure Authentication (Crucial for Demo)
Since we are using direct login without email verification for the SIH demo:
1. Go to **Authentication** > **Providers** in the Supabase Dashboard.
2. Click on **Email**.
3. Toggle **Confirm email** to OFF.
4. Click **Save**.

## 3. Verify Environment Variables
Ensure your `.env.local` contains the following:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Make Your Account an Admin
After you sign up in the app, you will be placed in the "pending" state. To promote yourself to Admin, run this in the Supabase SQL Editor:
```sql
UPDATE users SET role = 'admin', status = 'approved' WHERE email = 'your-email@example.com';
```
