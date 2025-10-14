-- Debug RLS issues
-- Check if RLS is enabled and policies are working

-- 1. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 2. Check current user context (should show your user ID when run in authenticated context)
SELECT auth.uid() as current_user_id, auth.email() as current_email;

-- 3. Check all policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 4. Try to select your profile directly (should work if policies are correct)
SELECT id, email, first_name, last_name, role, created_at 
FROM public.profiles 
WHERE id = auth.uid();

-- 5. Try to select your profile by the specific ID (replace with your actual ID)
SELECT id, email, first_name, last_name, role, created_at 
FROM public.profiles 
WHERE id = 'c0b9b0d8-df1d-4446-b3e3-610519e03317';