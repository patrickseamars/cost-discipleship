-- Fix RLS policies for groups table
-- Add missing policies to allow admins to create, read, update groups

-- First drop any existing problematic policies
DROP POLICY IF EXISTS "Members can read own group" ON public.groups;
DROP POLICY IF EXISTS "Admins can manage all groups" ON public.groups;
DROP POLICY IF EXISTS "Group leaders can read managed groups" ON public.groups;

-- Create comprehensive policies for groups table
-- 1. Allow members to read their own group info
CREATE POLICY "Members can read own group" ON public.groups
  FOR SELECT USING (
    id IN (
      SELECT group_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- 2. Allow group leaders to read and update groups they lead
CREATE POLICY "Group leaders can manage own groups" ON public.groups
  FOR ALL USING (leader_id = auth.uid());

-- 3. Allow admins to manage all groups
CREATE POLICY "Admins can manage all groups" ON public.groups
  FOR ALL USING (public.is_admin());

-- 4. Allow admins to create new groups (INSERT)
-- Note: The above policy should cover this, but making it explicit
CREATE POLICY "Admins can create groups" ON public.groups
  FOR INSERT WITH CHECK (public.is_admin());

-- Ensure the is_admin function exists (in case it wasn't applied)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Also fix the profiles table policies to ensure they work correctly
-- Drop and recreate the admin policy for profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());