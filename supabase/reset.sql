-- ==========================================
-- DESTRUCTIVE: RESET SUPABASE SCHEMA
-- ==========================================
-- Run this script to drop all custom tables, views, functions, triggers, and storage buckets.
-- It leaves Supabase internal schemas (auth, storage) intact but clears our custom objects.

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Storage buckets should be deleted manually in the Supabase Dashboard or via API script (scripts/delete-buckets.ts) to prevent the ERROR: 42501 (Direct deletion from storage tables is not allowed).
