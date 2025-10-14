-- Fix RLS policy to allow users to create their own profile
-- This allows new users to INSERT their profile after signup

-- Add INSERT policy for new users to create their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Also add UPDATE policy if not already covered
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);