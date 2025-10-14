-- Fix RLS policies to prevent infinite recursion
-- Run this after the initial migration

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all groups" ON public.groups;

-- Create fixed admin policies using auth.uid() directly
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (
    -- Check if current user is admin by checking their role directly in auth metadata
    -- or by using a safer approach with a function
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Alternative approach - create a function to check admin status safely
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

-- Drop the problematic policy and recreate with function
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all groups" ON public.groups  
  FOR ALL USING (public.is_admin());

-- Update group leader policies to be more explicit
DROP POLICY IF EXISTS "Group leaders can read member progress" ON public.user_progress;
CREATE POLICY "Group leaders can read member progress" ON public.user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      INNER JOIN public.groups g ON p.group_id = g.id
      WHERE p.id = user_progress.user_id 
      AND g.leader_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Group leaders can read member assessments" ON public.user_assessments;
CREATE POLICY "Group leaders can read member assessments" ON public.user_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      INNER JOIN public.groups g ON p.group_id = g.id
      WHERE p.id = user_assessments.user_id 
      AND g.leader_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Group leaders can read member responses" ON public.user_responses;
CREATE POLICY "Group leaders can read member responses" ON public.user_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      INNER JOIN public.groups g ON p.group_id = g.id
      WHERE p.id = user_responses.user_id 
      AND g.leader_id = auth.uid()
    )
  );