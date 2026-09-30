-- Run this in your Supabase SQL Editor to create the 3 test accounts instantly!
-- (Requires the pgcrypto extension, which Supabase enables by default)

-- 1. Admin Account
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'admin@imd.gov.in', 
  crypt('admin123', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin User", "role": "admin", "department": "Administration", "username": "admin"}',
  now(), now()
);

-- Note: The trigger we created in 02_auth_schema.sql will automatically create the public.users and public.profiles row.
-- But the trigger defaults them to 'pending'. We must promote the admin to 'approved'.
UPDATE public.users SET status = 'approved', role = 'admin' WHERE email = 'admin@imd.gov.in';

-- 2. Trainer Account
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'trainer@imd.gov.in', 
  crypt('trainer123', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Senior Trainer", "role": "trainer", "department": "forecasting", "username": "trainer1"}',
  now(), now()
);

UPDATE public.users SET status = 'approved', role = 'trainer' WHERE email = 'trainer@imd.gov.in';

-- 3. Trainee Account
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'trainee@imd.gov.in', 
  crypt('trainee123', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Junior Forecaster", "role": "trainee", "department": "radar", "username": "trainee1"}',
  now(), now()
);

UPDATE public.users SET status = 'approved', role = 'trainee' WHERE email = 'trainee@imd.gov.in';
