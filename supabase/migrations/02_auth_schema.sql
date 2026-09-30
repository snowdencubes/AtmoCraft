-- AtmoCraft: Stage 4 - Auth Trigger and Username Schema

-- 1. Add username to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "username" TEXT UNIQUE;

-- 2. Modify users table to link to auth.users
-- The users table ID should map exactly to auth.users ID
-- Ensure we handle the constraint gracefully if data already exists
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE public.users ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Create Trigger to automatically create users and profiles rows when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role TEXT;
BEGIN
  -- Extract role from metadata, default to trainee. Block admin self-assignment.
  requested_role := NEW.raw_user_meta_data->>'role';
  IF requested_role NOT IN ('trainee', 'trainer') THEN
    requested_role := 'trainee';
  END IF;

  -- Insert into public.users
  INSERT INTO public.users (id, name, email, role, avatar, department, status, username, "createdAt")
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Unknown'),
    NEW.email,
    requested_role,
    '/avatars/default.png',
    COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
    'pending', -- ALWAYS pending until admin approves
    NEW.raw_user_meta_data->>'username',
    now()
  );

  -- Insert into public.profiles
  INSERT INTO public.profiles ("userId")
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Helper function to find email by username (used for login)
-- This function skips RLS and operates securely to translate usernames to emails for the server
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email FROM users WHERE username = p_username LIMIT 1;
  RETURN v_email;
END;
$$;
